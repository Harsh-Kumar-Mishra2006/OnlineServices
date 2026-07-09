export interface User {
  id: string;
  name: string;
  email: string | null;
  username: string | null;
  phone: string;
  role: 'user' | 'worker' | 'admin';
  profile: {
    age: string;
    gender: string;
    dob: string;
    address: string;
    education: string;
    bio: string;
    avatar: string;
  };
  isVerified: boolean;
  isActive: boolean;
}

export interface AuthResponse {
  success: boolean;
  data?: string;
  user?: User;
  message?: string;
  error?: string;
}

export interface LoginCredentials {
  email?: string;
  username?: string;
  phone?: string;
  password: string;
}

export interface SignupData {
  name: string;
  email?: string; // Made optional
  username?: string; // Made optional
  phone: string; // Required
  password: string;
  role?: 'user' | 'worker' | 'admin';
  age?: string;
  gender?: string;
  dob?: string;
}

export interface Worker {
  id?: string;
  _id?: string;
  name: string;
  email: string | null; // Made optional
  service_type: string;
  phone_number: string; // Primary identifier
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  experience_years: number;
  skills: string[];
  certifications: string[];
  bio: string;
  hourly_rate: number;
  availability: {
    monday: boolean;
    tuesday: boolean;
    wednesday: boolean;
    thursday: boolean;
    friday: boolean;
    saturday: boolean;
    sunday: boolean;
    start_time: string;
    end_time: string;
  };
  rating: number;
  total_reviews: number;
  status: 'active' | 'inactive' | 'pending' | 'busy';
  joining_date: string;
  created_by?: string;
}

export interface CreateWorkerData {
  name: string;
  email?: string; // Made optional
  username?: string; // Made optional
  phone: string; // Required
  password: string;
  service_type: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  experience_years: number;
  skills: string[];
  certifications: string[];
  bio: string;
  hourly_rate: number;
}

export const SERVICE_CATEGORIES = [
  'Plumber',
  'Electrician',
  'Carpenter',
  'Painter',
  'AC Technician',
  'Mechanic',
  'Cleaner',
  'Gardener',
  'Mason',
  'Roofing Specialist',
  'Flooring Specialist',
  'Appliance Repair',
  'Pest Control',
  'Locksmith',
  'Home Renovation',
  'Other'
] as const;

export type ServiceCategory = typeof SERVICE_CATEGORIES[number];

// ============= USER QUERY TYPES =============

export interface UserQuery {
  _id?: string;
  user: string | User;
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  issue: string;
  service_type_required: ServiceCategory;
  urgency: 'urgent' | 'very_high' | 'high' | 'medium' | 'low' | 'flexible';
  urgency_details?: {
    urgent: { timeframe: string; priority: number };
    very_high: { timeframe: string; priority: number };
    high: { timeframe: string; priority: number };
    medium: { timeframe: string; priority: number };
    low: { timeframe: string; priority: number };
    flexible: { timeframe: string; priority: number };
  };
  preferred_schedule?: {
    preferred_date: Date;
    preferred_time_slot: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
    flexible_timing: boolean;
  };
  attachments?: {
    filename: string;
    url: string;
    filetype: string;
    uploaded_at: Date;
  }[];
  budget?: {
    min: number;
    max: number | null;
    is_negotiable: boolean;
  };
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'rescheduled';
  assigned_to?: string | Worker;
  assigned_by?: string | User;
  assigned_at?: Date;
  created_at: Date;
  updated_at: Date;
  scheduled_date?: Date;
  completed_at?: Date;
  admin_notes?: string;
  worker_notes?: string;
  rating?: number;
  feedback?: string;
  feedback_given_at?: Date;
}

export interface CreateQueryData {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  issue: string;
  service_type_required: ServiceCategory;
  urgency: 'urgent' | 'very_high' | 'high' | 'medium' | 'low' | 'flexible';
  preferred_schedule?: {
    preferred_date: Date;
    preferred_time_slot: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
    flexible_timing: boolean;
  };
  budget?: {
    min: number;
    max: number | null;
    is_negotiable: boolean;
  };
}

export interface UpdateQueryData {
  issue?: string;
  service_type_required?: ServiceCategory;
  urgency?: 'urgent' | 'very_high' | 'high' | 'medium' | 'low' | 'flexible';
  address?: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    landmark?: string;
  };
  preferred_schedule?: {
    preferred_date: Date;
    preferred_time_slot: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
    flexible_timing: boolean;
  };
  budget?: {
    min: number;
    max: number | null;
    is_negotiable: boolean;
  };
}

