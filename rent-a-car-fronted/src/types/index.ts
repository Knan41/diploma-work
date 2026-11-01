// Car
export interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  fuel: string;
  transmission: string;
  seats: number;
  category: string;
  categoryLabel?: string;
  image: string;
  description: string;
  engine: string;
  horsepower: number;
  acceleration: number;
  available: boolean;
}

export interface CreateCarRequest {
  brand: string;
  model: string;
  year: number;
  pricePerDay: number;
  fuel?: string;
  transmission?: string;
  seats?: number;
  category?: string;
  image?: string;
  description?: string;
  engine?: string;
  horsepower?: number;
  acceleration?: number;
  available?: boolean;
}

export interface UpdateCarRequest {
  id: number;
  data: Partial<CreateCarRequest>;
}

export interface CarsQueryParams {
  search?: string;
  brand?: string;
  category?: string;
  fuel?: string;
  transmission?: string;
  minPrice?: number;
  maxPrice?: number;
  available?: boolean;
}

export interface BookedDateRange {
  startDate: string;
  endDate: string;
}

// User
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  phone?: string | null;
  createdAt?: string;
}

export interface UpdateUserRoleRequest {
  id: number;
  role: 'user' | 'admin';
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface UpdateProfileRequest {
  name?: string;
  password?: string;
}

// Booking
export interface Booking {
  id: number;
  carId: number;
  userId: number;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: 'pending' | 'approved' | 'cancelled';
  cancelledBy?: 'user' | 'admin' | null;
  createdAt: string;
  car: {
    id: number;
    brand: string;
    model: string;
    image: string;
    pricePerDay: number;
  };
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateBookingRequest {
  carId: number;
  startDate: string;
  endDate: string;
}

export interface UpdateBookingStatusRequest {
  id: number;
  status: 'pending' | 'approved' | 'cancelled';
}

// Stats
export interface StatsResponse {
  totalCars: number;
  availableCars: number;
  totalUsers: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

// Contact messages
export interface ContactMessage {
  id: number;
  name: string;
  message: string;
  userId: number | null;
  createdAt: string;
}

export interface SendMessageRequest {
  name: string;
  message: string;
}

// Category
export interface Category {
  id: number;
  value: string;
  label: string;
}
