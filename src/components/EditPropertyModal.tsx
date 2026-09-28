import React, { useState, useEffect } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  DollarSign, 
  Phone, 
  Check, 
  Sparkles, 
  Lock, 
  Unlock, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  Key,
  Save,
  CheckCircle2
} from 'lucide-react';
import { Property, Neighborhood, RoomType, CampusGate } from '../types';
import { maskCaretakerPhone, maskNationalId, maskPayoutAccount, PUBLIC_CONTACT } from '../utils/security';

interface EditPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
  onUpdateProperty: (property: Property) => void;
  isAdmin: boolean;
  onOpenAdminPanel: () => void;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  isOpen,
  onClose,
  property,
  onUpdateProperty,
  isAdmin,
  onOpenAdminPanel,
}) => {
  if (!isOpen || !property) return null;

  const [title, setTitle] = useState(property.title);
  const [buildingName, setBuildingName] = useState(property.buildingName);
  const [neighborhood, setNeighborhood] = useState<Neighborhood>(property.neighborhood);
  const [nearestGate, setNearestGate] = useState<CampusGate>(property.nearestGate);
  const [walkingMinutes, setWalkingMinutes] = useState(property.walkingMinutes.toString());
  const [roomType, setRoomType] = useState<RoomType>(property.roomType);
  const [price, setPrice] = useState(property.price.toString());
  const [deposit, setDeposit] = useState(property.deposit.toString());
  const [vacantCount, setVacantCount] = useState(property.vacantRoomsCount.toString());
  const [totalRooms, setTotalRooms] = useState(property.totalRooms.toString());
  const [addressDesc, setAddressDesc] = useState(property.addressDescription);
  const [description, setDescription] = useState(property.description);
  const [imageUrl, setImageUrl] = useState(property.images[0] || '');

  // Caretaker credentials (only modifiable by Admin)
  const [caretakerName, setCaretakerName] = useState(property.caretakerName);
  const [caretakerPhone, setCaretakerPhone] = useState(property.caretakerPhone);
  const [caretakerWhatsApp, setCaretakerWhatsApp] = useState(property.caretakerWhatsApp);
  const [caretakerNationalId, setCaretakerNationalId] = useState(property.caretakerNationalId || '');
  const [landlordPayoutMpesa, setLandlordPayoutMpesa] = useState(property.landlordPayoutMpesa || '');

  // Admin controls
  const [approvalStatus, setApprovalStatus] = useState(property.approvalStatus);
  const [isVerified, setIsVerified] = useState(property.isVerified);

  // Amenities
  const [wifi, setWifi] = useState(property.amenities.some((a) => a.toLowerCase().includes('wi-fi')));
  const [water, setWater] = useState(property.amenities.some((a) => a.toLowerCase().includes('water')));
  const [hotShower, setHotShower] = useState(property.amenities.some((a) => a.toLowerCase().includes('shower')));
  const [token, setToken] = useState(property.amenities.some((a) => a.toLowerCase().includes('token') || a.toLowerCase().includes('meter')));
  const [cctv, setCctv] = useState(property.amenities.some((a) => a.toLowerCase().includes('cctv') || a.toLowerCase().includes('guard')));
  const [balcony, setBalcony] = useState(property.amenities.some((a) => a.toLowerCase().includes('balcony')));

  // Reset values when opened for a different property
  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setBuildingName(property.buildingName);
      setNeighborhood(property.neighborhood);
      setNearestGate(property.nearestGate);
      setWalkingMinutes(property.walkingMinutes.toString());
      setRoomType(property.roomType);
      setPrice(property.price.toString());
      setDeposit(property.deposit.toString());
      setVacantCount(property.vacantRoomsCount.toString());
      setTotalRooms(property.totalRooms.toString());
      setAddressDesc(property.addressDescription);
      setDescription(property.description);
      setImageUrl(property.images[0] || '');
      setCaretakerName(property.caretakerName);
      setCaretakerPhone(property.caretakerPhone);
      setCaretakerWhatsApp(property.caretakerWhatsApp);
      setCaretakerNationalId(property.caretakerNationalId || '');
      setLandlordPayoutMpesa(property.landlordPayoutMpesa || '');
      setApprovalStatus(property.approvalStatus);
      setIsVerified(property.isVerified);
      setWifi(property.amenities.some((a) => a.toLowerCase().includes('wi-fi')));
      setWater(property.amenities.some((a) => a.toLowerCase().includes('water')));
      setHotShower(property.amenities.some((a) => a.toLowerCase().includes('shower')));
      setToken(property.amenities.some((a) => a.toLowerCase().includes('token') || a.toLowerCase().includes('meter')));
      setCctv(property.amenities.some((a) => a.toLowerCase().includes('cctv') || a.toLowerCase().includes('guard')));
      setBalcony(property.amenities.some((a) => a.toLowerCase().includes('balcony')));
    }
  }, [property]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const amenitiesList: string[] = [];
    if (wifi) amenitiesList.push('High-Speed Wi-Fi');
    if (water) amenitiesList.push('24/7 Borehole Water');
    if (hotShower) amenitiesList.push('Instant Hot Shower');
    if (token) amenitiesList.push('Prepaid KPLC Token Meter');
    if (cctv) amenitiesList.push('CCTV & Security Guard');
    if (balcony) amenitiesList.push('Private Balcony');

    const updatedImages = [...property.images];
    if (imageUrl.trim()) {
      updatedImages[0] = imageUrl.trim();
    }

    const updatedProperty: Property = {
      ...property,
      title: title.trim(),
      buildingName: buildingName.trim() || title.trim(),
      neighborhood,
      nearestGate,
      walkingMinutes: Number(walkingMinutes) || property.walkingMinutes,
      roomType,
      price: Number(price) || property.price,
      deposit: Number(deposit) || property.deposit,
      vacantRoomsCount: Number(vacantCount) || 0,
      totalRooms: Number(totalRooms) || property.totalRooms,
      addressDescription: addressDesc.trim() || property.addressDescription,
      description: description.trim() || property.description,
      images: updatedImages,
      amenities: amenitiesList.length > 0 ? amenitiesList : property.amenities,
      caretakerName: 'KU Room Finders Support',
      caretakerPhone: '',
      caretakerWhatsApp: PUBLIC_CONTACT.whatsapp,
      caretakerNationalId: undefined,
      landlordPayoutMpesa: undefined,
      // Admin statuses
      approvalStatus: isAdmin ? approvalStatus : property.approvalStatus,
      isVerified: isAdmin ? isVerified : property.isVerified,
    };

    onUpdateProperty(updatedProperty);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#047857] flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-base sm:text-lg text-slate-900">
                  Edit House / Listing Details
                </h3>
                {isAdmin ? (
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Unlock className="w-3 h-3 text-emerald-700" />
                    Admin Mode: Full Caretaker Access
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                    <Lock className="w-3 h-3 text-amber-700" />
                    Caretaker Details Protected
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Updating: <span className="font-semibold text-slate-800">{property.title}</span> ({property.neighborhood})
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Main Title & Building */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Property Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Sunrise Executive Bedsitters"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Building Name</label>
              <input
                type="text"
                value={buildingName}
                onChange={(e) => setBuildingName(e.target.value)}
                placeholder="e.g. Sunrise Heights"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
              />
            </div>
          </div>

          {/* Neighborhood & Gate */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Neighborhood</label>
              <select
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value as Neighborhood)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              >
                <option value="KM Gate">KM Gate</option>
                <option value="Nyayo Gate">Nyayo Gate</option>
                <option value="Main Gate">Main Gate</option>
                <option value="Eastern Bypass Gate">Eastern Bypass Gate</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Walking Minutes to Gate</label>
              <input
                type="number"
                min="1"
                max="60"
                value={walkingMinutes}
                onChange={(e) => setWalkingMinutes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>
          </div>

          {/* Room Type, Rent, Deposit, Vacancies */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value as RoomType)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
              >
                <option value="bedsit">Bedsitter</option>
                <option value="single">Single Room</option>
                <option value="one_bedroom">1-Bedroom</option>
                <option value="hostel_shared">Shared Hostel</option>
                <option value="executive_studio">Executive Studio</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Monthly Rent (KES)</label>
              <input
                type="number"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Deposit (KES)</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Vacant Units</label>
              <input
                type="number"
                min="0"
                max="50"
                value={vacantCount}
                onChange={(e) => setVacantCount(e.target.value)}
                className="w-full px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono font-bold text-emerald-700"
              />
            </div>
          </div>

          {/* SENSITIVE CARETAKER CREDENTIALS SECTION */}
          <div className={`p-4 rounded-2xl border transition-all ${
            isAdmin ? 'bg-emerald-50/70 border-emerald-300' : 'bg-amber-50/70 border-amber-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 font-bold text-xs">
                {isAdmin ? (
                  <>
                    <Unlock className="w-4 h-4 text-emerald-700" />
                    <span className="text-emerald-950">Caretaker & Landlord Credentials (Admin Unmasked)</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-amber-700" />
                    <span className="text-amber-950">Caretaker Credentials Protected (Admin Only)</span>
                  </>
                )}
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                isAdmin ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-900'
              }`}>
                {isAdmin ? 'Admin Editable' : 'Vault Locked'}
              </span>
            </div>

            {!isAdmin ? (
              /* Non-Admin Locked View */
              <div className="space-y-3">
                <div className="p-3 bg-white/80 rounded-xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block">Confidential Caretaker Data Protection</strong>
                    <span>
                      In accordance with the agency business model, caretaker phone numbers, WhatsApp, and payout keys are strictly shielded from public view. Only authenticated administrators may inspect or modify these credentials.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Caretaker Name</span>
                    <span className="font-semibold text-slate-800">{property.caretakerName}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Phone Number (Locked)</span>
                    <span className="font-mono font-bold text-slate-600">
                      {maskCaretakerPhone(property.caretakerPhone, false)}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">National ID (Locked)</span>
                    <span className="font-mono font-bold text-slate-600">
                      {maskNationalId(property.caretakerNationalId, false)}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                    <span className="text-slate-400 block text-[10px]">Landlord Payout Account</span>
                    <span className="font-mono font-bold text-slate-600">
                      {maskPayoutAccount(property.landlordPayoutMpesa, false)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminPanel();
                  }}
                  className="text-[11px] font-bold text-[#047857] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Log into Admin Security Vault to edit sensitive caretaker details →</span>
                </button>
              </div>
            ) : (
              /* Admin Unmasked Editable View */
              <div className="space-y-3">
                <p className="text-[11px] text-emerald-800">
                  You are authenticated as Super Administrator. You have full clearance to edit caretaker contacts and payout destinations.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Caretaker Full Name</label>
                    <input
                      type="text"
                      value={caretakerName}
                      onChange={(e) => setCaretakerName(e.target.value)}
                      placeholder="e.g. Mr. James Maina"
                      className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl text-slate-800 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Caretaker Phone Number</label>
                    <input
                      type="tel"
                      value={caretakerPhone}
                      onChange={(e) => setCaretakerPhone(e.target.value)}
                      placeholder="+254 722 000 000"
                      className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl font-mono text-emerald-800 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Caretaker National ID</label>
                    <input
                      type="text"
                      value={caretakerNationalId}
                      onChange={(e) => setCaretakerNationalId(e.target.value)}
                      placeholder="e.g. 28941072"
                      className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl font-mono text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-0.5">Payout M-Pesa Phone</label>
                    <input
                      type="tel"
                      value={landlordPayoutMpesa}
                      onChange={(e) => setLandlordPayoutMpesa(e.target.value)}
                      placeholder="0722123456"
                      className="w-full px-3 py-1.5 bg-white border border-emerald-300 rounded-xl font-mono text-slate-800"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Admin Verification & Status Controls (Only visible to Admin) */}
          {isAdmin && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
              <span className="font-bold text-slate-900 block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Admin Governance & Visibility</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Approval Status</label>
                  <select
                    value={approvalStatus}
                    onChange={(e) => setApprovalStatus(e.target.value as 'approved' | 'pending_review' | 'rejected')}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold"
                  >
                    <option value="approved">Approved (Live for Students)</option>
                    <option value="pending_review">Pending Admin Review (Hidden)</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="edit-is-verified"
                    checked={isVerified}
                    onChange={(e) => setIsVerified(e.target.checked)}
                    className="w-4 h-4 rounded text-[#047857] focus:ring-[#047857]"
                  />
                  <label htmlFor="edit-is-verified" className="font-bold text-slate-800 cursor-pointer">
                    Verified Badge (Escrow Protected)
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Landmark & Directions */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Landmark / Directions</label>
            <input
              type="text"
              value={addressDesc}
              onChange={(e) => setAddressDesc(e.target.value)}
              placeholder="e.g. KM 2nd lane behind equity agent, blue gate"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl"
            />
          </div>

          {/* Photo URL */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Main Photo URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-800"
            />
          </div>

          {/* Amenities checkboxes */}
          <div>
            <label className="block font-bold text-slate-700 mb-1.5">Amenities Included</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { label: 'High-Speed Wi-Fi', state: wifi, set: setWifi },
                { label: '24/7 Borehole Water', state: water, set: setWater },
                { label: 'Instant Hot Shower', state: hotShower, set: setHotShower },
                { label: 'Prepaid Token Meter', state: token, set: setToken },
                { label: 'CCTV & Security', state: cctv, set: setCctv },
                { label: 'Private Balcony', state: balcony, set: setBalcony },
              ].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => item.set(!item.state)}
                  className={`p-2 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                    item.state ? 'border-[#047857] bg-emerald-50 text-[#047857]' : 'border-slate-200 bg-white text-slate-600'
                  }`}
                >
                  <span className="font-semibold text-[11px]">{item.label}</span>
                  {item.state && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">Description & House Rules</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell KU students about the room..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2.5 px-6 rounded-xl bg-[#047857] hover:bg-[#065F46] text-white font-display font-bold flex items-center gap-1.5 shadow-md transition-all active:scale-98 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Listing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
