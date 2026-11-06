import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  User,
  Mail,
  Phone,
  FileText,
  ShieldCheck,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { EventItem, Registration } from '../types';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

interface RegistrationModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registration: Registration) => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
  onOpenAuth,
}) => {
  const { profile, signInWithDemo } = useAuth();
  const { registerForEvent, isUserRegistered } = useEvents();

  const [fullName, setFullName] = useState(profile?.displayName || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [phone, setPhone] = useState(profile?.phoneNumber || '');
  const [notes, setNotes] = useState('');
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync inputs if profile changes
  React.useEffect(() => {
    if (profile) {
      if (!fullName) setFullName(profile.displayName || '');
      if (!email) setEmail(profile.email || '');
      if (!phone) setPhone(profile.phoneNumber || '');
    }
  }, [profile]);

  if (!isOpen || !event) return null;

  const isSoldOut = event.registeredCount >= event.maxParticipants;
  const alreadyBooked = isUserRegistered(event.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!profile) {
      setErrorMessage('Please sign in to complete your event registration.');
      return;
    }

    if (!fullName.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!agreed) {
      setErrorMessage('Please agree to the event attendee terms to proceed.');
      return;
    }

    setLoading(true);
    try {
      const reg = await registerForEvent(event.id, {
        userName: fullName.trim(),
        userEmail: email.trim(),
        userPhone: phone.trim(),
        notes: notes.trim(),
      });

      // Trigger celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#4f46e5', '#7c3aed', '#10b981', '#f59e0b'],
        });
      } catch {
        // confetti fallback safe
      }

      onSuccess(reg);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="relative p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
              {event.category}
            </span>
            <h3 className="font-heading font-bold text-xl text-slate-900 mt-2 leading-snug">
              Register for {event.title}
            </h3>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1 font-medium text-slate-700">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                {event.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {event.time}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {event.location}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Status checks */}
          {alreadyBooked ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Already Registered</h4>
                <p className="text-xs mt-1 text-emerald-700">
                  You already have an active booking for this event. You can review your ticket pass or cancel anytime from your "My Bookings" page.
                </p>
              </div>
            </div>
          ) : isSoldOut ? (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Event Full</h4>
                <p className="text-xs mt-1 text-amber-700">
                  This event has reached its maximum limit of {event.maxParticipants} participants. Registrations are currently closed.
                </p>
              </div>
            </div>
          ) : !profile ? (
            <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 space-y-3">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-sm">Sign in to complete booking</h4>
                  <p className="text-xs mt-1 text-indigo-700">
                    To generate your verified digital ticket pass and link it to your account, please sign in or test with a one-click demo profile.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onOpenAuth('login')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Sign In with Google / Account
                </button>
                <button
                  type="button"
                  onClick={() => signInWithDemo('user')}
                  className="px-3 py-1.5 text-xs font-medium bg-white text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100/50 transition-colors"
                >
                  Continue as Demo Attendee
                </button>
              </div>
            </div>
          ) : null}

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  disabled={alreadyBooked || isSoldOut}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    disabled={alreadyBooked || isSoldOut}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    disabled={alreadyBooked || isSoldOut}
                    className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Requests or Notes (Optional)
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Dietary requirements, accessibility assistance, or team name..."
                  disabled={alreadyBooked || isSoldOut}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed resize-none"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2.5 pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                disabled={alreadyBooked || isSoldOut}
                className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
              />
              <label htmlFor="terms" className="text-xs text-slate-600 leading-snug cursor-pointer">
                I agree to the EventEase attendee code of conduct and confirm that I will present my digital ticket pass upon entry.
              </label>
            </div>

            {/* Pricing Summary */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Ticket Registration Fee</span>
              <span className="font-bold text-slate-900 text-sm">
                {event.price === 0 ? 'Free of Charge' : `$${event.price}.00 USD`}
              </span>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading || alreadyBooked || isSoldOut || !profile}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed shadow-md shadow-indigo-200 transition-all min-w-[130px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Booking...</span>
                  </>
                ) : alreadyBooked ? (
                  'Already Booked'
                ) : isSoldOut ? (
                  'Sold Out'
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
