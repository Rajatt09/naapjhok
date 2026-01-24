import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { User, Phone, Plus, MapPin, LogOut, Settings, Trash2, ShoppingBag, ChevronRight, Clock, Package, Mail, Save, X } from 'lucide-react';
import Button from '../components/Button';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import api

const Profile = () => {
    const { user, logout } = useAuth();
    const { profiles, addProfile, updateProfile, deleteProfile } = useCart();
    const navigate = useNavigate();

    const [activeProfileId, setActiveProfileId] = useState('me');
    const [activeProfileName, setActiveProfileName] = useState('me');
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);
    
    // UI States
    const [isAddingProfile, setIsAddingProfile] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    
    // Form States
    const [newProfileData, setNewProfileData] = useState({ name: '', phone: '', email: '', location: '' });
    const [editFormData, setEditFormData] = useState({ name: '', phone: '', email: '', location: '' });
    const [errors, setErrors] = useState({});

    // Active Profile Object (handle MongoDB _id)
    const activeProfile = profiles.find(p => p._id === activeProfileId) || profiles[0] || { _id: 'me', name: 'Me', isSelf: true };

    // Reset edit state when changing profiles
    useEffect(() => {
        setIsEditing(false);
        setErrors({});
    }, [activeProfileId]);

    // Fetch Orders on Mount
    useEffect(() => {
        const fetchOrders = async () => {
            setLoadingOrders(true);
            try {
                const res = await api.get('/orders');
                // The backend returns: { status: 'success', data: { orders: [...] } }
                const fetchedOrders = res.data.data?.orders || [];
                console.log("Fetched Orders:", fetchedOrders);
                console.log("profiles are: ", profiles);
                setOrders(fetchedOrders);
            } catch (error) {
                console.error("Error fetching orders:", error);
                setOrders([]);
            } finally {
                setLoadingOrders(false);
            }
        };
        fetchOrders();
    }, []);

    // Filter Orders for Active Profile
    // Filter Orders for Active Profile
    const activeProfileOrders = orders.filter(order => {
         // Normalize IDs to string to avoid ObjectId vs String issues
        const orderPid = String(order.profileId || 'me'); 
       
        const activePid = String(activeProfileName || 'me');
        console.log("..................................");
        console.log("Order PID:", orderPid);
        console.log("Active PID:", activePid);
        console.log("order is: ", order);
        console.log("..................................");
        return orderPid === activePid;
    });

    // Validation Helper
    const validate = (data) => {
        const newErrors = {};
        if (!data.name.trim()) newErrors.name = 'Name is required';
        if (!data.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^\d{10}$/.test(data.phone.replace(/\D/g,''))) newErrors.phone = 'Enter valid 10-digit phone';
        if (!data.location.trim()) newErrors.location = 'Location is required';
        if (data.email && !/\S+@\S+\.\S+/.test(data.email)) newErrors.email = 'Invalid email format';
        
        return newErrors;
    };

    const handleAddProfile = async (e) => {
        e.preventDefault();
        const validationErrors = validate(newProfileData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            const newP = await addProfile({ ...newProfileData, isSelf: false });
            if (newP && newP._id) {
                setActiveProfileId(newP._id);
            }
            setNewProfileData({ name: '', phone: '', email: '', location: '' });
            setIsAddingProfile(false);
            setErrors({});
        } catch (err) {
            setErrors({ name: err.message }); // Or general error
        }
    };

    const handleEditToggle = () => {
        if (!isEditing) {
            // Enter edit mode: populate form
            setEditFormData({
                name: activeProfile.name || '',
                phone: activeProfile.phone || '',
                email: activeProfile.email || '',
                location: activeProfile.location || '' // Ensure backend supports location or map it
            });
        }
        setIsEditing(!isEditing);
        setErrors({});
    };

    const handleSaveEdit = async () => {
        const validationErrors = validate(editFormData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        await updateProfile(activeProfileId, editFormData);
        setIsEditing(false);
    };

    const triggerDelete = () => {
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        deleteProfile(activeProfileId);
        setActiveProfileId('me');
        setShowDeleteModal(false);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-brand-cream pt-32 pb-20 px-4">
            <DeleteConfirmationModal 
                isOpen={showDeleteModal} 
                onClose={() => setShowDeleteModal(false)} 
                onConfirm={confirmDelete}
                profileName={activeProfile.name}
            />
            
            <div className="container-custom max-w-7xl">
                
                {/* Header with Logout */}
                <div className="flex justify-between items-end mb-8 border-b border-brand-brown/10 pb-6">
                    <div>
                        <h1 className="text-4xl font-serif text-brand-espresso mb-1">My Dashboard</h1>
                        <p className="text-brand-taupe">Manage profiles and view specific order history.</p>
                    </div>
                    <button onClick={handleLogout} className="text-brand-coffee hover:text-red-600 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wider cursor-pointer">
                        <LogOut size={16} /> Logout
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                    
                    {/* LEFT SIDEBAR: PROFILE LIST */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-2xl shadow-lg border border-brand-brown/10 overflow-hidden">
                            <div className="p-6 bg-brand-coffee text-brand-cream flex justify-between items-center">
                                <h3 className="font-serif text-xl">Profiles</h3>
                                <button onClick={() => setIsAddingProfile(!isAddingProfile)} className="text-brand-cream/80 hover:text-white transition-colors cursor-pointer">
                                    <Plus size={20} className={isAddingProfile ? "rotate-45 transition-transform" : "transition-transform"} />
                                </button>
                            </div>
                            
                            {/* Add Profile Form */}
                            {isAddingProfile && (
                                <div className="p-4 bg-brand-cream/50 border-b border-brand-brown/10 animate-in slide-in-from-top-2">
                                    <h4 className="text-xs font-bold uppercase text-brand-coffee mb-3">New Profile Details</h4>
                                    <div className="space-y-3">
                                        <div>
                                            <input 
                                                type="text" 
                                                value={newProfileData.name}
                                                onChange={(e) => setNewProfileData({...newProfileData, name: e.target.value})}
                                                placeholder="Name *" 
                                                className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.name ? 'border-red-400' : 'border-brand-brown/20'}`}
                                            />
                                            {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <input 
                                                type="text" 
                                                value={newProfileData.phone}
                                                onChange={(e) => setNewProfileData({...newProfileData, phone: e.target.value})}
                                                placeholder="Phone *" 
                                                className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.phone ? 'border-red-400' : 'border-brand-brown/20'}`}
                                            />
                                            {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <input 
                                                type="email" 
                                                value={newProfileData.email}
                                                onChange={(e) => setNewProfileData({...newProfileData, email: e.target.value})}
                                                placeholder="Email" 
                                                className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.email ? 'border-red-400' : 'border-brand-brown/20'}`}
                                            />
                                            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <input 
                                                type="text" 
                                                value={newProfileData.location}
                                                onChange={(e) => setNewProfileData({...newProfileData, location: e.target.value})}
                                                placeholder="Location (City/Area) *" 
                                                className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.location ? 'border-red-400' : 'border-brand-brown/20'}`}
                                            />
                                            {errors.location && <p className="text-red-500 text-[10px] mt-1">{errors.location}</p>}
                                        </div>
                                        <Button onClick={handleAddProfile} variant="primary" className="w-full text-xs py-2 cursor-pointer">Add Profile</Button>
                                    </div>
                                </div>
                            )}

                            <div className="divide-y divide-brand-brown/5">
                                {profiles.map(profile => (
                                    <button
                                        key={profile._id}
                                        onClick={() => {
                                            setActiveProfileName(profile.name);
                                            setActiveProfileId(profile._id)
                                        }}
                                        className={`w-full text-left p-4 flex items-center gap-4 transition-all cursor-pointer ${
                                            activeProfileId === profile._id 
                                            ? 'bg-brand-brown/5 border-l-4 border-brand-coffee' 
                                            : 'hover:bg-brand-cream/50 border-l-4 border-transparent'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-lg ${
                                            activeProfileId === profile._id ? 'bg-brand-coffee text-white' : 'bg-brand-cream text-brand-coffee'
                                        }`}>
                                            {profile.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className={`font-bold text-sm ${activeProfileId === profile._id ? 'text-brand-espresso' : 'text-brand-coffee'}`}>
                                                {profile.name} {profile.isSelf && '(You)'}
                                            </h4>
                                            <p className="text-[10px] text-brand-taupe uppercase tracking-wider">
                                                {profile.isSelf ? 'Primary Account' : 'Measurement Profile'}
                                            </p>
                                        </div>
                                        {activeProfileId === profile._id && <ChevronRight size={16} className="text-brand-rust" />}
                                    </button>
                                ))}
                            </div>
                        </div>

                         <div className="bg-white rounded-xl shadow border border-brand-brown/10 p-2">
                            <button className="w-full text-left p-3 hover:bg-brand-cream/50 transition-colors flex items-center gap-3 text-brand-coffee/80 text-sm cursor-pointer rounded-lg">
                                <Settings size={16} /> Account Settings
                            </button>
                        </div>
                    </div>

                    {/* RIGHT CONTENT: ACTIVE PROFILE DETAILS */}
                    <div className="lg:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500" key={activeProfileId}>
                        
                        {/* Selected Profile Header / Edit Form */}
                        <div className="bg-white rounded-2xl shadow border border-brand-brown/10 p-6 relative overflow-hidden">
                            {!isEditing ? (
                                // VIEW MODE
                                <div className="flex flex-col md:flex-row md:items-center gap-6">
                                     <div className="w-20 h-20 bg-brand-coffee text-brand-cream rounded-full flex items-center justify-center text-4xl font-serif shadow-lg shrink-0">
                                         {activeProfile.name.charAt(0)}
                                     </div>
                                     <div className="flex-1 space-y-2">
                                         <div className="flex items-start justify-between">
                                             <div>
                                                 <h2 className="text-3xl font-serif text-brand-espresso">{activeProfile.name}</h2>
                                                 <p className="text-brand-taupe flex items-center gap-2 text-sm mt-1">
                                                     <User size={14} /> {activeProfile.isSelf ? 'Personal Profile' : 'Sub-profile'}
                                                 </p>
                                             </div>
                                             {/* Actions */}
                                             <div className="flex gap-2">
                                                 <Button onClick={handleEditToggle} variant="outline" className="text-xs py-2 px-3 h-9 border-brand-brown/20 text-brand-taupe hover:border-brand-coffee hover:text-brand-coffee cursor-pointer">
                                                    Edit Details
                                                 </Button>
                                                 {!activeProfile.isSelf && (
                                                     <button onClick={triggerDelete} className="h-9 w-9 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer" title="Delete Profile">
                                                         <Trash2 size={16} />
                                                     </button>
                                                 )}
                                             </div>

                                         </div>
                                         
                                         {/* Details Grid */}
                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-brand-brown/5">
                                             <p className="flex items-center gap-2 text-brand-coffee text-sm">
                                                 <Phone size={14} className="text-brand-taupe" />
                                                 {activeProfile.phone || <span className="text-brand-taupe italic">No phone added</span>}
                                             </p>
                                             <p className="flex items-center gap-2 text-brand-coffee text-sm">
                                                 <Mail size={14} className="text-brand-taupe" />
                                                 {activeProfile.email || <span className="text-brand-taupe italic">No email added</span>}
                                             </p>
                                             <p className="flex items-center gap-2 text-brand-coffee text-sm">
                                                 <MapPin size={14} className="text-brand-taupe" />
                                                 {activeProfile.location || <span className="text-brand-taupe italic">No location added</span>}
                                             </p>
                                         </div>
                                     </div>
                                </div>
                            ) : (
                                // EDIT MODE
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center mb-2 pb-2 border-b border-brand-brown/10">
                                        <h3 className="font-serif text-xl text-brand-espresso">Edit Profile</h3>
                                        <button onClick={handleEditToggle} className="text-brand-taupe hover:text-brand-coffee cursor-pointer">
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-brand-taupe uppercase mb-1 block">Name</label>
                                            <input 
                                                type="text" 
                                                value={editFormData.name}
                                                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                                className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.name ? 'border-red-400' : 'border-brand-brown/20'}`}
                                            />
                                            {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-brand-taupe uppercase mb-1 block">Phone</label>
                                            <input 
                                                type="text" 
                                                value={editFormData.phone}
                                                onChange={(e) => setEditFormData({...editFormData, phone: e.target.value})}
                                                className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.phone ? 'border-red-400' : 'border-brand-brown/20'}`}
                                            />
                                            {errors.phone && <p className="text-red-500 text-[10px] mt-1">{errors.phone}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-brand-taupe uppercase mb-1 block">Email</label>
                                            <input 
                                                type="email" 
                                                value={editFormData.email}
                                                onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                                className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.email ? 'border-red-400' : 'border-brand-brown/20'}`}
                                            />
                                            {errors.email && <p className="text-red-500 text-[10px] mt-1">{errors.email}</p>}
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-brand-taupe uppercase mb-1 block">Location</label>
                                            <input 
                                                type="text" 
                                                value={editFormData.location}
                                                onChange={(e) => setEditFormData({...editFormData, location: e.target.value})}
                                                className={`w-full p-2 text-sm border rounded-md outline-none focus:border-brand-coffee ${errors.location ? 'border-red-400' : 'border-brand-brown/20'}`}
                                            />
                                            {errors.location && <p className="text-red-500 text-[10px] mt-1">{errors.location}</p>}
                                        </div>
                                    </div>
                                    <div className="flex gap-3 justify-end pt-2">
                                        <Button onClick={handleEditToggle} variant="outline" className="text-xs py-2 px-4 cursor-pointer">Cancel</Button>
                                        <Button onClick={handleSaveEdit} variant="primary" className="text-xs py-2 px-6 cursor-pointer">Save Changes</Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order History Section */}
                        <div>
                            <h3 className="text-xl font-serif text-brand-espresso mb-6 flex items-center gap-2">
                                <Clock size={20} /> Order History
                            </h3>

                            {loadingOrders ? (
                                <div className="text-center py-12 text-brand-taupe">Loading orders...</div>
                            ) : activeProfileOrders.length > 0 ? (
                                <div className="space-y-4">
                                    {activeProfileOrders.map(order => (
                                        <div key={order._id} className="bg-white rounded-xl p-6 border border-brand-brown/10 shadow-sm hover:shadow-md transition-shadow group">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4 pb-4 border-b border-brand-brown/5">
                                                <div>
                                                    <p className="text-[10px] text-brand-taupe uppercase tracking-widest mb-1">Order #{order._id.slice(-6).toUpperCase()}</p>
                                                    <h4 className="font-serif text-lg text-brand-espresso">
                                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                                            day: 'numeric', month: 'long', year: 'numeric'
                                                        })}
                                                    </h4>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                                                        order.status === 'Pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                                                        order.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                                                        'bg-gray-50 text-gray-600 border-gray-200'
                                                    }`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="font-serif text-xl text-brand-coffee">₹{order.totalAmount}</span>
                                                </div>
                                            </div>
                                            
                                            {/* Order Items Preview */}
                                            <div className="space-y-3">
                                                {order.items.map((item, idx) => (
                                                    <div key={idx} className="flex items-center gap-4">
                                                        <div className="w-10 h-12 bg-brand-cream rounded overflow-hidden">
                                                            <div className="w-full h-full bg-brand-brown/10 flex items-center justify-center">
                                                                <Package size={16} className="text-brand-taupe/50"/>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-sm font-bold text-brand-coffee">{item.product?.name || 'Custom Garment'}</p>
                                                            <p className="text-xs text-brand-taupe">{item.withFabric ? '+ Fabric Included' : 'Stitching Only'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-4 pt-4 border-t border-brand-brown/5 flex justify-end">
                                                <button className="text-xs font-bold text-brand-rust uppercase tracking-wider hover:text-brand-brown transition-colors cursor-pointer">
                                                    View Details
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-brand-cream/30 border border-brand-brown/5 rounded-xl p-12 text-center">
                                    <div className="w-16 h-16 bg-brand-brown/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-taupe">
                                        <ShoppingBag size={24} />
                                    </div>
                                    <h4 className="font-serif text-lg text-brand-coffee mb-2">No Previous Orders</h4>
                                    <p className="text-brand-taupe text-sm mb-6 max-w-xs mx-auto">
                                        There are no completed orders linked to <strong>{activeProfile.name}</strong> yet.
                                    </p>
                                    <Button onClick={() => navigate('/products')} variant="primary" className="text-xs py-3 px-6 cursor-pointer">
                                        Browse Collection
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
