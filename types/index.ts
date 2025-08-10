export interface IUser {
  _id: string;
  name: string;
  username: string;
  email: string;
  role: 'admin' | 'reader';
  avatar?: string;
  bio?: string;
  newsletter: boolean;
  isEmailVerified: boolean;
  lastLogin?: Date;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  author: IUser; // This will be populated
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  readingTime: number;
  views: number;
  likes: string[]; // Array of user IDs
  shares: {
    total: number;
    twitter: number;
    facebook: number;
    linkedin: number;
    whatsapp: number;
  };
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
  };
  publishedAt?: Date;
  isFeature: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  commentsCount?: number;
}

export interface IComment {
  _id: string;
  text: string;
  author: IUser;
  blog: string;
  createdAt?: string;
  updatedAt?: string;
} 