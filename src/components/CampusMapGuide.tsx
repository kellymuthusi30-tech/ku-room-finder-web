import React, { useState } from 'react';
import {
  MapPin,
  Footprints,
  Bike,
  Bus,
  ShieldCheck,
  Info,
  Compass,
  Check,
  Clock,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { KU_CAMPUS_GATES } from '../data/mockData';

export const CampusMapGuide: React.FC = () => {
  const [selectedGate, setSelectedGate] = useState<string>('KM Gate');

  const gateInfo = KU_CAMPUS_GATES.find((g) => g.name === selectedGate) || KU_CAMPUS_GATES[0];

  return (
    <div className="py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-2 border border-blue-200/80 shadow-2xs">
          <Compass className="w-3.5 h-3.5" />
          <span>Kenyatta University Main Campus & Housing Transit Map</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
          Campus Gates & Off-Campus Neighborhoods
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed font-medium">
          Choose where to live based on your faculty and daily walking route. See walking times to the Postmodern Library, gate opening hours, and bodaboda fare rates.
        </p>
      </div>

      {/* Interactive Map Visualizer */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-sm space-y-6">
        {/* Visual Campus Vector Schematic */}
        <div className="relative h-84 sm:h-100 bg-[#E8F4EE] rounded-3xl overflow-hidden border border-blue-200/80 shadow-inner">
          <svg
            className="w-full h-full"
            viewBox="0 0 820 460"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern id="campusGridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#CBE4D6" strokeWidth="1.2" />
              </pattern>
              <linearGradient id="roadGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="100%" stopColor="#334155" />
              </linearGradient>
            </defs>

            {/* Grid base */}
            <rect width="100%" height="100%" fill="url(#campusGridPattern)" />

            {/* Thika Superhighway Highway Artery */}
            <path
              d="M -10 330 L 830 330"
              stroke="url(#roadGradient)"
              strokeWidth="32"
              strokeLinecap="round"
            />
            <path
              d="M -10 330 L 830 330"
              stroke="#FDE047"
              strokeWidth="2"
              strokeDasharray="14 10"
            />
            <text x="410" y="335" fill="#FFFFFF" fontSize="11" fontWeight="800" letterSpacing="2" textAnchor="middle">
              THIKA SUPERHIGHWAY (A2 NAIROBI - THIKA)
            </text>

            {/* KM Pedestrian Footbridge */}
            <g transform="translate(260, 310)">
              <rect x="-24" y="-8" width="48" height="38" rx="4" fill="#2563EB" opacity="0.9" />
              <text x="0" y="14" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle">
                FOOTBRIDGE
              </text>
            </g>

            {/* Kenyatta University Main Campus Area (Green boundary) */}
            <rect
              x="110"
              y="30"
              width="600"
              height="260"
              rx="28"
              fill="#D4EADF"
              stroke="#2563EB"
              strokeWidth="3.5"
            />

            {/* University Crest / Title */}
            <text x="410" y="60" fill="#1D4ED8" fontSize="15" fontWeight="900" letterSpacing="1" textAnchor="middle">
              KENYATTA UNIVERSITY MAIN CAMPUS (6,000+ ACRES)
            </text>

            {/* Internal Campus Walkways */}
            <path
              d="M 260 270 L 260 180 L 410 180 L 410 110"
              fill="none"
              stroke="#A7D7C1"
              strokeWidth="8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M 140 180 L 260 180"
              fill="none"
              stroke="#A7D7C1"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M 580 270 L 580 180 L 410 180"
              fill="none"
              stroke="#A7D7C1"
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Internal Landmark 1: Postmodern Library */}
            <g transform="translate(410, 140)">
              <rect x="-85" y="-28" width="170" height="56" rx="12" fill="#FFFFFF" stroke="#2563EB" strokeWidth="2" filter="drop-shadow(0px 4px 6px rgba(0,0,0,0.06))" />
              <circle cx="-60" cy="0" r="14" fill="#E8F4EE" />
              <text x="-60" y="4" textAnchor="middle" fontSize="11"></text>
              <text x="14" y="-4" fill="#1D4ED8" fontSize="11" fontWeight="800" textAnchor="middle">
                KU Postmodern Library
              </text>
              <text x="14" y="12" fill="#64748B" fontSize="9" fontWeight="600" textAnchor="middle">
                Central Academic Hub
              </text>
            </g>

            {/* Internal Landmark 2: Nyayo Hostels Complex */}
            <g transform="translate(230, 110)">
              <rect x="-55" y="-20" width="110" height="40" rx="10" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" />
              <text x="0" y="-1" fill="#1D4ED8" fontSize="10" fontWeight="bold" textAnchor="middle">
                Nyayo Hostels
              </text>
              <text x="0" y="12" fill="#94A3B8" fontSize="8" textAnchor="middle">
                On-Campus Halls 1-6
              </text>
            </g>

            {/* Internal Landmark 3: Administration Block & Clock Tower */}
            <g transform="translate(590, 120)">
              <rect x="-65" y="-20" width="130" height="40" rx="10" fill="#FFFFFF" stroke="#2563EB" strokeWidth="1.5" />
              <text x="0" y="-1" fill="#1D4ED8" fontSize="10" fontWeight="bold" textAnchor="middle">
                KU Admin Complex
              </text>
              <text x="0" y="12" fill="#94A3B8" fontSize="8" textAnchor="middle">
                Finance & Admissions
              </text>
            </g>

            {/* GATE 1: KM Gate (Busiest) */}
            <g
              transform="translate(260, 275)"
              className="cursor-pointer group"
              onClick={() => setSelectedGate('KM Gate')}
            >
              {selectedGate === 'KM Gate' && (
                <circle r="28" fill="#F59E0B" opacity="0.3" className="animate-ping" />
              )}
              <circle r="22" fill={selectedGate === 'KM Gate' ? '#2563EB' : '#FFFFFF'} stroke="#2563EB" strokeWidth="3" />
              <text x="0" y="5" fill={selectedGate === 'KM Gate' ? '#FFFFFF' : '#2563EB'} fontSize="11" fontWeight="900" textAnchor="middle">
                KM
              </text>
              <rect x="-50" y="28" width="100" height="20" rx="6" fill="#0F172A" />
              <text x="0" y="42" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                KM Gate (Busiest)
              </text>
            </g>

            {/* GATE 2: Nyayo Gate */}
            <g
              transform="translate(130, 180)"
              className="cursor-pointer group"
              onClick={() => setSelectedGate('Nyayo Gate')}
            >
              {selectedGate === 'Nyayo Gate' && (
                <circle r="24" fill="#F59E0B" opacity="0.3" className="animate-ping" />
              )}
              <circle r="18" fill={selectedGate === 'Nyayo Gate' ? '#2563EB' : '#FFFFFF'} stroke="#2563EB" strokeWidth="3" />
              <text x="0" y="4" fill={selectedGate === 'Nyayo Gate' ? '#FFFFFF' : '#2563EB'} fontSize="10" fontWeight="bold" textAnchor="middle">
                NY
              </text>
              <rect x="-40" y="-32" width="80" height="18" rx="5" fill="#0F172A" />
              <text x="0" y="-20" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Nyayo Gate
              </text>
            </g>

            {/* GATE 3: Main Gate */}
            <g
              transform="translate(580, 275)"
              className="cursor-pointer group"
              onClick={() => setSelectedGate('Main Gate')}
            >
              {selectedGate === 'Main Gate' && (
                <circle r="24" fill="#F59E0B" opacity="0.3" className="animate-ping" />
              )}
              <circle r="18" fill={selectedGate === 'Main Gate' ? '#2563EB' : '#FFFFFF'} stroke="#2563EB" strokeWidth="3" />
              <text x="0" y="4" fill={selectedGate === 'Main Gate' ? '#FFFFFF' : '#2563EB'} fontSize="10" fontWeight="bold" textAnchor="middle">
                MG
              </text>
              <rect x="-40" y="26" width="80" height="18" rx="5" fill="#0F172A" />
              <text x="0" y="38" fill="#FFFFFF" fontSize="9" fontWeight="bold" textAnchor="middle">
                Main Gate
              </text>
            </g>

            {/* OFF-CAMPUS NEIGHBORHOOD CLUSTERS */}
            {/* KM & Sukari Hub */}
            <g transform="translate(260, 400)">
              <rect x="-95" y="-20" width="190" height="42" rx="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
              <text x="0" y="-2" fill="#78350F" fontSize="11" fontWeight="bold" textAnchor="middle">
                KM / Kahawa Sukari Hub
              </text>
              <text x="0" y="12" fill="#B45309" fontSize="9" fontWeight="semibold" textAnchor="middle">
                 3-5 min walk across KM Footbridge
              </text>
            </g>

            {/* Wendani Hub */}
            <g transform="translate(90, 400)">
              <rect x="-75" y="-20" width="150" height="42" rx="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
              <text x="0" y="-2" fill="#78350F" fontSize="11" fontWeight="bold" textAnchor="middle">
                Kahawa Wendani
              </text>
              <text x="0" y="12" fill="#B45309" fontSize="9" fontWeight="semibold" textAnchor="middle">
                 QuickMart (8-10 min)
              </text>
            </g>

            {/* Ruiru Hub */}
            <g transform="translate(710, 400)">
              <rect x="-70" y="-20" width="140" height="42" rx="12" fill="#FEF3C7" stroke="#D97706" strokeWidth="2" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.08))" />
              <text x="0" y="-2" fill="#78350F" fontSize="11" fontWeight="bold" textAnchor="middle">
                Ruiru / Toll
              </text>
              <text x="0" y="12" fill="#B45309" fontSize="9" fontWeight="semibold" textAnchor="middle">
                 5 min Boda (KES 50)
              </text>
            </g>
          </svg>
        </div>

        {/* Selected Gate Focus Interactive Card */}
        <div className="p-5 bg-slate-50 rounded-3xl border border-slate-200/90 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-extrabold text-[#2563EB] uppercase tracking-wider block">
                Selected Campus Gate
              </span>
              <h3 className="font-display font-extrabold text-lg text-slate-900 mt-0.5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#2563EB]" />
                {gateInfo.name}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 bg-white border border-slate-200 px-3 py-1 rounded-xl">
                 {gateInfo.walkingTimeFromLibrary} walk to Library
              </span>
              <span className="text-xs font-bold text-blue-800 bg-blue-100 px-3 py-1 rounded-xl">
                Open 5:30 AM - 11:00 PM
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            {gateInfo.desc}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-700 pt-2 border-t border-slate-200/60">
            <span>Serves student residences in:</span>
            {gateInfo.walkingZones.map((z, i) => (
              <span key={i} className="bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-xs font-bold text-[#2563EB] shadow-2xs">
                {z}
              </span>
            ))}
          </div>
        </div>

        {/* Student Commute & Rent Cheat Sheet */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* KM Zone */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200/90 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-display font-extrabold text-sm text-slate-900">KM (Directly at Gate)</span>
              <span className="text-[10px] font-bold text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full">
                3 min walk
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Prime location for medical, law & engineering students who value proximity. Printing shops, salons, and eateries right downstairs.
            </p>
            <div className="text-xs text-slate-700 font-semibold space-y-1">
              <div className="flex justify-between">
                <span>Bedsitters:</span>
                <span className="font-bold">KES 6,500 - 8,500</span>
              </div>
              <div className="flex justify-between text-blue-700">
                <span>Daily Transit Cost:</span>
                <span className="font-bold">KES 0 (Walk)</span>
              </div>
            </div>
          </div>

          {/* Wendani Zone */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200/90 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-display font-extrabold text-sm text-slate-900">Kahawa Wendani</span>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full">
                8-10 min walk
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Most social student area. Home to QuickMart, butcheries, gyms, and late-night study bistros. Easy access to Nairobi CBD matatus.
            </p>
            <div className="text-xs text-slate-700 font-semibold space-y-1">
              <div className="flex justify-between">
                <span>1-Bedrooms:</span>
                <span className="font-bold">KES 11,000 - 14,000</span>
              </div>
              <div className="flex justify-between text-amber-700">
                <span>Bodaboda to Gate:</span>
                <span className="font-bold">KES 50</span>
              </div>
            </div>
          </div>

          {/* Ruiru / Sukari */}
          <div className="p-5 bg-white rounded-3xl border border-slate-200/90 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="font-display font-extrabold text-sm text-slate-900">Sukari & Ruiru</span>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-full">
                Quiet & Spacious
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tree-lined, quiet, gated residential avenues. Excellent for sharing large 1-bedroom or 2-bedroom flats to cut individual rent in half.
            </p>
            <div className="text-xs text-slate-700 font-semibold space-y-1">
              <div className="flex justify-between">
                <span>Executive Studios:</span>
                <span className="font-bold">KES 9,000 - 11,000</span>
              </div>
              <div className="flex justify-between text-blue-700">
                <span>Matatu to Campus:</span>
                <span className="font-bold">KES 20 - 30</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
