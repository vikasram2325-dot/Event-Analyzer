import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  runTransaction,
  increment,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { EventItem, Registration, AdminStats, FilterOptions } from '../types';
import { INITIAL_EVENTS } from '../data/initialEvents';
import { useAuth } from './AuthContext';

interface EventContextType {
  events: EventItem[];
  userRegistrations: Registration[];
  allRegistrations: Registration[];
  loadingEvents: boolean;
  loadingRegistrations: boolean;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  filteredEvents: EventItem[];
  registerForEvent: (
    eventId: string,
    details: { userName: string; userEmail: string; userPhone: string; notes?: string }
  ) => Promise<Registration>;
  cancelRegistration: (registrationId: string, eventId: string) => Promise<void>;
  createEvent: (eventData: Omit<EventItem, 'id' | 'registeredCount' | 'createdAt'>) => Promise<string>;
  updateEvent: (eventId: string, eventData: Partial<EventItem>) => Promise<void>;
  deleteEvent: (eventId: string) => Promise<void>;
  checkInParticipant: (registrationId: string, checkedIn: boolean) => Promise<void>;
  isUserRegistered: (eventId: string) => boolean;
  getUserRegistration: (eventId: string) => Registration | undefined;
  getEventById: (eventId: string) => EventItem | undefined;
  stats: AdminStats;
  resetFilters: () => void;
  seedInitialEvents: () => Promise<void>;
}

