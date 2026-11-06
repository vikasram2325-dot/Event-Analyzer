import React, { useState } from 'react';
import {
  Compass,
  LayoutGrid,
  List,
  Sparkles,
  Inbox,
  RotateCcw,
  Calendar,
  Clock,
  MapPin,
  Users,
  CheckCircle2,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventFilters } from '../components/EventFilters';
import { EventCard } from '../components/EventCard';
import { EventItem } from '../types';

interface EventsPageProps {
  onSelectEvent: (event: EventItem) => void;
  onOpenRegister: (event: EventItem) => void;
}

export const EventsPage: React.FC<EventsPageProps> = ({
  onSelectEvent,
  onOpenRegister,
}) => {
  const {
    filteredEvents,
    filterOptions,
    setFilterOptions,
    resetFilters,
    loadingEvents,
    isUserRegistered,
  } = useEvents();

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
            <Compass className="w-4 h-4" />
            <span>Event Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-slate-900 mt-1">
            Discover Upcoming Events
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Explore industry summits, technical workshops, festivals, and networking meetups.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 self-start md:self-end">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'grid'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters Component */}
      <EventFilters
        filterOptions={filterOptions}
        setFilterOptions={setFilterOptions}
        onReset={resetFilters}
        totalResults={filteredEvents.length}
      />

      {/* Events Results */}
      {loadingEvents ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-slate-500">Loading scheduled events...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mx-auto">
            <Inbox className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-lg text-slate-900">
            No events match your criteria
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            We couldn't find any events matching your selected filters. Try searching with different terms or reset your filters.
          </p>
          <button
            onClick={resetFilters}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onSelect={onSelectEvent}
              onRegisterClick={onOpenRegister}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const registered = isUserRegistered(event.id);
            const isSoldOut = event.registeredCount >= event.maxParticipants;
            const isCancelled = event.status === 'cancelled';
            const remainingSeats = Math.max(0, event.maxParticipants - event.registeredCount);

            return (
              <div
                key={event.id}
                onClick={() => onSelectEvent(event)}
                className="group bg-white rounded-2xl border border-slate-200 hover:border-indigo-200 hover:shadow-lg transition-all p-4 sm:p-5 flex flex-col md:flex-row gap-5 items-start md:items-center cursor-pointer"
              >
                {/* Image */}
                <div className="w-full md:w-52 h-40 md:h-32 rounded-xl overflow-hidden bg-slate-100 shrink-0 relative">
                  <img
                    src={event.imageUrl}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full backdrop-blur-sm">
                    {event.category}
                  </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-2 min-w-0">
                  <div className="flex items-center gap-3 text-xs font-semibold text-indigo-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {event.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-slate-500 font-normal">
                      <Clock className="w-3.5 h-3.5" />
                      {event.time}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold font-heading text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.venue}, {event.location}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span>{event.registeredCount} / {event.maxParticipants} booked</span>
                    </span>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                  <div className="text-right">
                    <span className="text-sm font-bold text-slate-900 block">
                      {event.price === 0 ? 'Free' : `$${event.price}`}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {remainingSeats} seats available
                    </span>
                  </div>

                  {registered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Registered
                    </span>
                  ) : isSoldOut || isCancelled ? (
                    <span className="text-xs font-medium text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg">
                      {isCancelled ? 'Cancelled' : 'Sold Out'}
                    </span>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRegister(event);
                      }}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-xl shadow-sm transition-colors"
                    >
                      <span>Book Seat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
