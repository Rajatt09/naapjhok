import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
// import authHero from '../assets/auth_hero.png';
import authHero from '../assets/auth_hero.png';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) setError('');
    };

    const validate = () => {
        if (!formData.email || !formData.password) {
            setError('Please fill in all fields');
            return false;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
             setError('Please enter a valid email address');
             return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        
        setIsLoading(true);
        const res = await login(formData.email, formData.password);
        setIsLoading(false);

        if (res.success) {
            navigate('/');
        } else {
            setError(res.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-brand-cream">
            {/* Left Side - Image */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                <img 
                    src={authHero} 
                    alt="Luxury Fabric" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-espresso/40 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex flex-col justify-end p-16 text-white">
                    <h1 className="font-serif text-5xl mb-4 leading-tight">Crafting Elegance,<br/>Tailored for You.</h1>
                    <p className="text-brand-cream/80 text-lg max-w-md font-light">Experience the seamless blend of tradition and modernity with our bespoke tailoring services.</p>
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
                        <h2 className="text-4xl font-serif text-brand-espresso mb-2">Welcome Back !!</h2>
                        <p className="text-brand-taupe">Sign in to access your measurements and orders.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-100 flex items-center gap-2 animate-in slide-in-from-top-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                             {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-4">
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
                                    <Lock size={20} />
                                </div>
                                <input 
                                    type="password" 
                                    name="password" 
                                    value={formData.password} 
                                    onChange={handleChange} 
                                    placeholder="Password"
                                    className="w-full pl-12 pr-4 py-3.5 bg-white border border-brand-brown/20 rounded-lg outline-none focus:border-brand-coffee focus:ring-1 focus:ring-brand-coffee transition-all text-brand-espresso placeholder-brand-taupe/50"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-brand-taupe hover:text-brand-coffee transition-colors">
                                <input type="checkbox" className="rounded border-brand-brown/30 text-brand-coffee focus:ring-brand-coffee" />
                                <span>Remember me</span>
                            </label>
                            <a href="#" className="font-medium text-brand-rust hover:text-brand-brown transition-colors">Forgot password?</a>
                        </div>

                        <Button 
                            variant="primary" 
                            className="w-full py-4 text-sm font-bold tracking-widest uppercase hover:shadow-lg transition-all flex flex-col items-center justify-center gap-1 cursor-pointer"
                            disabled={isLoading}
                        >
                            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Sign In</span></>}
                        </Button>
                    </form>

                    <div className="text-center text-sm text-brand-taupe pt-4">
                        Don't have an account? 
                        <Link to="/signup" className="font-bold text-brand-coffee hover:text-brand-rust ml-1 transition-colors">
                            Create Account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
