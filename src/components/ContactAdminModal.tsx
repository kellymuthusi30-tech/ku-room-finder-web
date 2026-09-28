import React, { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { buildWhatsAppUrl, PUBLIC_CONTACT } from '../utils/security';

interface ContactAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
}

const REQUEST_TYPES = [
  'Room viewing',
  'Room availability',
  'Listing support',
  'Payment or safety concern',
  'Other question',
] as const;

export const ContactAdminModal: React.FC<ContactAdminModalProps> = ({
  isOpen,
  onClose,
  propertyTitle,
}) => {
  const [requestType, setRequestType] = useState<(typeof REQUEST_TYPES)[number]>(REQUEST_TYPES[0]);
  const [message, setMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const context = propertyTitle ? `Property: ${propertyTitle}\n` : '';
    const text = [
      `Hello ${PUBLIC_CONTACT.name},`,
      `I need help with: ${requestType}.`,
      context.trim(),
      message.trim() ? `Message: ${message.trim()}` : '',
    ].filter(Boolean).join('\n');

    window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer');
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal="true" aria-labelledby="contact-admin-title">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#25D366] text-white">
              <MessageCircle className="h-5 w-5 fill-white" />
            </div>
            <div>
              <h2 id="contact-admin-title" className="font-display text-lg font-extrabold">Contact Admin</h2>
              <p className="text-xs text-slate-300">WhatsApp Kelly Muthusi</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20" aria-label="Close contact form">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-5">
          <label className="block text-xs font-bold text-slate-700">
            What do you need help with?
            <select value={requestType} onChange={(event) => setRequestType(event.target.value as (typeof REQUEST_TYPES)[number])} className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-[#047857]">
              {REQUEST_TYPES.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>

          {propertyTitle && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
              This message will include: <strong>{propertyTitle}</strong>
            </div>
          )}

          <label className="block text-xs font-bold text-slate-700">
            Message <span className="font-normal text-slate-400">(optional)</span>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} maxLength={500} placeholder="Tell Kelly what you need..." className="mt-1.5 w-full resize-none rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-800 outline-none focus:border-[#047857]" />
          </label>

          <p className="text-[11px] leading-relaxed text-slate-500">WhatsApp opens with your message ready to send. Do not send passwords, PINs, or national ID numbers.</p>

          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3.5 text-sm font-extrabold text-white shadow-sm hover:bg-[#20ba59]">
            <Send className="h-4 w-4" />
            Continue to WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
};
