import { createSelector } from 'reselect'

export const selectProfile = state => state.profile
export const selectProfileUserProfile = createSelector([selectProfile], profile => profile.userProfile)
export const selectProfileErrorMessage = createSelector([selectProfile], profile => profile.profileError)
export const selectProfileProfileLoading = createSelector([selectProfile], profile => profile.profileLoading)