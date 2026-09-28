import React from 'react';
import { 
  X, 
  ShieldCheck, 
  QrCode, 
  Printer, 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Lock, 
  CheckCircle2, 
  Sparkles,
  Download,
  ThumbsUp
} from 'lucide-react';
import { HouseHuntingPayment } from '../types';
import { ADMIN_CONFIG, generateClearanceHash, formatDiscreetCurrency, maskRegNumber, maskPhoneNumber } from '../utils/security';

interface DiscreetViewingPassModalProps {
  pass: HouseHuntingPayment | null;
  onClose: () => void;
  isAdmin: boolean;
  isDiscreetMode: boolean;
}

export const DiscreetViewingPassModal: React.FC<DiscreetViewingPassModalProps> = ({
  pass,
  onClose,
  isAdmin,
  isDiscreetMode,
}) => {
  if (!pass) return null;

  const clearanceHash = generateClearanceHash(pass.id + pass.clearancePassCode);
  const isFree = pass.amount === 0 || pass.isFreeViewing;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Top Controls */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
            <span className="font-display font-extrabold text-sm text-white">
              {isFree ? '100% Free Viewing Clearance Voucher' : 'Post-Viewing Escrow Receipt'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Print or Save PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print Slip</span>
            </button>
            <button
              onClick={onClose}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Physical Slip Body */}
        <div className="p-6 bg-[#FCFDFD] space-y-6 text-slate-900" id="clearance-slip">
          {/* Header Watermark Block */}
          <div className="text-center pb-5 border-b-2 border-dashed border-slate-200 relative">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] text-white flex items-center justify-center mx-auto shadow-md mb-2">
              <ShieldCheck className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <h2 className="font-display font-black text-xl text-slate-900 tracking-tight">
              KU ROOM FINDERS AGENCY LTD
            </h2>
            <span className="text-[10px] uppercase tracking-widest font-extrabold text-[#2563EB] block">
              ACCREDITED OFF-CAMPUS HOUSING PLACEMENT BUREAU
            </span>
            <p className="text-[11px] text-slate-400 mt-1 font-mono">
              Main Office: KM Gate Centre, 2nd Floor Â· P.O Box 43844-00100 Nairobi
            </p>
          </div>

          {/* Pass ID & Status */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-extrabold block tracking-wider">
                Clearance Slip ID
              </span>
              <span className="font-mono font-black text-lg text-slate-900">
                {pass.clearancePassCode}
              </span>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider inline-flex items-center gap-1 ${
                isFree
                  ? 'bg-blue-100 text-[#2563EB] border border-blue-300'
                  : 'bg-blue-100/90 text-blue-800 border border-blue-300'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                {isFree ? '100% Free Inspection' : 'Escrow Cleared'}
              </span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Candidate Comrade:</span>
              <span className="font-bold text-slate-900">{pass.studentName}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">KU Registration No:</span>
              <span className="font-mono font-bold text-slate-900">
                {maskRegNumber(pass.studentRegNo, isAdmin)}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Inspection Zone:</span>
              <span className="font-bold text-[#2563EB]">{pass.targetNeighborhood}</span>
            </div>
            {pass.propertyTitle && (
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 font-medium">Target Residence:</span>
                <span className="font-bold text-slate-900">{pass.propertyTitle}</span>
              </div>
            )}
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Designated Meeting Gate:</span>
              <span className="font-bold text-slate-900">{pass.pickupGate}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Scheduled Viewing Slot:</span>
              <span className="font-bold text-slate-900">{pass.scheduledDate} Â· {pass.scheduledTime}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Assigned Escort Agent:</span>
              <span className="font-bold text-slate-900">{pass.escortAgentAssigned}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Payment Timing:</span>
              <span className="font-bold text-[#2563EB]">
                {isFree ? 'Pay After Viewing (Zero Upfront)' : 'Paid Post-Inspection'}
              </span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100">
              <span className="text-slate-500 font-medium">Initial Upfront Fee:</span>
              <span className="font-display font-black text-slate-900 tabular-nums text-sm">
                {isFree ? 'KES 0.00 (FREE)' : formatDiscreetCurrency(pass.amount, isDiscreetMode)}
              </span>
            </div>
          </div>

          {/* QR Code & Security Stamp */}
          <div className="pt-4 border-t-2 border-dashed border-slate-200 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-400 font-mono block">Security Verification Hash:</span>
              <span className="text-xs font-mono font-extrabold text-slate-800 block">{clearanceHash}</span>
              <p className="text-[10px] text-slate-400 max-w-xs leading-tight">
                Show this clearance slip on your phone to your accredited guide at {pass.pickupGate}. Never hand cash to brokers.
              </p>
            </div>

            {/* Stylized QR Code Container */}
            <div className="w-18 h-18 bg-white p-2 rounded-2xl border-2 border-slate-900 shrink-0 flex items-center justify-center shadow-xs">
              <div className="grid grid-cols-4 gap-1 w-full h-full p-0.5">
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-transparent" />
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-transparent" />
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-transparent" />
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-transparent" />
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-slate-900 rounded-xs" />
                <div className="bg-transparent" />
                <div className="bg-slate-900 rounded-xs" />
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-blue-50 rounded-xl border border-blue-200/80 text-[11px] text-blue-950 leading-relaxed text-center">
            <strong>Free Viewing Guarantee:</strong> Physical viewing of the property is 100% FREE. You only pay holding escrow or placement fees after viewing and approving the unit.
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end">
          <button
            onClick={onClose}
            className="py-2.5 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Close Voucher
          </button>
        </div>
      </div>
    </div>
  );
};
