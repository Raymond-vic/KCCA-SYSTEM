import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Store, 
  Users, 
  FileText, 
  Settings, 
  LogOut, 
  Plus, 
  CheckCircle, 
  XCircle, 
  Clock,
  Search,
  Bell,
  Menu,
  ChevronRight,
  ShieldCheck,
  Building2,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Market, Vendor, UserRole } from './types';

// --- Components ---

const Button = ({ children, onClick, variant = 'primary', className = '', disabled = false, type = 'button' }: any) => {
  const variants: any = {
    primary: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
    secondary: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-100'
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, disabled = false }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>}
    <input
      type={type}
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white disabled:bg-slate-50"
    />
  </div>
);

const Select = ({ label, value, onChange, options, required = false }: any) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-sm font-semibold text-slate-700">{label} {required && <span className="text-red-500">*</span>}</label>}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all bg-white"
    >
      <option value="">Select an option</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

const Badge = ({ children, variant = 'neutral' }: any) => {
  const variants: any = {
    neutral: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${variants[variant]}`}>
      {children}
    </span>
  );
};

// --- Views ---

const Login = ({ onLogin }: { onLogin: (user: User) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('applicant');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';
    const body = isRegistering ? { name, email, password, role } : { email, password };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const user = await res.json();
        onLogin(user);
      } else {
        const data = await res.json();
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-xl shadow-slate-200/50 w-full max-w-md border border-slate-100"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-slate-200 p-2">
            <img 
              src="https://www.kcca.go.ug/img/logo.png" 
              alt="KCCA Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">KCCA Market System</h1>
          <p className="text-slate-500 text-sm">Kampala Capital City Authority</p>
        </div>

        <form onSubmit={handleSubmit} className="space-gap flex flex-col gap-4">
          {isRegistering && (
            <Input label="Full Name" value={name} onChange={setName} required />
          )}
          <Input label="Email Address" type="email" value={email} onChange={setEmail} required />
          <Input label="Password" type="password" value={password} onChange={setPassword} required />
          
          {isRegistering && (
            <Select 
              label="Account Type" 
              value={role} 
              onChange={(v: any) => setRole(v)} 
              options={[
                { label: 'Market Owner (Applicant)', value: 'applicant' },
                { label: 'Market Vendor', value: 'vendor' }
              ]}
              required 
            />
          )}

          {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

          <Button type="submit" className="w-full mt-2">
            {isRegistering ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-emerald-600 text-sm font-semibold hover:underline"
          >
            {isRegistering ? 'Already have an account? Sign In' : 'Need an account? Register here'}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const MarketRegistrationForm = ({ user, onSuccess }: { user: User, onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    ownerName: user.name,
    ownerId: '',
    ownerPhone: '',
    ownerEmail: user.email,
    ownerAddress: '',
    marketName: '',
    marketAddress: '',
    marketType: 'Public',
    marketSize: '',
    stallsCount: '',
    yearEstablished: '',
    operatingDays: 'Monday-Sunday',
    operatingHours: '06:00 - 18:00',
    marketManagerName: '',
    marketManagerContact: '',
    declaration: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration) return alert("Please accept the declaration");
    
    const res = await fetch('/api/markets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("Market registration submitted successfully!");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-8">
      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">1. Market Owner Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Owner Full Name" value={formData.ownerName} onChange={(v: any) => setFormData({...formData, ownerName: v})} required />
          <Input label="National ID / Passport No." value={formData.ownerId} onChange={(v: any) => setFormData({...formData, ownerId: v})} required />
          <Input label="Phone Number" value={formData.ownerPhone} onChange={(v: any) => setFormData({...formData, ownerPhone: v})} required />
          <Input label="Email Address" value={formData.ownerEmail} onChange={(v: any) => setFormData({...formData, ownerEmail: v})} />
          <div className="md:col-span-2">
            <Input label="Physical Address" value={formData.ownerAddress} onChange={(v: any) => setFormData({...formData, ownerAddress: v})} required />
          </div>
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">2. Market Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Market Name" value={formData.marketName} onChange={(v: any) => setFormData({...formData, marketName: v})} required />
          <Input label="Market Physical Address" value={formData.marketAddress} onChange={(v: any) => setFormData({...formData, marketAddress: v})} required />
          <Select 
            label="Market Type" 
            value={formData.marketType} 
            onChange={(v: any) => setFormData({...formData, marketType: v})} 
            options={[
              { label: 'Public', value: 'Public' },
              { label: 'Private', value: 'Private' },
              { label: 'Community', value: 'Community' }
            ]}
            required 
          />
          <Input label="Market Size (Sq. Meters)" type="number" value={formData.marketSize} onChange={(v: any) => setFormData({...formData, marketSize: v})} required />
          <Input label="Number of Stalls/Shops" type="number" value={formData.stallsCount} onChange={(v: any) => setFormData({...formData, stallsCount: v})} required />
          <Input label="Year Established" type="number" value={formData.yearEstablished} onChange={(v: any) => setFormData({...formData, yearEstablished: v})} />
        </div>
      </section>

      <section>
        <h3 className="text-lg font-bold text-slate-900 mb-4 border-b pb-2">3. Operational Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Operating Days" value={formData.operatingDays} onChange={(v: any) => setFormData({...formData, operatingDays: v})} required />
          <Input label="Operating Hours" value={formData.operatingHours} onChange={(v: any) => setFormData({...formData, operatingHours: v})} required />
          <Input label="Market Manager Name" value={formData.marketManagerName} onChange={(v: any) => setFormData({...formData, marketManagerName: v})} required />
          <Input label="Market Manager Contact" value={formData.marketManagerContact} onChange={(v: any) => setFormData({...formData, marketManagerContact: v})} required />
        </div>
      </section>

      <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            checked={formData.declaration} 
            onChange={(e) => setFormData({...formData, declaration: e.target.checked})}
            className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <p className="text-sm text-slate-600">
            I declare that the information provided is true and correct to the best of my knowledge. I understand that any false information may lead to rejection or legal action.
          </p>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onSuccess}>Cancel</Button>
        <Button type="submit">Submit Registration</Button>
      </div>
    </form>
  );
};

const VendorRegistrationForm = ({ user, markets, onSuccess }: { user: User, markets: Market[], onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    userId: user.id,
    marketId: '',
    fullName: user.name,
    nationalId: '',
    phone: '',
    businessType: '',
    products: '',
    stallType: 'Stall',
    declaration: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.declaration) return alert("Please accept the declaration");
    
    const res = await fetch('/api/vendors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });
    if (res.ok) {
      alert("Vendor application submitted successfully!");
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" value={formData.fullName} onChange={(v: any) => setFormData({...formData, fullName: v})} required />
        <Input label="National ID No." value={formData.nationalId} onChange={(v: any) => setFormData({...formData, nationalId: v})} required />
        <Input label="Phone Number" value={formData.phone} onChange={(v: any) => setFormData({...formData, phone: v})} required />
        <Select 
          label="Preferred Market" 
          value={formData.marketId} 
          onChange={(v: any) => setFormData({...formData, marketId: v})} 
          options={markets.filter(m => m.status === 'approved').map(m => ({ label: m.name, value: m.id }))}
          required 
        />
        <Input label="Business Type" placeholder="e.g. Retail, Wholesale" value={formData.businessType} onChange={(v: any) => setFormData({...formData, businessType: v})} required />
        <Input label="Products/Commodities" placeholder="e.g. Vegetables, Clothing" value={formData.products} onChange={(v: any) => setFormData({...formData, products: v})} required />
        <Select 
          label="Preferred Stall Type" 
          value={formData.stallType} 
          onChange={(v: any) => setFormData({...formData, stallType: v})} 
          options={[
            { label: 'Stall', value: 'Stall' },
            { label: 'Shop', value: 'Shop' },
            { label: 'Open Space', value: 'Open Space' }
          ]}
          required 
        />
      </div>

      <section className="bg-slate-50 p-4 rounded-lg border border-slate-200">
        <div className="flex items-start gap-3">
          <input 
            type="checkbox" 
            checked={formData.declaration} 
            onChange={(e) => setFormData({...formData, declaration: e.target.checked})}
            className="mt-1 w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
          />
          <p className="text-sm text-slate-600">
            I declare that the information provided is true and correct. I agree to abide by the market rules and regulations set by KCCA.
          </p>
        </div>
      </section>

      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onSuccess}>Cancel</Button>
        <Button type="submit">Submit Application</Button>
      </div>
    </form>
  );
};

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [markets, setMarkets] = useState<Market[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('kcca_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      const [mRes, vRes] = await Promise.all([
        fetch('/api/markets'),
        fetch('/api/vendors')
      ]);
      if (mRes.ok) setMarkets(await mRes.json());
      if (vRes.ok) setVendors(await vRes.json());
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  const handleLogin = (u: User) => {
    setUser(u);
    localStorage.setItem('kcca_user', JSON.stringify(u));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('kcca_user');
  };

  const updateMarketStatus = async (id: number, status: string) => {
    const res = await fetch(`/api/markets/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) fetchData();
  };

  const updateVendorStatus = async (id: number, status: string, extra = {}) => {
    const res = await fetch(`/api/vendors/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, ...extra }),
    });
    if (res.ok) fetchData();
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>;
  if (!user) return <Login onLogin={handleLogin} />;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <Badge variant="success">Approved</Badge>;
      case 'rejected': return <Badge variant="danger">Rejected</Badge>;
      case 'pending': return <Badge variant="warning">Pending</Badge>;
      case 'recommended': return <Badge variant="info">Recommended</Badge>;
      case 'verified': return <Badge variant="info">Verified</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        activeTab === id 
          ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' 
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col gap-8 fixed h-full">
        <div className="flex items-center gap-3 px-2">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm p-1 border border-slate-100">
            <img 
              src="https://www.kcca.go.ug/img/logo.png" 
              alt="KCCA Logo" 
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <h2 className="font-bold text-slate-900 leading-tight">KCCA</h2>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Market System</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2 flex-1">
          <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
          {(user.role === 'admin' || user.role === 'officer' || user.role === 'director' || user.role === 'manager') && (
            <SidebarItem id="markets" icon={Store} label="Markets" />
          )}
          {(user.role === 'admin' || user.role === 'supervisor' || user.role === 'manager') && (
            <SidebarItem id="vendors" icon={Users} label="Vendors" />
          )}
          {user.role === 'admin' && (
            <SidebarItem id="users" icon={ShieldCheck} label="User Management" />
          )}
          <SidebarItem id="reports" icon={FileText} label="Reports" />
        </nav>

        <div className="pt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold">{user.role}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize">{activeTab}</h1>
            <p className="text-slate-500">Welcome back, {user.name}</p>
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell size={20} />
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-8"
            >
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Markets', value: markets.length, icon: Store, color: 'bg-blue-500' },
                  { label: 'Active Vendors', value: vendors.filter(v => v.status === 'approved').length, icon: Users, color: 'bg-emerald-500' },
                  { label: 'Pending Applications', value: markets.filter(m => m.status === 'pending').length + vendors.filter(v => v.status === 'pending').length, icon: Clock, color: 'bg-amber-500' },
                  { label: 'Approved Today', value: 0, icon: CheckCircle, color: 'bg-purple-500' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      <stat.icon size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Section */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-bold text-slate-900">Quick Actions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(user.role === 'applicant' || user.role === 'officer' || user.role === 'admin') && (
                    <div className="bg-emerald-600 p-6 rounded-2xl text-white shadow-xl shadow-emerald-100 flex flex-col gap-4">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        <Plus size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Register New Market</h3>
                        <p className="text-emerald-50/80 text-sm">Submit a new market registration request to KCCA.</p>
                      </div>
                      <Button variant="secondary" className="w-fit bg-white text-emerald-600 border-none" onClick={() => { setActiveTab('markets'); setIsFormOpen(true); }}>
                        Start Application
                      </Button>
                    </div>
                  )}
                  {(user.role === 'vendor' || user.role === 'admin') && (
                    <div className="bg-slate-900 p-6 rounded-2xl text-white shadow-xl shadow-slate-200 flex flex-col gap-4">
                      <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                        <UserPlus size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">Apply for Stall</h3>
                        <p className="text-slate-400 text-sm">Register as a vendor in one of the KCCA approved markets.</p>
                      </div>
                      <Button variant="secondary" className="w-fit bg-white text-slate-900 border-none" onClick={() => { setActiveTab('vendors'); setIsFormOpen(true); }}>
                        Apply Now
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                  <h2 className="font-bold text-slate-900">Recent Applications</h2>
                  <Button variant="ghost" className="text-sm">View All</Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                      <tr>
                        <th className="px-6 py-4">Reference</th>
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Type</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {markets.slice(0, 5).map((m) => (
                        <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-emerald-600">{m.ref_no}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{m.name}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">Market</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{new Date(m.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{getStatusBadge(m.status)}</td>
                        </tr>
                      ))}
                      {vendors.slice(0, 5).map((v) => (
                        <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs font-bold text-blue-600">{v.ref_no}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{v.full_name}</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">Vendor</td>
                          <td className="px-6 py-4 text-slate-500 text-sm">{new Date(v.created_at).toLocaleDateString()}</td>
                          <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'markets' && (
            <motion.div 
              key="markets"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Market Registrations</h2>
                {!isFormOpen && (user.role === 'applicant' || user.role === 'officer' || user.role === 'admin') && (
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus size={18} /> New Registration
                  </Button>
                )}
              </div>

              {isFormOpen ? (
                <MarketRegistrationForm user={user} onSuccess={() => { setIsFormOpen(false); fetchData(); }} />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <tr>
                          <th className="px-6 py-4">Ref No</th>
                          <th className="px-6 py-4">Market Name</th>
                          <th className="px-6 py-4">Owner</th>
                          <th className="px-6 py-4">Type</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {markets.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs font-bold">{m.ref_no}</td>
                            <td className="px-6 py-4 font-medium text-slate-900">{m.name}</td>
                            <td className="px-6 py-4 text-slate-500 text-sm">{m.owner_name}</td>
                            <td className="px-6 py-4 text-slate-500 text-sm">{m.type}</td>
                            <td className="px-6 py-4">{getStatusBadge(m.status)}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                {user.role === 'manager' && m.status === 'pending' && (
                                  <Button variant="ghost" className="text-emerald-600 p-1" onClick={() => updateMarketStatus(m.id, 'recommended')}>
                                    Recommend
                                  </Button>
                                )}
                                {user.role === 'director' && m.status === 'recommended' && (
                                  <>
                                    <Button variant="ghost" className="text-emerald-600 p-1" onClick={() => updateMarketStatus(m.id, 'approved')}>
                                      Approve
                                    </Button>
                                    <Button variant="ghost" className="text-red-600 p-1" onClick={() => updateMarketStatus(m.id, 'rejected')}>
                                      Reject
                                    </Button>
                                  </>
                                )}
                                <Button variant="ghost" className="p-1"><ChevronRight size={18} /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'vendors' && (
            <motion.div 
              key="vendors"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-900">Vendor Applications</h2>
                {!isFormOpen && (user.role === 'vendor' || user.role === 'admin') && (
                  <Button onClick={() => setIsFormOpen(true)}>
                    <Plus size={18} /> New Application
                  </Button>
                )}
              </div>

              {isFormOpen ? (
                <VendorRegistrationForm user={user} markets={markets} onSuccess={() => { setIsFormOpen(false); fetchData(); }} />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                        <tr>
                          <th className="px-6 py-4">Ref No</th>
                          <th className="px-6 py-4">Vendor Name</th>
                          <th className="px-6 py-4">Market</th>
                          <th className="px-6 py-4">Stall No</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {vendors.map((v) => (
                          <tr key={v.id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-xs font-bold">{v.ref_no}</td>
                            <td className="px-6 py-4 font-medium text-slate-900">{v.full_name}</td>
                            <td className="px-6 py-4 text-slate-500 text-sm">{v.market_name}</td>
                            <td className="px-6 py-4 text-slate-500 text-sm font-mono">{v.stall_no || '-'}</td>
                            <td className="px-6 py-4">{getStatusBadge(v.status)}</td>
                            <td className="px-6 py-4">
                              <div className="flex gap-2">
                                {user.role === 'supervisor' && v.status === 'pending' && (
                                  <Button variant="ghost" className="text-emerald-600 p-1" onClick={() => updateVendorStatus(v.id, 'verified')}>
                                    Verify
                                  </Button>
                                )}
                                {user.role === 'manager' && v.status === 'verified' && (
                                  <Button variant="ghost" className="text-emerald-600 p-1" onClick={() => {
                                    const stall = prompt("Enter Stall Number to allocate:");
                                    if (stall) updateVendorStatus(v.id, 'approved', { stall_no: stall });
                                  }}>
                                    Approve & Allocate
                                  </Button>
                                )}
                                <Button variant="ghost" className="p-1"><ChevronRight size={18} /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div 
              key="reports"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Market Statistics</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Public Markets</span>
                    <span className="font-bold">{markets.filter(m => m.type === 'Public').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Private Markets</span>
                    <span className="font-bold">{markets.filter(m => m.type === 'Private').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Community Markets</span>
                    <span className="font-bold">{markets.filter(m => m.type === 'Community').length}</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Vendor Occupancy</h3>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Total Stalls</span>
                    <span className="font-bold">{markets.reduce((acc, m) => acc + m.stalls_count, 0)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Occupied Stalls</span>
                    <span className="font-bold">{vendors.filter(v => v.status === 'approved').length}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">Available Stalls</span>
                    <span className="font-bold">{markets.reduce((acc, m) => acc + m.stalls_count, 0) - vendors.filter(v => v.status === 'approved').length}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
