import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Ticket,
  TrendingUp,
  Plus,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Database,
  BarChart3,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { EventItem, Registration } from '../types';

interface AdminDashboardProps {
  onNavigateToManageEvents: () => void;
  onNavigateToParticipants: () => void;
  onOpenCreateEvent: () => void;
  onSelectEvent: (event: EventItem) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onNavigateToManageEvents,
  onNavigateToParticipants,
  onOpenCreateEvent,
  onSelectEvent,
}) => {
  const { profile, isAdmin, signInWithDemo } = useAuth();
  const { events, allRegistrations, stats, seedInitialEvents } = useEvents();

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-purple-50 text-purple-700 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-heading text-slate-900">
          Admin Privileges Required
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          The Admin Dashboard is restricted to platform administrators. For demonstration and project grading, switch to Admin Mode below.
        </p>
        <button
          onClick={() => signInWithDemo('admin')}
          className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-purple-200"
        >
          Enable Demo Admin Mode
        </button>
      </div>
    );
  }

  const recentRegistrations = [...allRegistrations]
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 5);

  const topCapacityEvents = [...events]
    .sort((a, b) => (b.registeredCount / b.maxParticipants) - (a.registeredCount / a.maxParticipants))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-600 font-semibold text-xs tracking-wider uppercase">
            <LayoutDashboard className="w-4 h-4" />
            <span>Admin Management Console</span>
          </div>
          <h1 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
            System Overview & Metrics
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor real-time event analytics, bookings, and attendee registrations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenCreateEvent}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Event</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Events */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Events
            </span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-heading text-slate-900">
              {stats.totalEvents}
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              {stats.activeEvents} Active
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Across {new Set(events.map((e) => e.category)).size} unique categories
          </p>
        </div>

        {/* Total Registrations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Bookings
            </span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Ticket className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-heading text-slate-900">
              {stats.totalRegistrations}
            </span>
            <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
              Passes Issued
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {allRegistrations.filter((r) => r.status === 'cancelled').length} cancellations recorded
          </p>
        </div>

        {/* Unique Participants */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Attendees
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-heading text-slate-900">
              {stats.totalParticipants}
            </span>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
              Unique Users
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Registered with verified email & profile
          </p>
        </div>

        {/* Capacity Utilization */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Capacity Utilization
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-3xl font-extrabold font-heading text-slate-900">
              {stats.capacityUtilization}%
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Total capacity across all venues
          </p>
        </div>
      </div>

      {/* Middle Row: Top Capacity Events & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Capacity Breakdown */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Event Fill Rate & Occupancy
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Top scheduled events approaching or exceeding capacity threshold
              </p>
            </div>
            <button
              onClick={onNavigateToManageEvents}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {topCapacityEvents.map((evt) => {
              const fill = Math.min(
                100,
                Math.round((evt.registeredCount / evt.maxParticipants) * 100)
              );
              return (
                <div
                  key={evt.id}
                  onClick={() => onSelectEvent(evt)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/80 cursor-pointer space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[280px]">
                      {evt.title}
                    </span>
                    <span className="text-xs font-semibold text-slate-700">
                      {evt.registeredCount} / {evt.maxParticipants} ({fill}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        fill >= 90 ? 'bg-amber-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${fill}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{evt.category} • {evt.date}</span>
                    <span className="text-indigo-600 font-medium">Click to view event</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Management Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Quick Admin Controls
            </h3>
            <p className="text-xs text-slate-500">
              Direct access to common event organizer and registration workflows.
            </p>

            <div className="space-y-2.5 pt-2">
              <button
                onClick={onOpenCreateEvent}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 border border-indigo-100 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl">
                    <Plus className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Create New Event</h4>
                    <p className="text-[11px] text-indigo-700">Publish a conference or workshop</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-indigo-600" />
              </button>

              <button
                onClick={onNavigateToManageEvents}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-slate-900 text-white rounded-xl">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Manage All Events</h4>
                    <p className="text-[11px] text-slate-500">Edit schedule, capacity & delete</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={onNavigateToParticipants}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-600 text-white rounded-xl">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs">Participants & Attendance</h4>
                    <p className="text-[11px] text-slate-500">Check-in desk & export attendee CSV</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table: Recent Registrations Feed */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Recent Registrations Feed
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live updates of the latest attendee bookings across all events.
            </p>
          </div>
          <button
            onClick={onNavigateToParticipants}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Attendees</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentRegistrations.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No registrations received yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Ticket ID</th>
                  <th className="pb-3">Attendee</th>
                  <th className="pb-3">Event</th>
                  <th className="pb-3">Date</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 pr-2 text-right">Registration Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 pl-2 font-mono font-bold text-indigo-700">
                      {reg.ticketCode}
                    </td>
                    <td className="py-3.5">
                      <div className="font-bold text-slate-900">{reg.userName}</div>
                      <div className="text-[11px] text-slate-400">{reg.userEmail}</div>
                    </td>
                    <td className="py-3.5 font-medium text-slate-700 max-w-[200px] truncate">
                      {reg.eventTitle}
                    </td>
                    <td className="py-3.5 text-slate-600">{reg.eventDate}</td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          reg.status === 'confirmed'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-rose-50 text-rose-700'
                        }`}
                      >
                        {reg.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 pr-2 text-right text-slate-400">
                      {new Date(reg.registeredAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
