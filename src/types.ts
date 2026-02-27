export type UserRole = 'admin' | 'officer' | 'applicant' | 'vendor' | 'director' | 'manager' | 'supervisor';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: string;
}

export interface Market {
  id: number;
  ref_no: string;
  name: string;
  owner_name: string;
  owner_id_no: string;
  owner_phone: string;
  owner_email?: string;
  owner_address: string;
  address: string;
  type: 'Private' | 'Public' | 'Community';
  size: number;
  stalls_count: number;
  year_established?: number;
  operating_days: string;
  operating_hours: string;
  manager_name: string;
  manager_contact: string;
  status: 'pending' | 'recommended' | 'approved' | 'rejected';
  created_at: string;
}

export interface Vendor {
  id: number;
  ref_no: string;
  user_id: number;
  market_id: number;
  market_name?: string;
  full_name: string;
  national_id: string;
  phone: string;
  business_type: string;
  products: string;
  stall_type?: string;
  stall_no?: string;
  status: 'pending' | 'verified' | 'approved' | 'rejected';
  created_at: string;
}
