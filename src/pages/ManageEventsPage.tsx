import React, { useState } from 'react';
import {
  Calendar,
  Plus,
  Search,
  Edit2,
  Trash2,
  Users,
  Eye,
  AlertTriangle,
  Clock,
  MapPin,
  CheckCircle2,
  Sparkles,
  Tag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { EventItem, EventStatus } from '../types';
import { EventFormModal } from '../components/EventFormModal';
import { ConfirmationModal } from '../components/ConfirmationModal';

interface ManageEventsPageProps {
  onSelectEvent: (event: EventItem) => void;
  onFilterParticipantsByEvent: (eventId: string) => void;
}

export const ManageEventsPage: React.FC<ManageEventsPageProps> = ({
  onSelectEvent,
  onFilterParticipantsByEvent,
}) => {
  const { isAdmin, signInWithDemo } = useAuth();
  const { events, createEvent, updateEvent, deleteEvent } = useEvents();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EventStatus>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingEvent, setDeletingEvent] = useState<EventItem | null>(null);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Admin Access Required</h2>
        <p className="text-sm text-slate-500">
          Only administrators can create, update, or delete events.
        </p>
        <button
          onClick={() => signInWithDemo('admin')}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold"
        >
          Switch to Admin Mode
        </button>
      </div>
    );
  }

  const filteredEvents = events.filter((e) => {
    if (statusFilter !== 'all' && e.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        e.title.toLowerCase().includes(q) ||
        e.venue.toLowerCase().includes(q) ||
        e.organizerName.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenCreate = () => {
    setEditingEvent(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (event: EventItem) => {
    setEditingEvent(event);
    setModalOpen(true);
  };

  const handleModalSubmit = async (
    eventData: Omit<EventItem, 'id' | 'registeredCount' | 'createdAt'>
  ) => {
    if (editingEvent) {
      await updateEvent(editingEvent.id, eventData);
    } else {
      await createEvent(eventData);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingEvent) return;
    await deleteEvent(deletingEvent.id);
    setDeletingEvent(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs tracking-wider uppercase">
            <Calendar className="w-4 h-4" />
            <span>Event Operations</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
            Manage All Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create, update schedules, monitor participant caps, and delete events.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-98 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New Event</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search events by title or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto overflow-x-auto w-full sm:w-auto">
          {(['all', 'published', 'draft', 'cancelled'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize whitespace-nowrap transition-all ${
                statusFilter === st
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st} ({st === 'all' ? events.length : events.filter((e) => e.status === st).length})
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredEvents.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <p>No events found matching your filter criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-indigo-600 font-semibold underline"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-4 pl-6">Event Details</th>
                  <th className="py-4 px-3">Date & Time</th>
                  <th className="py-4 px-3">Category</th>
                  <th className="py-4 px-3">Capacity Booked</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredEvents.map((evt) => {
                  const fill = Math.min(
                    100,
                    Math.round((evt.registeredCount / evt.maxParticipants) * 100)
                  );
                  return (
                    <tr key={evt.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Title & Venue */}
                      <td className="py-4 pl-6 pr-3 max-w-[280px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={evt.imageUrl}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover bg-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4
                              onClick={() => onSelectEvent(evt)}
                              className="font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer truncate"
                            >
                              {evt.title}
                            </h4>
                            <p className="text-[11px] text-slate-400 truncate">
                              {evt.venue}, {evt.location}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Date & Time */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <div className="font-semibold text-slate-800">{evt.date}</div>
                        <div className="text-[11px] text-slate-400">{evt.time}</div>
                      </td>

                      {/* Category */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                          {evt.category}
                        </span>
                      </td>

                      {/* Capacity Booked */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="font-bold text-slate-800">
                              {evt.registeredCount} / {evt.maxParticipants}
                            </span>
                            <span className="text-slate-400">{fill}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                fill >= 90 ? 'bg-amber-500' : 'bg-indigo-600'
                              }`}
                              style={{ width: `${fill}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            evt.status === 'published'
                              ? 'bg-emerald-50 text-emerald-700'
                              : evt.status === 'draft'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {evt.status}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-4 pr-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View details */}
                          <button
                            onClick={() => onSelectEvent(evt)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Preview Event Page"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* View Attendees */}
                          <button
                            onClick={() => onFilterParticipantsByEvent(evt.id)}
                            className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Registered Attendees"
                          >
                            <Users className="w-4 h-4" />
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(evt)}
                            className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Edit Event"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => setDeletingEvent(evt)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <EventFormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingEvent}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(deletingEvent)}
        onClose={() => setDeletingEvent(null)}
        onConfirm={handleConfirmDelete}
        danger
        title="Delete Event Permanently?"
        message={`Are you sure you want to delete "${deletingEvent?.title}"? This action cannot be undone and will remove all associated event data.`}
        confirmText="Yes, Delete Event"
        cancelText="Keep Event"
      />
    </div>
  );
};
