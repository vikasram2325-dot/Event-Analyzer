export type UserRole = 'user' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  phoneNumber?: string;
  createdAt: string;
}

export type EventCategory =
  | 'Technology'
  | 'Business'
  | 'Design & Creative'
  | 'Music & Entertainment'
  | 'Workshops & Training'
  | 'Health & Wellness'
  | 'Sports & Fitness'
  | 'Community & Networking';

export type EventStatus = 'published' | 'draft' | 'completed' | 'cancelled';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: EventCategory;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:00 AM - 4:00 PM"
  venue: string;
  location: string; // City or "Online / Virtual"
  organizerName: string;
  organizerId?: string;
  maxParticipants: number;
  registeredCount: number;
  status: EventStatus;
  price: number; // 0 for Free
  featured?: boolean;
  createdAt: string;
  updatedAt?: string;
}

export type RegistrationStatus = 'confirmed' | 'cancelled';

export interface Registration {
  id: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventVenue: string;
  eventLocation: string;
  eventImageUrl: string;
  userId: string;
  userEmail: string;
  userName: string;
  userPhone: string;
  ticketCode: string;
  status: RegistrationStatus;
  registeredAt: string;
  cancelledAt?: string;
  checkedIn?: boolean;
  notes?: string;
}

export interface FilterOptions {
  searchQuery: string;
  category: string;
  location: string;
  date: string;
  sortBy: 'date-asc' | 'date-desc' | 'popular' | 'newest';
}

export interface AdminStats {
  totalEvents: number;
  activeEvents: number;
  totalRegistrations: number;
  totalParticipants: number;
  capacityUtilization: number;
  totalRevenue: number;
}
