import { createSelector } from 'reselect'

export const selectPost = state => state.post
export const selectPostAllPosts = createSelector([selectPost], post => post.allPosts)
export const selectPostPostLoading = createSelector([selectPost], post => post.postLoading)
