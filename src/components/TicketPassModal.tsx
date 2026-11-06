import React from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Printer,
  Download,
  Share2,
  QrCode,
  Sparkles,
  Ticket as TicketIcon,
} from 'lucide-react';
import { Registration } from '../types';

interface TicketPassModalProps {
  registration: Registration | null;
  isOpen: boolean;
  onClose: () => void;
  onGoToBookings?: () => void;
}

export const TicketPassModal: React.FC<TicketPassModalProps> = ({
  registration,
  isOpen,
  onClose,
  onGoToBookings,
}) => {
  if (!isOpen || !registration) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Top Controls */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold tracking-wider uppercase text-slate-200">
              Verified Event Pass
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Pass Container */}
        <div id="printable-ticket" className="p-6 bg-slate-50 flex-1 space-y-6">
          {/* Ticket Card */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
            {/* Top Event Cover */}
            <div className="relative h-28 bg-indigo-900">
              <img
                src={registration.eventImageUrl}
                alt={registration.eventTitle}
                className="w-full h-full object-cover opacity-60"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">
                  Confirmed Entry
                </span>
                <h3 className="text-base font-bold text-white font-heading truncate">
                  {registration.eventTitle}
                </h3>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-5 space-y-4">
              {/* Event Date & Time */}
              <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Date
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    {registration.eventDate}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Time
                  </span>
                  <span className="font-semibold text-slate-800 flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    {registration.eventTime}
                  </span>
                </div>
              </div>

              {/* Venue */}
              <div className="text-xs border-b border-slate-100 pb-3">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                  Location & Venue
                </span>
                <p className="font-semibold text-slate-800 flex items-start gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{registration.eventVenue}, {registration.eventLocation}</span>
                </p>
              </div>

              {/* Attendee Details */}
              <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-3">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Attendee
                  </span>
                  <span className="font-semibold text-slate-900 block truncate mt-0.5">
                    {registration.userName}
                  </span>
                  <span className="text-[11px] text-slate-500 truncate block">
                    {registration.userEmail}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">
                    Status
                  </span>
                  <span className={`inline-flex items-center gap-1 font-semibold text-xs mt-1 px-2 py-0.5 rounded-full ${
                    registration.status === 'confirmed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-rose-50 text-rose-700'
                  }`}>
                    <CheckCircle2 className="w-3 h-3" />
                    {registration.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* QR Code Section & Ticket Identifier */}
              <div className="flex items-center justify-between pt-1">
                <div className="space-y-1">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold block">
                    Ticket Reference
                  </span>
                  <span className="font-mono text-sm font-bold tracking-wider text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100 inline-block">
                    {registration.ticketCode}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    Scan at door for instant validation
                  </p>
                </div>

                {/* Simulated QR Code SVG */}
                <div className="w-16 h-16 bg-slate-900 p-1.5 rounded-xl flex items-center justify-center text-white shrink-0 shadow-inner">
                  <QrCode className="w-full h-full text-white" />
                </div>
              </div>
            </div>

            {/* Perforated edge effect */}
            <div className="relative border-t-2 border-dashed border-slate-200 bg-slate-50 p-2.5 text-center text-[10px] text-slate-400 font-mono tracking-widest uppercase">
              • • • PRESENT AT ENTRANCE • • •
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            Print Pass
          </button>

          {onGoToBookings && (
            <button
              onClick={() => {
                onClose();
                onGoToBookings();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              <TicketIcon className="w-3.5 h-3.5" />
              View in My Bookings
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
