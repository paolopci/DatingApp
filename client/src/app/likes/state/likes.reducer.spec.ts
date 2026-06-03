import { Member } from '../../_models/member';
import { Paginator } from '../../_models/pagination';
import { likesActions } from './likes.actions';
import { initialLikesState, likesFeature } from './likes.reducer';

describe('likesFeature reducer', () => {
  const member: Member = {
    id: 2,
    username: 'luigi',
    age: 30,
    photoUrl: 'luigi.jpg',
    knownAs: 'Luigi',
    created: new Date('2025-01-01'),
    lastActive: new Date('2025-01-02'),
    gender: 'male',
    introduction: '',
    interests: '',
    lookingFor: '',
    city: 'Roma',
    country: 'Italia',
    photos: []
  };

  const pagination: Paginator = {
    currentPage: 1,
    itemsPerPage: 5,
    totalItems: 1,
    totalPages: 1
  };

  it('should expose the initial likes state', () => {
    expect(initialLikesState).toEqual({
      likeIds: [],
      members: [],
      pagination: undefined,
      params: { predicate: 'liked', pageNumber: 1, pageSize: 5 },
      loading: false,
      error: null
    });
  });

  it('should store liked ids when they are loaded', () => {
    const state = likesFeature.reducer(
      initialLikesState,
      likesActions.likeIdsLoaded({ ids: [2, 4] })
    );

    expect(state.likeIds).toEqual([2, 4]);
  });

  it('should update params and reset page number when predicate changes', () => {
    const state = likesFeature.reducer(
      { ...initialLikesState, params: { predicate: 'liked', pageNumber: 3, pageSize: 10 } },
      likesActions.likesPredicateChanged({ predicate: 'mutual' })
    );

    expect(state.params).toEqual({ predicate: 'mutual', pageNumber: 1, pageSize: 10 });
  });

  it('should store paginated members when load succeeds', () => {
    const state = likesFeature.reducer(
      { ...initialLikesState, loading: true },
      likesActions.likesLoaded({ members: [member], pagination })
    );

    expect(state.members).toEqual([member]);
    expect(state.pagination).toEqual(pagination);
    expect(state.loading).toBeFalse();
  });

  it('should optimistically toggle like ids', () => {
    const liked = likesFeature.reducer(
      { ...initialLikesState, likeIds: [2] },
      likesActions.likeToggled({ memberId: 3 })
    );
    const unliked = likesFeature.reducer(
      { ...initialLikesState, likeIds: [2, 3] },
      likesActions.likeToggled({ memberId: 3 })
    );

    expect(liked.likeIds).toEqual([2, 3]);
    expect(unliked.likeIds).toEqual([2]);
  });
});
