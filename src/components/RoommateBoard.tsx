import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  MapPin, 
  MessageCircle, 
  GraduationCap, 
  ShieldCheck, 
  Search, 
  Filter, 
  Sparkles, 
  HeartHandshake, 
  Trash2, 
  Lock, 
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';
import { RoommatePost, Neighborhood } from '../types';
import { buildWhatsAppUrl, maskPhoneNumber, formatDiscreetCurrency, PUBLIC_CONTACT } from '../utils/security';

interface RoommateBoardProps {
  posts: RoommatePost[];
  onAddPost: (post: RoommatePost) => void;
  isAdmin: boolean;
  onRemovePost: (id: string) => void;
  isDiscreetMode?: boolean;
}

export const RoommateBoard: React.FC<RoommateBoardProps> = ({
  posts,
  onAddPost,
  isAdmin,
  onRemovePost,
  isDiscreetMode = false,
}) => {
  const [selectedGender, setSelectedGender] = useState<'all' | 'Female' | 'Male'>('all');
  const [selectedLocation, setSelectedLocation] = useState<Neighborhood | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New post form state
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [year, setYear] = useState('Year 2');
  const [gender, setGender] = useState<'Female' | 'Male'>('Female');
  const [location, setLocation] = useState<Neighborhood>('Kahawa Wendani');
  const [budget, setBudget] = useState('5500');
  const [targetRoom, setTargetRoom] = useState('1-Bedroom Flat (to split)');
  const [bio, setBio] = useState('');
  const [lookingFor, setLookingFor] = useState('');
  const [phone, setPhone] = useState('+254 7');

  const filteredPosts = posts.filter((post) => {
    const matchGender = selectedGender === 'all' || post.gender === selectedGender;
    const matchLocation = selectedLocation === 'all' || post.preferredLocation === selectedLocation;
    return matchGender && matchLocation;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !course.trim()) return;

    const newPost: RoommatePost = {
      id: `roomie-${Date.now()}`,
      studentName: name.trim(),
      studentCourse: course.trim(),
      yearOfStudy: year,
      gender,
      preferredLocation: location,
      budgetPerPerson: Number(budget) || 5000,
      targetRoomType: targetRoom,
      bio: bio.trim() || 'KU Student looking for a quiet, organized flatmate.',
      lookingFor: lookingFor.trim() || 'Looking for someone to split rent and bills.',
      contactPhone: '',
      contactWhatsApp: PUBLIC_CONTACT.whatsapp,
      createdAt: 'Just now',
      verifiedStudent: true,
      status: 'active',
    };

    onAddPost(newPost);
    setIsModalOpen(false);
    setName('');
    setCourse('');
    setBio('');
    setLookingFor('');
  };

  return (
    <div className="py-8 space-y-6">
      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-[#D97706] text-xs font-bold mb-2 border border-amber-200/80 shadow-2xs">
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Kenyatta University Comrade Pairing Network</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
            KU Student Roommate Board
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed font-medium">
            Cut your living costs by half. Connect with verified KU comrades to split spacious 1-bedroom and 2-bedroom flats in Wendani and KM.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="py-3 px-5 rounded-2xl bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#1D4ED8] hover:to-[#2563EB] text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-blue-950/15 transition-all self-start sm:self-auto active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-[#F59E0B]" />
          <span>Post Roommate Request</span>
        </button>
      </div>

      {/* Filter Tabs & Privacy notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-3xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Gender:</span>
          {(['all', 'Female', 'Male'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedGender === g
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {g === 'all' ? 'All Genders' : `${g} Comrades`}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 mr-1 hidden sm:inline">Area:</span>
          {(['all', 'Kahawa Wendani', 'KM Gate', 'Kahawa Sukari'] as const).map((loc) => (
            <button
              key={loc}
              onClick={() => setSelectedLocation(loc)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedLocation === loc
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {loc === 'all' ? 'All Areas' : loc}
            </button>
          ))}
        </div>
      </div>

      {/* Roommates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post.id}
            className="bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-slate-300 shadow-xs hover:shadow-lg transition-all duration-300 space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 border border-blue-300 flex items-center justify-center font-display font-black text-[#2563EB] text-lg shadow-2xs">
                    {post.studentName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-display font-extrabold text-base text-slate-900">
                        {post.studentName}
                      </h3>
                      {post.verifiedStudent && (
                        <span className="text-[10px] bg-blue-50 text-[#2563EB] font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5 border border-blue-200/70">
                          <ShieldCheck className="w-3 h-3 text-[#2563EB]" />
                          KU Student
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                      {post.studentCourse}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-display font-black text-[#D97706] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-xl tabular-nums inline-block">
                    {formatDiscreetCurrency(post.budgetPerPerson, isDiscreetMode)}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-semibold mt-0.5">per person / mo</span>
                </div>
              </div>

              {/* Looking for box */}
              <div className="mt-4 p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">Looking for:</span>
                <p className="text-slate-600 leading-relaxed font-normal">{post.lookingFor}</p>
              </div>

              {/* Bio & Habits */}
              <p className="text-xs text-slate-500 mt-3 leading-relaxed font-normal italic">
                "{post.bio}"
              </p>

              {/* Masked / Protected Phone Indicator */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/70">
                <span className="flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {maskPhoneNumber(post.contactPhone, isAdmin)}
                </span>
                {!isAdmin ? (
                  <span className="text-[10px] text-blue-700 font-semibold flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" /> Comrade Contact Shield Active
                  </span>
                ) : (
                  <span className="text-[10px] text-[#2563EB] font-bold">Unmasked (Admin View)</span>
                )}
              </div>
            </div>

            {/* Footer Metadata & Connect CTA */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Prefers {post.preferredLocation}</span>
                <span className="text-slate-300">Â·</span>
                <span className="text-[11px] text-slate-400 font-normal">{post.createdAt}</span>
              </div>

              <div className="flex items-center gap-2">
                {isAdmin && (
                  <button
                    onClick={() => onRemovePost(post.id)}
                    className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                    title="Admin Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}

                <a
                  href={buildWhatsAppUrl(`Hello Kelly, I am interested in the roommate listing for ${post.preferredLocation}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-2 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Chat Comrade</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Post Roommate Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">
                  Post Roommate Request
                </h3>
                <p className="text-xs text-slate-500">Your phone number is protected from scrapers</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center"
              >
                âœ•
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Brian Kiprop"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Course / Major
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. B.Sc. Computer Science"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Year of Study
                  </label>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Year 1">1st Year</option>
                    <option value="Year 2">2nd Year</option>
                    <option value="Year 3">3rd Year</option>
                    <option value="Year 4">4th Year</option>
                    <option value="Postgraduate">Postgraduate</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Gender
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'Female' | 'Male')}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Female">Female Comrade</option>
                    <option value="Male">Male Comrade</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Preferred Neighborhood
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value as Neighborhood)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  >
                    <option value="Kahawa Wendani">Kahawa Wendani</option>
                    <option value="KM Gate">KM Gate</option>
                    <option value="Kahawa Sukari">Kahawa Sukari</option>
                    <option value="Ruiru">Ruiru</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your Budget / Month (KES)
                  </label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Target Room Type
                  </label>
                  <input
                    type="text"
                    required
                    value={targetRoom}
                    onChange={(e) => setTargetRoom(e.target.value)}
                    placeholder="e.g. 1-Bedroom Flat"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  What kind of roommate are you looking for?
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Seeking a clean, respectful comrade to split KES 12,000 rent near Wendani..."
                  value={lookingFor}
                  onChange={(e) => setLookingFor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  About You (Habits & Study Schedule)
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Disciplined student, non-smoker, mostly in campus library..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs rounded-xl shadow-md transition-all active:scale-98"
              >
                Publish Comrade Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
