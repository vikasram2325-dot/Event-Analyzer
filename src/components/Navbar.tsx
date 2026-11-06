import React, { useState } from 'react';
import {
  Calendar,
  Ticket,
  LayoutDashboard,
  Users,
  Compass,
  LogOut,
  User as UserIcon,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export type ActivePage =
  | 'landing'
  | 'events'
  | 'event-details'
  | 'my-bookings'
  | 'profile'
  | 'admin-dashboard'
  | 'admin-events'
  | 'admin-participants'
  | 'auth';

interface NavbarProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenAuth: (initialMode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  onOpenAuth,
}) => {
  const { profile, isAdmin, signOut } = useAuth();
  const { userRegistrations } = useEvents();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const confirmedBookingsCount = userRegistrations.filter(
    (r) => r.status === 'confirmed'
  ).length;

  const navigateTo = (page: ActivePage) => {
    setActivePage(page);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <div
            onClick={() => navigateTo('landing')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-heading">
                  Event<span className="text-indigo-600">Ease</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-100">
                  Pro
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                Smart Event Management
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button
              onClick={() => navigateTo('landing')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'landing'
                  ? 'text-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => navigateTo('events')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'events' || activePage === 'event-details'
                  ? 'text-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-500" />
              Explore Events
            </button>

            {/* My Bookings link */}
            <button
              onClick={() => {
                if (!profile) {
                  onOpenAuth('login');
                } else {
                  navigateTo('my-bookings');
                }
              }}
              className={`relative flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                activePage === 'my-bookings'
                  ? 'text-indigo-600 bg-indigo-50 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-4 h-4 text-slate-500" />
              My Bookings
              {confirmedBookingsCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center px-1.5 py-0.2 text-[11px] font-bold text-white bg-indigo-600 rounded-full min-w-5 h-5">
                  {confirmedBookingsCount}
                </span>
              )}
            </button>

            {/* Admin Hub Navigation */}
            {isAdmin && (
              <div className="flex items-center pl-2 ml-2 border-l border-slate-200 gap-1">
                <button
                  onClick={() => navigateTo('admin-dashboard')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activePage === 'admin-dashboard'
                      ? 'bg-purple-100 text-purple-800'
                      : 'text-purple-700 bg-purple-50 hover:bg-purple-100'
                  }`}
                  title="Admin Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  Dashboard
                </button>
                <button
                  onClick={() => navigateTo('admin-events')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activePage === 'admin-events'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  title="Manage Events"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  Manage
                </button>
                <button
                  onClick={() => navigateTo('admin-participants')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-colors ${
                    activePage === 'admin-participants'
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  title="View Participants"
                >
                  <Users className="w-3.5 h-3.5" />
                  Attendees
                </button>
              </div>
            )}
          </nav>

          {/* Right Action / Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {!profile ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenAuth('login')}
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => onOpenAuth('register')}
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all active:scale-95"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-3 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left"
                >
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-semibold text-slate-900 leading-tight">
                      {profile.displayName || 'Account'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium capitalize">
                      {isAdmin ? 'Admin' : 'Attendee'}
                    </span>
                  </div>
                  {profile.photoURL ? (
                    <img
                      src={profile.photoURL}
                      alt={profile.displayName}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                      {profile.displayName?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
                </button>

                {/* Profile Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-medium text-slate-500">Signed in as</p>
                      <p className="text-sm font-semibold text-slate-900 truncate">
                        {profile.email}
                      </p>
                      {isAdmin && (
                        <div className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3" />
                          System Administrator
                        </div>
                      )}
                    </div>

                    <button
                      onClick={() => navigateTo('profile')}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <UserIcon className="w-4 h-4 text-slate-400" />
                      My Profile
                    </button>

                    <button
                      onClick={() => navigateTo('my-bookings')}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                    >
                      <span className="flex items-center gap-2">
                        <Ticket className="w-4 h-4 text-slate-400" />
                        My Bookings
                      </span>
                      {confirmedBookingsCount > 0 && (
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                          {confirmedBookingsCount}
                        </span>
                      )}
                    </button>

                    {isAdmin && (
                      <div className="border-t border-slate-100 my-1 pt-1">
                        <p className="px-4 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                          Admin Tools
                        </p>
                        <button
                          onClick={() => navigateTo('admin-dashboard')}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-purple-700 hover:bg-purple-50"
                        >
                          <LayoutDashboard className="w-4 h-4 text-purple-600" />
                          Admin Dashboard
                        </button>
                        <button
                          onClick={() => navigateTo('admin-events')}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Calendar className="w-4 h-4 text-slate-400" />
                          Manage Events
                        </button>
                        <button
                          onClick={() => navigateTo('admin-participants')}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <Users className="w-4 h-4 text-slate-400" />
                          Participants Master
                        </button>
                      </div>
                    )}

                    <div className="border-t border-slate-100 my-1 pt-1">
                      <button
                        onClick={async () => {
                          await signOut();
                          setProfileDropdownOpen(false);
                          navigateTo('landing');
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {profile && (
              <button
                onClick={() => navigateTo('my-bookings')}
                className="relative p-2 text-slate-600 hover:text-slate-900 rounded-lg"
                title="My Bookings"
              >
                <Ticket className="w-5 h-5" />
                {confirmedBookingsCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full" />
                )}
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => navigateTo('landing')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              activePage === 'landing' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => navigateTo('events')}
            className={`w-full text-left px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              activePage === 'events' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
            }`}
          >
            Explore Events
          </button>
          <button
            onClick={() => {
              if (!profile) onOpenAuth('login');
              else navigateTo('my-bookings');
            }}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium ${
              activePage === 'my-bookings' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-700'
            }`}
          >
            <span>My Bookings</span>
            {confirmedBookingsCount > 0 && (
              <span className="text-xs bg-indigo-600 text-white font-bold px-2 py-0.5 rounded-full">
                {confirmedBookingsCount}
              </span>
            )}
          </button>

          {isAdmin && (
            <div className="pt-2 border-t border-slate-100 space-y-1">
              <p className="px-3.5 text-xs font-semibold uppercase tracking-wider text-purple-700">
                Administrator
              </p>
              <button
                onClick={() => navigateTo('admin-dashboard')}
                className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium text-purple-700 bg-purple-50"
              >
                Dashboard
              </button>
              <button
                onClick={() => navigateTo('admin-events')}
                className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700"
              >
                Manage Events
              </button>
              <button
                onClick={() => navigateTo('admin-participants')}
                className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700"
              >
                Attendees Master
              </button>
            </div>
          )}

          <div className="pt-4 border-t border-slate-200">
            {!profile ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full py-2.5 text-center text-sm font-medium border border-slate-300 rounded-lg text-slate-700"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('register');
                  }}
                  className="w-full py-2.5 text-center text-sm font-semibold bg-indigo-600 text-white rounded-lg"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => navigateTo('profile')}
                  className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium text-slate-700"
                >
                  User Profile ({profile.displayName})
                </button>
                <button
                  onClick={async () => {
                    await signOut();
                    setMobileMenuOpen(false);
                    navigateTo('landing');
                  }}
                  className="w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium text-rose-600 bg-rose-50"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
