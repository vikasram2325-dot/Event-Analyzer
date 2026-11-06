import React from 'react';
import {
  Calendar,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Users,
  Compass,
  CheckCircle,
  TrendingUp,
  Award,
  Zap,
  MapPin,
  Tag,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { EventCard } from '../components/EventCard';
import { EventCategory, EventItem } from '../types';

interface LandingPageProps {
  onNavigateToEvents: (category?: string) => void;
  onSelectEvent: (event: EventItem) => void;
  onOpenRegister: (event: EventItem) => void;
  onOpenCreateEvent?: () => void;
}

const CATEGORY_ITEMS: { name: EventCategory; icon: string; count: string; color: string }[] = [
  { name: 'Technology', icon: '💻', count: '18+ Events', color: 'from-blue-500/10 to-indigo-500/10' },
  { name: 'Business', icon: '📈', count: '12+ Events', color: 'from-emerald-500/10 to-teal-500/10' },
  { name: 'Design & Creative', icon: '🎨', count: '15+ Events', color: 'from-purple-500/10 to-pink-500/10' },
  { name: 'Music & Entertainment', icon: '🎵', count: '24+ Events', color: 'from-rose-500/10 to-amber-500/10' },
  { name: 'Workshops & Training', icon: '⚡', count: '10+ Events', color: 'from-amber-500/10 to-orange-500/10' },
  { name: 'Health & Wellness', icon: '🌿', count: '9+ Events', color: 'from-teal-500/10 to-emerald-500/10' },
  { name: 'Sports & Fitness', icon: '🏃', count: '14+ Events', color: 'from-red-500/10 to-orange-500/10' },
  { name: 'Community & Networking', icon: '🤝', count: '20+ Events', color: 'from-indigo-500/10 to-purple-500/10' },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onNavigateToEvents,
  onSelectEvent,
  onOpenRegister,
  onOpenCreateEvent,
}) => {
  const { events, stats, filterOptions, setFilterOptions } = useEvents();

  const featuredEvents = events
    .filter((e) => e.status === 'published')
    .slice(0, 6);

  const [heroSearch, setHeroSearch] = React.useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilterOptions((prev) => ({ ...prev, searchQuery: heroSearch }));
    onNavigateToEvents();
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/0 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 bg-indigo-500/15 border border-indigo-400/30 text-indigo-300 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>The Next-Generation Event Platform</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-heading leading-tight">
              Discover & Experience <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
                Remarkable Events
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              From high-stakes tech summits and investor pitch nights to acoustic festivals and hands-on masterclasses — explore, book passes in seconds, and manage your entire itinerary in one unified place.
            </p>

            {/* Hero Search Bar */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 max-w-2xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl flex flex-col sm:flex-row gap-2"
            >
              <input
                type="text"
                placeholder="Search by conference, topic, artist, or city..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                className="flex-1 px-4 py-3 bg-white text-slate-900 rounded-xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 font-medium"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/40 transition-all active:scale-98"
              >
                <span>Find Events</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Live Platform Stats */}
            <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-slate-800/80">
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-white">
                  {stats.totalEvents}+
                </div>
                <div className="text-xs text-slate-400 mt-1">Live Events</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-indigo-400">
                  {stats.totalRegistrations}+
                </div>
                <div className="text-xs text-slate-400 mt-1">Passes Issued</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-400">
                  {stats.capacityUtilization}%
                </div>
                <div className="text-xs text-slate-400 mt-1">Capacity Booked</div>
              </div>
              <div className="text-center p-3">
                <div className="text-2xl sm:text-3xl font-extrabold font-heading text-purple-400">
                  100%
                </div>
                <div className="text-xs text-slate-400 mt-1">Live Firebase Sync</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
              Explore Topics
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-2">
              Browse by Event Category
            </h2>
          </div>
          <button
            onClick={() => onNavigateToEvents()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {CATEGORY_ITEMS.map((item) => (
            <div
              key={item.name}
              onClick={() => onNavigateToEvents(item.name)}
              className="group p-5 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="text-3xl mb-3 transform group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <div>
                <h3 className="font-heading font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{item.count}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
              Trending Now
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 mt-2">
              Featured Upcoming Events
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Curated experiences with active bookings and confirmed keynote speakers.
            </p>
          </div>
          <button
            onClick={() => onNavigateToEvents()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>See Full Calendar ({events.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredEvents.map((evt) => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelect={onSelectEvent}
              onRegisterClick={onOpenRegister}
            />
          ))}
        </div>
      </section>

      {/* Why Choose EventEase / Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 lg:p-16 text-white relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800">
              Enterprise Grade Event Infrastructure
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-heading mt-4 leading-tight">
              Built for Organizers. Loved by Attendees.
            </h2>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              EventEase eliminates registration bottlenecks with real-time capacity locks, automatic QR ticket delivery, and real-time administrator controls.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-600/30 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Capacity Lock Guard</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Atomic transaction rules prevent overselling beyond participant limits.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-600/30 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Digital Pass & QR Codes</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Instant printable pass with unique references for door check-in.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-600/30 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Zero Duplicate Bookings</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Smart UID constraint locks prevent multiple duplicate seats per attendee.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-600/30 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-white">Live Admin Analytics</h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Track participant attendance, capacity usage, and export registration lists.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <button
                onClick={() => onNavigateToEvents()}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-indigo-600/30 transition-all"
              >
                Explore All Events
              </button>
              {onOpenCreateEvent && (
                <button
                  onClick={onOpenCreateEvent}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-xl border border-slate-700 transition-all"
                >
                  Create An Event
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
