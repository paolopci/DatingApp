import { Member } from '../../_models/member';
import { Paginator } from '../../_models/pagination';
import { UserParams } from '../../_models/userParams';

export interface MembersState {
  members: Member[];
  memberEntities: Record<string, Member>;
  selectedMember: Member | null;
  pagination: Paginator | undefined;
  params: UserParams;
  loading: boolean;
  error: string | null;
}
