import React, { useState, useEffect } from 'react';
import { 
  Code, 
  Sparkles, 
  ExternalLink, 
  Mail, 
  MapPin, 
  X, 
  ChevronRight, 
  Menu, 
  CheckCircle2, 
  ArrowUpRight,
  Send,
  Linkedin,
  Github,
  Globe,
  Smartphone,
  Map,
  GraduationCap,
  Briefcase,
  Database,
  Compass,
  Copy,
  Check,
  Search,
  Calendar,
  Layers,
  Award
} from 'lucide-react';

const PROJECTS = [
  {
    id: 1,
    title: 'Farmers4Forest Foundation',
    category: 'GIS & Web Platform',
    type: 'GIS',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80',
    description: 'Digital platform and mapping tools supporting sustainable agroforestry, smallholder farmers, and community-based forest conservation initiatives.',
    tags: ['React', 'GIS Mapping', 'Agroforestry', 'Conservation'],
    link: 'https://farmers4forest.org',
    isExternal: true
  },
  {
    id: 2,
    title: 'Serikat Petani Kelapa Sawit (SPKS)',
    category: 'Web Platform',
    type: 'Web',
    image: 'https://images.unsplash.com/photo-1595838788652-320d3eb84e5a?auto=format&fit=crop&w=800&q=80',
    description: 'Web application empowering independent oil palm smallholders through land mapping, sustainability compliance, and organizational traceability.',
    tags: ['Web Platform', 'Smallholder Mapping', 'UI/UX', 'Tailwind'],
    link: 'https://spks.or.id',
    isExternal: true
  },
  {
    id: 3,
    title: 'Mobile GIS Offline Synchronization App',
    category: 'Mobile GIS & Thesis',
    type: 'Mobile',
    image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80',
    description: 'Undergraduate thesis project implementing SQLite offline-first spatial data collection with vector map tiles and background synchronization for community conservation areas.',
    tags: ['React Native', 'SQLite', 'Offline Sync', 'Mapbox GIS'],
    link: '#thesis',
    isExternal: false
  },
  {
    id: 4,
    title: 'ForestryGIS Field Data Collector',
    category: 'Mobile GIS',
    type: 'GIS',
    image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    description: 'Field data collection utility engineered for forest protection consultants to log geospatial points, biodiversity metrics, and environmental threats in remote off-grid regions.',
    tags: ['Mobile GIS', 'Leaflet', 'GeoJSON', 'React Native'],
    link: '#services',
    isExternal: false
  }
];

const SERVICES = [
  {
    id: 'frontend',
    icon: Code,
    color: 'from-emerald-400 to-teal-500',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
    iconBg: 'bg-emerald-600',
    title: 'Front-End Development',
    skills: ['React.js', 'Tailwind CSS', 'JavaScript (ES6+)', 'Responsive UI/UX'],
    description: 'Crafting responsive, high-performance web applications using React, Tailwind CSS, and modern JavaScript standards with clean design systems and accessible user interfaces.'
  },
  {
    id: 'mobile',
    icon: Smartphone,
    color: 'from-sky-400 to-blue-500',
    bgColor: 'bg-sky-50 dark:bg-sky-950/30',
    iconBg: 'bg-sky-600',
    title: 'Mobile App Development',
    skills: ['React Native', 'SQLite Storage', 'Offline Sync', 'Cross-Platform'],
    description: 'Building robust cross-platform mobile apps using React Native integrated with SQLite offline storage and background data synchronization for seamless remote usage.'
  },
  {
    id: 'gis',
    icon: Map,
    color: 'from-purple-400 to-indigo-500',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    iconBg: 'bg-indigo-600',
    title: 'GIS & Spatial Integration',
    skills: ['Mapbox GL', 'Leaflet.js', 'GeoJSON Data', 'Community Mapping'],
    description: 'Designing custom Geographic Information Systems using Mapbox and Leaflet, enabling spatial analytics, interactive map layering, and community conservation mapping.'
  }
];

