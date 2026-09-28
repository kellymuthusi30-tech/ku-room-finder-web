import React from 'react';
import {
  Search,
  MapPin,
  Home,
  SlidersHorizontal,
  ShieldCheck,
  Footprints,
  CheckCircle2,
  Sparkles,
  Bed,
  DoorClosed,
  Sofa,
  Users,
  Ticket,
  Lock,
  Eye,
  EyeOff,
  ThumbsUp,
  Briefcase,
  Coins
} from 'lucide-react';
import { Neighborhood, RoomType } from '../types';
import { ROOM_IMAGES } from '../data/mockData';
import { formatDiscreetCurrency } from '../utils/security';

interface HeroSearchProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedNeighborhood: Neighborhood | 'all';
  setSelectedNeighborhood: (n: Neighborhood | 'all') => void;
  selectedRoomType: RoomType | 'all';
  setSelectedRoomType: (r: RoomType | 'all') => void;
  maxBudget: number | null;
  setMaxBudget: (b: number | null) => void;
  walkUnder10Min: boolean;
  setWalkUnder10Min: (w: boolean) => void;
  onOpenDiscreetPayment: () => void;
  isDiscreetMode: boolean;
  onOpenListProperty?: () => void;
}

const NEIGHBORHOODS: { id: Neighborhood | 'all'; label: string; badge?: string }[] = [
  { id: 'all', label: 'All KU Zones' },
  { id: 'KM Gate', label: 'KM Gate', badge: '3-5 min walk' },
  { id: 'Kahawa Wendani', label: 'Kahawa Wendani', badge: 'Near QuickMart' },
  { id: 'Kahawa Sukari', label: 'Kahawa Sukari', badge: 'Quiet & Serene' },
  { id: 'Ruiru', label: 'Ruiru / Toll', badge: 'Modern Flats' },
];

