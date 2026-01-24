import React, { useState } from 'react';
import { Palette, Upload, Scissors, X } from 'lucide-react';

const FabricModal = ({ isOpen, onClose, onConfirm }) => {
    const [details, setDetails] = useState({
        color: '',
        fabricType: '',
        referenceImage: null
    });

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(details);
        setDetails({ color: '', fabricType: '', referenceImage: null });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[75] flex items-center justify-center p-4 bg-brand-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-brand-cream w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-brand-brown/20">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-brand-rust to-brand-brown p-6 text-brand-tan relative overflow-hidden">
                    <Scissors className="absolute -bottom-4 -right-4 text-white/10 w-32 h-32" />
                    <h3 className="font-serif text-2xl tracking-wide relative z-10">Fabric Customization</h3>
                    <p className="text-white/80 text-xs uppercase tracking-widest mt-1 relative z-10">Tailor it your way</p>
                    <button onClick={onClose} className="absolute top-6 right-6 hover:text-white transition-colors z-20"><X size={24} /></button>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        
                        {/* Fabric Type */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-brand-brown uppercase tracking-wider mb-2">
                                <Scissors size={14} /> Preferred Fabric Type
                            </label>
                            <select 
                                required
                                className="w-full p-3 bg-white/80 border border-brand-brown/20 rounded-lg focus:outline-none focus:border-brand-brown font-serif text-brand-espresso cursor-pointer"
                                value={details.fabricType}
                                onChange={e => setDetails({...details, fabricType: e.target.value})}
                            >
                                <option value="">Select Fabric...</option>
                                <option value="Cotton">Premium Cotton</option>
                                <option value="Linen">Pure Linen</option>
                                <option value="Wool">Merino Wool</option>
                                <option value="Silk">Raw Silk</option>
                                <option value="Velvet">Royal Velvet</option>
                                <option value="Other">Other (Discuss with Masterji)</option>
                            </select>
                        </div>

                        {/* Color Preference */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-brand-brown uppercase tracking-wider mb-2">
                                <Palette size={14} /> Color Preference
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g., Midnight Blue, Charcoal Grey..."
                                className="w-full p-3 bg-white/80 border border-brand-brown/20 rounded-lg focus:outline-none focus:border-brand-brown font-serif placeholder-brand-taupe/50"
                                value={details.color}
                                onChange={e => setDetails({...details, color: e.target.value})}
                            />
                        </div>

                        {/* Reference Image (Mock) */}
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-brand-brown uppercase tracking-wider mb-2">
                                <Upload size={14} /> Reference Image (Optional)
                            </label>
                            <div className="border-2 border-dashed border-brand-brown/20 rounded-lg p-6 flex flex-col items-center justify-center text-brand-taupe hover:bg-brand-brown/5 transition-colors cursor-pointer group">
                                <Upload size={32} className="mb-2 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-xs font-bold uppercase tracking-wide">Click to Upload</span>
                                <span className="text-[10px] opacity-70 mt-1">JPG, PNG up to 5MB</span>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            className="w-full py-4 bg-brand-coffee text-white font-bold text-xs uppercase tracking-[0.2em] hover:bg-brand-espresso rounded-lg shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                        >
                            Confirm & Add to Cart
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FabricModal;
