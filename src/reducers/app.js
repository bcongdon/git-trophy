import dummyData from '../data/gaearon2016.json'

import {
  RECEIVED_CONTRIBUTION_DATA,
  RECEIVED_YEAR_OPTIONS,
  START_CONTRIBUTION_UPDATE,
  START_YEARS_UPDATE,
  START_DOWNLOAD_LOAD,
  START_EXPORT_LOAD,
  START_MODEL_LOADING,
  FINISHED_DOWNLOAD_LOAD,
  FINISHED_EXPORT_LOAD,
  UPDATE_SELECTED_YEAR,
  UPDATE_SELECTED_ENTITY,
  UPDATE_SCENE_CONTAINER,
  ERRORED_YEAR_FETCH,
  ERRORED_CONTRIBUTIONS_FETCH } from '../types'

const INITIAL_STATE = {
  data: dummyData.contributions,
  entity: dummyData.username,
  year: dummyData.year,
  yearOptions: ['2017', '2016', '2015', '2014', '2013', '2012', '2011'],
  loadingContributions: false,
  loadingYears: false,
  loadingDownload: false,
  loadingExport: false,
  loadingModel: false,
  previewEntity: dummyData.username,
  previewYear: dummyData.year,
  container: null,
  erroredEntity: false
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    // Received data
    case RECEIVED_CONTRIBUTION_DATA:
      return {
        ...state,
        data: action.data,
        previewEntity: action.entity,
        previewYear: action.year,
        loadingContributions: false,
        loadingModel: false
      }
    case RECEIVED_YEAR_OPTIONS:
      return {...state, yearOptions: action.years, loadingYears: false}

    // Trigger updates
    case START_CONTRIBUTION_UPDATE:
      return {...state, loadingContributions: true}
    case START_YEARS_UPDATE:
      return {...state, loadingYears: true}
    case START_DOWNLOAD_LOAD:
      return {...state, loadingDownload: true}
    case START_EXPORT_LOAD:
      return {...state, loadingExport: true}
    case START_MODEL_LOADING:
      return {...state, loadingModel: true}

    // On update completion
    case FINISHED_EXPORT_LOAD:
      return {...state, loadingExport: false}
    case FINISHED_DOWNLOAD_LOAD:
      return {...state, loadingDownload: false}

    // Error handling
    case ERRORED_YEAR_FETCH:
      return {...state, loadingYears: false, erroredEntity: true}
    case ERRORED_CONTRIBUTIONS_FETCH:
      return {...state, loadingContributions: false}

    // UI Updates
    case UPDATE_SELECTED_YEAR:
      return {...state, year: action.year}
    case UPDATE_SELECTED_ENTITY:
      return {...state, entity: action.entity, yearOptions: [], erroredEntity: false}
    case UPDATE_SCENE_CONTAINER:
      return {...state, container: action.container}
  }
  return state
}
