import { createSelector } from 'reselect'

export const selectAuth = state => state.auth
export const selectAuthUser = createSelector([selectAuth], authState => authState.user)
export const selectAuthAccessToken = createSelector([selectAuth], authState => authState.accessToken)