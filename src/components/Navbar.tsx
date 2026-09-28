import React from 'react';
import {
  Home,
  Users,
  Map,
  PlusCircle,
  BookmarkCheck,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  Shield,
  Lock,
  Eye,
  EyeOff,
  Ticket,
  CreditCard,
  Briefcase,
  Edit,
  MessageCircle
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'properties' | 'roommates' | 'campus-map';
  setActiveTab: (tab: 'properties' | 'roommates' | 'campus-map') => void;
  onOpenListProperty: () => void;
  onOpenBookings: () => void;
  bookingsCount: number;
  isAdmin: boolean;
  onOpenAdminPanel: () => void;
  isDiscreetMode: boolean;
  onToggleDiscreetMode: () => void;
  onOpenDiscreetPayment: (mode?: 'free_viewing' | 'pay_after_viewing') => void;
  onOpenContactAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenListProperty,
  onOpenBookings,
  bookingsCount,
  isAdmin,
  onOpenAdminPanel,
  isDiscreetMode,
  onToggleDiscreetMode,
  onOpenDiscreetPayment,
  onOpenContactAdmin,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 transition-all shadow-xs">
      <div className="max-w-7xl mx-auto w-full min-w-0 px-3 sm:px-6 lg:px-8 min-h-18 py-2 sm:py-0 flex items-center justify-between gap-2 sm:gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div
          onClick={() => setActiveTab('properties')}
          className="flex min-w-0 items-center gap-2 sm:gap-3 cursor-pointer select-none group"
        >
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#1D4ED8] via-[#2563EB] to-[#172554] flex items-center justify-center text-white shadow-md shadow-blue-900/15 group-hover:scale-105 transition-transform duration-200">
              <GraduationCap className="w-6 h-6 text-[#F59E0B]" />
            </div>
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#F59E0B] border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-900">

            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-display font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900 group-hover:text-[#2563EB] transition-colors truncate max-w-[150px] sm:max-w-none">
                KU Room Finders
              </span>
              <span className="text-[10px] font-extrabold bg-blue-50 text-[#2563EB] border border-blue-200/80 px-2 py-0.5 rounded-full uppercase tracking-wider hidden lg:inline-flex items-center gap-1 shadow-2xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse"></span>
                100% Free Room Viewings
              </span>
            </div>
            <span className="text-[11px] text-slate-500 font-medium hidden sm:block -mt-0.5">
              Verified Student Housing  Pay Only After Viewing
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'properties'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Home className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Hostels & Rooms</span>
          </button>

          <button
            onClick={() => setActiveTab('roommates')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'roommates'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#D97706]" />
            <span>Roommate Board</span>
          </button>

          <button
            onClick={() => setActiveTab('campus-map')}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'campus-map'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-blue-600" />
            <span>Campus Gate Map</span>
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex min-w-0 shrink-0 items-center gap-1 sm:gap-2">
          <button
            onClick={onOpenContactAdmin}
            className="px-2.5 sm:px-3 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 cursor-pointer"
            title="Contact Kelly Muthusi on WhatsApp"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-white" />
            <span className="hidden sm:inline">Contact Admin</span>
          </button>

          {/* Discreet Mode Toggle Button */}
          <button
            onClick={onToggleDiscreetMode}
            className={`hidden sm:flex px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold items-center gap-1.5 transition-all shadow-2xs border cursor-pointer ${
              isDiscreetMode
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-amber-200/50'
                : 'bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700'
            }`}
            title={isDiscreetMode ? 'Discreet Mode Active: Amounts Masked' : 'Turn On Discreet Mode (Mask Prices)'}
          >
            {isDiscreetMode ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                <span className="hidden xl:inline">Discreet: ON</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span className="hidden xl:inline">Discreet Mode</span>
              </>
            )}
          </button>

          {/* Quick 100% Free Viewing Pass Button */}
          <button
            onClick={() => onOpenDiscreetPayment('free_viewing')}
            className="px-2.5 sm:px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-[#2563EB] text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-2xs shrink-0 cursor-pointer"
            title="Book 100% Free Room Viewing (Pay After Viewing)"
          >
            <Ticket className="w-3.5 h-3.5 text-[#D97706]" />
            <span className="hidden sm:inline">Free Viewing</span>
            <span className="text-[10px] bg-[#2563EB] text-white px-1.5 py-0.5 rounded-md font-black uppercase">
              KES 0
            </span>
          </button>

          {/* House Listing Job / List House Button */}
          <button
            onClick={onOpenListProperty}
            className="hidden sm:flex px-2.5 sm:px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 text-xs font-extrabold items-center gap-1.5 transition-all shadow-2xs shrink-0 cursor-pointer"
            title="House Listing Job: Scout Vacant Rooms & Earn KES 500-1,500 Bounty / List or Edit Houses"
          >
            <Briefcase className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Listing Job</span>
            <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md font-black uppercase">
              Bounty
            </span>
          </button>

          {/* Admin Vault Action Button */}
          <button
            onClick={onOpenAdminPanel}
            className={`hidden sm:flex px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer ${
              isAdmin
                ? 'bg-blue-900 text-blue-200 border border-blue-700'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
            title="Administrator Credentials & Escrow Vault"
          >
            {isAdmin ? (
              <>
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span className="hidden lg:inline">Admin Vault</span>
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span className="hidden lg:inline">Admin Vault</span>
              </>
            )}
          </button>

          {/* My Bookings / Viewings button */}
          <button
            onClick={onOpenBookings}
            className="relative px-2.5 sm:px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs shrink-0 cursor-pointer"
            title="My Scheduled Viewings & Passes"
          >
            <BookmarkCheck className="w-4 h-4 text-[#2563EB]" />
            <span className="hidden sm:inline">My Passes</span>
            {bookingsCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white text-[10px] font-extrabold flex items-center justify-center tabular-nums animate-pulse">
                {bookingsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile nav bar row */}
      <div className="md:hidden flex border-t border-slate-200 px-4 py-2.5 bg-slate-50/90 justify-around text-xs">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'properties' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-600'
          }`}
        >
          <Home className="w-3.5 h-3.5" />
          <span>Rooms</span>
        </button>
        <button
          onClick={() => setActiveTab('roommates')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'roommates' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-600'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Roommates</span>
        </button>
        <button
          onClick={() => setActiveTab('campus-map')}
          className={`flex items-center gap-1.5 py-1 px-3 rounded-lg font-bold transition-colors cursor-pointer ${
            activeTab === 'campus-map' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-slate-600'
          }`}
        >
          <Map className="w-3.5 h-3.5" />
          <span>Gate Map</span>
        </button>
      </div>
    </header>
  );
};
