import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Phone, 
  Check, 
  Sparkles, 
  Lock, 
  ShieldCheck, 
  Coins, 
  Briefcase, 
  UserCheck, 
  Award,
  AlertCircle,
  Edit,
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import { Property, Neighborhood, RoomType, CampusGate } from '../types';
import { ROOM_IMAGES } from '../data/mockData';
import { PUBLIC_CONTACT } from '../utils/security';

interface ListPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProperty: (property: Property) => void;
  onOpenEditProperty?: (property: Property) => void;
  properties?: Property[];
  isAdmin?: boolean;
}

export const ListPropertyModal: React.FC<ListPropertyModalProps> = ({
  isOpen,
  onClose,
  onAddProperty,
  onOpenEditProperty,
  properties = [],
  isAdmin = false,
}) => {
  if (!isOpen) return null;

  // Active view: 'scout_job' | 'landlord' | 'manage_listings'
  const [activeTab, setActiveTab] = useState<'scout_job' | 'landlord' | 'manage_listings'>('scout_job');

  // Form fields
  const [title, setTitle] = useState('');
  const [buildingName, setBuildingName] = useState('');
  const [neighborhood, setNeighborhood] = useState<Neighborhood>('KM Gate');
  const [nearestGate, setNearestGate] = useState<CampusGate>('KM Gate');
  const [walkingMinutes, setWalkingMinutes] = useState('5');
  const [roomType, setRoomType] = useState<RoomType>('bedsit');
  const [price, setPrice] = useState('7500');
  const [deposit, setDeposit] = useState('7500');
  const [vacantCount, setVacantCount] = useState('2');
  const [addressDesc, setAddressDesc] = useState('');
  const [description, setDescription] = useState('');

  // Scout Job Fields
  const [scoutName, setScoutName] = useState('Brian Kiprop');
  const [scoutRegNo, setScoutRegNo] = useState('C01/2940/2023');
  const [scoutPhone, setScoutPhone] = useState('0712345678');

  // Caretaker Credentials (STRICTLY ADMIN ONLY)
  const [caretakerName, setCaretakerName] = useState('');
  const [caretakerPhone, setCaretakerPhone] = useState('+254 7');
  const [caretakerNationalId, setCaretakerNationalId] = useState('');
  const [payoutMpesa, setPayoutMpesa] = useState('');

  // Amenities
  const [wifi, setWifi] = useState(true);
  const [water, setWater] = useState(true);
  const [hotShower, setHotShower] = useState(true);
  const [token, setToken] = useState(true);
  const [cctv, setCctv] = useState(true);
  const [balcony, setBalcony] = useState(false);

  // Success message
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  // Compute scout bounty based on room type
  const calculateBounty = (type: RoomType) => {
    switch (type) {
      case 'one_bedroom':
        return 1500;
      case 'executive_studio':
        return 1200;
      case 'bedsit':
        return 800;
      case 'single':
      case 'hostel_shared':
      default:
        return 500;
    }
  };

  const currentBounty = calculateBounty(roomType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !caretakerName.trim()) return;

    const amenitiesList: string[] = [];
    if (wifi) amenitiesList.push('High-Speed Wi-Fi');
    if (water) amenitiesList.push('24/7 Borehole Water');
    if (hotShower) amenitiesList.push('Instant Hot Shower');
    if (token) amenitiesList.push('Prepaid KPLC Token Meter');
    if (cctv) amenitiesList.push('CCTV & Security Guard');
    if (balcony) amenitiesList.push('Private Balcony');

    const isScout = activeTab === 'scout_job';

    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: title.trim(),
      buildingName: buildingName.trim() || title.trim(),
      neighborhood,
      nearestGate,
      walkingMinutes: Number(walkingMinutes) || 5,
      distanceKm: 0.5,
      roomType,
      price: Number(price) || 7500,
      pricePeriod: 'month',
      deposit: Number(deposit) || 7500,
      images: [
        roomType === 'one_bedroom'
          ? ROOM_IMAGES.oneBedroom
          : roomType === 'hostel_shared'
          ? ROOM_IMAGES.shared
          : ROOM_IMAGES.bedsitter,
        ROOM_IMAGES.exterior,
      ],
      isVerified: false,
      rating: 5.0,
      reviewCount: 0,
      vacantRoomsCount: Number(vacantCount) || 1,
      totalRooms: 20,
      // SENSITIVE CREDENTIALS (Admin Only)
      caretakerName: caretakerName.trim(),
      caretakerPhone: '',
      caretakerWhatsApp: PUBLIC_CONTACT.whatsapp,
      caretakerNationalId: undefined,
      landlordPayoutMpesa: undefined,
      approvalStatus: 'pending_review',
      addressDescription: addressDesc.trim() || `${neighborhood}, near KU Campus`,
      amenities: amenitiesList,
      rules: ['Gate locked at 10:30 PM', 'Quiet study hours enforced'],
      description: description.trim() || 'Modern off-campus student accommodation verified by KU Room Finders.',
      featured: false,
      // Scout Job Details
      listedBy: isScout ? 'scout' : 'landlord',
      scoutName: isScout ? scoutName.trim() : undefined,
      scoutPhone: isScout ? scoutPhone.trim() : undefined,
      scoutRegNo: isScout ? scoutRegNo.trim() : undefined,
      listingBountyKes: isScout ? currentBounty : undefined,
      bountyPayoutStatus: isScout ? 'pending_admin_review' : undefined,
    };

    onAddProperty(newProp);

    if (isScout) {
      setSubmissionSuccess(
        `ðŸŽ‰ House Listing Job Submitted! Your scout entry for "${newProp.title}" is queued for Admin verification. Once our Super Admin calls the caretaker and approves the room, your bounty of KES ${currentBounty.toLocaleString()} will be sent to ${scoutPhone}.`
      );
    } else {
      setSubmissionSuccess(
        `Hostel listing "${newProp.title}" submitted successfully! It has been dispatched to the Admin Security Vault for credential verification before going live.`
      );
    }
  };

  const handleResetForm = () => {
    setTitle('');
    setBuildingName('');
    setCaretakerName('');
    setCaretakerPhone('+254 7');
    setCaretakerNationalId('');
    setPayoutMpesa('');
    setAddressDesc('');
    setDescription('');
    setSubmissionSuccess(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-md">
              <Briefcase className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                  House Listing Job & Property Portal
                </h3>
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold">
                  Earn KES 500 - 1,500
                </span>
              </div>
              <p className="text-xs text-slate-500">
                KU Student Scout Job Â· List Vacant Rooms or Manage Existing Listings
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-4 sm:px-6 pt-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto text-xs font-bold shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('scout_job');
                setSubmissionSuccess(null);
              }}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'scout_job'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Coins className="w-4 h-4 text-amber-600" />
              <span>House Scout Job (Earn Bounty)</span>
              <span className="bg-amber-400 text-slate-950 px-1.5 py-0.2 rounded text-[9px] font-black">
                PAID
              </span>
            </button>

            <button
              onClick={() => {
                setActiveTab('landlord');
                setSubmissionSuccess(null);
              }}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'landlord'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Landlord Direct Listing</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('manage_listings');
                setSubmissionSuccess(null);
              }}
              className={`pb-3 px-3 border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'manage_listings'
                  ? 'border-[#2563EB] text-[#2563EB]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit className="w-4 h-4 text-purple-600" />
              <span>Edit Houses Listed ({properties.length})</span>
            </button>
          </div>
        </div>

        {/* Content Body */}
        {submissionSuccess ? (
          <div className="p-8 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center mx-auto shadow-sm">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            <h4 className="font-display font-extrabold text-slate-900 text-lg">
              Listing Queued Successfully!
            </h4>
            <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
              {submissionSuccess}
            </p>
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 max-w-md text-left flex items-start gap-2">
              <Lock className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                <strong>Confidentiality Guarantee:</strong> Caretaker contact numbers are now vaulted. Only the verified Administrator has clearance to inspect or dial caretaker details.
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleResetForm}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              >
                List Another Vacant House
              </button>
              <button
                onClick={onClose}
                className="py-2.5 px-5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : activeTab === 'manage_listings' ? (
          /* TAB: MANAGE & EDIT LISTED HOUSES */
          <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-extrabold text-sm text-slate-900">
                  Select a House to Edit Details
                </h4>
                <p className="text-xs text-slate-500">
                  Edit prices, vacancies, gate distance, amenities, or descriptions.
                </p>
              </div>
              <span className="text-xs font-bold text-[#2563EB] bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                {properties.length} Listed Properties
              </span>
            </div>

            <div className="space-y-2.5">
              {properties.map((prop) => (
                <div
                  key={prop.id}
                  className="p-3.5 bg-slate-50 hover:bg-slate-100/80 rounded-2xl border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prop.images[0]}
                      alt={prop.title}
                      className="w-14 h-14 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-display font-bold text-sm text-slate-900 line-clamp-1">
                          {prop.title}
                        </h5>
                        <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          prop.approvalStatus === 'approved' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {prop.approvalStatus}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                        <span className="font-semibold text-[#2563EB]">{prop.neighborhood}</span>
                        <span>Â·</span>
                        <span>KES {prop.price.toLocaleString()}/mo</span>
                        <span>Â·</span>
                        <span className="text-blue-700 font-bold">{prop.vacantRoomsCount} Vacant</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5 flex items-center gap-1 font-mono">
                        <Lock className="w-3 h-3 text-amber-600" />
                        {isAdmin ? `Caretaker: ${prop.caretakerName} (${prop.caretakerPhone})` : 'Caretaker Contacts: Admin Vaulted'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (onOpenEditProperty) {
                        onClose();
                        onOpenEditProperty(prop);
                      }
                    }}
                    className="py-2 px-4 rounded-xl bg-slate-900 hover:bg-[#2563EB] text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-end sm:self-center shadow-xs cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Edit House</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* FORM BODY: SCOUT JOB OR LANDLORD DIRECT */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
            {/* Scout Job Explainer & Bounty Calculator */}
            {activeTab === 'scout_job' && (
              <div className="p-4 bg-gradient-to-br from-blue-50 via-cyan-50 to-amber-50 rounded-2xl border border-blue-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-600" />
                    <span className="font-display font-extrabold text-slate-900 text-sm">
                      KU Student House Scout Bounty Gig
                    </span>
                  </div>
                  <span className="text-xs font-black bg-[#2563EB] text-white px-2.5 py-1 rounded-full shadow-2xs">
                    Earn KES {currentBounty.toLocaleString()} Bounty
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Earn extra cash between classes! Spot a vacant bedsitter or room around KM Gate, Kahawa Wendani, or Sukari. Submit the property details & caretaker phone below. Once our Admin verifies the vacancy, you receive your bounty straight to your M-Pesa.
                </p>

                {/* Scout Profile Inputs */}
                <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Your Name (Scout)</label>
                    <input
                      type="text"
                      required
                      value={scoutName}
                      onChange={(e) => setScoutName(e.target.value)}
                      placeholder="e.g. Brian Kiprop"
                      className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">KU Student Reg No.</label>
                    <input
                      type="text"
                      required
                      value={scoutRegNo}
                      onChange={(e) => setScoutRegNo(e.target.value)}
                      placeholder="e.g. C01/2940/2023"
                      className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-xl font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">M-Pesa for Bounty Payout</label>
                    <input
                      type="tel"
                      required
                      value={scoutPhone}
                      onChange={(e) => setScoutPhone(e.target.value)}
                      placeholder="e.g. 0712345678"
                      className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-xl font-mono text-blue-800 font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Property Core Info */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Hostel / Apartment Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunrise Executive Bedsitters - KM"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Neighborhood</label>
                <select
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value as Neighborhood)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="KM Gate">KM Gate</option>
                  <option value="Kahawa Wendani">Kahawa Wendani</option>
                  <option value="Kahawa Sukari">Kahawa Sukari</option>
                  <option value="Ruiru">Ruiru</option>
                  <option value="Bypass">Bypass</option>
                  <option value="Roysambu">Roysambu</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nearest Campus Gate</label>
                <select
                  value={nearestGate}
                  onChange={(e) => setNearestGate(e.target.value as CampusGate)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <option value="KM Gate">KM Gate</option>
                  <option value="Nyayo Gate">Nyayo Gate</option>
                  <option value="Main Gate">Main Gate</option>
                  <option value="Eastern Bypass Gate">Eastern Bypass Gate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Room Type</label>
                <select
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value as RoomType)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                >
                  <option value="bedsit">Bedsitter (KES 800 Bounty)</option>
                  <option value="single">Single Room (KES 500 Bounty)</option>
                  <option value="one_bedroom">1-Bedroom (KES 1,500 Bounty)</option>
                  <option value="hostel_shared">Shared Hostel (KES 500 Bounty)</option>
                  <option value="executive_studio">Executive Studio (KES 1,200 Bounty)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Monthly Rent (KES)</label>
                <input
                  type="number"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vacant Units</label>
                <input
                  type="number"
                  required
                  value={vacantCount}
                  onChange={(e) => setVacantCount(e.target.value)}
                  className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>

            {/* SENSITIVE CARETAKER CREDENTIALS (ADMIN RESTRICTED) */}
            <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-300 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-900 font-bold">
                  <Lock className="w-4 h-4 text-amber-600" />
                  <span>Caretaker Information (Strictly Encrypted Â· Admin Only)</span>
                </div>
                <span className="text-[9px] bg-amber-200 text-amber-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Admin Vault Only
                </span>
              </div>

              <div className="p-2.5 bg-white/90 rounded-xl border border-amber-200 text-[11px] text-amber-900 leading-tight">
                <strong>Data Protection Guarantee:</strong> The caretaker phone and national ID entered below will <strong>NEVER</strong> be visible to students or search engines. Only the Super Administrator can view and call caretakers to arrange escorted student viewings.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Caretaker Full Name <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mr. John Mwangi"
                    value={caretakerName}
                    onChange={(e) => setCaretakerName(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Caretaker Direct Phone <span className="text-red-500">*</span></label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0722000000"
                    value={caretakerPhone}
                    onChange={(e) => setCaretakerPhone(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono text-blue-800 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Caretaker National ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 28941072"
                    value={caretakerNationalId}
                    onChange={(e) => setCaretakerNationalId(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl font-mono text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-0.5">Payout M-Pesa Phone</label>
                  <input
                    type="tel"
                    placeholder="e.g. 0722123456"
                    value={payoutMpesa}
                    onChange={(e) => setPayoutMpesa(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-amber-300 rounded-xl font-mono text-slate-900"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Landmark / Precise Directions</label>
              <input
                type="text"
                placeholder="e.g. KM 2nd lane behind equity agent, yellow gate"
                value={addressDesc}
                onChange={(e) => setAddressDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            {/* Amenities checkboxes */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Amenities Available</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { label: 'Wi-Fi Included', state: wifi, set: setWifi },
                  { label: '24/7 Borehole Water', state: water, set: setWater },
                  { label: 'Instant Hot Shower', state: hotShower, set: setHotShower },
                  { label: 'Own Prepaid Meter', state: token, set: setToken },
                  { label: 'CCTV & Security Guard', state: cctv, set: setCctv },
                  { label: 'Private Balcony', state: balcony, set: setBalcony },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => item.set(!item.state)}
                    className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      item.state ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <span className="font-semibold text-[11px]">{item.label}</span>
                    {item.state && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Description & House Rules</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe room condition, cleanliness, study atmosphere..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-display font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              {activeTab === 'scout_job' ? (
                <>
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Submit House Listing Job & Claim KES {currentBounty.toLocaleString()} Bounty</span>
                </>
              ) : (
                <span>Submit Hostel for Admin Security Verification</span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
