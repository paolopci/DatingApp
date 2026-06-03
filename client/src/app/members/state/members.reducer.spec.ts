import { Member } from '../../_models/member';
import { Paginator } from '../../_models/pagination';
import { membersActions } from './members.actions';
import { initialMembersState, membersFeature } from './members.reducer';

describe('membersFeature reducer', () => {
  const member: Member = {
    id: 1,
    username: 'maria',
    age: 28,
    photoUrl: 'old.jpg',
    knownAs: 'Maria',
    created: new Date('2025-01-01'),
    lastActive: new Date('2025-01-02'),
    gender: 'female',
    introduction: 'Intro',
    interests: 'Music',
    lookingFor: 'Friendship',
    city: 'Roma',
    country: 'Italia',
    photos: [{ id: 10, url: 'old.jpg', isMain: true }]
  };

  const pagination: Paginator = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 1,
    totalPages: 1
  };

  it('should expose the initial members state', () => {
    expect(initialMembersState.params).toEqual({
      pageNumber: 1,
      pageSize: 5,
      gender: undefined,
      minAge: 18,
      maxAge: 100,
      orderBy: 'lastActive',
      orderDirection: 'desc'
    });
    expect(initialMembersState.members).toEqual([]);
  });

  it('should update list params and keep existing defaults', () => {
    const state = membersFeature.reducer(
      initialMembersState,
      membersActions.memberParamsChanged({ params: { pageNumber: 2, gender: 'female' } })
    );

    expect(state.params).toEqual({
      ...initialMembersState.params,
      pageNumber: 2,
      gender: 'female'
    });
  });

  it('should store paginated members when load succeeds', () => {
    const state = membersFeature.reducer(
      { ...initialMembersState, loading: true },
      membersActions.membersLoaded({ members: [member], pagination })
    );

    expect(state.members).toEqual([member]);
    expect(state.pagination).toEqual(pagination);
    expect(state.loading).toBeFalse();
  });

  it('should upsert a loaded member detail', () => {
    const state = membersFeature.reducer(
      initialMembersState,
      membersActions.memberLoaded({ member })
    );

    expect(state.selectedMember).toEqual(member);
    expect(state.memberEntities[member.username]).toEqual(member);
  });

  it('should sync main photo across selected member and list', () => {
    const state = membersFeature.reducer(
      {
        ...initialMembersState,
        members: [member],
        selectedMember: member,
        memberEntities: { [member.username]: member }
      },
      membersActions.mainPhotoUpdated({
        username: 'maria',
        photoId: 11,
        photoUrl: 'new.jpg'
      })
    );

    expect(state.members[0].photoUrl).toBe('new.jpg');
    expect(state.selectedMember?.photoUrl).toBe('new.jpg');
  });
});
