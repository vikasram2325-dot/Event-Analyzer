import React from 'react';
import { Calendar, Mail, MapPin, Phone, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC<{
  onNavigate: (page: 'landing' | 'events' | 'admin-dashboard') => void;
}> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-900/50">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-heading">
                Event<span className="text-indigo-400">Ease</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              EventEase is the modern, smart event management and discovery platform designed for organizers to orchestrate memorable experiences and attendees to book tickets friction-free.
            </p>
            <div className="flex items-center gap-2 text-xs text-indigo-400 bg-slate-800/80 px-3 py-1.5 rounded-lg w-fit border border-slate-700/60">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Real-time Firebase Firestore Sync & Role-based Security</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Discover
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('landing')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Featured Events
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  All Conferences & Meetups
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Workshops & Masterclasses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('events')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Virtual Live Streams
                </button>
              </li>
            </ul>
          </div>

          {/* Organizers / Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Organizers
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Admin Analytics
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Publish New Event
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-dashboard')}
                  className="hover:text-white transition-colors text-slate-400"
                >
                  Attendee Verification & QR
                </button>
              </li>
              <li>
                <span className="text-xs text-slate-500">
                  Capacity Guard Protection
                </span>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-white">
              Contact & Inquiries
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@eventease.io</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>+1 (800) 555-EASE</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>San Francisco, CA & Global</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EventEase Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with React, Tailwind CSS & Firebase</span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1">
              Engineered for seamless event experiences <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
