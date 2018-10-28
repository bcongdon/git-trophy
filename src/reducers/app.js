import dummyData from '../data/facebook-react2016.json'

import {
  ERRORED_CONTRIBUTIONS_FETCH,
  ERRORED_YEAR_FETCH,
  FINISHED_DOWNLOAD_LOAD,
  FINISHED_EXPORT_LOAD,
  RECEIVED_CONTRIBUTION_DATA,
  RECEIVED_YEAR_OPTIONS,
  START_CONTRIBUTION_UPDATE,
  START_DOWNLOAD_LOAD,
  START_EXPORT_LOAD,
  START_MODEL_LOADING,
  START_YEARS_UPDATE,
  UPDATE_SCENE_CONTAINER,
  UPDATE_SELECTED_ENTITY,
  UPDATE_SELECTED_YEAR } from '../types'

const INITIAL_STATE = {
  container: null,
  data: dummyData.contributions,
  entity: dummyData.entity,
  erroredEntity: false,
  loadingContributions: false,
  loadingDownload: false,
  loadingExport: false,
  loadingModel: false,
  loadingYears: false,
  previewEntity: dummyData.entity,
  previewYear: dummyData.year.toString(),
  year: dummyData.year.toString(),
  yearOptions: ['2018', '2017', '2016', '2015', '2014', '2013']
}

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    // Received data
    case RECEIVED_CONTRIBUTION_DATA:
      return {
        ...state,
        data: action.data,
        erroredEntity: false,
        loadingContributions: false,
        loadingModel: false,
        previewEntity: action.entity,
        previewYear: action.year
      }
    case RECEIVED_YEAR_OPTIONS:
      return {
        ...state,
        erroredEntity: false,
        loadingYears: false,
        yearOptions: action.years
      }

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
      return {
        ...state,
        entity: action.entity,
        erroredEntity: false,
        loadingContributions: false,
        loadingYears: false,
        yearOptions: []
      }
    case UPDATE_SCENE_CONTAINER:
      return {...state, container: action.container}
  }
  return state
}
