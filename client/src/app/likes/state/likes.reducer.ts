import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { likesActions } from './likes.actions';
import { LikesState } from './likes.models';

export const initialLikesState: LikesState = {
  likeIds: [],
  members: [],
  pagination: undefined,
  params: { predicate: 'liked', pageNumber: 1, pageSize: 5 },
  loading: false,
  error: null
};

const toggleId = (ids: number[], memberId: number) =>
  ids.includes(memberId) ? ids.filter(id => id !== memberId) : [...ids, memberId];

const reducer = createReducer(
  initialLikesState,
  on(likesActions.loadLikeIds, (state): LikesState => ({
    ...state,
    error: null
  })),
  on(likesActions.likeIdsLoaded, (state, { ids }): LikesState => ({
    ...state,
    likeIds: ids
  })),
  on(likesActions.loadLikes, (state): LikesState => ({
    ...state,
    loading: true,
    error: null
  })),
  on(likesActions.likesLoaded, (state, { members, pagination }): LikesState => ({
    ...state,
    members,
    pagination,
    loading: false,
    error: null
  })),
  on(likesActions.likesLoadFailed, (state, { error }): LikesState => ({
    ...state,
    loading: false,
    error
  })),
  on(likesActions.likesPredicateChanged, (state, { predicate }): LikesState => ({
    ...state,
    params: { ...state.params, predicate, pageNumber: 1 }
  })),
  on(likesActions.likesPageChanged, (state, { pageNumber }): LikesState => ({
    ...state,
    params: { ...state.params, pageNumber }
  })),
  on(likesActions.likesPageSizeChanged, (state, { pageSize }): LikesState => ({
    ...state,
    params: { ...state.params, pageSize, pageNumber: 1 }
  })),
  on(likesActions.likeToggled, (state, { memberId }): LikesState => ({
    ...state,
    likeIds: toggleId(state.likeIds, memberId)
  })),
  on(likesActions.likeToggleFailed, (state, { memberId, error }): LikesState => ({
    ...state,
    likeIds: toggleId(state.likeIds, memberId),
    error
  }))
);

export const likesFeature = createFeature({
  name: 'likes',
  reducer,
  extraSelectors: ({ selectLikeIds }) => ({
    selectHasLiked: (memberId: number) => createSelector(
      selectLikeIds,
      likeIds => likeIds.includes(memberId)
    )
  })
});
