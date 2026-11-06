import React, { useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  QrCode,
  Calendar,
  Mail,
  Phone,
  ShieldCheck,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { Registration } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { TicketPassModal } from '../components/TicketPassModal';

interface ParticipantsPageProps {
  initialEventFilter?: string;
  onClearInitialEventFilter?: () => void;
}

export const ParticipantsPage: React.FC<ParticipantsPageProps> = ({
  initialEventFilter,
  onClearInitialEventFilter,
}) => {
  const { isAdmin, signInWithDemo } = useAuth();
  const {
    events,
    allRegistrations,
    checkInParticipant,
    cancelRegistration,
  } = useEvents();

  const [selectedEventId, setSelectedEventId] = useState<string>(initialEventFilter || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [selectedPass, setSelectedPass] = useState<Registration | null>(null);
  const [cancellingRegistration, setCancellingRegistration] = useState<Registration | null>(null);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Admin Access Required</h2>
        <p className="text-sm text-slate-500">
          The Participants Master list is restricted to authorized organizers.
        </p>
        <button
          onClick={() => signInWithDemo('admin')}
          className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-semibold"
        >
          Enable Admin Mode
        </button>
      </div>
    );
  }

  // Filter registrations
  const filteredRegistrations = allRegistrations.filter((reg) => {
    if (selectedEventId && reg.eventId !== selectedEventId) return false;
    if (statusFilter !== 'all' && reg.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        reg.userName.toLowerCase().includes(q) ||
        reg.userEmail.toLowerCase().includes(q) ||
        reg.ticketCode.toLowerCase().includes(q) ||
        reg.eventTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Ticket Code',
      'Attendee Name',
      'Email',
      'Phone',
      'Event Title',
      'Event Date',
      'Status',
      'Checked In',
      'Registered At',
    ];

    const rows = filteredRegistrations.map((r) => [
      r.ticketCode,
      `"${r.userName.replace(/"/g, '""')}"`,
      r.userEmail,
      r.userPhone || '',
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      r.eventDate,
      r.status,
      r.checkedIn ? 'YES' : 'NO',
      r.registeredAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `EventEase_Participants_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingRegistration) return;
    await cancelRegistration(cancellingRegistration.id, cancellingRegistration.eventId);
    setCancellingRegistration(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs tracking-wider uppercase">
            <Users className="w-4 h-4" />
            <span>Attendee Directory</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
            Registered Participants Master
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Search attendees, verify digital tickets, toggle check-in, and export registration manifests.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={filteredRegistrations.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV Manifest ({filteredRegistrations.length})</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-3">
        {/* Search */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by attendee name, email, or ticket code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Filter by Event */}
        <div className="md:col-span-4">
          <select
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer text-slate-700"
          >
            <option value="">All Events ({events.length})</option>
            {events.map((evt) => (
              <option key={evt.id} value={evt.id}>
                {evt.title} ({evt.registeredCount} booked)
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 cursor-pointer text-slate-700"
          >
            <option value="all">All Statuses</option>
            <option value="confirmed">Confirmed Only</option>
            <option value="cancelled">Cancelled Only</option>
          </select>
        </div>
      </div>

      {/* Attendees Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredRegistrations.length === 0 ? (
          <div className="py-16 text-center text-xs text-slate-400 space-y-2">
            <p>No participant registrations found matching your query.</p>
            {(searchQuery || selectedEventId || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedEventId('');
                  setStatusFilter('all');
                  if (onClearInitialEventFilter) onClearInitialEventFilter();
                }}
                className="text-indigo-600 font-semibold underline"
              >
                Reset filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                  <th className="py-4 pl-6">Ticket Code</th>
                  <th className="py-4 px-3">Participant</th>
                  <th className="py-4 px-3">Event Name</th>
                  <th className="py-4 px-3">Contact</th>
                  <th className="py-4 px-3">Check-In Status</th>
                  <th className="py-4 px-3">Status</th>
                  <th className="py-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Ticket Code */}
                    <td className="py-4 pl-6 pr-3 whitespace-nowrap font-mono font-bold text-indigo-700">
                      {reg.ticketCode}
                    </td>

                    {/* Participant Name */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{reg.userName}</div>
                      <div className="text-[11px] text-slate-400">
                        Booked {new Date(reg.registeredAt).toLocaleDateString()}
                      </div>
                    </td>

                    {/* Event Name */}
                    <td className="py-4 px-3 max-w-[200px]">
                      <div className="font-semibold text-slate-800 truncate">
                        {reg.eventTitle}
                      </div>
                      <div className="text-[11px] text-slate-400">{reg.eventDate}</div>
                    </td>

                    {/* Contact */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <div className="text-slate-700">{reg.userEmail}</div>
                      <div className="text-[11px] text-slate-400">{reg.userPhone || '—'}</div>
                    </td>

                    {/* Check-in toggle */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <button
                        onClick={() => checkInParticipant(reg.id, !reg.checkedIn)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-[11px] transition-colors ${
                          reg.checkedIn
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        title="Click to toggle check-in at entrance"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>{reg.checkedIn ? 'Checked In' : 'Not Checked In'}</span>
                      </button>
                    </td>

                    {/* Booking Status */}
                    <td className="py-4 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                          reg.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {reg.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedPass(reg)}
                          className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                          title="View Digital Pass"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>

                        {reg.status === 'confirmed' && (
                          <button
                            onClick={() => setCancellingRegistration(reg)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Cancel Registration"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Pass Modal */}
      <TicketPassModal
        registration={selectedPass}
        isOpen={Boolean(selectedPass)}
        onClose={() => setSelectedPass(null)}
      />

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={Boolean(cancellingRegistration)}
        onClose={() => setCancellingRegistration(null)}
        onConfirm={handleConfirmCancel}
        danger
        title="Cancel Attendee Registration?"
        message={`Are you sure you want to cancel the registration for ${cancellingRegistration?.userName} (${cancellingRegistration?.ticketCode})? This seat will be returned to the event pool.`}
        confirmText="Yes, Cancel Registration"
        cancelText="Keep Registration"
      />
    </div>
  );
};
