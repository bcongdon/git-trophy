import dummyData from './data/gaearon2016.json'

import {
  RECEIVED_CONTRIBUTION_DATA,
  START_CONTRIBUTION_UPDATE,
  UPDATE_SELECTED_YEAR,
  UPDATE_SELECTED_ENTITY } from './types'

const INITIAL_STATE = {
  data: dummyData.contributions,
  entity: dummyData.username,
  year: dummyData.year,
  loadingContributions: false,
  previewEntity: dummyData.username,
  previewYear: dummyData.year
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    case RECEIVED_CONTRIBUTION_DATA:
      return {
        ...state,
        data: action.data,
        previewEntity: action.entity,
        previewYear: action.year,
        loadingContributions: false
      }
    case START_CONTRIBUTION_UPDATE:
      return {...state, loadingContributions: true}
    case UPDATE_SELECTED_YEAR:
      return {...state, year: action.year}
    case UPDATE_SELECTED_ENTITY:
      return {...state, entity: action.entity}
  }
  return state
}
