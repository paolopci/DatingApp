import { createFeature, createReducer, on } from '@ngrx/store';
import { Member } from '../../_models/member';
import { UserParams } from '../../_models/userParams';
import { membersActions } from './members.actions';
import { MembersState } from './members.models';

export const defaultMemberParams = (gender: string | undefined = undefined): UserParams => ({
  pageNumber: 1,
  pageSize: 5,
  gender,
  minAge: 18,
  maxAge: 100,
  orderBy: 'lastActive',
  orderDirection: 'desc'
});

export const initialMembersState: MembersState = {
  members: [],
  memberEntities: {},
  selectedMember: null,
  pagination: undefined,
  params: defaultMemberParams(),
  loading: false,
  error: null
};

const upsertMember = (entities: Record<string, Member>, member: Member) => ({
  ...entities,
  [member.username]: member
});

const updateMainPhoto = (member: Member, photoId: number, photoUrl: string): Member => ({
  ...member,
  photoUrl,
  photos: (member.photos ?? []).map(photo => ({
    ...photo,
    isMain: photo.id === photoId
  }))
});

const reducer = createReducer(
  initialMembersState,
  on(membersActions.loadMembers, (state): MembersState => ({
    ...state,
    loading: true,
    error: null
  })),
  on(membersActions.membersLoaded, (state, { members, pagination }): MembersState => ({
    ...state,
    members,
    pagination,
    memberEntities: members.reduce(
      (entities, member) => upsertMember(entities, member),
      state.memberEntities
    ),
    loading: false,
    error: null
  })),
  on(membersActions.membersLoadFailed, (state, { error }): MembersState => ({
    ...state,
    loading: false,
    error
  })),
  on(membersActions.memberParamsChanged, (state, { params }): MembersState => ({
    ...state,
    params: { ...state.params, ...params }
  })),
  on(membersActions.memberParamsReset, (state, { gender }): MembersState => ({
    ...state,
    params: defaultMemberParams(gender)
  })),
  on(membersActions.loadMember, (state): MembersState => ({
    ...state,
    loading: true,
    error: null
  })),
  on(membersActions.memberLoaded, (state, { member }): MembersState => ({
    ...state,
    selectedMember: member,
    memberEntities: upsertMember(state.memberEntities, member),
    loading: false,
    error: null
  })),
  on(membersActions.memberUpdated, (state, { member }): MembersState => ({
    ...state,
    selectedMember: member,
    members: state.members.map(item => item.username === member.username ? member : item),
    memberEntities: upsertMember(state.memberEntities, member),
    error: null
  })),
  on(membersActions.mainPhotoUpdated, (state, { username, photoId, photoUrl }): MembersState => {
    const selectedMember = state.selectedMember?.username === username
      ? updateMainPhoto(state.selectedMember, photoId, photoUrl)
      : state.selectedMember;
    const entity = state.memberEntities[username];

    return {
      ...state,
      selectedMember,
      members: state.members.map(member =>
        member.username === username ? updateMainPhoto(member, photoId, photoUrl) : member
      ),
      memberEntities: entity
        ? upsertMember(state.memberEntities, updateMainPhoto(entity, photoId, photoUrl))
        : state.memberEntities
    };
  }),
  on(membersActions.photoAdded, (state, { username, photo }): MembersState => {
    const appendPhoto = (member: Member): Member => ({
      ...member,
      photos: [...(member.photos ?? []), photo]
    });
    const selectedMember = state.selectedMember?.username === username
      ? appendPhoto(state.selectedMember)
      : state.selectedMember;
    const entity = state.memberEntities[username];

    return {
      ...state,
      selectedMember,
      memberEntities: entity ? upsertMember(state.memberEntities, appendPhoto(entity)) : state.memberEntities
    };
  }),
  on(membersActions.photoDeleted, (state, { username, photoId }): MembersState => {
    const removePhoto = (member: Member): Member => ({
      ...member,
      photos: (member.photos ?? []).filter(photo => photo.id !== photoId)
    });
    const selectedMember = state.selectedMember?.username === username
      ? removePhoto(state.selectedMember)
      : state.selectedMember;
    const entity = state.memberEntities[username];

    return {
      ...state,
      selectedMember,
      memberEntities: entity ? upsertMember(state.memberEntities, removePhoto(entity)) : state.memberEntities
    };
  })
);

export const membersFeature = createFeature({
  name: 'members',
  reducer
});
