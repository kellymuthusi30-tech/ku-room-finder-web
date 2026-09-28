import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Lock, 
  CreditCard, 
  Check, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  Phone, 
  User, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle,
  Smartphone,
  Ticket,
  ThumbsUp,
  KeyRound
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { HouseHuntingTier, CampusGate, Neighborhood, HouseHuntingPayment, Property } from '../types';
import { ADMIN_CONFIG, formatDiscreetCurrency, generateClearanceHash } from '../utils/security';

interface DiscreetPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (payment: HouseHuntingPayment) => void;
  selectedProperty?: Property | null;
  isDiscreetMode: boolean;
  onToggleDiscreetMode: () => void;
  initialMode?: 'free_viewing' | 'pay_after_viewing';
}

const POST_VIEWING_TIERS: {
  id: HouseHuntingTier;
  name: string;
  badge: string;
  amount: number;
  description: string;
  features: string[];
}[] = [
  {
    id: 'holding_deposit',
    name: 'Post-Viewing Room Reservation Escrow',
    badge: '100% Rent-Deductible Freeze',
    amount: 1000,
    description: 'You have viewed and approved the unit. Freeze this specific vacant room for 48 hours directly with the caretaker under official agency escrow.',
    features: [
      'Locks the inspected vacant room in your name immediately',
      '100% credited toward your first month move-in deposit',
      'Official Caretaker Reservation Release Token issued',
      'Agency Escrow Guarantee: unit cannot be given to walk-ins',
      'Priority key handover on your scheduled move-in date',
    ],
  },
  {
    id: 'post_viewing_placement',
    name: 'Post-Viewing Tenancy & Placement Clearance',
    badge: 'Zero-Hassle Move-In',
    amount: 500,
    description: 'Formal tenancy scrutiny after inspection. We verify landlord title/caretaker authority, electricity token sub-meter reading, and tenancy agreement.',
    features: [
      'Official tenancy agreement drafting and review',
      'Water meter & token prepaid meter reading audit',
      'Borehole & clean water supply certification',
      'Caretaker key handover protocol supervision',
      'Comrade dispute resolution support during your lease',
    ],
  },
  {
    id: 'full_placement',
    name: 'Complete Executive Relocation Package',
    badge: 'Premium Student Relocation',
    amount: 2500,
    description: 'Complete student relocation package including lease verification, meter reading, and luggage porter assistance from KM or Wendani stage.',
    features: [
      'Covers room reservation + complete tenancy clearance',
      'Luggage porter assistance from KM or Wendani bus stop',
      'Room deep-clean inspection before key handover',
      'Dedicated housing manager on-call throughout semester',
    ],
  },
];

const BILLING_DESCRIPTORS = [
  { id: 'KU-RE HOUSING ESCROW', label: 'KU-RE HOUSING ESCROW (Standard Agency)' },
  { id: 'CAMPUS SERVICES / CLEARANCE', label: 'CAMPUS SERVICES / CLEARANCE (High Privacy)' },
  { id: 'CONFIDENTIAL CLIENT ESCROW', label: 'CONFIDENTIAL CLIENT ESCROW (Discreet)' },
  { id: 'SECURE VIEWING PASS #KU', label: 'SECURE VIEWING PASS #KU (Student General)' },
];

