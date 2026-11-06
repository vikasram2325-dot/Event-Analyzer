import React, { useState } from 'react';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  QrCode,
  ArrowRight,
  Compass,
  FileText,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { Registration } from '../types';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { TicketPassModal } from '../components/TicketPassModal';

interface MyBookingsPageProps {
  onNavigateToEvents: () => void;
  onOpenAuth: () => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({
  onNavigateToEvents,
  onOpenAuth,
}) => {
  const { profile } = useAuth();
  const { userRegistrations, cancelRegistration, loadingRegistrations } = useEvents();

  const [filterTab, setFilterTab] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [selectedPass, setSelectedPass] = useState<Registration | null>(null);
  const [cancellingRegistration, setCancellingRegistration] = useState<Registration | null>(null);

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
          <Ticket className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">
          Sign In to Access Your Bookings
        </h2>
        <p className="text-sm text-slate-500">
          Please sign in to retrieve your registered event passes and view confirmation details.
        </p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 shadow-md shadow-indigo-200 transition-colors"
        >
          Sign In Now
        </button>
      </div>
    );
  }

  const filtered = userRegistrations.filter((r) => {
    if (filterTab === 'confirmed') return r.status === 'confirmed';
    if (filterTab === 'cancelled') return r.status === 'cancelled';
    return true;
  });

  const handleConfirmCancel = async () => {
    if (!cancellingRegistration) return;
    await cancelRegistration(cancellingRegistration.id, cancellingRegistration.eventId);
    setCancellingRegistration(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <Ticket className="w-4 h-4" />
            <span>Attendee Portal</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
            My Event Bookings
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your registered event passes, view verification QR codes, or cancel bookings.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterTab === 'all'
                ? 'bg-white text-indigo-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Passes ({userRegistrations.length})
          </button>
          <button
            onClick={() => setFilterTab('confirmed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterTab === 'confirmed'
                ? 'bg-white text-emerald-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Confirmed (
            {userRegistrations.filter((r) => r.status === 'confirmed').length}
            )
          </button>
          <button
            onClick={() => setFilterTab('cancelled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              filterTab === 'cancelled'
                ? 'bg-white text-rose-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Cancelled (
            {userRegistrations.filter((r) => r.status === 'cancelled').length}
            )
          </button>
        </div>
      </div>

      {/* Bookings List */}
      {loadingRegistrations ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Retrieving your passes...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            {filterTab === 'all'
              ? 'No event bookings yet'
              : `No ${filterTab} event passes`}
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Ready to explore? Browse upcoming summits, design workshops, and conferences to reserve your seat today.
          </p>
          <button
            onClick={onNavigateToEvents}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200 transition-colors"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Events</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((reg) => {
            const isConfirmed = reg.status === 'confirmed';

            return (
              <div
                key={reg.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Top Section */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {isConfirmed ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Confirmed</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Cancelled</span>
                        </>
                      )}
                    </span>

                    <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                      {reg.ticketCode}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-slate-900 leading-snug">
                    {reg.eventTitle}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span className="font-semibold text-slate-800">{reg.eventDate}</span>
                      <span>•</span>
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{reg.eventTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{reg.eventVenue}, {reg.eventLocation}</span>
                    </div>
                  </div>

                  {/* Registered Attendee Name */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Attendee: <strong className="text-slate-800">{reg.userName}</strong></span>
                    <span className="text-[11px]">Booked {new Date(reg.registeredAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setSelectedPass(reg)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition-colors shadow-sm"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>View Pass & QR</span>
                  </button>

                  {isConfirmed && (
                    <button
                      onClick={() => setCancellingRegistration(reg)}
                      className="px-3.5 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-semibold transition-colors"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

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
        title="Cancel Registration?"
        message={`Are you sure you want to cancel your seat for "${cancellingRegistration?.eventTitle}"? This will release your reserved ticket so another attendee can book it.`}
        confirmText="Yes, Cancel Booking"
        cancelText="Keep My Booking"
      />
    </div>
  );
};
