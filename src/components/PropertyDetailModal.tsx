import React, { useState } from 'react';
import {
  X,
  MapPin,
  Footprints,
  Phone,
  MessageCircle,
  ShieldCheck,
  Check,
  Calendar,
  Clock,
  CreditCard,
  User,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  Info,
  Maximize2,
  Lock,
  Shield,
  Ticket,
  Key,
  ThumbsUp,
  Edit
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Property, Booking, HouseHuntingPayment } from '../types';
import { RoomHotspot } from '../data/mockData';
import {
  buildWhatsAppUrl,
  maskNationalId,
  maskPayoutAccount,
  maskCaretakerPhone,
  formatDiscreetCurrency,
  maskRegNumber
} from '../utils/security';

interface PropertyDetailModalProps {
  property: (Property & { hotspots?: RoomHotspot[] }) | null;
  onClose: () => void;
  onAddBooking: (booking: Booking) => void;
  isAdmin: boolean;
  onOpenAdminPanel: () => void;
  isDiscreetMode: boolean;
  onOpenDiscreetPayment: (property: Property, mode?: 'free_viewing' | 'pay_after_viewing') => void;
  onOpenEditProperty?: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onAddBooking,
  isAdmin,
  onOpenAdminPanel,
  isDiscreetMode,
  onOpenDiscreetPayment,
  onOpenEditProperty,
}) => {
  if (!property) return null;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'tour'>('photos');
  const [activeHotspot, setActiveHotspot] = useState<RoomHotspot | null>(
    property.hotspots && property.hotspots.length > 0 ? property.hotspots[0] : null
  );

  const [activeActionTab, setActiveActionTab] = useState<'free_viewing' | 'reserve'>('free_viewing');

  // Form state for free scheduling
  const [studentName, setStudentName] = useState('Charles Munyoki');
  const [studentRegNo, setStudentRegNo] = useState('E37/4820/2023');
  const [studentPhone, setStudentPhone] = useState('+254 712 345 678');
  const [viewingDate, setViewingDate] = useState('Tomorrow');
  const [viewingTime, setViewingTime] = useState('2:00 PM - 3:00 PM');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  const handleScheduleFreeViewing = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const passCode = `PASS-KU-${Math.floor(1000 + Math.random() * 9000)}`;
      const newBooking: Booking = {
        id: `VIEW-${Math.floor(100000 + Math.random() * 900000)}`,
        propertyId: property.id,
        propertyTitle: property.title,
        neighborhood: property.neighborhood,
        roomType: property.roomType,
        studentName,
        studentRegNo,
        studentPhone,
        depositAmount: 0, // 100% FREE UPFRONT
        mpesaCode: 'FREE-ESCORT-PASS',
        status: 'viewing_scheduled',
        bookingDate: new Date().toLocaleDateString(),
        viewingDate,
        viewingTime,
        caretakerName: property.caretakerName,
        caretakerPhone: property.caretakerPhone,
        clearancePassCode: passCode,
        isDiscreet: isDiscreetMode,
        isFreeViewing: true,
        paymentStatus: 'free_viewing_zero_cost',
      };

      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#2563EB', '#F59E0B', '#60A5FA'],
        });
      } catch {}

      setIsSubmitting(false);
      onAddBooking(newBooking);
      setBookingSuccess(`100% Free Physical Viewing Scheduled! Clearance Pass ID: ${passCode}. An accredited KU Room Finders field guide will meet you at ${property.nearestGate}. Physical inspection is 100% FREE  payment only happens after viewing if you decide to take the room!`);
    }, 500);
  };

  const handleOpenPostViewingCheckout = () => {
    onClose();
    onOpenDiscreetPayment(property, 'pay_after_viewing');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Sticky Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
          <div>
            <span className="text-xs font-bold text-[#2563EB] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
              Verified Off-Campus Residence  {property.neighborhood}
            </span>
            <h2 className="font-display font-black text-lg sm:text-xl text-slate-900 mt-0.5 truncate max-w-md sm:max-w-xl">
              {property.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onOpenEditProperty && (
              <button
                onClick={() => onOpenEditProperty(property)}
                className="py-1.5 px-3 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Edit House Details & Vacancies"
              >
                <Edit className="w-3.5 h-3.5 text-purple-600" />
                <span>Edit House</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Free Viewing Guarantee Tag */}
          <div className="p-3 bg-blue-50 rounded-2xl border border-blue-200/80 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-blue-950 font-bold">
              <span className="w-2 h-2 rounded-full bg-[#2563EB] animate-pulse"></span>
              <span>100% Free Room Viewing Guarantee: Zero Upfront Charges</span>
            </div>
            <span className="text-[10px] font-extrabold bg-[#2563EB] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Pay After Viewing
            </span>
          </div>

          {/* Media Header Controls: Photos vs Interactive Virtual Tour */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-bold">
              <button
                onClick={() => setActiveMediaTab('photos')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeMediaTab === 'photos'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Photo Gallery ({property.images.length})
              </button>

              <button
                onClick={() => setActiveMediaTab('tour')}
                className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeMediaTab === 'tour'
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Interactive Room Tour</span>
              </button>
            </div>

            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
              {property.vacantRoomsCount} Vacant Rooms
            </span>
          </div>

          {/* Media Display Viewport */}
          {activeMediaTab === 'photos' ? (
            /* Standard Gallery */
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-100 rounded-3xl overflow-hidden shadow-sm">
              <img
                src={property.images[currentImageIndex]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {property.images.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all shadow-md cursor-pointer"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full">
                {currentImageIndex + 1} / {property.images.length}
              </div>
            </div>
          ) : (
            /* Interactive Virtual Tour */
            <div className="relative aspect-[16/9] sm:aspect-[21/9] bg-slate-900 rounded-3xl overflow-hidden shadow-sm">
              <img
                src={property.images[0]}
                alt="Virtual Room Walkthrough"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-90"
              />

              {/* Hotspot Markers */}
              {property.hotspots?.map((hotspot) => (
                <button
                  key={hotspot.id}
                  onClick={() => setActiveHotspot(hotspot)}
                  style={{ top: `${hotspot.yPercent}%`, left: `${hotspot.xPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none cursor-pointer"
                >
                  <span className="relative flex h-8 w-8 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F59E0B] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-7 w-7 bg-[#2563EB] text-[#F59E0B] border-2 border-white items-center justify-center text-xs font-bold shadow-md">
                      +
                    </span>
                  </span>
                </button>
              ))}

              {activeHotspot && (
                <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/90 shadow-lg text-slate-900 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#2563EB]">
                      <Sparkles className="w-3.5 h-3.5 text-[#F59E0B]" />
                      <span>{activeHotspot.title}</span>
                    </div>
                    <button
                      onClick={() => setActiveHotspot(null)}
                      className="text-slate-400 hover:text-slate-600 text-xs font-bold cursor-pointer"
                    >

                    </button>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {activeHotspot.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Quick Metrics & Location */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 block">Monthly Rent</span>
              <span className="text-lg font-display font-black text-slate-900 tabular-nums">
                {formatDiscreetCurrency(property.price, isDiscreetMode)}
              </span>
              <span className="text-[10px] text-slate-500 block">per {property.pricePeriod}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 block">Viewing Fee</span>
              <span className="text-lg font-display font-black text-[#2563EB] tabular-nums">
                100% FREE
              </span>
              <span className="text-[10px] text-blue-600 block font-bold">Pay After Inspection</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 block">Walk to Campus</span>
              <span className="text-lg font-display font-black text-slate-900 tabular-nums flex items-center gap-1">
                <Footprints className="w-4 h-4 text-[#D97706]" />
                {property.walkingMinutes} mins
              </span>
              <span className="text-[10px] text-slate-500 block font-medium">to {property.nearestGate}</span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-[11px] font-bold text-slate-400 block">Neighborhood</span>
              <span className="text-sm font-display font-black text-[#2563EB] block truncate">
                {property.neighborhood}
              </span>
              <span className="text-[10px] text-slate-500 block font-medium">Safe student cluster</span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
              Hostel Overview
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {property.description}
            </p>
          </div>

          {/* Caretaker & Landlord Credential Box (STRICT ENFORCEMENT OF RESTRICTIONS) */}
          <div className="p-5 bg-slate-900 text-white rounded-3xl space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-blue-400 font-bold uppercase tracking-wider block">
                    Hostel Administration Record
                  </span>
                  {!isAdmin && (
                    <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                      Escorted Viewing Protocol
                    </span>
                  )}
                </div>
                <h4 className="font-display font-extrabold text-base text-white mt-0.5">
                  {isAdmin ? property.caretakerName : `${property.caretakerName} (Agency Vaulted)`}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {property.addressDescription}
                </p>
              </div>

              {/* Action Buttons */}
              {isAdmin ? (
                <div className="flex items-center gap-2 shrink-0">
                  {onOpenEditProperty && (
                    <button
                      onClick={() => onOpenEditProperty(property)}
                      className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                      title="Edit House Details & Caretaker Contacts"
                    >
                      <Edit className="w-3.5 h-3.5" />
                      <span>Edit Listing</span>
                    </button>
                  )}

                  <a
                    href={buildWhatsAppUrl(`Hello Kelly, I need help with ${property.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              ) : (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActiveActionTab('free_viewing')}
                    className="px-4 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                  >
                    <Ticket className="w-3.5 h-3.5 text-amber-300" />
                    <span>Schedule Free Viewing (KES 0)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Restricted Credentials Details Bar */}
            <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  Caretaker Direct Contact:
                </span>
                <span className="font-mono font-bold text-blue-300">
                  {maskCaretakerPhone(property.caretakerPhone, isAdmin)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between">
                <span className="text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  Caretaker National ID:
                </span>
                <span className="font-mono font-bold text-blue-300">
                  {maskNationalId(property.caretakerNationalId, isAdmin)}
                </span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between sm:col-span-2">
                <span className="text-slate-400 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  Landlord Payout Escrow Destination:
                </span>
                <span className="font-mono font-bold text-blue-300">
                  {maskPayoutAccount(property.landlordPayoutMpesa, isAdmin)}
                </span>
              </div>
            </div>

            {!isAdmin && (
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                <span>Free viewing accompanied by an accredited guide at {property.nearestGate}.</span>
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminPanel();
                  }}
                  className="text-blue-400 hover:underline font-bold cursor-pointer"
                >
                  Admin Verification Portal
                </button>
              </div>
            )}
          </div>

          {/* Student Actions: Schedule FREE Viewing vs Pay After Viewing */}
          <div className="pt-2 border-t border-slate-200">
            <div className="flex border-b border-slate-200 mb-4">
              <button
                onClick={() => setActiveActionTab('free_viewing')}
                className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeActionTab === 'free_viewing'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <Ticket className="w-4 h-4 text-[#2563EB]" />
                <span>1. Schedule 100% Free Viewing (KES 0 Upfront)</span>
              </button>

              <button
                onClick={() => setActiveActionTab('reserve')}
                className={`pb-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeActionTab === 'reserve'
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-[#D97706]" />
                <span>2. Pay After Viewing (Reserve Room KES 1,000)</span>
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-[#2563EB] text-white flex items-center justify-center mx-auto shadow-sm">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="font-display font-extrabold text-slate-900 text-base">Free Viewing Pass Confirmed!</h4>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">{bookingSuccess}</p>
                <button
                  onClick={onClose}
                  className="mt-3 py-2 px-6 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Close & View in My Viewings
                </button>
              </div>
            ) : activeActionTab === 'free_viewing' ? (
              /* TAB 1: 100% FREE VIEWING PASS FORM */
              <form onSubmit={handleScheduleFreeViewing} className="space-y-4">
                <div className="p-3.5 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/80 rounded-2xl text-xs text-blue-950 flex items-start gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-[#2563EB] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block text-xs">
                      Free Comrade Inspection Policy  Zero Shillings Charged Now
                    </span>
                    <span className="text-slate-600 text-[11px] leading-relaxed block mt-0.5">
                      An accredited KU Room Finders guide will meet you at {property.nearestGate} to escort you into {property.title}. Inspect water, Wi-Fi, electricity meter, and security completely free. <strong>You only pay after viewing</strong> if you decide to take the room!
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Student Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                      <span>KU Registration Number</span>
                      <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-0.5">
                        <Lock className="w-2.5 h-2.5" /> Vaulted
                      </span>
                    </label>
                    <input
                      type="text"
                      required
                      value={studentRegNo}
                      onChange={(e) => setStudentRegNo(e.target.value)}
                      placeholder="e.g. E37/4210/2023"
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Contact Phone
                    </label>
                    <input
                      type="tel"
                      required
                      value={studentPhone}
                      onChange={(e) => setStudentPhone(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Preferred Day
                    </label>
                    <select
                      value={viewingDate}
                      onChange={(e) => setViewingDate(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="Today">Today (Immediate)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="This Friday">This Friday</option>
                      <option value="This Saturday">This Saturday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Time Slot
                    </label>
                    <select
                      value={viewingTime}
                      onChange={(e) => setViewingTime(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#2563EB]"
                    >
                      <option value="10:00 AM - 11:30 AM">Morning (10:00 AM)</option>
                      <option value="2:00 PM - 3:00 PM">Afternoon (2:00 PM)</option>
                      <option value="4:30 PM - 6:00 PM">Evening (4:30 PM)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-display font-extrabold text-xs sm:text-sm rounded-2xl shadow-lg shadow-blue-950/20 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#F59E0B]" />
                    <span>{isSubmitting ? 'Generating Free Escort Pass...' : 'Issue 100% FREE Viewing Pass'}</span>
                  </div>
                  <span className="font-mono text-blue-200 text-xs">KES 0.00 (Free)</span>
                </button>
              </form>
            ) : (
              /* TAB 2: PAY AFTER VIEWING (SETTLE ESCROW) */
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200 text-xs text-blue-900 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[#2563EB]">
                    <Sparkles className="w-4 h-4 text-[#F59E0B]" />
                    <span>Have You Inspected and Approved This Room?</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">
                    If you have completed your physical viewing and want to lock this unit, deposit <strong>KES 1,000</strong> into agency escrow. The caretaker freezes this room for you for 48 hours, and this KES 1,000 is <strong>100% deductible from your move-in deposit</strong>!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenPostViewingCheckout}
                  className="w-full py-4 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-display font-bold text-sm rounded-2xl shadow-lg shadow-blue-950/20 flex items-center justify-between transition-all active:scale-98 cursor-pointer"
                >
                  <span>Proceed to Post-Viewing M-Pesa Checkout</span>
                  <span className="font-extrabold tabular-nums">KES 1,000.00</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