export const DiscreetPaymentModal: React.FC<DiscreetPaymentModalProps> = ({
  isOpen,
  onClose,
  onPaymentSuccess,
  selectedProperty,
  isDiscreetMode,
  onToggleDiscreetMode,
  initialMode = 'free_viewing',
}) => {
  if (!isOpen) return null;

  // Active modal mode: 'free_viewing' (KES 0 Upfront) vs 'pay_after_viewing' (Post-Inspection Settlement)
  const [activeModalTab, setActiveModalTab] = useState<'free_viewing' | 'pay_after_viewing'>(initialMode);

  // Selected post-viewing tier
  const [selectedTier, setSelectedTier] = useState<HouseHuntingTier>('holding_deposit');
  const [billingDescriptor, setBillingDescriptor] = useState<string>(BILLING_DESCRIPTORS[0].id);

  // Student inputs
  const [studentName, setStudentName] = useState('Charles Munyoki');
  const [studentRegNo, setStudentRegNo] = useState('E37/4820/2023');
  const [studentPhone, setStudentPhone] = useState('0712345678');
  const [pickupGate, setPickupGate] = useState<CampusGate>(
    selectedProperty ? selectedProperty.nearestGate : 'KM Gate'
  );
  const [preferredDate, setPreferredDate] = useState('Tomorrow');
  const [preferredTime, setPreferredTime] = useState('10:00 AM - 12:00 PM');

  // Interactive Payment Flow State (for Pay-After-Viewing)
  const [paymentStep, setPaymentStep] = useState<'form' | 'stk_pending' | 'success'>('form');
  const [stkCountdown, setStkCountdown] = useState(15);
  const [generatedPayment, setGeneratedPayment] = useState<HouseHuntingPayment | null>(null);

  const currentTierObj = POST_VIEWING_TIERS.find((t) => t.id === selectedTier) || POST_VIEWING_TIERS[0];

  // 1. FREE VIEWING PASS HANDLER (KES 0.00 UPFRONT)
  const handleScheduleFreeViewing = (e: React.FormEvent) => {
    e.preventDefault();
    const randomPassCode = `PASS-KU-${Math.floor(1000 + Math.random() * 9000)}`;
    const agents = ['Agent Otieno (KM Gate Escort #02)', 'Agent Mercy (Wendani Guide #07)', 'Agent Kipchumba (Sukari Specialist #04)'];
    const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

    const freePass: HouseHuntingPayment = {
      id: `FREE-${Date.now().toString().slice(-6)}`,
      studentName,
      studentRegNo,
      studentPhone,
      targetNeighborhood: selectedProperty ? selectedProperty.neighborhood : 'KM Gate',
      propertyId: selectedProperty?.id,
      propertyTitle: selectedProperty?.title || 'Accompanied Off-Campus Hostel Inspection',
      tier: 'free_viewing',
      amount: 0, // 100% FREE UPFRONT
      billingDescriptor: 'ZERO CHARGE (FREE VIEWING PASS)',
      mpesaCode: 'FREE-ESCORT-PASS',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      scheduledDate: preferredDate,
      scheduledTime: preferredTime,
      pickupGate,
      escortAgentAssigned: assignedAgent,
      clearancePassCode: randomPassCode,
      status: 'active',
      notes: '100% Free Physical Viewing Pass. Zero upfront cost. Student pays only after viewing if satisfied.',
      isFreeViewing: true,
      paymentTiming: 'free_viewing_upfront',
    };

    try {
      confetti({
        particleCount: 110,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#047857', '#F59E0B', '#10B981'],
      });
    } catch {}

    setGeneratedPayment(freePass);
    setPaymentStep('success');
    onPaymentSuccess(freePass);
  };

  // 2. POST-VIEWING PAYMENT HANDLER (M-Pesa STK PUSH)
  const handleInitiateSTK = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentStep('stk_pending');
    setStkCountdown(15);

    const interval = setInterval(() => {
      setStkCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSimulatePinEntered = () => {
    const randomMpesa = `QJ${Math.floor(10 + Math.random() * 89)}K${Math.floor(100 + Math.random() * 899)}KU`;
    const randomPassCode = `PASS-KU-${Math.floor(1000 + Math.random() * 9000)}`;
    const agents = ['Agent Otieno (Field Escort #02)', 'Agent Mercy (KM Specialist #07)', 'Agent Kipchumba (Wendani Guide #04)'];
    const assignedAgent = agents[Math.floor(Math.random() * agents.length)];

    const payment: HouseHuntingPayment = {
      id: `PAY-${Date.now().toString().slice(-6)}`,
      studentName,
      studentRegNo,
      studentPhone,
      targetNeighborhood: selectedProperty ? selectedProperty.neighborhood : 'KM Gate',
      propertyId: selectedProperty?.id,
      propertyTitle: selectedProperty?.title || 'Post-Viewing Room Reservation',
      tier: selectedTier,
      amount: currentTierObj.amount,
      billingDescriptor,
      mpesaCode: randomMpesa,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      scheduledDate: preferredDate,
      scheduledTime: preferredTime,
      pickupGate,
      escortAgentAssigned: assignedAgent,
      clearancePassCode: randomPassCode,
      status: 'active',
      notes: `Post-viewing escrow settlement of KES ${currentTierObj.amount} under ${billingDescriptor}`,
      isFreeViewing: false,
      paymentTiming: 'paid_after_viewing',
    };

    try {
      confetti({
        particleCount: 130,
        spread: 85,
        origin: { y: 0.6 },
        colors: ['#047857', '#F59E0B', '#10B981', '#059669'],
      });
    } catch {}

    setGeneratedPayment(payment);
    setPaymentStep('success');
    onPaymentSuccess(payment);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#047857] flex items-center justify-center text-white shadow-md shadow-emerald-950/40">
              <ShieldCheck className="w-5 h-5 text-[#F59E0B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg text-white">
                  KU Room Finders · Viewing & Escrow Portal
                </h3>
                <span className="text-[10px] font-bold bg-[#047857] text-white px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Pay After Viewing
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Physical Inspection is 100% Free · Settle Escrow Only After You Approve the Room
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Discreet Mode quick toggle */}
            <button
              onClick={onToggleDiscreetMode}
              className={`p-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                isDiscreetMode
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-white/10 hover:bg-white/20 text-slate-300'
              }`}
              title={isDiscreetMode ? 'Discreet Mode Active' : 'Toggle Discreet Mode'}
            >
              {isDiscreetMode ? <EyeOff className="w-4 h-4 text-amber-400" /> : <Eye className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Tabs: 100% FREE VIEWING vs PAY AFTER VIEWING */}
        {paymentStep === 'form' && (
          <div className="bg-slate-100/90 p-2 border-b border-slate-200 grid grid-cols-2 gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setActiveModalTab('free_viewing')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeModalTab === 'free_viewing'
                  ? 'bg-[#047857] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60 hover:bg-white'
              }`}
            >
              <Ticket className="w-4 h-4 text-[#F59E0B]" />
              <span className="truncate">1. Schedule 100% Free Viewing</span>
              <span className="text-[10px] bg-amber-400/20 text-amber-200 border border-amber-400/30 px-1.5 py-0.2 rounded-md font-black shrink-0">
                KES 0
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModalTab('pay_after_viewing')}
              className={`py-2.5 px-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                activeModalTab === 'pay_after_viewing'
                  ? 'bg-[#047857] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 bg-white/60 hover:bg-white'
              }`}
            >
              <CreditCard className="w-4 h-4 text-[#F59E0B]" />
              <span className="truncate">2. Pay After Viewing (Reserve Unit)</span>
              <span className="text-[10px] bg-emerald-900/30 text-emerald-100 border border-emerald-500/30 px-1.5 py-0.2 rounded-md font-black shrink-0">
                Escrow
              </span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {paymentStep === 'form' && (
            <>
              {/* Context Banner if paying for a specific property */}
              {selectedProperty && (
                <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200/90 flex items-start gap-3 text-xs text-emerald-950">
                  <Sparkles className="w-4 h-4 text-[#047857] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      Target Residence: {selectedProperty.title}
                    </span>
                    <span className="text-slate-600">
                      Location: {selectedProperty.neighborhood} ({selectedProperty.walkingMinutes} min walk to {selectedProperty.nearestGate}) · {selectedProperty.vacantRoomsCount} vacant rooms.
                    </span>
                  </div>
                </div>
              )}

              {/* TAB 1: 100% FREE VIEWING PASS (KES 0 UPFRONT) */}
              {activeModalTab === 'free_viewing' ? (
                <form onSubmit={handleScheduleFreeViewing} className="space-y-6">
                  {/* Free Viewing Explainer Banner */}
                  <div className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-2 font-display font-extrabold text-sm text-[#047857]">
                      <CheckCircle2 className="w-4 h-4 text-[#047857]" />
                      <span>Comrade Free Inspection Guarantee (KES 0 Upfront)</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      Physical viewing is <strong>100% FREE</strong>. An accredited KU Room Finders field guide will meet you at your designated campus gate to escort you to the property. You inspect water, token sub-meters, security, and cleanliness before paying anything.
                    </p>
                    <div className="pt-1.5 flex items-center gap-2 text-[11px] font-bold text-amber-900">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#D97706]" />
                      <span>Payment Only After Viewing: If you like the room, you can freeze it with official escrow. If you don't like it, you pay KES 0!</span>
                    </div>
                  </div>

                  {/* Escort Logistics */}
                  <div className="space-y-3">
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                      Student Details & Campus Gate Meeting Point
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Student Full Name
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            required
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#047857]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center justify-between">
                          <span>KU Registration Number</span>
                          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                            <Lock className="w-2.5 h-2.5" /> Admin-Restricted
                          </span>
                        </label>
                        <input
                          type="text"
                          required
                          value={studentRegNo}
                          onChange={(e) => setStudentRegNo(e.target.value)}
                          placeholder="e.g. E37/4820/2023"
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#047857]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Phone / WhatsApp
                        </label>
                        <div className="relative">
                          <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            value={studentPhone}
                            onChange={(e) => setStudentPhone(e.target.value)}
                            placeholder="0712345678"
                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-none focus:border-[#047857]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Guide Meeting Gate
                        </label>
                        <select
                          value={pickupGate}
                          onChange={(e) => setPickupGate(e.target.value as CampusGate)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#047857]"
                        >
                          <option value="KM Gate">KM Gate (Main Pedestrian)</option>
                          <option value="Nyayo Gate">Nyayo Hostels Gate</option>
                          <option value="Main Gate">Main Highway Gate</option>
                          <option value="Eastern Bypass Gate">Eastern Bypass Gate</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Inspection Slot
                        </label>
                        <select
                          value={preferredTime}
                          onChange={(e) => setPreferredTime(e.target.value)}
                          className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#047857]"
                        >
                          <option value="Morning (10:00 AM)">Morning (10:00 AM)</option>
                          <option value="Midday (1:00 PM)">Midday (1:00 PM)</option>
                          <option value="Afternoon (3:30 PM)">Afternoon (3:30 PM)</option>
                          <option value="Evening (5:00 PM)">Evening (5:00 PM)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Free Viewing Instant Pass CTA */}
                  <button
                    type="submit"
                    className="w-full py-4 px-5 bg-gradient-to-r from-[#047857] via-[#065F46] to-[#047857] hover:brightness-105 text-white font-display font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center justify-between transition-all active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <Ticket className="w-5 h-5 text-[#F59E0B]" />
                      <span>Issue 100% Free Viewing Pass (Instant)</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black tabular-nums">KES 0.00</span>
                      <span className="text-[10px] text-emerald-200 block font-normal">
                        Pay Only After Viewing
                      </span>
                    </div>
                  </button>
                </form>
              ) : (
                /* TAB 2: PAY AFTER VIEWING (POST-INSPECTION SETTLEMENT) */
                <form onSubmit={handleInitiateSTK} className="space-y-6">
                  {/* Post-Viewing Explainer */}
                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/90 text-xs text-amber-950 flex items-start gap-2.5">
                    <KeyRound className="w-4 h-4 text-[#D97706] shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        Already Viewed and Inspected the Unit?
                      </span>
                      <span className="text-slate-600 text-[11px] leading-relaxed block mt-0.5">
                        If you have physically inspected this room and decided to take it, settle your holding escrow below. The caretaker freezes the room in your name, and 100% of this fee is credited toward your rent/deposit.
                      </span>
                    </div>
                  </div>

                  {/* Post-Viewing Service Tier Selector */}
                  <div>
                    <label className="block text-xs font-extrabold text-slate-900 uppercase tracking-wider mb-2.5">
                      1. Select Post-Viewing Settlement Package
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {POST_VIEWING_TIERS.map((tier) => {
                        const isSelected = selectedTier === tier.id;
                        return (
                          <div
                            key={tier.id}
                            onClick={() => setSelectedTier(tier.id)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                              isSelected
                                ? 'border-[#047857] bg-emerald-50/40 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#047857]">
                                  {tier.badge}
                                </span>
                                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                                  isSelected ? 'border-[#047857] bg-[#047857] text-white' : 'border-slate-300'
                                }`}>
                                  {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                </div>
                              </div>
                              <h4 className="font-display font-extrabold text-sm text-slate-900 leading-snug">
                                {tier.name}
                              </h4>
                              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                                {tier.description}
                              </p>
                            </div>

                            <div className="mt-3 pt-2 border-t border-slate-100">
                              <div className="text-base font-display font-black text-slate-900 tabular-nums">
                                {formatDiscreetCurrency(tier.amount, isDiscreetMode)}
                              </div>
                              <span className="text-[10px] text-slate-400 font-semibold block">
                                {tier.id === 'holding_deposit' ? '100% rent deductible' : 'Placement clearance'}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Discreet Billing Descriptor Selector */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                        <Lock className="w-3.5 h-3.5 text-[#047857]" />
                        <span>Discreet Statement Billing Descriptor</span>
                      </div>
                      <span className="text-[10px] bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-semibold">
                        Protects Privacy on M-Pesa SMS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {BILLING_DESCRIPTORS.map((desc) => (
                        <button
                          type="button"
                          key={desc.id}
                          onClick={() => setBillingDescriptor(desc.id)}
                          className={`p-2.5 rounded-xl text-left text-xs font-semibold transition-all border ${
                            billingDescriptor === desc.id
                              ? 'border-[#047857] bg-white text-[#047857] shadow-xs'
                              : 'border-slate-200 bg-white/70 text-slate-600 hover:bg-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className={`w-3 h-3 rounded-full border flex items-center justify-center shrink-0 ${
                              billingDescriptor === desc.id ? 'border-[#047857] bg-[#047857]' : 'border-slate-300'
                            }`} />
                            <span className="truncate">{desc.label}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Student & Phone for STK */}
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
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-[#047857]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        M-Pesa Number (for STK Prompt)
                      </label>
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="0712345678"
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-medium text-slate-800 focus:outline-none focus:border-[#047857]"
                      />
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button
                    type="submit"
                    className="w-full py-4 px-5 bg-gradient-to-r from-[#047857] via-[#065F46] to-[#047857] hover:brightness-105 text-white font-display font-extrabold text-sm rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center justify-between transition-all active:scale-98 cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-[#F59E0B]" />
                      <span>Send Post-Viewing M-Pesa STK Prompt</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black tabular-nums">
                        {formatDiscreetCurrency(currentTierObj.amount, isDiscreetMode)}
                      </span>
                      <span className="text-[10px] text-emerald-200 block font-normal">
                        Till {ADMIN_CONFIG.escrowPaybill} · Agency Escrow
                      </span>
                    </div>
                  </button>
                </form>
              )}
            </>
          )}

          {/* Step 2: Interactive Simulated M-Pesa STK Push (Only for Pay-After-Viewing) */}
          {paymentStep === 'stk_pending' && (
            <div className="py-8 px-4 text-center max-w-md mx-auto space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="relative w-20 h-20 mx-auto">
                <div className="w-20 h-20 rounded-full border-4 border-emerald-100 border-t-[#047857] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center font-display font-extrabold text-slate-900 text-lg tabular-nums">
                  {stkCountdown}s
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  Post-Viewing M-Pesa STK Push Sent
                </span>
                <h4 className="text-xl font-display font-black text-slate-900 mt-2">
                  Check Your Phone
                </h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  A payment prompt for <strong>KES {currentTierObj.amount}</strong> to <strong>{billingDescriptor}</strong> has been sent to <strong className="font-mono text-slate-800">{studentPhone}</strong>.
                </p>
              </div>

              {/* Safaricom STK Simulation Card */}
              <div className="p-4 bg-slate-900 text-white rounded-2xl shadow-xl text-left space-y-3 border border-slate-800">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
                  <span className="font-bold text-[#00c389]">SAFARICOM M-PESA</span>
                  <span>SIM 1</span>
                </div>

                <div className="text-xs space-y-1">
                  <p className="font-mono text-slate-200 text-xs">
                    Do you want to pay KES {currentTierObj.amount}.00 to {billingDescriptor} (Till {ADMIN_CONFIG.escrowPaybill})?
                  </p>
                  <p className="text-slate-400 text-[11px]">Enter M-Pesa PIN:</p>
                  <div className="py-2 px-3 bg-slate-800 rounded-lg font-mono text-center tracking-widest text-emerald-400 font-black">
                    ••••
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSimulatePinEntered}
                  className="w-full py-2.5 px-4 bg-[#00c389] hover:bg-[#00ad7a] text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>Authorize & Simulate PIN Entered</span>
                </button>
              </div>

              <p className="text-[11px] text-slate-400">
                Did not receive prompt? <button onClick={() => setPaymentStep('form')} className="text-[#047857] font-bold underline">Change phone number</button>
              </p>
            </div>
          )}

          {/* Step 3: Clearance Voucher Generated (Both for Free Viewing and Paid Escrow) */}
          {paymentStep === 'success' && generatedPayment && (
            <div className="py-4 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-[#047857] flex items-center justify-center mx-auto shadow-md">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#047857] bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                  {generatedPayment.amount === 0 ? '100% Free Viewing Pass Confirmed' : 'Post-Viewing Room Reservation Confirmed'}
                </span>
                <h4 className="text-2xl font-display font-black text-slate-900 mt-2">
                  {generatedPayment.amount === 0 ? 'Free Escort Viewing Pass Issued' : 'Room Holding Escrow Cleared'}
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
                  {generatedPayment.amount === 0
                    ? 'Your physical viewing pass is completely free. Your accredited KU field guide will meet you at the gate for inspection.'
                    : 'Your post-viewing reservation has been vaulted in agency escrow. The caretaker has frozen the room in your name.'}
                </p>
              </div>

              {/* Clearance Voucher Card */}
              <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/90 text-left space-y-4 max-w-lg mx-auto shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-wider block">
                      Clearance Pass ID
                    </span>
                    <span className="font-mono font-black text-lg text-slate-900">
                      {generatedPayment.clearancePassCode}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      {generatedPayment.amount === 0 ? 'Cost Upfront' : 'Escrow Ref'}
                    </span>
                    <span className="font-mono font-bold text-xs text-emerald-700">
                      {generatedPayment.amount === 0 ? '100% FREE (KES 0)' : generatedPayment.mpesaCode}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned Field Guide:</span>
                    <span className="font-bold text-slate-800">{generatedPayment.escortAgentAssigned}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Meeting Gate:</span>
                    <span className="font-bold text-slate-800">{generatedPayment.pickupGate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Scheduled Slot:</span>
                    <span className="font-bold text-slate-800">{generatedPayment.scheduledDate} ({generatedPayment.scheduledTime})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Payment Timing:</span>
                    <span className="font-bold text-[#047857]">
                      {generatedPayment.amount === 0 ? 'Pay After Viewing if Satisfied' : 'Settled Post-Inspection'}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-100/50 rounded-xl border border-emerald-200 text-[11px] text-emerald-950 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#047857] shrink-0" />
                  <span>
                    {generatedPayment.amount === 0
                      ? `Show this pass on your phone to ${generatedPayment.escortAgentAssigned} at ${generatedPayment.pickupGate}. Inspection is 100% free!`
                      : `Your room is locked. Present this voucher to the caretaker during move-in for key handover.`}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="py-3 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Done & View My Clearance Passes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
