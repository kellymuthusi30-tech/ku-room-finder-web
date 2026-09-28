import React, { useState } from 'react';
import {
  MapPin,
  Footprints,
  Phone,
  MessageCircle,
  Star,
  ShieldCheck,
  Heart,
  Wifi,
  Droplet,
  Flame,
  ChevronLeft,
  ChevronRight,
  Eye,
  Lock,
  Sparkles,
  Ticket,
  Edit
} from 'lucide-react';
import { Property } from '../types';
import { buildWhatsAppUrl, formatDiscreetCurrency, maskCaretakerPhone } from '../utils/security';

interface PropertyCardProps {
  property: Property;
  onSelectProperty: (p: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  isAdmin: boolean;
  isDiscreetMode: boolean;
  onBookViewingPass: (p: Property) => void;
  onEditProperty?: (p: Property) => void;
}

const formatRoomType = (type: string) => {
  switch (type) {
    case 'bedsit':
      return 'Bedsitter';
    case 'single':
      return 'Single Room';
    case 'one_bedroom':
      return '1-Bedroom Flat';
    case 'hostel_shared':
      return 'Shared Hostel';
    case 'executive_studio':
      return 'Executive Studio';
    default:
      return 'Student Room';
  }
};

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelectProperty,
  isFavorite,
  onToggleFavorite,
  isAdmin,
  isDiscreetMode,
  onBookViewingPass,
  onEditProperty,
}) => {
  const [activeImgIdx, setActiveImgIdx] = useState(0);

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev + 1) % property.images.length);
  };

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImgIdx((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <div
      onClick={() => onSelectProperty(property)}
      className="group bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full hover:-translate-y-1"
    >
      {/* Visual Image Container with Hover Mini-Carousel */}
      <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
        <img
          src={property.images[activeImgIdx]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Image Controls on hover */}
        {property.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
              aria-label="Next photo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Carousel Dot Indicators */}
            <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 z-10">
              {property.images.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === activeImgIdx ? 'w-4 bg-white shadow-xs' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Live Vacancy Pill */}
        <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
          <span>{property.vacantRoomsCount} Vacant</span>
        </div>

        {/* Favorite Bookmark */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-red-500 transition-colors shadow-sm"
          aria-label={isFavorite ? 'Remove from saved' : 'Save room'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Verified Caretaker & Escrow Badge */}
        {property.isVerified && (
          <div className="absolute bottom-3 left-3 bg-[#2563EB]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span>Escrow Protected</span>
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Unboxed Metadata with Typographic Separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <span className="text-[#2563EB]">{property.neighborhood}</span>
            <span aria-hidden="true"></span>
            <span className="flex items-center gap-1 text-slate-600">
              <Footprints className="w-3.5 h-3.5 text-[#D97706]" />
              {property.walkingMinutes} min walk ({property.nearestGate})
            </span>
          </div>

          <h3 className="font-display font-extrabold text-base text-slate-900 mt-1.5 group-hover:text-[#2563EB] transition-colors line-clamp-1">
            {property.title}
          </h3>

          <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-relaxed">
            {property.addressDescription}
          </p>

          {/* Quick Amenities snippets */}
          <div className="mt-3 flex flex-wrap gap-1.5 text-[11px] text-slate-600 font-medium">
            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-lg">
              <Wifi className="w-3 h-3 text-blue-600" />
              Wi-Fi
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-lg">
              <Droplet className="w-3 h-3 text-cyan-600" />
              24/7 Water
            </span>
            <span className="inline-flex items-center gap-1 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-lg">
              <Flame className="w-3 h-3 text-amber-600" />
              Hot Shower
            </span>
          </div>

          {/* Credential Restriction Notice on Card */}
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px]">
            <span className="text-slate-500 flex items-center gap-1 font-medium">
              <Lock className="w-3 h-3 text-amber-600" />
              {isAdmin ? (
                <span className="text-blue-700 font-bold">Caretaker: {property.caretakerName}</span>
              ) : (
                <span>Direct Contact: <strong>Restricted to Admin</strong></span>
              )}
            </span>
            <span className="text-slate-400">
              {isAdmin ? 'Admin View' : 'Agency Escort'}
            </span>
          </div>
        </div>

        {/* Pricing and Action Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <div className="text-lg font-display font-black text-slate-900 tabular-nums">
              {formatDiscreetCurrency(property.price, isDiscreetMode)}
              <span className="text-xs font-normal text-slate-500">
                /{property.pricePeriod === 'semester' ? 'sem' : 'mo'}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
              {formatRoomType(property.roomType)}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* If Admin: show direct WhatsApp, Phone, and Edit button */}
            {isAdmin ? (
              <>
                {onEditProperty && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditProperty(property);
                    }}
                    className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center transition-colors shadow-2xs hover:bg-purple-200 cursor-pointer"
                    title="Edit House Details"
                  >
                    <Edit className="w-3.5 h-3.5 text-purple-700" />
                  </button>
                )}
                <a
                  href={buildWhatsAppUrl(`Hello Kelly, I need help with ${property.title}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center transition-colors shadow-2xs hover:bg-blue-200"
                  title="Admin Direct WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#2563EB]" />
                </a>
              </>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookViewingPass(property);
                }}
                className="py-1.5 px-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-300 text-[#2563EB] text-[11px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                title="Schedule 100% Free Room Viewing (Pay After Viewing)"
              >
                <Ticket className="w-3 h-3 text-[#D97706]" />
                <span>Free View</span>
              </button>
            )}

            <button
              onClick={() => onSelectProperty(property)}
              className="py-1.5 px-3 rounded-xl bg-slate-900 hover:bg-[#2563EB] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
