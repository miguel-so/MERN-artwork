export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'artist' | 'super_admin';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Artist extends User {
  role: 'artist';
  bio?: string;
  profileImage?: string;
  contactInfo?: {
    phone?: string;
    website?: string;
    socialMedia?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
    };
  };
}

export interface Artwork {
  _id: string;
  title: string;
  description: string;
  image: string;
  images?: string[]; // For multiple images/gallery
  size: string;
  note?: string;
  sold: boolean;
  artistId: string;
  artist?: Artist;
  category?: string;
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
  artworkId?: string;
  artistId?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Favorite {
  artworkId: string;
  addedAt: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  bio?: string;
}

export interface ResetPasswordData {
  email: string;
}

export interface NewPasswordData {
  token: string;
  password: string;
  confirmPassword: string;
}
