import React from 'react';
import { 
  X, 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  BookmarkCheck, 
  Shield, 
  Lock,
  Ticket,
  Printer,
  Sparkles,
  CreditCard,
  ThumbsUp
} from 'lucide-react';
import { Booking, HouseHuntingPayment } from '../types';
import { 
  maskRegNumber, 
  maskMpesaCode, 
  maskPhoneNumber, 
  maskCaretakerPhone, 
  formatDiscreetCurrency 
} from '../utils/security';

interface BookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookings: Booking[];
  isAdmin: boolean;
  onOpenAdminPanel: () => void;
  isDiscreetMode: boolean;
  onViewPassSlip?: (passCode: string) => void;
  onPayAfterViewing?: (booking: Booking) => void;
}

export const BookingsModal: React.FC<BookingsModalProps> = ({
  isOpen,
  onClose,
  bookings,
  isAdmin,
  onOpenAdminPanel,
  isDiscreetMode,
  onViewPassSlip,
  onPayAfterViewing,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-extrabold text-lg text-slate-900">
                My Viewings & Escrow Passes
              </h3>
              {!isAdmin && (
                <span className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1 border border-slate-200">
                  <Lock className="w-3 h-3 text-amber-600" />
                  PII Vaulted
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {isAdmin
                ? 'Admin View: Full Unmasked Direct Contacts & Escrow Keys Active'
                : 'Free viewing passes and post-viewing escrow records.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {bookings.length === 0 ? (
            <div className="text-center py-12">
              <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-slate-700">No scheduled viewings yet</h4>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Select any hostel or bedsitter in KM or Wendani and click "Free View" to schedule your 100% free physical inspection.
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const isFree = booking.depositAmount === 0 || booking.isFreeViewing;
              return (
                <div
                  key={booking.id}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#047857] uppercase tracking-wider block">
                        Ref #{booking.id} {booking.clearancePassCode ? `· ${booking.clearancePassCode}` : ''}
                      </span>
                      <h4 className="font-display font-bold text-sm text-slate-900">
                        {booking.propertyTitle}
                      </h4>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#047857]" />
                        {booking.neighborhood}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase ${
                        isFree
                          ? 'bg-emerald-100 text-[#047857] border border-emerald-300'
                          : booking.status === 'reserved'
                          ? 'bg-purple-100 text-purple-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}
                    >
                      {isFree ? '100% Free Viewing' : booking.status === 'reserved' ? 'Room Reserved' : 'Escorted Viewing'}
                    </span>
                  </div>

                  {/* Restricted Student PII Box */}
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200 text-xs space-y-1">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student Name:</span>
                      <span className="font-semibold text-slate-900">{booking.studentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">KU Reg No:</span>
                      <span className="font-mono font-bold text-slate-900 flex items-center gap-1">
                        {maskRegNumber(booking.studentRegNo, isAdmin)}
                        {!isAdmin && (
                          <span className="text-[9px] text-amber-700 bg-amber-50 px-1 rounded">Masked</span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Contact:</span>
                      <span className="font-mono font-medium text-slate-700">
                        {maskPhoneNumber(booking.studentPhone, isAdmin)}
                      </span>
                    </div>
                  </div>

                  {booking.viewingDate && (
                    <div className="p-2.5 bg-white rounded-xl border border-slate-200/70 text-xs text-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[#047857]" />
                        <span>{booking.viewingDate} ({booking.viewingTime})</span>
                      </div>
                      <span className="text-[11px] font-semibold text-emerald-700">ACCREDITED ESCORT</span>
                    </div>
                  )}

                  {/* Financial Status: Free Viewing vs Paid Escrow */}
                  {isFree ? (
                    <div className="p-3 bg-emerald-50/80 rounded-xl border border-emerald-200 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-emerald-800 uppercase font-extrabold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#047857]" />
                          <span>Inspection Cost: KES 0 (100% Free)</span>
                        </span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded font-bold">
                          Pay After Viewing
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-tight">
                        You are not charged anything upfront. If you like this room during the inspection, you can lock it directly below.
                      </p>
                      {onPayAfterViewing && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onPayAfterViewing(booking);
                          }}
                          className="w-full py-2 px-3 bg-[#047857] hover:bg-[#065F46] text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <CreditCard className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Liked the Room? Pay After Viewing to Reserve Unit</span>
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
                      <div>
                        <span className="block text-[10px] text-emerald-700 uppercase font-bold">
                          Post-Viewing Escrow Ref
                        </span>
                        <span className="font-mono font-black text-sm">
                          {maskMpesaCode(booking.mpesaCode, isAdmin)}
                        </span>
                        {!isAdmin && (
                          <span className="text-[9px] text-emerald-600 block">
                            Protected · Unmasked in Admin Vault
                          </span>
                        )}
                      </div>
                      <span className="font-extrabold text-base tabular-nums">
                        {formatDiscreetCurrency(booking.depositAmount, isDiscreetMode)}
                      </span>
                    </div>
                  )}

                  {/* Caretaker Contact Protected / Restricted Bar */}
                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                    <span>Caretaker: <strong>{booking.caretakerName}</strong></span>
                    {isAdmin ? (
                      <a
                        href={`tel:${booking.caretakerPhone}`}
                        className="font-bold text-[#047857] flex items-center gap-1 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call ({booking.caretakerPhone})</span>
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                        <Lock className="w-3 h-3 text-amber-600" />
                        <span>{maskCaretakerPhone(booking.caretakerPhone, false)}</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {!isAdmin && (
            <div className="p-3 bg-slate-100 rounded-2xl text-center space-y-1">
              <span className="text-[11px] text-slate-500 block">
                Are you an authorized agency administrator?
              </span>
              <button
                onClick={() => {
                  onClose();
                  onOpenAdminPanel();
                }}
                className="text-xs font-bold text-[#047857] hover:underline flex items-center justify-center gap-1 mx-auto cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Log into Admin Security Vault to view unmasked credentials</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
