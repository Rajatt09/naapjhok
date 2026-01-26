import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scissors, Ruler, Truck, ChevronRight, ChevronDown, ChevronUp, Star, Instagram, Linkedin, MessageCircle, User } from 'lucide-react';
import coat from "../assets/coat.png";
import stitching from "../assets/mixkit.mp4";

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="w-full bg-brand-cream">
            {/* ... (Previous Sections remain unchanged) ... */}
            
            {/* 1. HERO SECTION - Cinematic & Immersive */}
            <section className="relative h-screen w-full overflow-hidden" id="home">
                 {/* Video Background */}
                 <div className="absolute inset-0 w-full h-full">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90">
                        <source src={stitching} type="video/mp4" />
                    </video>
                    {/* Dark/Warm Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-brand-black/30 via-brand-coffee/20 to-brand-coffee/60 mix-blend-multiply"></div>
                </div>
                
                {/* Hero Content */}
                <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
                    <div className="border-t border-b border-brand-cream/30 py-8 px-12 backdrop-blur-sm bg-brand-coffee/10">
                        <p className="text-brand-cream font-sans tracking-[0.3em] uppercase text-xs md:text-sm mb-4">
                            The Art of Bespoke Tailoring
                        </p>
                        <h1 className="text-6xl md:text-9xl font-serif text-brand-cream mb-6 italic tracking-tight drop-shadow-2xl">
                            Stitch my <br/><span className="not-italic">Happiness.</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-brand-beige font-serif font-light italic max-w-2xl mx-auto mb-10">
                            "Where your measurements meet our masterpiece."
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <button onClick={() => navigate('/book-appointment')} className="px-10 py-4 cursor-pointer bg-brand-cream text-brand-coffee font-sans uppercase tracking-[2px] text-xs font-bold hover:bg-brand-tan transition-colors duration-300">
                                Book Appointment
                            </button>
                            <button onClick={() => navigate('/products')} className="px-10 py-4 cursor-pointer bg-transparent border border-brand-cream text-brand-cream font-sans uppercase tracking-[2px] text-xs font-bold hover:bg-brand-cream hover:text-brand-coffee transition-colors duration-300">
                                View Collection
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. PHILOSOPHY STRIP - Dark Contrast */}
            <section className="bg-brand-coffee py-16 px-6" id="why-naapjhok">
                <div className="container-custom flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                    <div className="max-w-xl">
                        <h2 className="text-3xl md:text-4xl text-brand-beige mb-2">Redefining Elegance</h2>
                        <p className="text-brand-tan/80 font-light leading-relaxed">
                            We don't just stitch clothes; we craft an identity. Experience the luxury of a suit made exclusively for you, from the comfort of your home.
                        </p>
                    </div>
                    <div className="flex gap-8 border-l border-brand-tan/20 pl-8">
                        <div>
                            <h3 className="text-4xl font-serif text-brand-rust">100%</h3>
                            <p className="text-xs text-brand-tan uppercase tracking-widest mt-1">Fit Guarantee</p>
                        </div>
                        <div>
                            <h3 className="text-4xl font-serif text-brand-rust">07</h3>
                            <p className="text-xs text-brand-tan uppercase tracking-widest mt-1">Days Delivery</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. THE BESPOKE PROCESS - Editorial Grid */}
            <section className="py-24 bg-brand-beige/30" id="how-it-works">
                <div className="container-custom relative">
                    <div className="text-center mb-20 max-w-4xl mx-auto">
                        <span className="text-brand-brown font-sans text-xs uppercase tracking-[0.2em] block mb-6">How It Works</span>
                        
                        {/* Narrative Intro */}
                        <h2 className="text-4xl md:text-5xl font-serif text-brand-coffee leading-tight mb-8">
                            "Standard sizes fit everyone, <br/> yet fit nobody <span className="italic text-brand-brown">Perfectly.</span>"
                        </h2>
                        
                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-brand-brown/80 font-sans text-sm tracking-wide mb-12">
                            <span>We digitize the process</span>
                            <span className="hidden md:inline text-brand-rust">→</span>
                            <span className="font-serif italic text-lg text-brand-coffee">but keep the “मास्टर जी” touch.</span>
                            <span className="hidden md:inline text-brand-rust">→</span>
                            <span>Your perfect fit at your Convenience.</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Step 1 */}
                        <div className="group bg-white p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(44,36,30,0.1)] border-t-4 border-brand-coffee transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(44,36,30,0.2)] relative overflow-hidden">
                            <span className="absolute -right-4 -bottom-8 text-[12rem] font-serif text-brand-coffee/[0.03] leading-none select-none group-hover:text-brand-coffee/[0.06] transition-colors duration-500">1</span>
                            
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-full bg-brand-cream border border-brand-coffee/20 flex items-center justify-center mb-8 text-brand-brown group-hover:scale-110 group-hover:border-brand-rust transition-all duration-500">
                                    <Star size={28} strokeWidth={1} /> 
                                </div>
                                <h3 className="text-2xl font-serif text-brand-coffee mb-4 group-hover:text-brand-brown transition-colors">Book Your Slot</h3>
                                <p className="text-brand-coffee/70 text-sm leading-relaxed mb-6">
                                    Schedule your home visit online by selecting a time into our calendar. Whether you have your own fabric or wish to explore our luxury swatch book.
                                </p>
                                <div className="w-12 h-[1px] bg-brand-coffee/20 group-hover:w-full group-hover:bg-brand-rust transition-all duration-700"></div>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="group bg-white p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(44,36,30,0.1)] border-t-4 border-brand-rust transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(44,36,30,0.2)] relative overflow-hidden">
                             <span className="absolute -right-4 -bottom-8 text-[12rem] font-serif text-brand-coffee/[0.03] leading-none select-none group-hover:text-brand-coffee/[0.06] transition-colors duration-500">2</span>
                            
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-full bg-brand-cream border border-brand-rust/30 flex items-center justify-center mb-8 text-brand-rust group-hover:scale-110 group-hover:border-brand-brown transition-all duration-500">
                                    <Ruler size={28} strokeWidth={1} />
                                </div>
                                <h3 className="text-2xl font-serif text-brand-coffee mb-4 group-hover:text-brand-brown transition-colors">The Master Visit</h3>
                                <p className="text-brand-coffee/70 text-sm leading-relaxed mb-6">
                                    Our Master Tailor arrives for a styling session to finalize your fabric selection and design details while taking precision measurements for a flawless silhouette.
                                </p>
                                <div className="w-12 h-[1px] bg-brand-rust/20 group-hover:w-full group-hover:bg-brand-brown transition-all duration-700"></div>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="group bg-white p-8 md:p-12 shadow-[0_10px_40px_-15px_rgba(44,36,30,0.1)] border-t-4 border-brand-coffee transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_60px_-15px_rgba(44,36,30,0.2)] relative overflow-hidden">
                             <span className="absolute -right-4 -bottom-8 text-[12rem] font-serif text-brand-coffee/[0.03] leading-none select-none group-hover:text-brand-coffee/[0.06] transition-colors duration-500">3</span>
                            
                            <div className="relative z-10">
                                <div className="w-16 h-16 rounded-full bg-brand-cream border border-brand-coffee/20 flex items-center justify-center mb-8 text-brand-brown group-hover:scale-110 group-hover:border-brand-rust transition-all duration-500">
                                    <Truck size={28} strokeWidth={1} />
                                </div>
                                <h3 className="text-2xl font-serif text-brand-coffee mb-4 group-hover:text-brand-brown transition-colors">Hand-Delivered Trial</h3>
                                <p className="text-brand-coffee/70 text-sm leading-relaxed mb-6">
                                    Our Master Tailor personally returns with your finished garment for a live trial to ensure a perfect fit with any final adjustments handled on the spot.
                                </p>
                                <div className="w-12 h-[1px] bg-brand-coffee/20 group-hover:w-full group-hover:bg-brand-rust transition-all duration-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. STORIES & WHY NAAPJHOK - The Soul & The Logic */}
            <section className="py-24 bg-brand-coffee text-brand-beige overflow-hidden relative" id="stories">
                {/* Background Pattern/Texture */}
                <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                
                <div className="container-custom relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        
                        {/* Left: Masterji ke Kisse (The Story) */}
                        <div className="lg:w-1/2 relative">
                            <div className="relative z-10">
                                <span className="text-brand-rust font-sans text-xs uppercase tracking-[0.3em] mb-4 block">Masterji ke Kisse</span>
                                <h2 className="text-4xl md:text-5xl font-serif text-brand-cream mb-6 leading-tight">
                                    "The Golden Scissors <br/> <span className="italic text-brand-tan opacity-70">of 1985.</span>"
                                </h2>
                                <p className="text-brand-beige/80 text-lg font-serif italic leading-relaxed mb-6 border-l-2 border-brand-rust pl-6">
                                    "They said he could measure a man with a glance. Masterji Ramlal didn't just stitch suits; he stitched confidence. For 40 years, his hands have defined the silhouette of Delhi's elite. Today, he heads our Quality Council."
                                </p>
                                <button className="text-sm cursor-pointer font-bold uppercase tracking-widest border-b border-brand-rust pb-1 text-brand-rust hover:text-brand-cream transition-colors">
                                    Read Full Journal - To be released soon :)
                                </button>
                            </div>
                            
                            {/* Abstract layered images */}
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-brown/20 rounded-full blur-3xl -z-10"></div>
                        </div>

                        {/* Right: Why Naapjhok (The Logic) */}
                        <div className="lg:w-1/2 bg-brand-cream/5 backdrop-blur-sm p-8 md:p-12 border border-brand-cream/10 rounded-sm">
                            <h3 className="text-2xl font-serif text-brand-cream mb-8">Why Naapjhok?</h3>
                            
                            <div className="space-y-8">
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 flex-shrink-0 bg-brand-rust/20 text-brand-rust flex items-center justify-center rounded-full group-hover:bg-brand-rust group-hover:text-brand-coffee transition-all duration-300">
                                        <Scissors size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-brand-cream text-lg font-serif mb-1 group-hover:translate-x-1 transition-transform">Legacy Certified</h4>
                                        <p className="text-brand-beige/60 text-sm leading-relaxed">Every garment is vetted by Master Tailors with 20+ years of experience, not just machines.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                     <div className="w-12 h-12 flex-shrink-0 bg-brand-rust/20 text-brand-rust flex items-center justify-center rounded-full group-hover:bg-brand-rust group-hover:text-brand-coffee transition-all duration-300">
                                        <Ruler size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-brand-cream text-lg font-serif mb-1 group-hover:translate-x-1 transition-transform">Virtual + Physical</h4>
                                        <p className="text-brand-beige/60 text-sm leading-relaxed">Book online, but get measured in person. The convenience of tech with the accuracy of touch.</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                     <div className="w-12 h-12 flex-shrink-0 bg-brand-rust/20 text-brand-rust flex items-center justify-center rounded-full group-hover:bg-brand-rust group-hover:text-brand-coffee transition-all duration-300">
                                        <Truck size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-brand-cream text-lg font-serif mb-1 group-hover:translate-x-1 transition-transform">End-to-End Ownership</h4>
                                        <p className="text-brand-beige/60 text-sm leading-relaxed">We don't aggregate tailors; we employ them. We own the quality from the first cut to the final button.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

             {/* 5. TESTIMONIALS / QUOTES */}
             <section className="py-24 bg-brand-cream text-center" id="about-us">
                <div className="container-custom">
                    <Star size={32} className="mx-auto text-brand-rust mb-6 fill-current" />
                    <h2 className="text-3xl md:text-5xl font-serif italic text-brand-coffee mb-12 leading-relaxed max-w-4xl mx-auto">
                        We bring world-class tailoring back to where it belongs—where every measurement is personal, every detail is precise, and every garment reflects the human skill behind it.
                    </h2>
                    <div className="flex items-center justify-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-brand-coffee/90 text-brand-cream flex items-center justify-center overflow-hidden border-2 border-brand-coffee shadow-lg">
                             <User size={24} />
                        </div>
                        <div className="text-left">
                            <p className="font-sans font-bold text-brand-coffee text-sm uppercase tracking-wider">Sanidhya Nigam</p>
                            <p className="text-xs text-brand-brown">Director, Naapjhok</p>
                        </div>
                    </div>
                </div>
             </section>

             {/* Ornamental Separator */}
             <div className="flex items-center justify-center py-12">
                <div className="h-px w-32 md:w-80 bg-gradient-to-r from-transparent to-brand-coffee"></div>
                <div className="px-6 text-brand-rust">
                    <Scissors size={24} strokeWidth={1.5} />
                </div>
                <div className="h-px w-32 md:w-80 bg-gradient-to-r from-brand-coffee to-transparent"></div>
             </div>

            {/* 6. FAQ (Accordion) */}

            <section className="py-24 bg-brand-cream" id="faq">
                <div className="container-custom">
                    <div className="flex flex-col md:flex-row gap-12 md:gap-24">
                        {/* Left Column: Sticky Header & Context */}
                        <div className="md:w-1/3 md:sticky md:top-32 h-fit">
                            <span className="text-brand-brown font-sans text-xs uppercase tracking-[0.2em] block mb-4">Support & Care</span>
                            <h2 className="text-4xl md:text-5xl font-serif text-brand-coffee mb-6 italic">Curiosities.</h2>
                            <p className="text-brand-coffee/70 font-sans text-sm leading-relaxed mb-8">
                                Everything you need to know about the bespoke experience. If you have more questions, our concierge team is always available.
                            </p>
                            <div className="relative overflow-hidden group rounded-sm mb-8">
                                <img 
                                    src={coat}
                                    alt="Tailoring details" 
                                    className="w-full aspect-[4/5] object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-brand-coffee/10"></div>
                            </div>
                            <span className="text-xs font-bold uppercase tracking-[2px] text-brand-coffee border-b border-brand-coffee transition-all pb-1">
                                Naapjhok.in
                            </span>
                        </div>

                        {/* Right Column: Accordion */}
                        <div className="md:w-2/3 space-y-4">
                            <FAQItem 
                                question="Are the prices shown on the website final?" 
                                answer="The prices listed are general quotes based on standard designs and fabric categories. The final price may vary slightly depending on the specific fabric you select from our curated collection and any complex design customizations you request during the Master Visit." 
                            />
                            <FAQItem 
                                question="When and how do I need to pay?" 
                                answer="To keep the process stress-free, you pay when the tailor comes to your home. We don't require upfront payments during the online booking process. You can pay us once the measurements and fabric selections are finalized." 
                            />
                             <FAQItem 
                                question="How long does the 'Master Visit' take?" 
                                answer="A typical session for a single person takes about 30 minutes. This includes fabric selection, design consultation, and precision measurements." 
                            />
                             <FAQItem 
                                question="What happens if the garment doesn't fit perfectly during the Live Trial?" 
                                answer="Our Master Tailor is right there with you during the trial to catch any issues. If any minor adjustments are needed, they will take the garment back, fix it, and deliver it again to ensure you are 100% happy with the fit." 
                            />
                             <FAQItem 
                                question="How long does the entire process take?" 
                                answer="Our standard turnaround time is 8 to 12 days. However, for urgent requirements, you can discuss 'Express Delivery' options with us during your consultation." 
                            />
                             <FAQItem 
                                question="Which areas in Delhi NCR do you cover?" 
                                answer="We currently serve all of Delhi, Gurgaon, Noida, Greater Noida, and Ghaziabad. If you are unsure about your location, just enter your pincode on the booking page to confirm." 
                            />
                             <FAQItem 
                                question="Can I book an appointment for my office?" 
                                answer="Absolutely. Many of our clients prefer being measured at their workplace during a break. Just ensure you have a private space available for the Master Tailor to take accurate measurements." 
                            />
                             <FAQItem 
                                question="Can I reschedule or cancel my appointment?" 
                                answer="Yes, we understand plans change. You can reschedule or cancel through your 'the Naap' dashboard or via our WhatsApp support up to 4 hours before your scheduled slot." 
                            />
                             <FAQItem 
                                question="Do you provide styles specifically for women?" 
                                answer="Yes. Redefining women’s professional wear is part of our mission. We specialize in power suits, blazers, and formal trousers designed to fit the female form perfectly—an area where ready-to-wear often fails." 
                            />
                        </div>
                    </div>
                </div>
            </section>

             {/* Footer - Rich & Detailed */}
             <footer className="bg-brand-black text-brand-tan pt-24 pb-12 border-t border-brand-tan/10">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
                        {/* 1. Brand & Social */}
                        <div className="space-y-6">
                            <h2 className="font-serif text-3xl italic text-brand-cream">Naapjhok</h2>
                            <p className="text-brand-tan/60 text-sm leading-relaxed max-w-xs">
                                Handcrafted in Delhi, for the ambitious. We blend the heritage of Indian craftsmanship with the convenience of modern technology.
                            </p>
                            <div className="flex gap-4">
                                <a href="https://www.instagram.com/naapjhok.in?igsh=NzU2dnpmM216ZXdu" className="w-10 h-10 rounded-full border border-brand-tan/20 flex items-center justify-center hover:bg-brand-tan hover:text-brand-black transition-all" aria-label="Instagram">
                                    <Instagram size={18} />
                                </a>
                                <a href="https://www.linkedin.com/company/naapjhok-india/" className="w-10 h-10 rounded-full border border-brand-tan/20 flex items-center justify-center hover:bg-brand-tan hover:text-brand-black transition-all" aria-label="LinkedIn">
                                    <Linkedin size={18} />
                                </a>
                                <a href="https://wa.me/+917985463989" className="w-10 h-10 rounded-full border border-brand-tan/20 flex items-center justify-center hover:bg-brand-tan hover:text-brand-black transition-all" aria-label="WhatsApp">
                                    <MessageCircle size={18} />
                                </a>
                            </div>
                        </div>

                        {/* 2. Explore */}
                        <div>
                            <h4 className="text-brand-cream font-sans font-bold text-xs uppercase tracking-[0.2em] mb-8">Explore</h4>
                            <ul className="space-y-4 text-sm text-brand-tan/70">
                                <li><a href="#" className="hover:text-brand-rust transition-colors">The Collection</a></li>
                                <li><a href="#how-it-works" className="hover:text-brand-rust transition-colors">The Process</a></li>
                                {/* <li><a href="#stories" className="hover:text-brand-rust transition-colors">Masterji's Journal</a></li> */}
                            </ul>
                        </div>

                        {/* 3. Concierge */}
                        <div>
                            <h4 className="text-brand-cream font-sans font-bold text-xs uppercase tracking-[0.2em] mb-8">Concierge</h4>
                            <ul className="space-y-4 text-sm text-brand-tan/70">
                                <li><a href="#" className="hover:text-brand-rust cursor-pointer transition-colors">Book Appointment</a></li>
                                {/* <li><a href="#" className="hover:text-brand-rust cursor-pointer transition-colors">Track Order</a></li> */}
                                <li><a href="#faq" className="hover:text-brand-rust cursor-pointer transition-colors">FAQ & Support</a></li>
                            </ul>
                        </div>

                        {/* 4. Newsletter REMOVED (Replaced with Contact Info or empty) */}
                        <div>
                             <h4 className="text-brand-cream font-sans font-bold text-xs uppercase tracking-[0.2em] mb-8">Contact Us</h4>
                             <p className="text-brand-tan/60 text-sm leading-relaxed">
                                 Questions? We are here to help.<br/>
                                 +91 79854 63989<br/>
                                 Monday to Sunday
                             </p>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="pt-8 border-t border-brand-tan/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-brand-tan/40 uppercase tracking-widest">
                        <p>&copy; 2026 Naapjhok. All Rights Reserved.</p>
                        {/* <div className="flex gap-8">
                            <a href="#" className="hover:text-brand-tan transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-brand-tan transition-colors">Terms of Service</a>
                        </div> */}
                    </div>
                </div>
            </footer>

        </div>
    );
};

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white border border-brand-coffee/5 overflow-hidden transition-all duration-300">
            <button 
                className="w-full py-6 px-8 flex justify-between items-center text-left hover:bg-brand-cream/50 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="text-lg font-serif text-brand-coffee">{question}</span>
                {isOpen ? <ChevronUp size={20} className="text-brand-rust"/> : <ChevronDown size={20} className="text-brand-tan"/>}
            </button>
            <div className={`px-8 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="text-brand-coffee/70 font-light text-sm leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}

export default LandingPage;
