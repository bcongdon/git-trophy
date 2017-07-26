import dummyData from './data/gaearon2016.json'

import { UPDATE_CONTRIBUTION_DATA } from './types'
const INITIAL_STATE = {
  data: dummyData.contributions,
  username: dummyData.username,
  year: dummyData.year,
  loadingContributions: false
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case UPDATE_CONTRIBUTION_DATA:
      return {...state, data: action.data, loadingContributions: false}
  }
  return state
}
