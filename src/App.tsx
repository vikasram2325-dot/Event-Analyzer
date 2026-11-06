import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EventProvider, useEvents } from './context/EventContext';
import { Navbar, ActivePage } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { MyBookingsPage } from './pages/MyBookingsPage';
import { UserProfilePage } from './pages/UserProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { ManageEventsPage } from './pages/ManageEventsPage';
import { ParticipantsPage } from './pages/ParticipantsPage';
import { AuthPage } from './pages/AuthPage';
import { RegistrationModal } from './components/RegistrationModal';
import { TicketPassModal } from './components/TicketPassModal';
import { EventFormModal } from './components/EventFormModal';
import { EventItem, Registration } from './types';

function MainApp() {
  const { profile, isAdmin } = useAuth();
  const { events, createEvent, setFilterOptions } = useEvents();

  const [activePage, setActivePage] = useState<ActivePage>('landing');
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [registeringEvent, setRegisteringEvent] = useState<EventItem | null>(null);
  const [confirmedTicket, setConfirmedTicket] = useState<Registration | null>(null);
  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [participantsEventFilter, setParticipantsEventFilter] = useState<string | undefined>(undefined);

  // Scroll to top on page switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage, selectedEvent]);

  // Navigate to event details
  const handleSelectEvent = (event: EventItem) => {
    setSelectedEvent(event);
    setActivePage('event-details');
  };

  // Open Registration Modal
  const handleOpenRegister = (event: EventItem) => {
    setRegisteringEvent(event);
  };

  // Handle successful registration
  const handleRegistrationSuccess = (reg: Registration) => {
    setRegisteringEvent(null);
    setConfirmedTicket(reg);
  };

  // Open Auth modal/page
  const handleOpenAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setActivePage('auth');
  };

  // Filter participants from an event
  const handleFilterParticipantsByEvent = (eventId: string) => {
    setParticipantsEventFilter(eventId);
    setActivePage('admin-participants');
  };

  // Navigate to events with optional category
  const handleNavigateToEvents = (category?: string) => {
    if (category) {
      setFilterOptions((prev) => ({ ...prev, category }));
    }
    setActivePage('events');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenAuth={handleOpenAuth}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {activePage === 'landing' && (
          <LandingPage
            onNavigateToEvents={handleNavigateToEvents}
            onSelectEvent={handleSelectEvent}
            onOpenRegister={handleOpenRegister}
            onOpenCreateEvent={isAdmin ? () => setCreateEventModalOpen(true) : undefined}
          />
        )}

        {activePage === 'events' && (
          <EventsPage
            onSelectEvent={handleSelectEvent}
            onOpenRegister={handleOpenRegister}
          />
        )}

        {activePage === 'event-details' && (
          <EventDetailsPage
            event={selectedEvent}
            onBack={() => setActivePage('events')}
            onRegisterClick={handleOpenRegister}
            onViewMyTicket={() => setActivePage('my-bookings')}
          />
        )}

        {activePage === 'my-bookings' && (
          <MyBookingsPage
            onNavigateToEvents={() => setActivePage('events')}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {activePage === 'profile' && (
          <UserProfilePage
            onNavigateToBookings={() => setActivePage('my-bookings')}
            onNavigateToAdmin={isAdmin ? () => setActivePage('admin-dashboard') : undefined}
            onOpenAuth={() => handleOpenAuth('login')}
          />
        )}

        {activePage === 'admin-dashboard' && (
          <AdminDashboard
            onNavigateToManageEvents={() => setActivePage('admin-events')}
            onNavigateToParticipants={() => {
              setParticipantsEventFilter(undefined);
              setActivePage('admin-participants');
            }}
            onOpenCreateEvent={() => setCreateEventModalOpen(true)}
            onSelectEvent={handleSelectEvent}
          />
        )}

        {activePage === 'admin-events' && (
          <ManageEventsPage
            onSelectEvent={handleSelectEvent}
            onFilterParticipantsByEvent={handleFilterParticipantsByEvent}
          />
        )}

        {activePage === 'admin-participants' && (
          <ParticipantsPage
            initialEventFilter={participantsEventFilter}
            onClearInitialEventFilter={() => setParticipantsEventFilter(undefined)}
          />
        )}

        {activePage === 'auth' && (
          <AuthPage
            initialMode={authMode}
            onSuccess={() => setActivePage('landing')}
            onCancel={() => setActivePage('landing')}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(page) => {
          if (page === 'admin-dashboard' && !isAdmin) {
            handleOpenAuth('login');
          } else {
            setActivePage(page);
          }
        }}
      />

      {/* Booking Registration Modal */}
      <RegistrationModal
        event={registeringEvent}
        isOpen={Boolean(registeringEvent)}
        onClose={() => setRegisteringEvent(null)}
        onSuccess={handleRegistrationSuccess}
        onOpenAuth={handleOpenAuth}
      />

      {/* Confirmation Ticket Pass Modal */}
      <TicketPassModal
        registration={confirmedTicket}
        isOpen={Boolean(confirmedTicket)}
        onClose={() => setConfirmedTicket(null)}
        onGoToBookings={() => {
          setConfirmedTicket(null);
          setActivePage('my-bookings');
        }}
      />

      {/* Create New Event Modal (Admin) */}
      <EventFormModal
        isOpen={createEventModalOpen}
        onClose={() => setCreateEventModalOpen(false)}
        onSubmit={async (data) => {
          await createEvent(data);
          setActivePage('admin-events');
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <EventProvider>
        <MainApp />
      </EventProvider>
    </AuthProvider>
  );
}
