import dummyData from './data/gaearon2016.json'

import {
  RECEIVED_CONTRIBUTION_DATA,
  RECEIVED_YEAR_OPTIONS,
  START_CONTRIBUTION_UPDATE,
  START_YEARS_UPDATE,
  START_DOWNLOAD_LOAD,
  FINISHED_DOWNLOAD_LOAD,
  UPDATE_SELECTED_YEAR,
  UPDATE_SELECTED_ENTITY,
  UPDATE_SCENE_CONTAINER } from './types'

const INITIAL_STATE = {
  data: dummyData.contributions,
  entity: dummyData.username,
  year: dummyData.year,
  yearOptions: ['2017', '2016', '2015', '2014', '2013', '2012', '2011'],
  loadingContributions: false,
  loadingYears: false,
  loadingDownload: false,
  previewEntity: dummyData.username,
  previewYear: dummyData.year,
  container: null
}

export default function (state = INITIAL_STATE, action) {
  console.log(action)
  switch (action.type) {
    case RECEIVED_CONTRIBUTION_DATA:
      return {
        ...state,
        data: action.data,
        previewEntity: action.entity,
        previewYear: action.year,
        loadingContributions: false
      }
    case RECEIVED_YEAR_OPTIONS:
      return {...state, yearOptions: action.years, loadingYears: false}
    case START_CONTRIBUTION_UPDATE:
      return {...state, loadingContributions: true}
    case START_YEARS_UPDATE:
      return {...state, loadingYears: true}
    case START_DOWNLOAD_LOAD:
      return {...state, loadingDownload: true}
    case FINISHED_DOWNLOAD_LOAD:
      return {...state, loadingDownload: false}
    case UPDATE_SELECTED_YEAR:
      return {...state, year: action.year}
    case UPDATE_SELECTED_ENTITY:
      return {...state, entity: action.entity, yearOptions: []}
    case UPDATE_SCENE_CONTAINER:
      return {...state, container: action.container}
  }
  return state
}
