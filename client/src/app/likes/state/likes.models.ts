import { Member } from '../../_models/member';
import { Paginator } from '../../_models/pagination';
import { LikesParams } from '../../_models/likesParams';

export interface LikesState {
  likeIds: number[];
  members: Member[];
  pagination: Paginator | undefined;
  params: LikesParams;
  loading: boolean;
  error: string | null;
}
