import {
  Post,
  Comment,
  Like,
  Subscriber,
  Analytics,
} from '../generated/prisma';

// Base types from Prisma
export type BlogPost = Post;
export type BlogComment = Comment;
export type BlogLike = Like;
export type BlogSubscriber = Subscriber;
export type BlogAnalytics = Analytics;

// Extended types for UI components
export interface PostWithStats extends Post {
  likes: Like[];
  comments: Comment[];
  _count: {
    likes: number;
    comments: number;
  };
}

export interface CommentWithReplies extends Comment {
  replies: Comment[];
  _count?: {
    replies: number;
  };
}

// Form types for creating/editing
export interface CreatePostInput {
  title: string;
  excerpt: string;
  content: string;
  slug: string;
  heroImage?: string;
  published?: boolean;
  publishedAt?: Date;
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: string;
}

export interface CreateCommentInput {
  content: string;
  postId: string;
  authorName: string;
  authorEmail: string;
  parentId?: string;
}

export interface CreateSubscriberInput {
  email: string;
  name?: string;
  source?: string;
}

// API response types
export interface BlogPostsResponse {
  posts: PostWithStats[];
  totalCount: number;
  hasMore: boolean;
}

export interface BlogPostResponse {
  post: PostWithStats;
  comments: CommentWithReplies[];
}

// Filter and pagination types
export interface PostFilters {
  published?: boolean;
  authorId?: string;
  search?: string;
  tags?: string[];
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'publishedAt' | 'title' | 'views';
  sortOrder?: 'asc' | 'desc';
}

// Analytics types
export interface AnalyticsEvent {
  event: string;
  postId?: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

export interface PostAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares?: number;
}
