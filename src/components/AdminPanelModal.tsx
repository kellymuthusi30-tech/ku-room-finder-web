import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  FileText,
  DollarSign,
  Users,
  Building2,
  Trash2,
  Check,
  RefreshCw,
  Clock,
  Phone,
  MessageCircle,
  Ticket,
  CreditCard,
  Download,
  Edit
} from 'lucide-react';
import { Property, Booking, RoommatePost, AdminSecurityLog, HouseHuntingPayment } from '../types';
import { ADMIN_CONFIG, buildWhatsAppUrl } from '../utils/security';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAdmin: boolean;
  onLoginAsAdmin: () => void;
  onLogoutAdmin: () => void;
  properties: Property[];
  onApproveProperty: (id: string) => void;
  onRejectProperty: (id: string) => void;
  onToggleVerifyProperty: (id: string) => void;
  onOpenEditProperty?: (property: Property) => void;
  bookings: Booking[];
  roommates: RoommatePost[];
  onRemoveRoommatePost: (id: string) => void;
  securityLogs: AdminSecurityLog[];
  houseHuntingPayments: HouseHuntingPayment[];
  onTogglePaymentStatus?: (id: string) => void;
  onViewClearanceSlip?: (payment: HouseHuntingPayment) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  isAdmin,
  onLoginAsAdmin,
  onLogoutAdmin,
  properties,
  onApproveProperty,
  onRejectProperty,
  onToggleVerifyProperty,
  onOpenEditProperty,
  bookings,
  roommates,
  onRemoveRoommatePost,
  securityLogs,
  houseHuntingPayments,
  onTogglePaymentStatus,
  onViewClearanceSlip,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'credentials' | 'payments' | 'approvals' | 'bookings' | 'audit'>('credentials');

  const pendingProperties = properties.filter((p) => p.approvalStatus === 'pending_review');
  const approvedProperties = properties.filter((p) => p.approvalStatus === 'approved');

  const totalEscrowHeld = houseHuntingPayments.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-md">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-extrabold text-lg text-white">
                  KU Room Finders  Admin Security Vault
                </h3>
                {isAdmin ? (
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                    Admin Vault Active
                  </span>
                ) : (
                  <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Locked / Student Protection Mode
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Restricted Agency Portal  Server authentication required
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Gate if Not Logged In */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center mx-auto text-slate-700 shadow-inner">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>

            <div>
              <h4 className="text-xl font-display font-black text-slate-900">
                Restricted Admin Access
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                To protect the agency house hunting business from middleman bypass and comply with the Kenya Data Protection Act 2019, raw caretaker contacts, national IDs, and financial M-Pesa escrow keys are locked.
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left">
              Administrator access is unavailable in this public client. Configure Firebase Authentication and server-side authorization before enabling the vault.
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Top Navigation Tabs */}
            <div className="p-3 sm:px-6 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold">
                <button
                  onClick={() => setActiveTab('credentials')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'credentials'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5 text-amber-600" />
                  <span>Caretaker & Landlord Vault</span>
                </button>

                <button
                  onClick={() => setActiveTab('payments')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'payments'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>House Hunting Escrow Ledger</span>
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] flex items-center justify-center font-black">
                    {houseHuntingPayments.length}
                  </span>
                </button>

                <button
                  onClick={() => setActiveTab('approvals')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'approvals'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Listings & Approvals</span>
                  {pendingProperties.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-black">
                      {pendingProperties.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('audit')}
                  className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                    activeTab === 'audit'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5 text-purple-600" />
                  <span>Security Audit Logs</span>
                </button>
              </div>

              <button
                onClick={onLogoutAdmin}
                className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors ml-auto"
              >
                Sign Out Admin
              </button>
            </div>

            {/* Tab 1: Unmasked Caretaker Credentials Vault */}
            {activeTab === 'credentials' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <Unlock className="w-4 h-4 text-blue-700" />
                      <span>Unmasked Landlord & Caretaker Registry</span>
                    </h4>
                    <p className="text-xs text-slate-600 mt-0.5">
                      These confidential credentials are encrypted and strictly withheld from regular student accounts to preserve the agency business.
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-500 block">Total Managed Units:</span>
                    <span className="text-base font-display font-black text-slate-900 tabular-nums">
                      {properties.reduce((acc, p) => acc + p.totalRooms, 0)} Units
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                        <th className="p-3">Hostel / Building</th>
                        <th className="p-3">Caretaker Name</th>
                        <th className="p-3">Unmasked Phone</th>
                        <th className="p-3">WhatsApp Link</th>
                        <th className="p-3">National ID</th>
                        <th className="p-3">Payout Escrow</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {properties.map((prop) => (
                        <tr key={prop.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-slate-900 block truncate max-w-[160px]">
                              {prop.title}
                            </span>
                            <span className="text-[10px] text-slate-400">
                              {prop.neighborhood}  {prop.vacantRoomsCount} Vacant
                            </span>
                          </td>
                          <td className="p-3 font-semibold text-slate-800">
                            {prop.caretakerName}
                          </td>
                          <td className="p-3 font-mono font-bold text-blue-700">
                            {prop.caretakerPhone}
                          </td>
                          <td className="p-3">
                            <a
                              href={buildWhatsAppUrl(`Hello Kelly, I need help with ${prop.title}.`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-2 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-[10px] inline-flex items-center gap-1 hover:bg-blue-200"
                            >
                              <MessageCircle className="w-3 h-3" />
                              <span>Direct WhatsApp</span>
                            </a>
                          </td>
                          <td className="p-3 font-mono text-slate-700 font-medium">
                            {prop.caretakerNationalId || 'N/A'}
                          </td>
                          <td className="p-3 font-mono text-slate-700 font-medium">
                            {prop.landlordPayoutMpesa ? `M-Pesa (${prop.landlordPayoutMpesa})` : 'N/A'}
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-1.5">
                              <a
                                href={buildWhatsAppUrl(`Hello Kelly, I need help with ${prop.title}.`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 font-bold text-[10px] inline-flex items-center gap-1 hover:bg-blue-200"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp Kelly</span>
                              </a>
                              {onOpenEditProperty && (
                                <button
                                  onClick={() => onOpenEditProperty(prop)}
                                  className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-[10px] inline-flex items-center gap-1 border border-purple-200 cursor-pointer"
                                  title="Edit House Details & Caretaker Credentials"
                                >
                                  <Edit className="w-3 h-3" />
                                  <span>Edit</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 2: House Hunting Payments & Escrow Ledger */}
            {activeTab === 'payments' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                    <span className="text-xs font-bold text-blue-800 block">Total Post-Viewing Escrow Vaulted</span>
                    <span className="text-2xl font-display font-black text-slate-900 tabular-nums">
                      KES {totalEscrowHeld.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-blue-600 block mt-0.5">Holding deposits & placements</span>
                  </div>

                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200">
                    <span className="text-xs font-bold text-amber-800 block">100% Free Viewings Scheduled</span>
                    <span className="text-2xl font-display font-black text-slate-900 tabular-nums">
                      {houseHuntingPayments.filter(p => p.amount === 0 || p.isFreeViewing).length} Free Tours
                    </span>
                    <span className="text-[10px] text-amber-600 block mt-0.5">Pay-after-viewing model</span>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <span className="text-xs font-bold text-slate-600 block">Agency Escrow Paybill</span>
                    <span className="text-lg font-mono font-black text-slate-900">
                      {ADMIN_CONFIG.escrowPaybill}
                    </span>
                    <span className="text-[10px] text-slate-500 block">{ADMIN_CONFIG.escrowAccountName}</span>
                  </div>
                </div>

                <div className="overflow-x-auto border border-slate-200 rounded-2xl bg-white shadow-2xs">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px] tracking-wider">
                        <th className="p-3">Pass ID</th>
                        <th className="p-3">Student / Reg No</th>
                        <th className="p-3">M-Pesa Reference</th>
                        <th className="p-3">Descriptor</th>
                        <th className="p-3">Meeting Gate</th>
                        <th className="p-3">Assigned Agent</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {houseHuntingPayments.length === 0 ? (
                        <tr>
                          <td colSpan={8} className="p-8 text-center text-slate-400">
                            No discreet house hunting payments recorded yet. Test by booking a viewing pass or room reservation!
                          </td>
                        </tr>
                      ) : (
                        houseHuntingPayments.map((pay) => (
                          <tr key={pay.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3 font-mono font-bold text-slate-900">
                              {pay.clearancePassCode}
                              {pay.amount === 0 && (
                                <span className="text-[9px] bg-blue-100 text-[#2563EB] px-1.5 py-0.2 rounded font-black block w-fit mt-0.5">
                                  FREE VIEWING
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-slate-900 block">{pay.studentName}</span>
                              <span className="font-mono text-[10px] text-slate-400">{pay.studentRegNo}</span>
                            </td>
                            <td className="p-3 font-mono font-bold text-blue-700">
                              {pay.amount === 0 ? 'FREE-PASS' : pay.mpesaCode}
                            </td>
                            <td className="p-3 font-semibold text-slate-600 text-[11px]">
                              {pay.billingDescriptor}
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-slate-800">{pay.pickupGate}</span>
                              <span className="text-[10px] text-slate-400 block">{pay.scheduledDate}</span>
                            </td>
                            <td className="p-3 text-slate-700 font-medium">
                              {pay.escortAgentAssigned}
                            </td>
                            <td className="p-3 font-display font-black text-slate-900 tabular-nums">
                              {pay.amount === 0 ? (
                                <span className="text-blue-700 font-bold">KES 0 (Pay Later)</span>
                              ) : (
                                `KES ${pay.amount.toLocaleString()}`
                              )}
                            </td>
                            <td className="p-3">
                              <button
                                onClick={() => onViewClearanceSlip && onViewClearanceSlip(pay)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-[10px] flex items-center gap-1"
                              >
                                <Ticket className="w-3 h-3 text-[#2563EB]" />
                                <span>Voucher</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Listings & Approvals */}
            {activeTab === 'approvals' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">
                    Hostel Listing Verification ({pendingProperties.length} Pending Review)
                  </h4>
                  <span className="text-xs text-slate-500">
                    Approved properties appear on student directory
                  </span>
                </div>

                <div className="space-y-3">
                  {properties.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h5 className="font-display font-bold text-sm text-slate-900">
                              {prop.title}
                            </h5>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              prop.approvalStatus === 'approved'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-900'
                            }`}>
                              {prop.approvalStatus}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {prop.neighborhood}  KES {prop.price.toLocaleString()}/{prop.pricePeriod}  Caretaker: {prop.caretakerName} ({prop.caretakerPhone})
                          </p>
                          {prop.scoutName && (
                            <span className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md font-bold mt-1 inline-flex items-center gap-1">
                              <span>Scout: {prop.scoutName} ({prop.scoutRegNo})</span>
                              <span> Bounty: KES {prop.listingBountyKes?.toLocaleString() || '800'}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {onOpenEditProperty && (
                          <button
                            onClick={() => onOpenEditProperty(prop)}
                            className="px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs flex items-center gap-1 transition-colors border border-purple-200 cursor-pointer"
                            title="Edit House Information"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit Listing</span>
                          </button>
                        )}

                        <button
                          onClick={() => onToggleVerifyProperty(prop.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                            prop.isVerified
                              ? 'bg-blue-50 text-blue-800 border border-blue-300'
                              : 'bg-slate-200 text-slate-700'
                          }`}
                        >
                          {prop.isVerified ? ' Verified Badge Active' : 'Mark Verified'}
                        </button>

                        {prop.approvalStatus === 'pending_review' ? (
                          <>
                            <button
                              onClick={() => onApproveProperty(prop.id)}
                              className="px-3 py-1.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                            >
                              Approve Listing
                            </button>
                            <button
                              onClick={() => onRejectProperty(prop.id)}
                              className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 font-bold text-xs hover:bg-red-200"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => onRejectProperty(prop.id)}
                            className="px-3 py-1.5 rounded-xl bg-red-50 text-red-600 font-bold text-xs hover:bg-red-100"
                          >
                            Remove Listing
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 4: Security Audit Trail */}
            {activeTab === 'audit' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>Real-Time Security & PII Protection Audit Trail</span>
                  </h4>
                  <span className="text-xs text-slate-400 font-mono">Immutable Log Stream</span>
                </div>

                <div className="space-y-2">
                  {securityLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80 text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-slate-800">{log.action}</span>
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                            log.securityLevel === 'high' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {log.securityLevel}
                          </span>
                        </div>
                        <p className="text-slate-600 mt-1 font-sans text-xs">{log.details}</p>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block">{log.timestamp}</span>
                        <span className="text-[10px] text-slate-500 font-bold">Actor: {log.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
