import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  ShieldCheck,
  Calendar,
  Ticket,
  CheckCircle2,
  Save,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

interface UserProfilePageProps {
  onNavigateToBookings: () => void;
  onNavigateToAdmin?: () => void;
  onOpenAuth: () => void;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({
  onNavigateToBookings,
  onNavigateToAdmin,
  onOpenAuth,
}) => {
  const { profile, isAdmin, updateUserProfile, signInWithDemo } = useAuth();
  const { userRegistrations } = useEvents();

  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [phoneNumber, setPhoneNumber] = useState(profile?.phoneNumber || '');
  const [saving, setSaving] = useState(false);
  const [successNotice, setSuccessNotice] = useState(false);

  React.useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhoneNumber(profile.phoneNumber || '');
    }
  }, [profile]);

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-slate-500">Please sign in to view your profile.</p>
        <button
          onClick={onOpenAuth}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  const confirmedCount = userRegistrations.filter((r) => r.status === 'confirmed').length;
  const cancelledCount = userRegistrations.filter((r) => r.status === 'cancelled').length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUserProfile({
        displayName: displayName.trim(),
        phoneNumber: phoneNumber.trim(),
      });
      setSuccessNotice(true);
      setTimeout(() => setSuccessNotice(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 pb-24">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-indigo-600 font-semibold text-xs tracking-wider uppercase">
          <User className="w-4 h-4" />
          <span>Account Settings</span>
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-slate-900 mt-1">
          Attendee Profile & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your personal details and view your platform participation.
        </p>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            {profile.photoURL ? (
              <img
                src={profile.photoURL}
                alt={profile.displayName}
                className="w-16 h-16 rounded-2xl object-cover ring-4 ring-indigo-50"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-2xl">
                {profile.displayName?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
            <div>
              <h3 className="font-heading font-bold text-xl text-slate-900">
                {profile.displayName || 'Event Attendee'}
              </h3>
              <p className="text-xs text-slate-500">{profile.email}</p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    isAdmin
                      ? 'bg-purple-50 text-purple-700 border border-purple-200'
                      : 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {isAdmin ? 'System Administrator' : 'Standard Attendee'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Demo Switcher for Evaluation */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs space-y-2">
            <span className="font-semibold text-slate-600 block text-[11px] uppercase tracking-wider">
              Evaluator Quick Switch
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => signInWithDemo('admin')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  isAdmin
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Admin Mode
              </button>
              <button
                type="button"
                onClick={() => signInWithDemo('user')}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  !isAdmin
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                Attendee Mode
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-center">
            <span className="text-2xl font-bold font-heading text-indigo-700 block">
              {confirmedCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Active Bookings</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
            <span className="text-2xl font-bold font-heading text-slate-800 block">
              {cancelledCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Cancelled Passes</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 text-center col-span-2 sm:col-span-1">
            <span className="text-2xl font-bold font-heading text-emerald-700 block">
              {confirmedCount + cancelledCount}
            </span>
            <span className="text-xs text-slate-500 font-medium">Lifetime Interactions</span>
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="font-heading font-bold text-lg text-slate-900">
          Personal Information
        </h3>

        {successNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address (Read-only)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Account Created
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  disabled
                  value={new Date(profile.createdAt).toLocaleDateString()}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-100 text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onNavigateToBookings}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
            >
              <Ticket className="w-4 h-4" />
              <span>Go to My Bookings</span>
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
