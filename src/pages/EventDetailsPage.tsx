import React, { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Share2,
  Bookmark,
  ShieldCheck,
  Building,
  User,
  Ticket,
  Sparkles,
} from 'lucide-react';
import { EventItem } from '../types';
import { useEvents } from '../context/EventContext';

interface EventDetailsPageProps {
  event: EventItem | null;
  onBack: () => void;
  onRegisterClick: (event: EventItem) => void;
  onViewMyTicket?: () => void;
}

export const EventDetailsPage: React.FC<EventDetailsPageProps> = ({
  event,
  onBack,
  onRegisterClick,
  onViewMyTicket,
}) => {
  const { isUserRegistered } = useEvents();
  const [copied, setCopied] = useState(false);

  if (!event) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-500">Event not found or has been removed.</p>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Events</span>
        </button>
      </div>
    );
  }

  const registered = isUserRegistered(event.id);
  const isSoldOut = event.registeredCount >= event.maxParticipants;
  const isCancelled = event.status === 'cancelled';
  const remainingSeats = Math.max(0, event.maxParticipants - event.registeredCount);
  const fillPercentage = Math.min(
    100,
    Math.round((event.registeredCount / event.maxParticipants) * 100)
  );

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Events Catalog</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? 'Link Copied!' : 'Share Event'}</span>
          </button>
        </div>
      </div>

      {/* Hero Banner with Title Overlay */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl min-h-[340px] sm:min-h-[420px] flex flex-col justify-end">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

        <div className="relative z-10 p-6 sm:p-10 lg:p-12 space-y-4 max-w-4xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {event.category}
            </span>
            {event.featured && (
              <span className="bg-purple-600/90 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured Experience
              </span>
            )}
            {isCancelled && (
              <span className="bg-rose-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                Cancelled
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold font-heading text-white leading-tight">
            {event.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-300 pt-2">
            <span className="flex items-center gap-2 font-semibold text-white">
              <Calendar className="w-4 h-4 text-indigo-400" />
              {event.date}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-400" />
              {event.time}
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              {event.location}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left 8 cols: Detailed Description & Venue info */}
        <div className="lg:col-span-8 space-y-8">
          {/* About Event */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900">
              About This Event
            </h2>
            <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line space-y-4">
              <p>{event.description}</p>
            </div>

            <div className="pt-6 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
                    Verified Organizer
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Hosted by <span className="font-semibold text-slate-700">{event.organizerName}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider">
                    Instant Digital Pass
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Unique QR code issued right into your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Location & Venue Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h2 className="text-xl font-bold font-heading text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-600" />
              Venue & Location
            </h2>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <p className="font-bold text-slate-900 text-sm">{event.venue}</p>
                <p className="text-xs text-slate-500 mt-0.5">{event.location}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 w-fit">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                On-Site Check-in Available
              </span>
            </div>

            {/* Simulated interactive map placeholder */}
            <div className="h-44 rounded-2xl bg-gradient-to-tr from-slate-200 via-indigo-50 to-slate-100 border border-slate-200 flex flex-col items-center justify-center text-center p-4">
              <MapPin className="w-8 h-8 text-indigo-600 animate-bounce mb-1" />
              <p className="text-xs font-semibold text-slate-700">{event.venue}</p>
              <p className="text-[11px] text-slate-500">{event.location}</p>
            </div>
          </div>
        </div>

        {/* Right 4 cols: Sticky Booking Action Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-lg sticky top-24 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[11px] uppercase font-semibold text-slate-400 block">
                  Registration
                </span>
                <span className="text-2xl font-extrabold text-slate-900 font-heading">
                  {event.price === 0 ? 'Free Entry' : `$${event.price}.00`}
                </span>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                registered
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : isSoldOut
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                {registered ? 'Booked' : isSoldOut ? 'Sold Out' : 'Open'}
              </span>
            </div>

            {/* Capacity Meter */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Participants Capacity</span>
                </span>
                <span className="font-bold text-slate-800">
                  {event.registeredCount} / {event.maxParticipants}
                </span>
              </div>

              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    fillPercentage >= 90
                      ? 'bg-amber-500'
                      : fillPercentage >= 100
                      ? 'bg-rose-500'
                      : 'bg-indigo-600'
                  }`}
                  style={{ width: `${fillPercentage}%` }}
                />
              </div>

              <p className="text-[11px] text-slate-400 text-right">
                {remainingSeats} {remainingSeats === 1 ? 'seat' : 'seats'} remaining
              </p>
            </div>

            {/* Event Key Highlights */}
            <div className="bg-slate-50 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Date</span>
                <span className="font-semibold text-slate-800">{event.date}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Time</span>
                <span className="font-semibold text-slate-800">{event.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Organizer</span>
                <span className="font-semibold text-slate-800 truncate max-w-[150px]">
                  {event.organizerName}
                </span>
              </div>
            </div>

            {/* CTA Button */}
            {registered ? (
              <div className="space-y-2">
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
                  <p className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    You are registered!
                  </p>
                </div>
                {onViewMyTicket && (
                  <button
                    onClick={onViewMyTicket}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Ticket className="w-4 h-4" />
                    <span>View Digital Ticket Pass</span>
                  </button>
                )}
              </div>
            ) : isSoldOut || isCancelled ? (
              <button
                disabled
                className="w-full py-3 bg-slate-100 text-slate-400 text-xs font-bold rounded-xl cursor-not-allowed text-center"
              >
                {isCancelled ? 'Event Cancelled' : 'Registration Closed (Sold Out)'}
              </button>
            ) : (
              <button
                onClick={() => onRegisterClick(event)}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                <Ticket className="w-4 h-4" />
                <span>Register for Event</span>
              </button>
            )}

            <div className="text-center">
              <span className="text-[11px] text-slate-400">
                Guaranteed seat reservation • Instant confirmation
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
