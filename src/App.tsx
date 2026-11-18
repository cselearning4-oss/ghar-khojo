import { useMemo, useState } from "react";
import {
  ArrowRight, ArrowUpRight, MapPin, ShieldCheck, Headphones, Menu, X,
  Search, SlidersHorizontal, Home, Building2, BedDouble, CheckCircle2,
  Instagram, Phone, Mail, ChevronDown, Sparkles, Clock3, Users, Wifi,
  Utensils, WashingMachine, Plus, LayoutDashboard, LogOut, ImagePlus
} from "lucide-react";

type Property = {
  id: number; name: string; area: string; type: string; rent: number;
  sharing: string; gender: string; features: string[]; image: string;
  deposit: string; verified: boolean;
};
const initialProperties: Property[] = [
  { id: 1, name: "Student Nest PG", area: "MP Nagar", type: "PG", rent: 6500, sharing: "2 sharing", gender: "Boys", features: ["Wi-Fi", "Meals", "Laundry"], image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85", deposit: "1 month", verified: true },
  { id: 2, name: "The Urban Stay", area: "Kolar Road", type: "Hostel", rent: 5200, sharing: "3 sharing", gender: "Girls", features: ["Wi-Fi", "Meals", "Security"], image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1000&q=85", deposit: "₹2,000", verified: true },
  { id: 3, name: "Lakeview Rooms", area: "Arera Colony", type: "Room", rent: 8500, sharing: "Single room", gender: "Any", features: ["Wi-Fi", "Attached bath"], image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85", deposit: "1 month", verified: false },
  { id: 4, name: "Campus Comfort Flat", area: "Bawadiya Kalan", type: "Flat", rent: 12000, sharing: "2 BHK", gender: "Any", features: ["Kitchen", "Balcony", "Parking"], image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85", deposit: "2 months", verified: false }
];
const areas = ["All areas", "MP Nagar", "Kolar Road", "Arera Colony", "Bawadiya Kalan", "Hoshangabad Road", "Raisen Road", "BHEL / Piplani"];
const money = (n: number) => `₹${n.toLocaleString("en-IN")}`;

export default function App() {
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [activeTab, setActiveTab] = useState("Home");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [area, setArea] = useState("All areas");
  const [kind, setKind] = useState("All");
  const [budget, setBudget] = useState("Any budget");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Property | null>(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [enquiries, setEnquiries] = useState(0);
  const filtered = useMemo(() => properties.filter(p =>
    (area === "All areas" || p.area === area) &&
    (kind === "All" || p.type === kind) &&
    (budget === "Any budget" || (budget === "Under ₹6,000" ? p.rent < 6000 : budget === "₹6,000–₹10,000" ? p.rent >= 6000 && p.rent <= 10000 : p.rent > 10000)) &&
    `${p.name} ${p.area} ${p.type}`.toLowerCase().includes(search.toLowerCase())
  ), [properties, area, kind, budget, search]);

  const openEnquiry = (p?: Property) => { setSelected(p || null); setShowForm(true); };
  const submitEnquiry = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());
    const saved = JSON.parse(localStorage.getItem("gk-enquiries") || "[]");
    saved.push({ ...payload, property: selected?.name || "General request", createdAt: new Date().toISOString() });
    localStorage.setItem("gk-enquiries", JSON.stringify(saved));
    setEnquiries(saved.length); setShowForm(false);
    setNotice("Thanks! Your request has been saved on this device. Connect the backend before launch to receive it centrally.");
  };
  const addDemoProperty = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const p: Property = {
      id: Date.now(), name: String(f.get("name")), area: String(f.get("area")), type: String(f.get("type")),
      rent: Number(f.get("rent")), sharing: String(f.get("sharing")), gender: String(f.get("gender")),
      features: ["Contact team for facilities"], image: String(f.get("image") || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85"),
      deposit: String(f.get("deposit") || "Ask us"), verified: false
    };
    setProperties(prev => [p, ...prev]); e.currentTarget.reset(); setNotice("Demo property added to this browser session.");
  };

  return <div className="app-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="topbar">
      <a className="brand" href="#" onClick={() => setActiveTab("Home")}><span className="brand-mark"><Home size={19}/></span><span>GHAR <b>KHOJO</b><small>YOUR HOME IN BHOPAL</small></span></a>
      <nav className={mobileMenu ? "nav nav-open" : "nav"}>
        {["Home", "Explore stays", "Locations", "How it works", "Support"].map(t => <a key={t} href={`#${t.toLowerCase().replaceAll(" ","-")}`} onClick={() => {setActiveTab(t);setMobileMenu(false);}} className={activeTab===t?"active":""}>{t}</a>)}
        <button className="nav-cta mobile-cta" onClick={() => openEnquiry()}>Find my stay <ArrowUpRight size={16}/></button>
      </nav>
      <div className="top-actions"><button className="text-button" onClick={() => setAdminOpen(true)}>Admin</button><button className="nav-cta" onClick={() => openEnquiry()}>Find my stay <ArrowUpRight size={16}/></button></div>
      <button className="menu-toggle" onClick={() => setMobileMenu(!mobileMenu)} aria-label="Toggle menu">{mobileMenu?<X/>:<Menu/>}</button>
    </header>

    <main>
      <section className="hero section-wrap" id="home">
        <div className="hero-copy">
          <div className="eyebrow"><span className="pulse-dot"/> BHOPAL STUDENT LIVING, MADE SIMPLE</div>
          <h1>A place to stay.<br/><span>A place to belong.</span></h1>
          <p className="hero-lead">New city. New college. Finding a room shouldn't be the hard part. Discover PGs, hostels, rooms and flats in Bhopal with a local team by your side.</p>
          <div className="hero-actions"><button className="primary-btn" onClick={() => document.getElementById("explore-stays")?.scrollIntoView({behavior:"smooth"})}>Explore stays <ArrowRight size={18}/></button><button className="secondary-btn" onClick={() => openEnquiry()}>Tell us what you need</button></div>
          <div className="hero-proof"><div className="proof-icon"><ShieldCheck size={19}/></div><div><b>Support beyond move-in</b><span>One year of accommodation assistance</span></div></div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame"><img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=90" alt="Bright modern apartment interior"/><div className="image-shade"/></div>
          <div className="floating-card card-location"><span className="mini-icon"><MapPin size={17}/></span><div><b>Made for Bhopal</b><small>Local area guidance</small></div></div>
          <div className="floating-card card-support"><span className="support-check"><CheckCircle2 size={17}/></span><div><b>1-year support</b><small>We're here after you move in</small></div></div>
          <div className="visual-caption"><span>01 / FIND YOUR SPACE</span><span>BHOPAL, MP</span></div>
        </div>
        <div className="hero-bottom-line"><span>PGs</span><i/><span>HOSTELS</span><i/><span>ROOMS</span><i/><span>FLATS</span><i/><span>STUDENT-FIRST SUPPORT</span></div>
      </section>

      <section className="search-panel section-wrap">
        <div className="search-heading"><div><span className="eyebrow">START YOUR SEARCH</span><h2>What does home look like?</h2></div><span className="search-note"><SlidersHorizontal size={15}/> Refine your options</span></div>
        <div className="filters">
          <label className="filter-field search-field"><span>SEARCH</span><div><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Property or locality"/></div></label>
          <label className="filter-field"><span>LOCATION</span><select value={area} onChange={e=>setArea(e.target.value)}>{areas.map(a=><option key={a}>{a}</option>)}</select></label>
          <label className="filter-field"><span>PROPERTY TYPE</span><select value={kind} onChange={e=>setKind(e.target.value)}>{["All","PG","Hostel","Room","Flat"].map(x=><option key={x}>{x}</option>)}</select></label>
          <label className="filter-field"><span>MONTHLY BUDGET</span><select value={budget} onChange={e=>setBudget(e.target.value)}>{["Any budget","Under ₹6,000","₹6,000–₹10,000","Above ₹10,000"].map(x=><option key={x}>{x}</option>)}</select></label>
        </div>
      </section>

      <section className="section-wrap listings" id="explore-stays">
        <div className="section-heading"><div><span className="eyebrow">A GOOD PLACE TO START</span><h2>Explore stays in Bhopal<span className="blue-period">.</span></h2><p>Browse sample listings. Availability and prices must be confirmed by our team.</p></div><button className="view-all" onClick={()=>{setArea("All areas");setKind("All");setBudget("Any budget");setSearch("");}}>Reset filters <ArrowUpRight size={16}/></button></div>
        <div className="property-grid">{filtered.map(p=><article className="property-card" key={p.id}>
          <div className="property-image"><img src={p.image} alt={p.name}/><span className="type-pill">{p.type}</span>{p.verified&&<span className="verified"><CheckCircle2 size={13}/> Team checked</span>}</div>
          <div className="property-content"><div className="property-area"><MapPin size={13}/>{p.area}</div><h3>{p.name}</h3><div className="property-meta"><span><Users size={14}/>{p.sharing}</span><span><Building2 size={14}/>{p.gender}</span></div><div className="feature-row">{p.features.slice(0,3).map(f=><span key={f}>{f}</span>)}</div><div className="property-footer"><div><b>{money(p.rent)}<small>/ month</small></b><span>Deposit: {p.deposit}</span></div><button className="round-arrow" onClick={()=>openEnquiry(p)} aria-label={`Enquire about ${p.name}`}><ArrowUpRight size={18}/></button></div></div>
        </article>)}</div>
        {filtered.length===0&&<div className="empty-state"><Search size={26}/><h3>No matching stays yet</h3><p>Send us your requirements and our team can help search.</p><button className="primary-btn" onClick={()=>openEnquiry()}>Request assistance <ArrowRight size={16}/></button></div>}
        <p className="disclaimer">Listing note: the displayed properties are starter/demo content for the design preview, not confirmed real vacancies. Replace them with verified properties before publishing.</p>
      </section>

      <section className="locations-section" id="locations"><div className="section-wrap location-layout"><div><span className="eyebrow">KNOW THE NEIGHBOURHOODS</span><h2>Find the area<br/>that fits your life.</h2><p>Tell us your college, commute and budget. We'll help you shortlist Bhopal localities that make sense for you.</p><button className="secondary-btn" onClick={()=>openEnquiry()}>Get area guidance <ArrowRight size={17}/></button></div><div className="area-grid">{[["MP Nagar","Coaching, offices & city connectivity"],["Kolar Road","Residential options & everyday essentials"],["Arera Colony","Established residential neighbourhood"],["Bawadiya Kalan","Apartment-led residential pockets"],["Hoshangabad Road","Growing residential corridor"],["BHEL / Piplani","Options around the eastern side"]].map(([a,d],i)=><button className="area-tile" key={a} onClick={()=>{setArea(a);document.getElementById("explore-stays")?.scrollIntoView({behavior:"smooth"});}}><span className="area-number">0{i+1}</span><b>{a}</b><small>{d}</small><ArrowUpRight size={17}/></button>)}</div></div></section>

      <section className="how-section section-wrap" id="how-it-works"><div className="section-heading"><div><span className="eyebrow">SIMPLE FROM DAY ONE</span><h2>Your next chapter, in 3 steps.</h2></div></div><div className="steps-grid">{[[Search,"01","Share your needs","Tell us your preferred area, budget, property type and move-in date."],[Home,"02","Get matched","Our Bhopal team reviews your requirements and shares suitable options."],[CheckCircle2,"03","Settle in","Visit, verify and decide. We're available for accommodation support after move-in."]].map(([Icon,n,t,d]:any)=><div className="step-card" key={n}><div className="step-top"><span>{n}</span><Icon size={22}/></div><h3>{t}</h3><p>{d}</p></div>)}</div></section>

      <section className="support-section" id="support"><div className="section-wrap support-inner"><div className="support-art"><div className="support-orbit orbit-a"/><div className="support-orbit orbit-b"/><div className="support-shield"><ShieldCheck size={58}/></div><span className="orbit-tag">HERE AFTER MOVE-IN</span></div><div className="support-copy"><span className="eyebrow">MORE THAN A ROOM FINDER</span><h2>One year of support.<br/><span>Because settling in matters.</span></h2><p>Our relationship doesn't end when you find a place. Ghar Khojo offers one year of accommodation-related assistance so students have a local point of contact when they need help.</p><div className="support-points"><span><CheckCircle2/> Help with accommodation concerns</span><span><CheckCircle2/> Guidance communicating with owners</span><span><CheckCircle2/> A team to contact when issues arise</span></div><button className="primary-btn" onClick={()=>openEnquiry()}>Talk to our team <ArrowRight size={17}/></button><small className="terms-note">Support scope, response times and exclusions will be defined in the published service terms.</small></div></div></section>

      <section className="final-cta section-wrap"><div><span className="eyebrow">YOUR BHOPAL STORY STARTS HERE</span><h2>Let's find your place.</h2><p>Share your requirements. We'll take it from there.</p></div><button className="primary-btn" onClick={()=>openEnquiry()}>Start your search <ArrowUpRight size={18}/></button></section>
    </main>
    <footer className="footer"><div className="footer-top"><a className="brand" href="#"><span className="brand-mark"><Home size={19}/></span><span>GHAR <b>KHOJO</b><small>YOUR HOME IN BHOPAL</small></span></a><p>Helping students feel at home in a new city.</p><div className="footer-links"><a href="#explore-stays">Explore stays</a><a href="#locations">Locations</a><a href="#support">Support</a><a href="mailto:hello@gharkhojo.in"><Mail size={14}/> Email us</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Ghar Khojo. All rights reserved.</span><span>Currently serving Bhopal, Madhya Pradesh.</span></div></footer>

    {showForm&&<div className="modal-backdrop" onMouseDown={e=>{if(e.target===e.currentTarget)setShowForm(false)}}><div className="modal"><button className="modal-close" onClick={()=>setShowForm(false)}><X/></button><span className="eyebrow">STUDENT ENQUIRY</span><h2>Tell us what you need.</h2><p>{selected?`Enquiring about ${selected.name} in ${selected.area}.`:"A few details help us find the right options."}</p><form onSubmit={submitEnquiry} className="enquiry-form">
      <label>Full name<input name="name" required placeholder="Your name"/></label><label>Mobile number<input name="phone" required inputMode="numeric" pattern="[0-9]{10}" placeholder="10-digit mobile number"/></label><label>Email address<input name="email" type="email" placeholder="you@example.com"/></label><label>College / institute<input name="college" placeholder="Where are you studying?"/></label><div className="form-two"><label>Preferred area<select name="area" defaultValue={selected?.area||""} required><option value="" disabled>Select area</option>{areas.slice(1).map(a=><option key={a}>{a}</option>)}<option>Flexible / suggest an area</option></select></label><label>Accommodation<select name="type" defaultValue={selected?.type||"Any"}><option>Any</option><option>PG</option><option>Hostel</option><option>Room</option><option>Flat</option></select></label></div><div className="form-two"><label>Monthly budget<select name="budget" required><option value="">Choose budget</option><option>Below ₹5,000</option><option>₹5,000–₹8,000</option><option>₹8,000–₹12,000</option><option>₹12,000–₹18,000</option><option>Above ₹18,000</option></select></label><label>Move-in date<input name="moveIn" type="date"/></label></div><label>Anything else we should know?<textarea name="notes" rows={3} placeholder="Sharing preference, food, facilities, gender preference..."/></label><label className="consent"><input type="checkbox" required/> I agree that Ghar Khojo may contact me about this accommodation request.</label><button className="primary-btn full-btn" type="submit">Submit request <ArrowRight size={17}/></button><small className="terms-note">Demo mode stores this enquiry in this browser only. Configure a secure backend before accepting real student data.</small>
    </form></div></div>}

    {adminOpen&&<div className="modal-backdrop"><div className="modal admin-modal"><button className="modal-close" onClick={()=>setAdminOpen(false)}><X/></button><span className="eyebrow">INTERNAL PREVIEW</span><h2>Property admin</h2><p>This starter admin panel is a local prototype, not a secured production dashboard.</p><div className="admin-stats"><div><b>{properties.length}</b><span>Properties</span></div><div><b>{JSON.parse(localStorage.getItem("gk-enquiries")||"[]").length}</b><span>Enquiries on this device</span></div></div><form className="enquiry-form" onSubmit={addDemoProperty}><h3>Add a property</h3><label>Property name<input name="name" required placeholder="e.g. Sunrise PG"/></label><div className="form-two"><label>Area<select name="area">{areas.slice(1).map(a=><option key={a}>{a}</option>)}</select></label><label>Type<select name="type"><option>PG</option><option>Hostel</option><option>Room</option><option>Flat</option></select></label></div><div className="form-two"><label>Monthly rent (₹)<input name="rent" type="number" required min="1"/></label><label>Sharing<input name="sharing" placeholder="2 sharing"/></label></div><div className="form-two"><label>For<select name="gender"><option>Any</option><option>Boys</option><option>Girls</option></select></label><label>Deposit<input name="deposit" placeholder="e.g. ₹5,000"/></label></div><label>Image URL<input name="image" placeholder="Paste a property photo URL"/></label><button className="primary-btn full-btn" type="submit">Add demo property <Plus size={16}/></button></form><p className="terms-note">For production: add admin login, cloud database, image uploads and role-based permissions.</p></div></div>}
    {notice&&<div className="toast"><CheckCircle2 size={18}/>{notice}<button onClick={()=>setNotice("")}><X size={16}/></button></div>}
  </div>;
}