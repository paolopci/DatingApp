export type LikesPredicate = 'liked' | 'likedBy' | 'mutual';

export interface LikesParams {
  predicate: LikesPredicate;
  pageNumber: number;
  pageSize: number;
}