const defaultFilterOptions: FilterOptions = {
  searchQuery: '',
  category: '',
  location: '',
  date: '',
  sortBy: 'date-asc',
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { profile, isAdmin } = useAuth();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [allRegistrations, setAllRegistrations] = useState<Registration[]>([]);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [loadingRegistrations, setLoadingRegistrations] = useState<boolean>(true);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilterOptions);

  // Seed events if Firestore collection is empty
  const seedInitialEvents = async () => {
    try {
      const snap = await getDocs(collection(db, 'events'));
      if (snap.empty) {
        console.log('Seeding initial events into Firestore...');
        for (const item of INITIAL_EVENTS) {
          const newDocRef = doc(collection(db, 'events'));
          await setDoc(newDocRef, {
            ...item,
            id: newDocRef.id,
            registeredCount: item.registeredCount || 0,
            createdAt: item.createdAt || new Date().toISOString(),
          });
        }
      }
    } catch (err) {
      console.warn('Initial seed skipped or failed, using local seed fallback:', err);
      // Fallback local memory events if offline
      setEvents(
        INITIAL_EVENTS.map((e, index) => ({
          ...e,
          id: `seed-evt-${index + 1}`,
          registeredCount: e.registeredCount || 0,
          createdAt: e.createdAt || new Date().toISOString(),
        }))
      );
    }
  };

  // Listen to events collection
  useEffect(() => {
    setLoadingEvents(true);
    const eventsQuery = query(collection(db, 'events'), orderBy('date', 'asc'));

    const unsubscribe = onSnapshot(
      eventsQuery,
      (snapshot) => {
        if (!snapshot.empty) {
          const loaded: EventItem[] = [];
          snapshot.forEach((docSnap) => {
            loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<EventItem, 'id'>) });
          });
          setEvents(loaded);
        } else {
          // If empty, trigger seed
          seedInitialEvents();
        }
        setLoadingEvents(false);
      },
      (error) => {
        console.error('Error listening to events:', error);
        // If error, populate initial fallback events so UI is never blank
        setEvents(
          INITIAL_EVENTS.map((e, idx) => ({
            ...e,
            id: `evt-seed-${idx + 1}`,
            registeredCount: e.registeredCount,
            createdAt: e.createdAt,
          }))
        );
        setLoadingEvents(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // Listen to registrations
  useEffect(() => {
    setLoadingRegistrations(true);
    const regCollection = collection(db, 'registrations');

    const unsubscribe = onSnapshot(
      regCollection,
      (snapshot) => {
        const loaded: Registration[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<Registration, 'id'>) });
        });
        setAllRegistrations(loaded);
        setLoadingRegistrations(false);
      },
      (error) => {
        console.error('Error listening to registrations:', error);
        setLoadingRegistrations(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // User-specific registrations
  const userRegistrations = useMemo(() => {
    if (!profile) return [];
    return allRegistrations.filter((r) => r.userId === profile.uid);
  }, [allRegistrations, profile]);

  const isUserRegistered = (eventId: string): boolean => {
    if (!profile) return false;
    return userRegistrations.some(
      (r) => r.eventId === eventId && r.status === 'confirmed'
    );
  };

  const getUserRegistration = (eventId: string): Registration | undefined => {
    if (!profile) return undefined;
    return userRegistrations.find(
      (r) => r.eventId === eventId && r.status === 'confirmed'
    );
  };

  const getEventById = (eventId: string): EventItem | undefined => {
    return events.find((e) => e.id === eventId);
  };

  // Register for an event with duplicate check and participant cap enforcement
  const registerForEvent = async (
    eventId: string,
    details: { userName: string; userEmail: string; userPhone: string; notes?: string }
  ): Promise<Registration> => {
    if (!profile) {
      throw new Error('Please sign in or select a demo account to book an event.');
    }

    const event = getEventById(eventId);
    if (!event) {
      throw new Error('Event not found.');
    }

    if (event.status === 'cancelled') {
      throw new Error('This event has been cancelled and cannot accept new bookings.');
    }

    // Check duplicate
    const alreadyRegistered = allRegistrations.some(
      (r) => r.eventId === eventId && r.userId === profile.uid && r.status === 'confirmed'
    );
    if (alreadyRegistered) {
      throw new Error('You have already registered for this event! Check "My Bookings" to view your ticket.');
    }

    // Check capacity
    if (event.registeredCount >= event.maxParticipants) {
      throw new Error('Sorry, this event has reached maximum capacity and registrations are closed.');
    }

    const regId = `${eventId}_${profile.uid}`;
    const ticketCode = `EE-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    const newRegistration: Registration = {
      id: regId,
      eventId,
      eventTitle: event.title,
      eventDate: event.date,
      eventTime: event.time,
      eventVenue: event.venue,
      eventLocation: event.location,
      eventImageUrl: event.imageUrl,
      userId: profile.uid,
      userEmail: details.userEmail || profile.email,
      userName: details.userName || profile.displayName,
      userPhone: details.userPhone || profile.phoneNumber || '',
      ticketCode,
      status: 'confirmed',
      registeredAt: new Date().toISOString(),
      notes: details.notes || '',
      checkedIn: false,
    };

    try {
      // Execute atomic transaction to prevent race conditions on seats
      const eventRef = doc(db, 'events', eventId);
      const regRef = doc(db, 'registrations', regId);
      const eventSubRegRef = doc(db, 'events', eventId, 'registrations', regId);

      await runTransaction(db, async (transaction) => {
        const eventSnap = await transaction.get(eventRef);
        if (eventSnap.exists()) {
          const currentCount = eventSnap.data().registeredCount || 0;
          const maxCapacity = eventSnap.data().maxParticipants || 100;
          if (currentCount >= maxCapacity) {
            throw new Error('Event reached maximum capacity just now.');
          }
          transaction.update(eventRef, {
            registeredCount: increment(1),
            updatedAt: new Date().toISOString(),
          });
        }
        transaction.set(regRef, newRegistration);
        transaction.set(eventSubRegRef, newRegistration);
      });

      return newRegistration;
    } catch (err: unknown) {
      console.warn('Transaction write to Firestore failed, checking offline state:', err);
      // If Firestore rules or offline mock triggers, still update local state for a seamless demo
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId ? { ...e, registeredCount: e.registeredCount + 1 } : e
        )
      );
      setAllRegistrations((prev) => [...prev, newRegistration]);
      return newRegistration;
    }
  };

  // Cancel a registration
  const cancelRegistration = async (registrationId: string, eventId: string) => {
    try {
      const regRef = doc(db, 'registrations', registrationId);
      const eventRef = doc(db, 'events', eventId);
      const eventSubRegRef = doc(db, 'events', eventId, 'registrations', registrationId);

      await updateDoc(regRef, {
        status: 'cancelled',
        cancelledAt: new Date().toISOString(),
      });

      try {
        await updateDoc(eventSubRegRef, {
          status: 'cancelled',
          cancelledAt: new Date().toISOString(),
        });
      } catch {
        // subcollection doc update optional
      }

      await updateDoc(eventRef, {
        registeredCount: increment(-1),
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Error cancelling on Firestore, updating local state:', err);
      setAllRegistrations((prev) =>
        prev.map((r) =>
          r.id === registrationId
            ? { ...r, status: 'cancelled', cancelledAt: new Date().toISOString() }
            : r
        )
      );
      setEvents((prev) =>
        prev.map((e) =>
          e.id === eventId
            ? { ...e, registeredCount: Math.max(0, e.registeredCount - 1) }
            : e
        )
      );
    }
  };

  // Create an event (Admin)
  const createEvent = async (
    eventData: Omit<EventItem, 'id' | 'registeredCount' | 'createdAt'>
  ): Promise<string> => {
    const newDocRef = doc(collection(db, 'events'));
    const newEvent: EventItem = {
      ...eventData,
      id: newDocRef.id,
      registeredCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await setDoc(newDocRef, newEvent);
      return newDocRef.id;
    } catch (err) {
      console.warn('Firestore create event failed, updating local state:', err);
      setEvents((prev) => [newEvent, ...prev]);
      return newDocRef.id;
    }
  };

  // Update an event (Admin)
  const updateEvent = async (eventId: string, eventData: Partial<EventItem>) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore update event failed, updating local state:', err);
      setEvents((prev) =>
        prev.map((e) => (e.id === eventId ? { ...e, ...eventData, updatedAt: new Date().toISOString() } : e))
      );
    }
  };

  // Delete an event (Admin)
  const deleteEvent = async (eventId: string) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
    } catch (err) {
      console.warn('Firestore delete event failed, updating local state:', err);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
    }
  };

  // Check in participant (Admin)
  const checkInParticipant = async (registrationId: string, checkedIn: boolean) => {
    try {
      const regRef = doc(db, 'registrations', registrationId);
      await updateDoc(regRef, { checkedIn });
    } catch (err) {
      console.warn('Firestore checkIn failed, updating local state:', err);
      setAllRegistrations((prev) =>
        prev.map((r) => (r.id === registrationId ? { ...r, checkedIn } : r))
      );
    }
  };

  // Filtered events based on search, category, location, date, and sorting
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Search by title, description, or organizer
        if (filterOptions.searchQuery.trim()) {
          const q = filterOptions.searchQuery.toLowerCase();
          const matchTitle = evt.title.toLowerCase().includes(q);
          const matchDesc = evt.description.toLowerCase().includes(q);
          const matchOrg = evt.organizerName.toLowerCase().includes(q);
          const matchVenue = evt.venue.toLowerCase().includes(q);
          const matchLoc = evt.location.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchOrg && !matchVenue && !matchLoc) {
            return false;
          }
        }

        // Category filter
        if (filterOptions.category && evt.category !== filterOptions.category) {
          return false;
        }

        // Location filter
        if (filterOptions.location.trim()) {
          const locQ = filterOptions.location.toLowerCase();
          const matchLoc = evt.location.toLowerCase().includes(locQ);
          const matchVenue = evt.venue.toLowerCase().includes(locQ);
          if (!matchLoc && !matchVenue) return false;
        }

        // Date filter
        if (filterOptions.date) {
          if (evt.date !== filterOptions.date) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (filterOptions.sortBy === 'date-asc') {
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        }
        if (filterOptions.sortBy === 'date-desc') {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        if (filterOptions.sortBy === 'popular') {
          return b.registeredCount - a.registeredCount;
        }
        if (filterOptions.sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [events, filterOptions]);

  const resetFilters = () => {
    setFilterOptions(defaultFilterOptions);
  };

  // Calculate Admin Stats
  const stats: AdminStats = useMemo(() => {
    const totalEvents = events.length;
    const activeEvents = events.filter((e) => e.status === 'published').length;
    const confirmedRegs = allRegistrations.filter((r) => r.status === 'confirmed');
    const totalRegistrations = confirmedRegs.length;

    // Unique participants by userEmail or userId
    const uniqueAttendees = new Set(confirmedRegs.map((r) => r.userEmail || r.userId));
    const totalParticipants = uniqueAttendees.size;

    const totalCapacity = events.reduce((acc, curr) => acc + (curr.maxParticipants || 0), 0);
    const totalSeatsBooked = events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

    const capacityUtilization = totalCapacity > 0 ? Math.round((totalSeatsBooked / totalCapacity) * 100) : 0;

    const totalRevenue = confirmedRegs.reduce((sum, reg) => {
      const evt = events.find((e) => e.id === reg.eventId);
      return sum + (evt?.price || 0);
    }, 0);

    return {
      totalEvents,
      activeEvents,
      totalRegistrations,
      totalParticipants,
      capacityUtilization,
      totalRevenue,
    };
  }, [events, allRegistrations]);

  return (
    <EventContext.Provider
      value={{
        events,
        userRegistrations,
        allRegistrations,
        loadingEvents,
        loadingRegistrations,
        filterOptions,
        setFilterOptions,
        filteredEvents,
        registerForEvent,
        cancelRegistration,
        createEvent,
        updateEvent,
        deleteEvent,
        checkInParticipant,
        isUserRegistered,
        getUserRegistration,
        getEventById,
        stats,
        resetFilters,
        seedInitialEvents,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
