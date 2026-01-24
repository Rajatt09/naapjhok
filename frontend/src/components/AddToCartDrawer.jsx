import React, { useState, useEffect } from 'react';
import { X, User, Plus, ChevronRight, Palette, Scissors, Upload, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Button from './Button';

const AddToCartDrawer = ({ isOpen, onClose, product, withFabric }) => {
    const { profiles, addProfile, addToCart } = useCart();
    
    // Steps: 1 = Profile, 2 = Fabric (if applicable)
    const [step, setStep] = useState(1);
    const [selectedProfileId, setSelectedProfileId] = useState('');
    const [isCreatingProfile, setIsCreatingProfile] = useState(false);
    const [errors, setErrors] = useState({});
    
    // New Profile State
    const [newProfile, setNewProfile] = useState({
        name: '',
        phone: '',
        email: '',
        address: '',
        measurements: '' 
    });

    // Fabric State
    const [fabricDetails, setFabricDetails] = useState({
        fabricType: '',
        color: '',
        description: '',
        referenceImage: null
    });

    // Reset state when drawer opens
    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setSelectedProfileId(''); // Default to empty to force selection
            setIsCreatingProfile(false);
            setNewProfile({ name: '', phone: '', email: '', address: '', measurements: '' });
            setFabricDetails({ fabricType: '', color: '', description: '', referenceImage: null });
            setErrors({});
        }
    }, [isOpen, product]);

    const validateProfileCreation = () => {
        const newErrors = {};
        if (!newProfile.name.trim()) newErrors.name = 'Name is required';
        if (!newProfile.phone.trim()) newErrors.phone = 'Phone number is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleCreateProfile = async (e) => {
        e.preventDefault();
        if (!validateProfileCreation()) return;

        try {
            const created = await addProfile(newProfile);
            if (created && created._id) {
                setSelectedProfileId(created._id);
                setIsCreatingProfile(false);
                setErrors({});
            }
        } catch (error) {
            setErrors({ submit: error.message });
        }
    };

    const handleNext = () => {
        if (step === 1) {
            if (!selectedProfileId) {
                setErrors({ profile: 'Please select a profile to proceed.' });
                return;
            }
            // Clear profile error if resolved
            setErrors(prev => ({ ...prev, profile: null }));
        }

        if (withFabric) {
            if (step === 1) {
                setStep(2);
            } else {
                // If already on step 2, trying to submit
                handleAddToCart();
            }
        } else {
            handleAddToCart();
        }
    };

    const validateFabricDetails = () => {
        const newErrors = {};
        if (!fabricDetails.fabricType) newErrors.fabricType = 'Please select a fabric type.';
        if (!fabricDetails.color.trim()) newErrors.color = 'Please specify a color preference.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleAddToCart = () => {
        // Final validation before adding
        if (step === 1 && !selectedProfileId) {
             setErrors({ profile: 'Please select a profile to proceed.' });
             return;
        }

        if (withFabric && step === 2) {
             if (!validateFabricDetails()) return;
        }

        const customization = withFabric ? fabricDetails : null;
        addToCart(product, { withFabric }, selectedProfileId, customization);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[70] flex justify-end">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-brand-black/20 backdrop-blur-sm transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Drawer */}
            <div className="relative w-full max-w-md bg-brand-cream h-full shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
                
                {/* Header */}
                <div className="flex items-center justify-between p-6 bg-brand-coffee text-brand-tan shadow-md z-10">
                    <div className="flex items-center gap-3">
                        {step === 2 && (
                            <button onClick={() => setStep(1)} className="hover:text-white transition-colors">
                                <ArrowLeft size={20} />
                            </button>
                        )}
                        <div>
                            <h3 className="font-serif text-xl tracking-wide">
                                {step === 1 ? 'Select Profile' : 'Fabric Details'}
                            </h3>
                            <p className="text-[10px] uppercase tracking-wider opacity-70">
                                {withFabric ? `Step ${step} of 2` : 'Final Step'}
                            </p>
                        </div>
                    </div>
                    <button onClick={onClose} className="hover:text-white transition-colors"><X size={24} /></button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Product Summary */}
                    <div className="flex items-start gap-4 p-4 bg-white/50 border border-brand-brown/10 rounded-lg">
                        <img src={product?.image} alt={product?.name} className="w-16 h-20 object-cover rounded bg-brand-brown/5" />
                        <div>
                            <h4 className="font-serif text-brand-espresso text-lg leading-tight">{product?.name}</h4>
                            <p className="text-xs text-brand-taupe uppercase tracking-wider mt-1">{product?.category}</p>
                            <p className="font-serif text-brand-coffee mt-2">
                                ₹{withFabric ? (product.basePrice + product.fabricPrice) : product.basePrice}
                            </p>
                        </div>
                    </div>

                    {/* STEP 1: Profile Selection */}
                    {step === 1 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                            
                            {!isCreatingProfile ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-brand-rust uppercase tracking-wider mb-2">Who is this for? <span className="text-red-500">*</span></label>
                                        <div className="relative">
                                            <select 
                                                value={selectedProfileId} 
                                                onChange={(e) => {
                                                    setSelectedProfileId(e.target.value);
                                                    setErrors(prev => ({...prev, profile: null}));
                                                }}
                                                className={`w-full p-4 bg-white border ${errors.profile ? 'border-red-500' : 'border-brand-brown/20'} rounded-lg appearance-none focus:outline-none focus:border-brand-brown font-serif text-lg text-brand-coffee cursor-pointer transition-colors`}
                                            >
                                                <option value="" disabled>Select a profile...</option>
                                                {profiles.map(p => (
                                                    <option key={p.id} value={p.id}>{p.name} {p.isSelf ? '(You)' : ''}</option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-4 top-5 rotate-90 text-brand-taupe pointer-events-none" size={16} />
                                        </div>
                                        {errors.profile && (
                                            <p className="flex items-center gap-1 text-xs text-red-500 mt-2 font-medium animate-in fade-in slide-in-from-top-1">
                                                <AlertCircle size={12} /> {errors.profile}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <div className="h-px bg-brand-brown/10 flex-1"></div>
                                        <span className="text-xs text-brand-taupe uppercase tracking-widest">OR</span>
                                        <div className="h-px bg-brand-brown/10 flex-1"></div>
                                    </div>

                                    <button 
                                        onClick={() => setIsCreatingProfile(true)}
                                        className="w-full py-3 flex items-center justify-center gap-2 border border-dashed border-brand-brown/30 text-brand-brown hover:bg-brand-brown/5 hover:border-brand-brown rounded-lg transition-all font-bold text-xs uppercase tracking-wider"
                                    >
                                        <Plus size={16} /> Add New Person
                                    </button>
                                </>
                            ) : (
                                <div className="bg-white p-6 rounded-lg border border-brand-brown/20 shadow-sm animate-in zoom-in-95 duration-200">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="font-serif text-brand-espresso text-lg">New Profile</h4>
                                        <button onClick={() => setIsCreatingProfile(false)} className="text-xs text-brand-rust hover:underline">Cancel</button>
                                    </div>
                                    <form onSubmit={handleCreateProfile} className="space-y-4">
                                        <div>
                                            <label className="text-[10px] font-bold text-brand-taupe uppercase tracking-wider mb-1 block">Full Name <span className="text-red-500">*</span></label>
                                            <input 
                                                placeholder="e.g. Aditi Sharma" 
                                                className={`w-full p-3 bg-brand-cream/30 border ${errors.name ? 'border-red-500' : 'border-brand-brown/10'} rounded focus:border-brand-brown outline-none transition-colors`}
                                                value={newProfile.name}
                                                onChange={e => setNewProfile({...newProfile, name: e.target.value})}
                                            />
                                            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                                        </div>
                                        
                                        <div>
                                            <label className="text-[10px] font-bold text-brand-taupe uppercase tracking-wider mb-1 block">Phone Number <span className="text-red-500">*</span></label>
                                            <input 
                                                placeholder="+91 98765 43210" 
                                                className={`w-full p-3 bg-brand-cream/30 border ${errors.phone ? 'border-red-500' : 'border-brand-brown/10'} rounded focus:border-brand-brown outline-none transition-colors`}
                                                value={newProfile.phone}
                                                onChange={e => setNewProfile({...newProfile, phone: e.target.value})}
                                            />
                                            {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                                        </div>

                                        <div>
                                            <label className="text-[10px] font-bold text-brand-taupe uppercase tracking-wider mb-1 block">Email (Optional)</label>
                                            <input 
                                                placeholder="aditi@example.com" 
                                                className="w-full p-3 bg-brand-cream/30 border border-brand-brown/10 rounded focus:border-brand-brown outline-none"
                                                value={newProfile.email}
                                                onChange={e => setNewProfile({...newProfile, email: e.target.value})}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            {errors.submit && <p className="text-xs text-red-500 text-center font-medium">{errors.submit}</p>}
                                            <button type="submit" className="w-full py-3 bg-brand-coffee text-white rounded text-xs font-bold uppercase tracking-wider hover:bg-brand-espresso shadow-md active:scale-[0.98] transition-all">
                                                Save Profile
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 2: Fabric Details */}
                    {step === 2 && (
                        <div className="space-y-6 animate-in slide-in-from-right duration-300">
                             <div>
                                <label className="block text-xs font-bold text-brand-rust uppercase tracking-wider mb-2">Fabric Type <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <select 
                                        value={fabricDetails.fabricType}
                                        onChange={(e) => {
                                            setFabricDetails({...fabricDetails, fabricType: e.target.value});
                                            setErrors(prev => ({...prev, fabricType: null}));
                                        }}
                                        className={`w-full p-3 pl-10 bg-white border ${errors.fabricType ? 'border-red-500' : 'border-brand-brown/20'} rounded-lg appearance-none focus:outline-none focus:border-brand-brown font-serif transition-colors`}
                                    >
                                        <option value="" disabled>Select a Fabric...</option>
                                        <option value="Cotton">Cotton</option>
                                        <option value="Linen">Linen</option>
                                        <option value="Wool">Wool</option>
                                        <option value="Silk">Silk</option>
                                        <option value="Velvet">Velvet</option>
                                    </select>
                                    <Scissors className="absolute left-3 top-3.5 text-brand-taupe pointer-events-none" size={16} />
                                </div>
                                {errors.fabricType && <p className="text-xs text-red-500 mt-1">{errors.fabricType}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-rust uppercase tracking-wider mb-2">Color Preference <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <input 
                                        type="text"
                                        placeholder="e.g. Navy Blue"
                                        value={fabricDetails.color}
                                        onChange={(e) => {
                                            setFabricDetails({...fabricDetails, color: e.target.value});
                                            setErrors(prev => ({...prev, color: null}));
                                        }}
                                        className={`w-full p-3 pl-10 bg-white border ${errors.color ? 'border-red-500' : 'border-brand-brown/20'} rounded-lg focus:outline-none focus:border-brand-brown font-serif transition-colors`}
                                    />
                                    <Palette className="absolute left-3 top-3.5 text-brand-taupe pointer-events-none" size={16} />
                                </div>
                                {errors.color && <p className="text-xs text-red-500 mt-1">{errors.color}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-rust uppercase tracking-wider mb-2">Reference Image (Optional)</label>
                                <div 
                                    className="border border-dashed border-brand-brown/30 rounded-lg p-6 bg-white/50 flex flex-col items-center justify-center text-brand-taupe hover:bg-brand-brown/5 transition-colors cursor-pointer group"
                                    onClick={() => document.getElementById('ref-image-upload').click()}
                                >
                                    <Upload size={24} className="mb-2 opacity-50 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">
                                        {fabricDetails.referenceImage ? fabricDetails.referenceImage.name : 'Upload Image'}
                                    </span>
                                    <input 
                                        id="ref-image-upload"
                                        type="file" 
                                        accept="image/*"
                                        className="hidden"
                                        onChange={(e) => {
                                            if (e.target.files?.[0]) {
                                                setFabricDetails(prev => ({ ...prev, referenceImage: e.target.files[0] }));
                                            }
                                        }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-brand-rust uppercase tracking-wider mb-2">Additional Notes</label>
                                <textarea 
                                    placeholder="Any specific patterns or details..."
                                    value={fabricDetails.description}
                                    onChange={(e) => setFabricDetails({...fabricDetails, description: e.target.value})}
                                    className="w-full p-3 bg-white border border-brand-brown/20 rounded-lg focus:outline-none focus:border-brand-brown font-serif h-24 resize-none"
                                />
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white border-t border-brand-brown/10 z-10">
                    <Button 
                        variant="primary" 
                        onClick={handleNext}
                        className="w-full py-4 text-sm"
                    >
                        {withFabric && step === 1 ? (
                            <span className="flex items-center gap-2 justify-center">Next: Fabric Details <ChevronRight size={16} /></span>
                        ) : (
                            <span className="flex items-center gap-2 justify-center">Confirm & Add to Cart <Check size={16} /></span>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default AddToCartDrawer;