export const HeroSearch: React.FC<HeroSearchProps> = ({
  searchQuery,
  setSearchQuery,
  selectedNeighborhood,
  setSelectedNeighborhood,
  selectedRoomType,
  setSelectedRoomType,
  maxBudget,
  setMaxBudget,
  walkUnder10Min,
  setWalkUnder10Min,
  onOpenDiscreetPayment,
  isDiscreetMode,
  onOpenListProperty,
}) => {
  return (
    <div className="pt-4 sm:pt-6 pb-8">
      {/* High-Impact Visual Hero Container */}
      <div className="relative rounded-3xl sm:rounded-4xl overflow-hidden shadow-xl border border-slate-200/80 mb-8">
        {/* Background Image with Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={ROOM_IMAGES.heroBanner}
            alt="Kenyatta University Student Accommodations"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000"
          />
          {/* Measured gradient scrim for 4.5:1 text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/85 to-slate-950/40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 p-6 sm:p-10 lg:p-14 max-w-4xl text-white">
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 backdrop-blur-md text-blue-300 text-xs font-bold mb-4 border border-blue-400/30 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-[#F59E0B]" />
            <span>100% Free Room Viewings  Pay Only After You Inspect & Approve the Room</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-display font-black text-white tracking-tight leading-tight text-balance">
            Free student house viewing near <span className="text-[#F59E0B]">KU Main Campus</span>
          </h1>

          <p className="text-xs sm:text-base text-slate-200 mt-3 max-w-2xl leading-relaxed font-medium">
            Zero upfront broker fees! Schedule an escorted physical room inspection for free at KM Gate, Nyayo Gate, or Wendani. Test water, power tokens, and security first  <strong>payment happens only after viewing</strong> if you decide to take the unit.
          </p>

          {/* Business Action Strip: Free Viewing Pass & House Listing Job */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenDiscreetPayment}
              className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#2563EB] via-[#1D4ED8] to-[#2563EB] hover:brightness-110 text-white font-display font-black text-xs sm:text-sm flex items-center gap-2.5 shadow-lg shadow-blue-950/40 transition-all active:scale-95 cursor-pointer"
            >
              <Ticket className="w-4 h-4 text-[#F59E0B]" />
              <span>Get 100% Free Viewing Pass</span>
              <span className="text-[10px] bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full font-black uppercase">
                KES 0 Free
              </span>
            </button>

            {onOpenListProperty && (
              <button
                onClick={onOpenListProperty}
                className="py-3 px-5 rounded-2xl bg-amber-500/90 hover:bg-amber-500 text-slate-950 font-display font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-amber-950/30 transition-all active:scale-95 cursor-pointer"
              >
                <Briefcase className="w-4 h-4 text-slate-950" />
                <span>House Listing Job (Earn KES 500-1,500)</span>
              </button>
            )}

            <div className="p-2 sm:px-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center gap-2 text-xs text-slate-200">
              <ThumbsUp className="w-3.5 h-3.5 text-[#F59E0B]" />
              <span>Pay Escrow Only After Viewing</span>
            </div>
          </div>

          {/* Quick Category Icons Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <button
              onClick={() => setSelectedRoomType(selectedRoomType === 'bedsit' ? 'all' : 'bedsit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                selectedRoomType === 'bedsit'
                  ? 'bg-[#2563EB] text-white ring-2 ring-blue-400'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              <Bed className="w-3.5 h-3.5 text-amber-400" />
              <span>Bedsitters / Studios</span>
            </button>

            <button
              onClick={() => setSelectedRoomType(selectedRoomType === 'one_bedroom' ? 'all' : 'one_bedroom')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                selectedRoomType === 'one_bedroom'
                  ? 'bg-[#2563EB] text-white ring-2 ring-blue-400'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              <Sofa className="w-3.5 h-3.5 text-blue-400" />
              <span>1-Bedroom Flats</span>
            </button>

            <button
              onClick={() => setSelectedRoomType(selectedRoomType === 'single' ? 'all' : 'single')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                selectedRoomType === 'single'
                  ? 'bg-[#2563EB] text-white ring-2 ring-blue-400'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              <DoorClosed className="w-3.5 h-3.5 text-blue-400" />
              <span>Single Budget Rooms</span>
            </button>

            <button
              onClick={() => setSelectedRoomType(selectedRoomType === 'hostel_shared' ? 'all' : 'hostel_shared')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 backdrop-blur-md cursor-pointer ${
                selectedRoomType === 'hostel_shared'
                  ? 'bg-[#2563EB] text-white ring-2 ring-blue-400'
                  : 'bg-white/15 text-white hover:bg-white/25 border border-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span>Shared Hostels</span>
            </button>
          </div>
        </div>
      </div>

      {/* Elevated Glassmorphic Search & Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200/90 shadow-md shadow-slate-200/50 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Main Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by building name, KM Gate, Wendani, Wi-Fi, Water..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm rounded-2xl border border-slate-200 focus:border-[#2563EB] focus:outline-none transition-all placeholder:text-slate-400 font-medium shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
              >

              </button>
            )}
          </div>

          {/* Room Type Dropdown */}
          <div className="md:col-span-4">
            <select
              value={selectedRoomType}
              onChange={(e) => setSelectedRoomType(e.target.value as RoomType | 'all')}
              className="w-full px-3.5 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm rounded-2xl border border-slate-200 focus:border-[#2563EB] focus:outline-none transition-all text-slate-800 font-semibold shadow-2xs"
            >
              <option value="all">All Room Types</option>
              <option value="bedsit">Bedsitters / Studios</option>
              <option value="single">Single Budget Rooms</option>
              <option value="one_bedroom">1-Bedroom Flats</option>
              <option value="hostel_shared">Twin / Shared Hostels (Per Semester)</option>
              <option value="executive_studio">Executive Studios</option>
            </select>
          </div>

          {/* Max Budget Dropdown */}
          <div className="md:col-span-3">
            <select
              value={maxBudget === null ? 'all' : maxBudget.toString()}
              onChange={(e) => setMaxBudget(e.target.value === 'all' ? null : Number(e.target.value))}
              className="w-full px-3.5 py-3 bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm rounded-2xl border border-slate-200 focus:border-[#2563EB] focus:outline-none transition-all text-slate-800 font-semibold shadow-2xs"
            >
              <option value="all">Any Price / Budget</option>
              <option value="5000">Under KES 5,000 / mo</option>
              <option value="8000">Under KES 8,000 / mo</option>
              <option value="11000">Under KES 11,000 / mo</option>
              <option value="15000">Under KES 15,000 / mo</option>
            </select>
          </div>
        </div>

        {/* Location Pills Row with Distance Toggle */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Location:</span>
            {NEIGHBORHOODS.map((n) => (
              <button
                key={n.id}
                onClick={() => setSelectedNeighborhood(n.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedNeighborhood === n.id
                    ? 'bg-[#2563EB] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <span>{n.label}</span>
                {n.badge && (
                  <span className={`text-[9px] px-1 py-0.2 rounded-md ${
                    selectedNeighborhood === n.id ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-600'
                  }`}>
                    {n.badge}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Proximity Toggle */}
          <button
            onClick={() => setWalkUnder10Min(!walkUnder10Min)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
              walkUnder10Min
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
            }`}
          >
            <Footprints className="w-3.5 h-3.5 text-[#D97706]" />
            <span> 10 Mins Walk to Campus</span>
          </button>
        </div>
      </div>

      {/* Trust Highlights Strip */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 font-semibold px-2">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>100% Free Room Viewing</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>Payment After Viewing Only</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>Accompanied Gate Meetups</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
          <span>Zero Upfront Broker Fees</span>
        </div>
      </div>
    </div>
  );
};
