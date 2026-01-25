import React, { useState } from 'react';
import { User, Plus, X, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProfileModal = ({ isOpen, onClose, onSelectProfile }) => {
    const { profiles, addProfile } = useCart();
    const [view, setView] = useState('select'); // 'select' or 'create'
    const [newProfile, setNewProfile] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        measurements: ''
    });

    if (!isOpen) return null;

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newProfile.name || !newProfile.phone) return;
        
        try {
            const created = await addProfile(newProfile);
            if (created) {
                onSelectProfile(created._id || created.id);
                setNewProfile({ name: '', phone: '', email: '', address: '', measurements: '' });
                setView('select');
                onClose();
            }
        } catch (error) {
            // Error handling is done in addProfile
        }
    };

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-brand-black/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-brand-cream w-full max-w-md rounded-lg shadow-2xl overflow-hidden border border-brand-brown/10">
                
                {/* Header */}
                <div className="bg-brand-coffee p-4 flex justify-between items-center text-brand-tan">
                    <h3 className="font-serif text-xl tracking-wide">
                        {view === 'select' ? 'Who is this for?' : 'New Measurement Profile'}
                    </h3>
                    <button onClick={onClose} className="hover:text-white transition-colors"><X size={20} /></button>
                </div>

                <div className="p-6">
                    {view === 'select' ? (
                        <div className="space-y-4">
                            <div className="grid gap-3 max-h-[60vh] overflow-y-auto">
                                {profiles.map(profile => (
                                    <button 
                                        key={profile._id || profile.id}
                                        onClick={() => { onSelectProfile(profile._id || profile.id); onClose(); }}
                                        className="flex items-center gap-4 p-4 rounded-lg border border-brand-brown/10 bg-white hover:border-brand-rust hover:shadow-md transition-all text-left group"
                                    >
                                        <div className="w-10 h-10 rounded-full bg-brand-brown/10 flex items-center justify-center text-brand-coffee group-hover:bg-brand-rust group-hover:text-white transition-colors">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <p className="font-serif text-lg text-brand-espresso font-medium">{profile.name}</p>
                                            {!profile.isSelf && <p className="text-xs text-brand-taupe">{profile.phone}</p>}
                                        </div>
                                        <div className="ml-auto opacity-0 group-hover:opacity-100 text-brand-rust">
                                            <Check size={20} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                            
                            <button 
                                onClick={() => setView('create')}
                                className="w-full py-3 flex items-center justify-center gap-2 border-2 border-dashed border-brand-brown/30 rounded-lg text-brand-brown font-bold uppercase text-xs tracking-wider hover:bg-brand-brown/5 hover:border-brand-brown transition-all"
                            >
                                <Plus size={16} /> Create New Profile
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-brand-rust uppercase tracking-wider mb-1">Full Name *</label>
                                <input 
                                    type="text" 
                                    required
                                    className="w-full p-2 bg-white border border-brand-brown/20 rounded focus:outline-none focus:border-brand-brown font-serif"
                                    value={newProfile.name}
                                    onChange={e => setNewProfile({...newProfile, name: e.target.value})}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-brand-rust uppercase tracking-wider mb-1">Phone *</label>
                                    <input 
                                        type="tel" 
                                        required
                                        className="w-full p-2 bg-white border border-brand-brown/20 rounded focus:outline-none focus:border-brand-brown font-serif"
                                        value={newProfile.phone}
                                        onChange={e => setNewProfile({...newProfile, phone: e.target.value})}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-brand-rust uppercase tracking-wider mb-1">Email</label>
                                    <input 
                                        type="email" 
                                        className="w-full p-2 bg-white border border-brand-brown/20 rounded focus:outline-none focus:border-brand-brown font-serif"
                                        value={newProfile.email}
                                        onChange={e => setNewProfile({...newProfile, email: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-brand-rust uppercase tracking-wider mb-1">Address (Optional)</label>
                                <textarea 
                                    className="w-full p-2 bg-white border border-brand-brown/20 rounded focus:outline-none focus:border-brand-brown font-serif h-20 resize-none"
                                    value={newProfile.address}
                                    onChange={e => setNewProfile({...newProfile, address: e.target.value})}
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => setView('select')}
                                    className="flex-1 py-3 text-brand-coffee font-bold text-xs uppercase tracking-wider hover:bg-black/5 rounded"
                                >
                                    Back
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-3 bg-brand-coffee text-white font-bold text-xs uppercase tracking-wider hover:bg-brand-espresso rounded shadow-lg"
                                >
                                    Save Profile
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfileModal;
