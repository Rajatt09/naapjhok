import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { User, Mail, Phone, Lock, ArrowRight, Loader2 } from 'lucide-react';
import authHero from '../assets/auth_hero.png';

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const validate = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password) {
            setError('All fields are required');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
             setError('Please enter a valid email address');
             return false;
        }
        if (!/^\d{10}$/.test(formData.phone.replace(/\D/g,''))) {
            setError('Please enter a valid 10-digit phone number');
            return false;
        }
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsLoading(true);
        const res = await signup(formData);
        setIsLoading(false);

        if (res.success) {
            navigate('/');
        } else {
            console.log(res);
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-brand-cream">
             {/* Left Side - Image */}
             <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <img 
                    src={authHero} 
                    alt="Luxury Interior" 
                    className="absolute inset-0 w-full h-full object-cover transform scale-x-[-1]"
                />
                <div className="absolute inset-0 bg-brand-espresso/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-16 text-white text-right">
                    <h1 className="font-serif text-5xl mb-4 leading-tight">Begin Your<br/>Bespoke Journey.</h1>
                    <p className="text-brand-cream/80 text-lg ml-auto max-w-md font-light">Join our exclusive community and experience tailoring that understands you.</p>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative">
                 {/* Mobile Background Helper */}
                 <div className="absolute inset-0 lg:hidden z-0">
                    <img src={authHero} alt="Background" className="w-full h-full object-cover opacity-10" />
                 </div>

                <div className="w-full max-w-md space-y-8 relative z-10">
                    <div className="text-center lg:text-left">
                        <h2 className="text-4xl md:mt-8 font-serif text-brand-espresso mb-2">Create Account</h2>
                        <p className="text-brand-taupe">Enter your details to register.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                             {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                         <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-brand-taupe group-focus-within:text-brand-coffee transition-colors">
                                <User size={20} />
                            </div>
                            <input 
                                type="text" 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                placeholder="Full Name"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-brand-brown/20 rounded-lg outline-none focus:border-brand-coffee focus:ring-1 focus:ring-brand-coffee transition-all text-brand-espresso placeholder-brand-taupe/50"
                            />
                        </div>

                        <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-brand-taupe group-focus-within:text-brand-coffee transition-colors">
                                <Mail size={20} />
                            </div>
                            <input 
                                type="email" 
                                name="email" 
                                value={formData.email} 
                                onChange={handleChange} 
                                placeholder="Email Address"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-brand-brown/20 rounded-lg outline-none focus:border-brand-coffee focus:ring-1 focus:ring-brand-coffee transition-all text-brand-espresso placeholder-brand-taupe/50"
                            />
                        </div>

                         <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-brand-taupe group-focus-within:text-brand-coffee transition-colors">
                                <Phone size={20} />
                            </div>
                            <input 
                                type="tel" 
                                name="phone" 
                                value={formData.phone} 
                                onChange={handleChange} 
                                placeholder="Phone Number"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-brand-brown/20 rounded-lg outline-none focus:border-brand-coffee focus:ring-1 focus:ring-brand-coffee transition-all text-brand-espresso placeholder-brand-taupe/50"
                            />
                        </div>
                        
                        <div className="relative group">
                            <div className="absolute left-4 top-3.5 text-brand-taupe group-focus-within:text-brand-coffee transition-colors">
                                <Lock size={20} />
                            </div>
                            <input 
                                type="password" 
                                name="password" 
                                value={formData.password} 
                                onChange={handleChange} 
                                placeholder="Password (min 6 chars)"
                                className="w-full pl-12 pr-4 py-3.5 bg-white border border-brand-brown/20 rounded-lg outline-none focus:border-brand-coffee focus:ring-1 focus:ring-brand-coffee transition-all text-brand-espresso placeholder-brand-taupe/50"
                            />
                        </div>

                        <div className="pt-2">
                             <Button 
                                variant="primary" 
                                className="w-full py-4 text-sm font-bold tracking-widest uppercase hover:shadow-lg transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Create Account</span></>}
                            </Button>
                        </div>
                    </form>

                    <div className="text-center text-sm text-brand-taupe pt-2">
                        Already have an account? 
                        <Link to="/login" className="font-bold text-brand-coffee hover:text-brand-rust ml-1 transition-colors">
                            Sign In
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
