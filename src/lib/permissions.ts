import { supabase } from './supabase';

// Types for user roles and permissions
export type UserRole = 'admin' | 'user' | 'anonymous';

export interface PermissionContext {
  userId?: string;
  role: UserRole;
  isAuthenticated: boolean;
}

// Check if user is admin by checking against config table
export async function checkIsAdmin(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('config')
      .select('value')
      .eq('key', 'admin_user_ids')
      .single();

    if (error || !data) {
      return false;
    }

    const adminIds = data.value.split(',').map((id: string) => id.trim());
    return adminIds.includes(userId);
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}

// Permission checks for posts
export const postPermissions = {
  // Check if user can read a specific post
  async canRead(postId: string, userId?: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('published')
        .eq('id', postId)
        .single();

      if (error || !data) return false;

      // Anyone can read published posts
      if (data.published) return true;

      // Only authenticated admins can read unpublished posts
      if (!userId) return false;
      return await checkIsAdmin(userId);
    } catch (error) {
      console.error('Error checking post read permission:', error);
      return false;
    }
  },

  // Check if user can create posts (admins only)
  async canCreate(userId: string): Promise<boolean> {
    return await checkIsAdmin(userId);
  },

  // Check if user can update posts (admins only)
  async canUpdate(_postId: string, userId: string): Promise<boolean> {
    return await checkIsAdmin(userId);
  },

  // Check if user can delete posts (admins only)
  async canDelete(_postId: string, userId: string): Promise<boolean> {
    return await checkIsAdmin(userId);
  },
};

// Permission checks for comments
export const commentPermissions = {
  // Check if user can read comments (on published posts)
  async canRead(commentId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select(
          `
          id,
          post_id,
          posts!inner (
            published
          )
        `
        )
        .eq('id', commentId)
        .single();

      if (error || !data) return false;

      // Can read comments on published posts
      return (data.posts as { published: boolean }[])[0]?.published ?? false;
    } catch (error) {
      console.error('Error checking comment read permission:', error);
      return false;
    }
  },

  // Check if user can create comments (authenticated users on published posts)
  async canCreate(postId: string, userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('published')
        .eq('id', postId)
        .single();

      if (error || !data) return false;

      // Can comment on published posts if authenticated
      return data.published;
    } catch (error) {
      console.error('Error checking comment create permission:', error);
      return false;
    }
  },

  // Check if user can update comments (own comments or admin)
  async canUpdate(commentId: string, userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('comments')
        .select('author_id')
        .eq('id', commentId)
        .single();

      if (error || !data) return false;

      // User can update their own comments
      if (data.author_id === userId) return true;

      // Admins can update any comment
      return await checkIsAdmin(userId);
    } catch (error) {
      console.error('Error checking comment update permission:', error);
      return false;
    }
  },

  // Check if user can delete comments (own comments or admin)
  async canDelete(commentId: string, userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('comments')
        .select('author_id')
        .eq('id', commentId)
        .single();

      if (error || !data) return false;

      // User can delete their own comments
      if (data.author_id === userId) return true;

      // Admins can delete any comment
      return await checkIsAdmin(userId);
    } catch (error) {
      console.error('Error checking comment delete permission:', error);
      return false;
    }
  },
};

// Permission checks for likes
export const likePermissions = {
  // Check if user can like a post (authenticated users on published posts)
  async canCreate(postId: string, userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('posts')
        .select('published')
        .eq('id', postId)
        .single();

      if (error || !data) return false;

      // Can like published posts if authenticated
      return data.published;
    } catch (error) {
      console.error('Error checking like create permission:', error);
      return false;
    }
  },

  // Check if user can unlike (delete their own like)
  async canDelete(likeId: string, userId: string): Promise<boolean> {
    if (!userId) return false;

    try {
      const { data, error } = await supabase
        .from('likes')
        .select('user_id')
        .eq('id', likeId)
        .single();

      if (error || !data) return false;

      // User can delete their own likes
      return data.user_id === userId;
    } catch (error) {
      console.error('Error checking like delete permission:', error);
      return false;
    }
  },

  // Check if user can toggle like (same as create)
  async canToggle(postId: string, userId: string): Promise<boolean> {
    return await this.canCreate(postId, userId);
  },
};

// Permission checks for subscribers
export const subscriberPermissions = {
  // Check if user can read subscriber list (admins only)
  async canRead(userId: string): Promise<boolean> {
    return await checkIsAdmin(userId);
  },

  // Check if user can create subscription (anyone)
  async canCreate(): Promise<boolean> {
    return true;
  },

  // Check if user can update subscription (admins only for now)
  async canUpdate(_subscriberId: string, userId: string): Promise<boolean> {
    return await checkIsAdmin(userId);
  },

  // Check if user can delete subscription (admins only)
  async canDelete(_subscriberId: string, userId: string): Promise<boolean> {
    return await checkIsAdmin(userId);
  },
};

// Permission checks for analytics
export const analyticsPermissions = {
  // Check if user can read analytics (admins only)
  async canRead(userId: string): Promise<boolean> {
    return await checkIsAdmin(userId);
  },

  // Check if user can create analytics events (anyone)
  async canCreate(): Promise<boolean> {
    return true;
  },

  // Check if user can delete analytics (admins only)
  async canDelete(userId: string): Promise<boolean> {
    return await checkIsAdmin(userId);
  },
};

// Utility functions
export function isValidUserId(userId: string | undefined): userId is string {
  return typeof userId === 'string' && userId.length > 0;
}

// Check multiple permissions at once
export async function checkMultiplePermissions(
  permissions: Array<() => Promise<boolean>>
): Promise<boolean> {
  try {
    const results = await Promise.all(permissions);
    return results.every((result) => result);
  } catch (error) {
    console.error('Error checking multiple permissions:', error);
    return false;
  }
}

// Get user's own comments
export async function getUserComments(userId: string) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('author_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user comments:', error);
    return [];
  }

  return data || [];
}

// Get user's own likes
export async function getUserLikes(userId: string) {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user likes:', error);
    return [];
  }

  return data || [];
}

// Check if user has liked a specific post
export async function hasUserLikedPost(
  postId: string,
  userId: string
): Promise<boolean> {
  if (!userId) return false;

  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', userId)
    .single();

  return !error && !!data;
}

// Get like count for a post
export async function getPostLikeCount(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from('likes')
    .select('*', { count: 'exact' })
    .eq('post_id', postId);

  if (error) {
    console.error('Error fetching like count:', error);
    return 0;
  }

  return count || 0;
}

// Get comment count for a post
export async function getPostCommentCount(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from('comments')
    .select('*', { count: 'exact' })
    .eq('post_id', postId);

  if (error) {
    console.error('Error fetching comment count:', error);
    return 0;
  }

  return count || 0;
}
