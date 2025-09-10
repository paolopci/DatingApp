export interface UserParams {
  pageNumber: number;
  pageSize: number;
  gender?: string;
  minAge?: number;
  maxAge?: number;
  orderBy?: 'created' | 'lastActive';
  orderDirection?: 'asc' | 'desc';
}
