export type RoomType = 
  | 'bedsit' 
  | 'single' 
  | 'one_bedroom' 
  | 'hostel_shared' 
  | 'executive_studio';

export type Neighborhood = 
  | 'KM Gate' 
  | 'Kahawa Wendani' 
  | 'Kahawa Sukari' 
  | 'Ruiru' 
  | 'Bypass' 
  | 'Roysambu';

export type CampusGate = 
  | 'KM Gate' 
  | 'Nyayo Gate' 
  | 'Main Gate' 
  | 'Eastern Bypass Gate';

export type HouseHuntingTier = 
  | 'free_viewing' 
  | 'holding_deposit' 
  | 'post_viewing_placement'
  | 'tour_pass' 
  | 'full_placement';

export interface Property {
  id: string;
  title: string;
  buildingName: string;
  neighborhood: Neighborhood;
  nearestGate: CampusGate;
  walkingMinutes: number;
  distanceKm: number;
  roomType: RoomType;
  price: number;
  pricePeriod: 'month' | 'semester';
  deposit: number;
  images: string[];
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  vacantRoomsCount: number;
  totalRooms: number;
  caretakerName: string;
  caretakerPhone: string; // SENSITIVE: Strictly restricted to Admin only!
  caretakerWhatsApp: string; // SENSITIVE: Strictly restricted to Admin only!
  caretakerNationalId?: string; // SENSITIVE: Admin-only
  landlordPayoutMpesa?: string; // SENSITIVE: Admin-only
  approvalStatus: 'approved' | 'pending_review' | 'rejected'; // Admin controlled
  addressDescription: string;
  amenities: string[];
  rules: string[];
  description: string;
  featured?: boolean;
  listedBy?: 'scout' | 'landlord' | 'admin';
  scoutName?: string;
  scoutPhone?: string;
  scoutRegNo?: string;
  listingBountyKes?: number;
  bountyPayoutStatus?: 'pending_admin_review' | 'bounty_approved' | 'bounty_paid';
}

export interface RoommatePost {
  id: string;
  studentName: string;
  studentCourse: string;
  yearOfStudy: string;
  gender: 'Female' | 'Male';
  preferredLocation: Neighborhood;
  budgetPerPerson: number;
  targetRoomType: string;
  bio: string;
  lookingFor: string;
  contactPhone: string;
  contactWhatsApp: string;
  createdAt: string;
  verifiedStudent: boolean;
  status?: 'active' | 'flagged' | 'removed';
}

export interface Booking {
  id: string;
  propertyId: string;
  propertyTitle: string;
  neighborhood: Neighborhood;
  roomType: string;
  studentName: string;
  studentRegNo: string; // SENSITIVE: Restricted to Admin
  studentPhone: string; // SENSITIVE: Restricted to Admin
  depositAmount: number;
  mpesaCode: string; // SENSITIVE: Masked for non-admins
  status: 'reserved' | 'viewing_scheduled';
  bookingDate: string;
  viewingDate?: string;
  viewingTime?: string;
  caretakerName: string;
  caretakerPhone: string; // SENSITIVE: Restricted to Admin
  clearancePassCode?: string;
  isDiscreet?: boolean;
  isFreeViewing?: boolean; // Free viewing pass - pay nothing upfront
  paymentStatus?: 'free_viewing_zero_cost' | 'paid_after_viewing' | 'pending_post_viewing';
}

export interface HouseHuntingPayment {
  id: string;
  studentName: string;
  studentRegNo: string;
  studentPhone: string;
  targetNeighborhood: Neighborhood;
  propertyId?: string;
  propertyTitle?: string;
  tier: HouseHuntingTier;
  amount: number;
  billingDescriptor: string; // e.g. 'KU-RE HOUSING ESCROW' or 'CONFIDENTIAL VIEWING'
  mpesaCode: string;
  timestamp: string;
  scheduledDate: string;
  scheduledTime: string;
  pickupGate: CampusGate;
  escortAgentAssigned: string;
  clearancePassCode: string; // e.g. 'PASS-KU-9482'
  status: 'active' | 'completed' | 'refunded';
  notes?: string;
  isFreeViewing?: boolean; // True when student books free viewing (KES 0 upfront)
  paymentTiming?: 'free_viewing_upfront' | 'paid_after_viewing';
}

export interface AdminSecurityLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entityType: 'booking' | 'property' | 'credentials' | 'roommate' | 'payment_escrow';
  details: string;
  securityLevel: 'low' | 'medium' | 'high';
}