const EDUCATION = [
  {
    period: 'Current',
    institution: 'Universitas Muhammadiyah Pontianak',
    degree: 'S1 Teknik Komputer / Informatika',
    note: 'Specializing in Mobile GIS, Spatial Data Management, and Front-End Engineering'
  },
  {
    period: 'High School',
    institution: 'MAN Singkawang',
    degree: 'Senior High School Education',
    note: 'Focus on natural sciences, logic, and early computer fundamentals'
  },
  {
    period: 'Junior High',
    institution: 'SMPIT Al-Fityan',
    degree: 'Junior High School Education',
    note: 'Character building, technology basics, and leadership'
  },
  {
    period: 'Elementary',
    institution: 'SD Tanjung Merpati',
    degree: 'Primary School Education',
    note: 'Kembayan, Sanggau Regency'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeEduIndex, setActiveEduIndex] = useState(0);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('kiapndy@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setIsContactOpen(false);
      setFormData({ name: '', email: '', message: '' });
    }, 2500);
  };

  const filteredProjects = PROJECTS.filter(p => {
    const matchesTab = activeTab === 'All' 
      || p.type.toLowerCase() === activeTab.toLowerCase()
      || p.category.toLowerCase().includes(activeTab.toLowerCase());

    const matchesSearch = searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTab && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-emerald-200 selection:text-emerald-900 overflow-x-hidden relative">
      
      {/* Background Decorative Gradient Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-emerald-300/30 via-teal-300/20 to-emerald-100/30 rounded-full blur-3xl opacity-80 animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-sky-400/20 via-indigo-300/20 to-teal-100/20 rounded-full blur-3xl opacity-70" />
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-emerald-200/20 via-sky-200/20 to-teal-100/30 rounded-full blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 border-b border-slate-200/80 transition-all shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Personal Logo */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-sky-600 flex items-center justify-center text-white shadow-md shadow-emerald-200 font-extrabold text-lg group-hover:scale-105 transition-transform">
              K
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-slate-900 leading-tight">
                Kurniawan<span className="text-emerald-600">.dev</span>
              </span>
              <span className="text-[10px] tracking-wider text-slate-500 uppercase font-semibold">Mobile GIS & Front-End</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <button onClick={() => scrollToSection('hero')} className="hover:text-emerald-600 transition-colors">Home</button>
            <button onClick={() => scrollToSection('about')} className="hover:text-emerald-600 transition-colors">About</button>
            <button onClick={() => scrollToSection('services')} className="hover:text-emerald-600 transition-colors">Services</button>
            <button onClick={() => scrollToSection('projects')} className="hover:text-emerald-600 transition-colors">Projects</button>
            <button onClick={() => scrollToSection('thesis')} className="hover:text-emerald-600 transition-colors">Thesis</button>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={() => setIsContactOpen(true)}
              className="px-6 py-2.5 rounded-full bg-slate-900 text-white font-medium text-sm hover:bg-emerald-600 transition-all shadow-md hover:shadow-emerald-200 active:scale-95 flex items-center gap-2"
            >
              <Mail size={16} />
              <span>Contact Me</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-2 text-slate-700 hover:text-emerald-600 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 px-6 py-6 flex flex-col gap-4 text-slate-700 font-medium">
            <button onClick={() => scrollToSection('hero')} className="text-left py-2 hover:text-emerald-600 border-b border-slate-100">Home</button>
            <button onClick={() => scrollToSection('about')} className="text-left py-2 hover:text-emerald-600 border-b border-slate-100">About</button>
            <button onClick={() => scrollToSection('services')} className="text-left py-2 hover:text-emerald-600 border-b border-slate-100">Services</button>
            <button onClick={() => scrollToSection('projects')} className="text-left py-2 hover:text-emerald-600 border-b border-slate-100">Projects</button>
            <button onClick={() => scrollToSection('thesis')} className="text-left py-2 hover:text-emerald-600 border-b border-slate-100">Thesis</button>
            <button 
              onClick={() => { setMobileMenuOpen(false); setIsContactOpen(true); }}
              className="mt-2 w-full text-center py-3 rounded-full bg-emerald-600 text-white font-medium shadow-md flex items-center justify-center gap-2"
            >
              <Mail size={16} />
              <span>Contact Me</span>
            </button>
          </div>
        )}
      </header>

      <section id="hero" className="relative z-10 pt-12 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center">
        
        {/* Top Tagline Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 border border-emerald-200 shadow-sm text-xs md:text-sm font-semibold text-emerald-800 mb-8 backdrop-blur-sm hover:border-emerald-400 transition-colors">
          <Sparkles size={16} className="text-emerald-600 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Mobile GIS Developer & Forest Protection Consultant</span>
        </div>

        {/* Hero Main Title */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-slate-900 max-w-5xl leading-[1.15]">
          Kurniawan Alhamdani Pandayu Putra
          <span className="block italic font-serif font-normal text-emerald-700 mt-2 text-2xl md:text-4xl lg:text-5xl">
            Front-End, React Native & Mobile GIS Specialist
          </span>
        </h1>

        <p className="mt-6 text-slate-600 text-base md:text-lg max-w-2xl leading-relaxed">
          Combining modern web technology with geospatial intelligence. Focused on building offline-first mobile GIS applications, community conservation mapping, and responsive front-end interfaces.
        </p>

        {/* Main Action CTA Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button 
            onClick={() => scrollToSection('projects')}
            className="px-7 py-3.5 rounded-full bg-emerald-600 text-white font-semibold text-sm hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 active:scale-95"
          >
            <span>Explore Projects</span>
            <ChevronRight size={18} />
          </button>
          <button 
            onClick={() => scrollToSection('about')}
            className="px-7 py-3.5 rounded-full bg-white text-slate-700 border border-slate-200 font-semibold text-sm hover:bg-slate-100 transition-all shadow-sm active:scale-95"
          >
            Read Biography
          </button>
        </div>

        {/* Profile Card & Key Badges */}
        <div className="relative mt-12 mb-8 w-full max-w-2xl bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-6 md:p-8 shadow-xl text-left grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-sky-500 flex items-center justify-center text-white text-3xl font-bold shadow-md mb-3 ring-4 ring-emerald-100">
              KAP
            </div>
            <h3 className="font-bold text-slate-900 text-base">Kurniawan A.P. Putra</h3>
            
            <button 
              onClick={handleCopyEmail}
              className="mt-1 flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-2.5 py-1 rounded-md transition-colors"
              title="Click to copy email"
            >
              <span>kiapndy@gmail.com</span>
              {copiedEmail ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            </button>
          </div>

          <div className="md:col-span-2 space-y-3 text-xs md:text-sm text-slate-600">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
              <MapPin size={18} className="text-emerald-600 shrink-0" />
              <span><strong>Location:</strong> Pontianak, Kalimantan Barat, Indonesia</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
              <GraduationCap size={18} className="text-emerald-600 shrink-0" />
              <span><strong>Education:</strong> Universitas Muhammadiyah Pontianak</span>
            </div>
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
              <Briefcase size={18} className="text-emerald-600 shrink-0" />
              <span><strong>Role:</strong> Forest Protection Consultant (Since 2025)</span>
            </div>
          </div>
        </div>

        {/* Hashtags */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-slate-500 font-medium text-xs md:text-sm tracking-wide">
          <span className="px-3 py-1 bg-white/60 border border-slate-200/80 rounded-full hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-default">#MobileGIS</span>
          <span className="px-3 py-1 bg-white/60 border border-slate-200/80 rounded-full hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-default">#ReactNative</span>
          <span className="px-3 py-1 bg-white/60 border border-slate-200/80 rounded-full hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-default">#FrontEndDev</span>
          <span className="px-3 py-1 bg-white/60 border border-slate-200/80 rounded-full hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-default">#OfflineSync</span>
          <span className="px-3 py-1 bg-white/60 border border-slate-200/80 rounded-full hover:text-emerald-600 hover:border-emerald-300 transition-all cursor-default">#ForestProtection</span>
        </div>
      </section>

      <section id="services" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase mb-2 block">Specializations</span>
          <h2 className="text-3xl md:text-5xl font-semibold text-slate-900 tracking-tight">
            Technical Capabilities &
            <span className="block italic font-serif font-normal text-emerald-700 mt-1">
              Field Expertise
            </span>
          </h2>
        </div>

        {/* Service Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={service.id} 
                className="group relative bg-white/80 backdrop-blur-xl border border-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1.5"
              >
                <div className={`w-16 h-16 rounded-2xl ${service.iconBg} text-white flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent size={30} />
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  {service.title}
                </h3>

                <p className="text-slate-600 text-sm leading-relaxed font-normal mb-6">
                  {service.description}
                </p>

                {/* Skill Chips */}
                <div className="mt-auto w-full pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-1.5">
                  {service.skills.map((skill, sIdx) => (
                    <span key={sIdx} className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-slate-100 text-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="about" className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-white p-8 md:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Personal Biography Details */}
          <div className="lg:col-span-7">
            <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase mb-2 block">Personal Biography</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Kurniawan Alhamdani Pandayu Putra
            </h2>
            
            <p className="text-slate-600 leading-relaxed mb-4 text-sm md:text-base">
              Born in <strong>Kembayan on March 12, 2004</strong>, Kurniawan is a tech developer and spatial data practitioner operating at the intersection of mobile software engineering, front-end development, and forest conservation.
            </p>

            <p className="text-slate-600 leading-relaxed mb-6 text-sm md:text-base">
              Since <strong>2025</strong>, he has actively worked as a <strong>Forest Protection Consultant</strong>. Facing real-world challenges while mapping off-grid conservation areas directly inspired his thesis research focus: developing resilient offline data synchronization frameworks for mobile GIS applications in community-managed forests.
            </p>

            {/* Field Experience & Inspiration highlight box */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 mb-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Compass size={100} className="text-emerald-900" />
              </div>
              <h4 className="font-bold text-slate-900 text-base mb-2 flex items-center gap-2">
                <Compass className="text-emerald-600" size={20} />
                <span>Field Experience & Thesis Inspiration</span>
              </h4>
              <p className="text-slate-700 text-xs md:text-sm leading-relaxed">
                Consulting in remote forested landscapes revealed critical technical bottlenecks: poor cellular connectivity prevents field teams from uploading geospatial data. This prompted his thesis topic, <em>"Integrasi Offline Synchronization pada Mobile GIS untuk Pendataan Kawasan Konservasi Berbasis Komunitas"</em>, implementing local SQLite caching and automated sync queues once connectivity resumes.
              </p>
            </div>

            {/* Key Accomplishment List */}
            <div className="space-y-3 mb-4">
              {[
                'Forest Protection Consultant for community conservation mapping (2025 - Present)',
                'Undergraduate student in Computer Engineering / Informatics at Universitas Muhammadiyah Pontianak',
                'Front-end practitioner specializing in React, Tailwind CSS, and React Native',
                'GIS enthusiast experienced with Mapbox, Leaflet, and spatial database integration'
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 text-slate-700 text-xs md:text-sm font-medium">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Education Timeline */}
          <div className="lg:col-span-5 bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <GraduationCap className="text-emerald-600" size={22} />
              <span>Educational Journey</span>
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-emerald-200">
              {EDUCATION.map((edu, index) => (
                <div 
                  key={index} 
                  onClick={() => setActiveEduIndex(index)}
                  className={`relative pl-9 cursor-pointer p-3 rounded-xl transition-all ${
                    activeEduIndex === index 
                      ? 'bg-white shadow-md border border-emerald-100' 
                      : 'hover:bg-slate-100/80'
                  }`}
                >
                  <div className={`absolute left-0 top-3.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    activeEduIndex === index 
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' 
                      : 'bg-white border-2 border-emerald-600 text-emerald-600'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                      {edu.period}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{edu.institution}</h4>
                  <p className="text-xs font-medium text-emerald-700">{edu.degree}</p>
                  <p className="text-xs text-slate-500 mt-1">{edu.note}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <section id="thesis" className="relative z-10 py-16 px-6 max-w-7xl mx-auto">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-3xl relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-semibold mb-6">
              <Database size={14} />
              <span>Undergraduate Thesis Research</span>
            </div>

            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4 text-white leading-snug">
              Integrasi Offline Synchronization pada Mobile GIS untuk Pendataan Kawasan Konservasi Berbasis Komunitas
            </h2>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed mb-8">
              Engineered specifically for off-grid conservation mapping in West Kalimantan. The system utilizes SQLite local storage within React Native to record offline spatial vector data, geotagged photos, and attribute points, automatically synchronizing with central PostgreSQL/PostGIS servers when internet connectivity is re-established.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-800 pt-6">
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <span className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Architecture</span>
                <span className="text-sm font-semibold text-emerald-400">Offline-First Mobile GIS</span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <span className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Core Stack</span>
                <span className="text-sm font-semibold text-emerald-400">React Native + SQLite</span>
              </div>
              <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <span className="block text-[11px] text-slate-400 uppercase font-semibold mb-1">Domain</span>
                <span className="text-sm font-semibold text-emerald-400">Community Conservation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="relative z-10 py-20 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <span className="text-emerald-600 text-xs font-bold tracking-wider uppercase mb-2 block">Portfolio</span>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured Projects & Works</h2>
          </div>

          {/* Filter Tabs & Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search projects..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white rounded-full text-xs border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 w-full sm:w-48 transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 bg-white p-1 rounded-full border border-slate-200">
              {['All', 'GIS', 'Web', 'Mobile'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeTab === tab 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filter Results Status */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 my-8">
            <p className="text-slate-500 text-sm">No projects matched your criteria.</p>
            <button 
              onClick={() => { setActiveTab('All'); setSearchQuery(''); }}
              className="mt-4 text-xs font-bold text-emerald-600 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Project Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div 
                key={project.id} 
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative overflow-hidden h-64 bg-slate-100">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm">
                    {project.category}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tags.map((tag, i) => (
                        <span key={i} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">
                      {project.title}
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    {project.isExternal ? (
                      <a 
                        href={project.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-4 py-2 rounded-xl transition-all"
                      >
                        <span>Visit Live Website</span>
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <button 
                        onClick={() => {
                          if (project.link.startsWith('#')) {
                            scrollToSection(project.link.replace('#', ''));
                          }
                        }}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-emerald-600 bg-slate-100 hover:bg-emerald-50 px-4 py-2 rounded-xl transition-all"
                      >
                        <span>View Details</span>
                        <ArrowUpRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="relative z-10 border-t border-slate-200/80 bg-white/60 backdrop-blur-md pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Brand & bio snippet */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-sky-600 flex items-center justify-center text-white font-bold text-sm">
                K
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Kurniawan<span className="text-emerald-600">.dev</span>
              </span>
            </div>
            
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed mb-6">
              Front-End & Mobile GIS Engineer specialized in React, React Native, SQLite offline data synchronization, and field mapping for community conservation.
            </p>

            {/* Social Icons & Email Quick Copy */}
            <div className="flex gap-3 text-slate-400">
              <button 
                onClick={handleCopyEmail}
                className="hover:text-emerald-600 transition-colors p-2 bg-slate-100 rounded-lg text-slate-600" 
                title="Copy Email"
              >
                <Mail size={18} />
              </button>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors p-2 bg-slate-100 rounded-lg text-slate-600" title="GitHub">
                <Github size={18} />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors p-2 bg-slate-100 rounded-lg text-slate-600" title="LinkedIn">
                <Linkedin size={18} />
              </a>
              <a href="https://farmers4forest.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors p-2 bg-slate-100 rounded-lg text-slate-600" title="Farmers4Forest">
                <Globe size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><button onClick={() => scrollToSection('hero')} className="hover:text-emerald-600 transition-colors">Home</button></li>
              <li><button onClick={() => scrollToSection('about')} className="hover:text-emerald-600 transition-colors">About & Bio</button></li>
              <li><button onClick={() => scrollToSection('services')} className="hover:text-emerald-600 transition-colors">Services</button></li>
              <li><button onClick={() => scrollToSection('projects')} className="hover:text-emerald-600 transition-colors">Projects</button></li>
              <li><button onClick={() => scrollToSection('thesis')} className="hover:text-emerald-600 transition-colors">Thesis Research</button></li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="font-bold text-slate-900 mb-4 text-sm">Direct Contact</h4>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-emerald-600 shrink-0" />
                <a href="mailto:kiapndy@gmail.com" className="hover:underline">kiapndy@gmail.com</a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                <span>Pontianak, Kalimantan Barat, Indonesia</span>
              </li>
              <li className="flex items-center gap-2">
                <GraduationCap size={16} className="text-emerald-600 shrink-0" />
                <span>Universitas Muhammadiyah Pontianak</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 border-t border-slate-200/80 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Kurniawan Alhamdani Pandayu Putra. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="https://farmers4forest.org" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">Farmers4Forest Foundation</a>
            <a href="https://spks.or.id" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-600 transition-colors">SPKS</a>
          </div>
        </div>
      </footer>

      {isContactOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 relative overflow-hidden border border-slate-100">
            
            {/* Close Button */}
            <button 
              onClick={() => setIsContactOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-full hover:bg-slate-100"
            >
              <X size={20} />
            </button>

            {formSubmitted ? (
              <div className="py-12 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-sm">Thank you for reaching out. Kurniawan will get back to you shortly.</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <span className="text-emerald-600 font-bold text-xs uppercase tracking-wider">Get In Touch</span>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">Connect with Kurniawan</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-500">kiapndy@gmail.com</p>
                    <button 
                      onClick={handleCopyEmail}
                      className="text-[10px] text-emerald-600 hover:underline font-semibold"
                    >
                      {copiedEmail ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Your Name" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="your.email@example.com" 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Message / Inquiry</label>
                    <textarea 
                      rows={4} 
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Share your inquiry regarding Mobile GIS, Front-End development, or field collaboration..." 
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center gap-2 active:scale-[0.98]"
                  >
                    <span>Send Message</span>
                    <Send size={16} />
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}