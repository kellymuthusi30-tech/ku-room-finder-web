import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  MapPin, 
  Footprints, 
  Search, 
  Heart, 
  ShieldCheck, 
  GraduationCap,
  Sparkles,
  Phone,
  ShieldAlert,
  Lock,
  Unlock,
  Ticket,
  Eye,
  EyeOff,
  ThumbsUp
} from 'lucide-react';
import { 
  Property, 
  RoommatePost, 
  Booking, 
  Neighborhood, 
  RoomType,
  AdminSecurityLog,
  HouseHuntingPayment
} from './types';
import { 
  PROPERTIES as INITIAL_PROPERTIES, 
  ROOMMATE_POSTS as INITIAL_ROOMMATES,
  INITIAL_SECURITY_LOGS
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { HeroSearch } from './components/HeroSearch';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { RoommateBoard } from './components/RoommateBoard';
import { CampusMapGuide } from './components/CampusMapGuide';
import { ListPropertyModal } from './components/ListPropertyModal';
import { EditPropertyModal } from './components/EditPropertyModal';
import { BookingsModal } from './components/BookingsModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { DiscreetPaymentModal } from './components/DiscreetPaymentModal';
import { DiscreetViewingPassModal } from './components/DiscreetViewingPassModal';
import { ContactAdminModal } from './components/ContactAdminModal';
import { PUBLIC_CONTACT } from './utils/security';

const INITIAL_HOUSE_HUNTING_PAYMENTS: HouseHuntingPayment[] = [];

const INITIAL_BOOKINGS: Booking[] = [];

export default function App() {
  // Navigation tabs: 'properties' | 'roommates' | 'campus-map'
  const [activeTab, setActiveTab] = useState<'properties' | 'roommates' | 'campus-map'>('properties');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | 'all'>('all');
  const [selectedRoomType, setSelectedRoomType] = useState<RoomType | 'all'>('all');
  const [maxBudget, setMaxBudget] = useState<number | null>(null);
  const [walkUnder10Min, setWalkUnder10Min] = useState(false);
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [favorites, setFavorites] = useState<string[]>(['prop-1', 'prop-2']);

  // Discreet Mode & Privacy State
  const [isDiscreetMode, setIsDiscreetMode] = useState<boolean>(false);

  // Admin Security State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState<boolean>(false);
  const [securityLogs, setSecurityLogs] = useState<AdminSecurityLog[]>(INITIAL_SECURITY_LOGS);

  // Data state
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [roommatePosts, setRoommatePosts] = useState<RoommatePost[]>(INITIAL_ROOMMATES);
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [houseHuntingPayments, setHouseHuntingPayments] = useState<HouseHuntingPayment[]>(INITIAL_HOUSE_HUNTING_PAYMENTS);

  // Modals
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [isListPropertyOpen, setIsListPropertyOpen] = useState(false);
  const [isBookingsOpen, setIsBookingsOpen] = useState(false);
  const [isContactAdminOpen, setIsContactAdminOpen] = useState(false);
  const [isDiscreetPaymentOpen, setIsDiscreetPaymentOpen] = useState(false);
  const [discreetModalInitialMode, setDiscreetModalInitialMode] = useState<'free_viewing' | 'pay_after_viewing'>('free_viewing');
  const [discreetPaymentTargetProp, setDiscreetPaymentTargetProp] = useState<Property | null>(null);
  const [selectedPassSlip, setSelectedPassSlip] = useState<HouseHuntingPayment | null>(null);

  // Handlers
  const handleToggleDiscreetMode = () => {
    setIsDiscreetMode((prev) => !prev);
  };

  const handleToggleFavorite = (propId: string) => {
    setFavorites((prev) =>
      prev.includes(propId) ? prev.filter((id) => id !== propId) : [...prev, propId]
    );
  };

  const handleAddBooking = (newBooking: Booking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Record Security log
    const newLog: AdminSecurityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'STUDENT_USER',
      action: newBooking.depositAmount === 0 ? 'FREE_VIEWING_SCHEDULED' : 'ESCROW_RESERVATION_VAULTED',
      entityType: 'booking',
      details: `Booking ${newBooking.id} created (${newBooking.depositAmount === 0 ? '100% Free Inspection Pass' : 'Post-viewing escrow'}). Direct contacts restricted to Admin.`,
      securityLevel: 'medium',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handlePaymentSuccess = (payment: HouseHuntingPayment) => {
    setHouseHuntingPayments((prev) => [payment, ...prev]);

    // Also add as a booking for the student view
    const newBooking: Booking = {
      id: payment.id,
      propertyId: payment.propertyId || 'general-pass',
      propertyTitle: payment.propertyTitle || `House Hunting Tour (${payment.targetNeighborhood})`,
      neighborhood: payment.targetNeighborhood,
      roomType: 'all',
      studentName: payment.studentName,
      studentRegNo: payment.studentRegNo,
      studentPhone: payment.studentPhone,
      depositAmount: payment.amount,
      mpesaCode: payment.mpesaCode,
      status: payment.tier === 'holding_deposit' ? 'reserved' : 'viewing_scheduled',
      bookingDate: new Date().toLocaleDateString(),
      viewingDate: payment.scheduledDate,
      viewingTime: payment.scheduledTime,
      caretakerName: PUBLIC_CONTACT.name,
      caretakerPhone: PUBLIC_CONTACT.phone,
      clearancePassCode: payment.clearancePassCode,
      isDiscreet: isDiscreetMode,
      isFreeViewing: payment.amount === 0,
      paymentStatus: payment.amount === 0 ? 'free_viewing_zero_cost' : 'paid_after_viewing',
    };
    setBookings((prev) => [newBooking, ...prev]);

    const newLog: AdminSecurityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'ESCROW_GATEWAY',
      action: payment.amount === 0 ? 'FREE_VIEWING_PASS_ISSUED' : 'DISCREET_PAYMENT_CLEARED',
      entityType: 'payment_escrow',
      details: payment.amount === 0 
        ? `Free viewing pass ${payment.clearancePassCode} issued (KES 0). Pay-after-viewing policy active.`
        : `Payment of KES ${payment.amount} under ${payment.billingDescriptor} verified. Clearance Pass ${payment.clearancePassCode} generated.`,
      securityLevel: 'high',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleAddProperty = (newProperty: Property) => {
    setProperties((prev) => [newProperty, ...prev]);

    const newLog: AdminSecurityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'LANDLORD_SUBMISSION',
      action: 'LISTING_QUEUED_FOR_APPROVAL',
      entityType: 'property',
      details: `New property ${newProperty.title} queued. Caretaker National ID encrypted.`,
      securityLevel: 'medium',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleUpdateProperty = (updatedProperty: Property) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p))
    );
    if (selectedProperty && selectedProperty.id === updatedProperty.id) {
      setSelectedProperty(updatedProperty);
    }
    const newLog: AdminSecurityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: isAdmin ? 'SUPER_ADMIN' : 'SCOUT_EDITOR',
      action: 'LISTING_UPDATED',
      entityType: 'property',
      details: `Property ${updatedProperty.title} updated. Sensitive caretaker credentials kept securely in vault.`,
      securityLevel: 'medium',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleApproveProperty = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, approvalStatus: 'approved', isVerified: true } : p))
    );
    const newLog: AdminSecurityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'SUPER_ADMIN',
      action: 'LISTING_APPROVED',
      entityType: 'property',
      details: `Property ${id} approved by admin and made visible to student directory.`,
      securityLevel: 'high',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleRejectProperty = (id: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    const newLog: AdminSecurityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'SUPER_ADMIN',
      action: 'LISTING_REJECTED',
      entityType: 'property',
      details: `Property ${id} rejected due to credential verification failure.`,
      securityLevel: 'high',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleToggleVerifyProperty = (id: string) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isVerified: !p.isVerified } : p))
    );
  };

  const handleAddRoommatePost = (newPost: RoommatePost) => {
    setRoommatePosts((prev) => [newPost, ...prev]);
  };

  const handleRemoveRoommatePost = (id: string) => {
    setRoommatePosts((prev) => prev.filter((p) => p.id !== id));
  };

  const handleLoginAsAdmin = () => {
    setIsAdmin(true);
    const newLog: AdminSecurityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'SUPER_ADMIN',
      action: 'ADMIN_AUTHENTICATED',
      entityType: 'credentials',
      details: 'Super Admin authenticated. Credential unmasking privileges unlocked.',
      securityLevel: 'high',
    };
    setSecurityLogs((prev) => [newLog, ...prev]);
  };

  const handleLogoutAdmin = () => {
    setIsAdmin(false);
  };

  const handleLaunchDiscreetPayment = (
    prop?: Property | null,
    mode: 'free_viewing' | 'pay_after_viewing' = 'free_viewing'
  ) => {
    setDiscreetPaymentTargetProp(prop || null);
    setDiscreetModalInitialMode(mode);
    setIsDiscreetPaymentOpen(true);
  };

  // Filtered properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // Security Gate: Pending listings are Admin-only!
      if (!isAdmin && prop.approvalStatus !== 'approved') {
        return false;
      }

      const matchNeigh = selectedNeighborhood === 'all' || prop.neighborhood === selectedNeighborhood;
      const matchType = selectedRoomType === 'all' || prop.roomType === selectedRoomType;
      const matchBudget = !maxBudget || prop.price <= maxBudget;
      const matchWalk = !walkUnder10Min || prop.walkingMinutes <= 10;
      const matchFav = !filterFavoritesOnly || favorites.includes(prop.id);

      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        prop.title.toLowerCase().includes(q) ||
        prop.buildingName.toLowerCase().includes(q) ||
        prop.neighborhood.toLowerCase().includes(q) ||
        prop.addressDescription.toLowerCase().includes(q) ||
        prop.amenities.some((a) => a.toLowerCase().includes(q));

      return matchNeigh && matchType && matchBudget && matchWalk && matchFav && matchSearch;
    });
  }, [
    properties,
    isAdmin,
    selectedNeighborhood,
    selectedRoomType,
    maxBudget,
    walkUnder10Min,
    filterFavoritesOnly,
    favorites,
    searchQuery,
  ]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col selection:bg-[#047857] selection:text-white">
      {/* Top Bar Contract with Free Viewing & Discreet Mode */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenListProperty={() => setIsListPropertyOpen(true)}
        onOpenBookings={() => setIsBookingsOpen(true)}
        bookingsCount={bookings.length}
        isAdmin={isAdmin}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isDiscreetMode={isDiscreetMode}
        onToggleDiscreetMode={handleToggleDiscreetMode}
        onOpenDiscreetPayment={(mode) => handleLaunchDiscreetPayment(null, mode || 'free_viewing')}
        onOpenContactAdmin={() => setIsContactAdminOpen(true)}
      />

      {/* Free Viewing Guarantee Notice Banner */}
      <div className="bg-slate-900 text-white text-[11px] py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-300">
              Free Viewing Policy:
            </span>
            <span className="text-slate-400 hidden sm:inline">
              Comrades inspect rooms 100% FREE with accredited gate guides. Payment happens ONLY after viewing if you decide to take the unit.
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {isDiscreetMode && (
              <span className="text-amber-400 font-bold flex items-center gap-1">
                <EyeOff className="w-3 h-3" />
                <span>Discreet Mode Active</span>
              </span>
            )}

            {isAdmin ? (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-emerald-400 hover:text-emerald-300 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <Unlock className="w-3 h-3" />
                <span>Admin Vault Active (Unmasked)</span>
              </button>
            ) : (
              <button
                onClick={() => setIsAdminPanelOpen(true)}
                className="text-amber-400 hover:text-amber-300 font-bold underline flex items-center gap-1 cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>Admin Security Access</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Dynamic View by Tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {activeTab === 'properties' && (
          <div>
            {/* Hero & Search Header */}
            <HeroSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedNeighborhood={selectedNeighborhood}
              setSelectedNeighborhood={setSelectedNeighborhood}
              selectedRoomType={selectedRoomType}
              setSelectedRoomType={setSelectedRoomType}
              maxBudget={maxBudget}
              setMaxBudget={setMaxBudget}
              walkUnder10Min={walkUnder10Min}
              setWalkUnder10Min={setWalkUnder10Min}
              onOpenDiscreetPayment={() => handleLaunchDiscreetPayment(null, 'free_viewing')}
              isDiscreetMode={isDiscreetMode}
              onOpenListProperty={() => setIsListPropertyOpen(true)}
            />

            {/* Results Filter Bar & Counts */}
            <div className="my-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">
                  Showing <strong className="text-[#047857]">{filteredProperties.length}</strong> verified residences & rooms
                </span>

                <button
                  onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    filterFavoritesOnly
                      ? 'bg-red-50 text-red-700 border border-red-200'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${filterFavoritesOnly ? 'fill-red-500 text-red-500' : 'text-slate-400'}`} />
                  <span>Saved Rooms ({favorites.length})</span>
                </button>
              </div>

              {/* Quick Reset if filtered */}
              {(selectedNeighborhood !== 'all' || selectedRoomType !== 'all' || maxBudget !== null || walkUnder10Min || searchQuery || filterFavoritesOnly) && (
                <button
                  onClick={() => {
                    setSelectedNeighborhood('all');
                    setSelectedRoomType('all');
                    setMaxBudget(null);
                    setWalkUnder10Min(false);
                    setSearchQuery('');
                    setFilterFavoritesOnly(false);
                  }}
                  className="text-xs font-bold text-[#047857] hover:underline cursor-pointer"
                >
                  Reset All Filters
                </button>
              )}
            </div>

            {/* Property Cards Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    onSelectProperty={setSelectedProperty}
                    isFavorite={favorites.includes(property.id)}
                    onToggleFavorite={handleToggleFavorite}
                    isAdmin={isAdmin}
                    isDiscreetMode={isDiscreetMode}
                    onBookViewingPass={(prop) => handleLaunchDiscreetPayment(prop, 'free_viewing')}
                    onEditProperty={(prop) => setEditingProperty(prop)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto space-y-3 shadow-xs">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-display font-bold text-lg text-slate-900">
                  No rooms match your search
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Try broadening your budget, selecting another gate neighborhood, or resetting your filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedNeighborhood('all');
                    setSelectedRoomType('all');
                    setMaxBudget(null);
                    setWalkUnder10Min(false);
                    setSearchQuery('');
                    setFilterFavoritesOnly(false);
                  }}
                  className="py-2 px-5 rounded-xl bg-[#047857] text-white text-xs font-bold shadow-xs hover:bg-[#065F46] cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}

        {/* Roommate Board Tab */}
        {activeTab === 'roommates' && (
          <RoommateBoard
            posts={roommatePosts}
            onAddPost={handleAddRoommatePost}
            isAdmin={isAdmin}
            onRemovePost={handleRemoveRoommatePost}
            isDiscreetMode={isDiscreetMode}
          />
        )}

        {/* Campus Gate Map Guide Tab */}
        {activeTab === 'campus-map' && (
          <CampusMapGuide />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#047857] flex items-center justify-center text-white font-display font-black text-sm">
              KU
            </div>
            <span className="font-display font-bold text-slate-900">
              KU Room Finders
            </span>
            <span className="text-slate-300">·</span>
            <span>100% Free Room Viewings · Pay After Viewing Escrow System</span>
          </div>

          <div className="flex items-center gap-4 font-medium text-slate-600">
            <button onClick={() => setActiveTab('properties')} className="hover:text-slate-900 cursor-pointer">Hostels & Rooms</button>
            <button onClick={() => setActiveTab('roommates')} className="hover:text-slate-900 cursor-pointer">Roommate Matching</button>
            <button onClick={() => setActiveTab('campus-map')} className="hover:text-slate-900 cursor-pointer">Campus Gates</button>
            <button onClick={() => handleLaunchDiscreetPayment(null, 'free_viewing')} className="hover:text-slate-900 text-[#047857] font-bold cursor-pointer">Free Viewing Pass</button>
            <button onClick={() => setIsAdminPanelOpen(true)} className="hover:text-slate-900 text-amber-700 font-bold cursor-pointer">Admin Vault</button>
          </div>
        </div>
      </footer>

      {/* Property Details Modal with Free Viewing & Post-Viewing Reservation */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onAddBooking={handleAddBooking}
        isAdmin={isAdmin}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isDiscreetMode={isDiscreetMode}
        onOpenDiscreetPayment={(prop, mode) => handleLaunchDiscreetPayment(prop, mode || 'free_viewing')}
        onOpenEditProperty={(prop) => setEditingProperty(prop)}
      />

      {/* List Property & Scout Job Modal */}
      <ListPropertyModal
        isOpen={isListPropertyOpen}
        onClose={() => setIsListPropertyOpen(false)}
        onAddProperty={handleAddProperty}
        onOpenEditProperty={(prop) => setEditingProperty(prop)}
        properties={properties}
        isAdmin={isAdmin}
      />

      {/* Edit Property Modal */}
      <EditPropertyModal
        isOpen={editingProperty !== null}
        onClose={() => setEditingProperty(null)}
        property={editingProperty}
        onUpdateProperty={handleUpdateProperty}
        isAdmin={isAdmin}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
      />

      {/* My Bookings / Viewings Modal with Credential Masking & Pay After Viewing */}
      <BookingsModal
        isOpen={isBookingsOpen}
        onClose={() => setIsBookingsOpen(false)}
        bookings={bookings}
        isAdmin={isAdmin}
        onOpenAdminPanel={() => setIsAdminPanelOpen(true)}
        isDiscreetMode={isDiscreetMode}
        onViewPassSlip={(passCode) => {
          const found = houseHuntingPayments.find((p) => p.clearancePassCode === passCode);
          if (found) {
            setSelectedPassSlip(found);
          }
        }}
        onPayAfterViewing={(booking) => {
          const matchedProp = properties.find((p) => p.id === booking.propertyId) || null;
          handleLaunchDiscreetPayment(matchedProp, 'pay_after_viewing');
        }}
      />

      <ContactAdminModal
        isOpen={isContactAdminOpen}
        onClose={() => setIsContactAdminOpen(false)}
      />

      {/* Discreet Free Viewing & Post-Viewing Payment Modal */}
      <DiscreetPaymentModal
        isOpen={isDiscreetPaymentOpen}
        onClose={() => setIsDiscreetPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
        selectedProperty={discreetPaymentTargetProp}
        isDiscreetMode={isDiscreetMode}
        onToggleDiscreetMode={handleToggleDiscreetMode}
        initialMode={discreetModalInitialMode}
      />

      {/* Formal Printable Discreet Viewing Voucher Pass */}
      <DiscreetViewingPassModal
        pass={selectedPassSlip}
        onClose={() => setSelectedPassSlip(null)}
        isAdmin={isAdmin}
        isDiscreetMode={isDiscreetMode}
      />

      {/* Admin Security Oversight & Credential Vault Modal */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        isAdmin={isAdmin}
        onLoginAsAdmin={handleLoginAsAdmin}
        onLogoutAdmin={handleLogoutAdmin}
        properties={properties}
        onApproveProperty={handleApproveProperty}
        onRejectProperty={handleRejectProperty}
        onToggleVerifyProperty={handleToggleVerifyProperty}
        onOpenEditProperty={(prop) => setEditingProperty(prop)}
        bookings={bookings}
        roommates={roommatePosts}
        onRemoveRoommatePost={handleRemoveRoommatePost}
        securityLogs={securityLogs}
        houseHuntingPayments={houseHuntingPayments}
        onViewClearanceSlip={(payment) => setSelectedPassSlip(payment)}
      />
    </div>
  );
}
