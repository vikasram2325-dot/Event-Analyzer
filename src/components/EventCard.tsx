import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  AlertCircle,
  Tag,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { EventItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onRegisterClick?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onRegisterClick,
}) => {
  const { isUserRegistered } = useEvents();
  const registered = isUserRegistered(event.id);

  const isSoldOut = event.registeredCount >= event.maxParticipants;
  const isCancelled = event.status === 'cancelled';
  const remainingSeats = Math.max(0, event.maxParticipants - event.registeredCount);
  const fillPercentage = Math.min(
    100,
    Math.round((event.registeredCount / event.maxParticipants) * 100)
  );

  // Format date: "Fri, Nov 20, 2026"
  const formattedDate = (() => {
    try {
      const d = new Date(event.date + 'T00:00:00');
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return event.date;
    }
  })();

  return (
    <div
      onClick={() => onSelect(event)}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Banner */}
      <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80';
          }}
        />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
          <Tag className="w-3 h-3 text-indigo-400" />
          <span>{event.category}</span>
        </div>

        {/* Status Badges */}
        <div className="absolute top-3 right-3 flex flex-col gap-1 items-end">
          {isCancelled ? (
            <span className="bg-rose-600/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" />
              Cancelled
            </span>
          ) : isSoldOut ? (
            <span className="bg-amber-600/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              Sold Out
            </span>
          ) : registered ? (
            <span className="bg-emerald-600/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Booked
            </span>
          ) : remainingSeats <= 15 ? (
            <span className="bg-amber-500/95 backdrop-blur-md text-slate-950 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
              Only {remainingSeats} Left
            </span>
          ) : null}

          {event.price === 0 ? (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              Free Entry
            </span>
          ) : (
            <span className="bg-indigo-600/90 backdrop-blur-md text-white text-xs font-bold px-2.5 py-0.5 rounded-full shadow-sm">
              ${event.price}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Date & Time */}
          <div className="flex items-center gap-3 text-xs font-semibold text-indigo-600 mb-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1 text-slate-500 font-normal">
              <Clock className="w-3.5 h-3.5" />
              {event.time}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-heading font-bold text-lg text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
            {event.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Location & Venue */}
          <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{event.venue}, {event.location}</span>
          </div>
        </div>

        {/* Capacity Progress Bar & Action */}
        <div className="pt-3 border-t border-slate-100 space-y-3">
          <div>
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {event.registeredCount} / {event.maxParticipants} Registered
                </span>
              </span>
              <span className="font-semibold text-slate-700">
                {fillPercentage}%
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
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
          </div>

          {/* Bottom Card Footer */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-slate-400 font-medium">
              By <span className="text-slate-700 font-semibold">{event.organizerName}</span>
            </span>

            {registered ? (
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Registered
              </span>
            ) : isSoldOut || isCancelled ? (
              <button
                disabled
                className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg cursor-not-allowed"
              >
                {isCancelled ? 'Cancelled' : 'Full'}
              </button>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onRegisterClick) {
                    onRegisterClick(event);
                  } else {
                    onSelect(event);
                  }
                }}
                className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 rounded-lg shadow-sm shadow-indigo-200 transition-colors"
              >
                <span>Book Seat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