export const URGENCY_LEVELS = {
  urgent: { label: '🚨 Urgent', timeframe: 'Within 1 hour', priority: 5 },
  very_high: { label: '🔴 Very High', timeframe: '2-3 hours', priority: 4 },
  high: { label: '🟠 High', timeframe: '4-6 hours', priority: 3 },
  medium: { label: '🟡 Medium', timeframe: 'Today', priority: 2 },
  low: { label: '🟢 Low', timeframe: '1-2 days', priority: 1 },
  flexible: { label: '📅 Flexible', timeframe: '3-5 days', priority: 0 }
} as const;

export const QUERY_STATUS = {
  pending: { label: '📋 Pending', color: 'bg-yellow-100 text-yellow-800' },
  assigned: { label: '👤 Assigned', color: 'bg-blue-100 text-blue-800' },
  in_progress: { label: '🔄 In Progress', color: 'bg-purple-100 text-purple-800' },
  completed: { label: '✅ Completed', color: 'bg-green-100 text-green-800' },
  cancelled: { label: '❌ Cancelled', color: 'bg-red-100 text-red-800' },
  rescheduled: { label: '📅 Rescheduled', color: 'bg-orange-100 text-orange-800' }
} as const;

export const TIME_SLOTS = {
  morning: '🌅 Morning (6AM - 12PM)',
  afternoon: '☀️ Afternoon (12PM - 5PM)',
  evening: '🌆 Evening (5PM - 9PM)',
  night: '🌙 Night (9PM - 6AM)',
  anytime: '🕐 Anytime'
} as const;

// ============= ASSIGNMENT TYPES =============

export interface Assignment {
  _id?: string;
  query: string | UserQuery;
  worker: string | Worker;
  assigned_by: string | User;
  assignment_date: Date;
  scheduled_date: Date;
  scheduled_time_slot: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
  status: 'assigned' | 'accepted' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
  worker_response: 'pending' | 'accepted' | 'rejected';
  worker_response_date?: Date;
  worker_notes?: string;
  admin_notes?: string;
  accepted_at?: Date;
  started_at?: Date;
  completed_at?: Date;
  estimated_hours: number;
  actual_hours: number;
  completion_notes?: string;
  completion_rating?: number;
  payment_status: 'pending' | 'processing' | 'completed' | 'failed';
  payment_amount: number;
  payment_date?: Date;
  worker_notified: boolean;
  worker_notified_at?: Date;
  user_notified: boolean;
  user_notified_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAssignmentData {
  queryId: string;
  workerId: string;
  scheduled_date: string;
  scheduled_time_slot?: 'morning' | 'afternoon' | 'evening' | 'night' | 'anytime';
  admin_notes?: string;
  estimated_hours?: number;
}

export interface AssignmentResponse {
  success: boolean;
  message?: string;
  data?: {
    assignment: any;
    query?: any;
    worker?: any;
  };
  error?: string;
}
// index.ts - Updated Billing Types

// ============= BILLING TYPES =============

export interface BillItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface CustomerAddress {
  street?: string;
  city?: string;
  state?: string;
  pincode?: string;
}

export interface Bill {
  _id?: string;
  bill_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: CustomerAddress;
  service_type: string;
  service_description: string;
  worker_name: string;
  worker_phone: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  total_amount: number;
  notes?: string;
  created_by: string | User;
  created_at: Date;
  updated_at: Date;
  is_deleted: boolean;
  is_paid?: boolean;
  payment?: string | Payment;
}

export interface CreateBillData {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address?: CustomerAddress;
  service_type: string;
  service_description: string;
  worker_name: string;
  worker_phone: string;
  items: BillItem[];
  discount?: number;
  notes?: string;
}

export interface UpdateBillData {
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: CustomerAddress;
  service_type?: string;
  service_description?: string;
  worker_name?: string;
  worker_phone?: string;
  items?: BillItem[];
  discount?: number;
  notes?: string;
}

// ============= PAYMENT TYPES =============

export interface PaymentScreenshot {
  public_id: string;
  url: string;
}

export interface Payment {
  _id?: string;
  bill: string | Bill;
  user: string | User;
  payment_amount: number;
  payment_screenshot: PaymentScreenshot;
  status: 'pending' | 'verified' | 'rejected';
  verified_by?: string | User;
  verified_at?: Date;
  verification_notes?: string;
  user_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface InitiatePaymentData {
  bill_id: string;
  user_notes?: string;
  screenshot: File;
}

export interface VerifyPaymentData {
  status: 'verified' | 'rejected';
  verification_notes?: string;
}