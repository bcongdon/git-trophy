import axios from 'axios'
import debounce from 'debounce'
import {
  RECEIVED_CONTRIBUTION_DATA,
  RECEIVED_YEAR_OPTIONS,
  START_CONTRIBUTION_UPDATE,
  START_YEARS_UPDATE,
  UPDATE_SELECTED_YEAR,
  UPDATE_SELECTED_ENTITY } from './types'

const BASE_URL = 'http://localhost:5000'

export const loadContributions = (entity, year) => (dispatch) => {
  dispatch({ type: START_CONTRIBUTION_UPDATE })
  return axios.get(`${BASE_URL}/v1/contributions`, { params: {entity, year} })
    .then((response) => {
      if (response.status !== 200) {
        // TODO: Handle error
      } else {
        dispatch({
          type: RECEIVED_CONTRIBUTION_DATA,
          data: response.data.contributions,
          entity: entity,
          year: year
        })
      }
    })
}

const debouncedYearOptionsFetch = debounce((dispatch, entity) => {
  dispatch({type: START_YEARS_UPDATE})
  return axios.get(`${BASE_URL}/v1/years`, { params: {entity} })
    .then((response) => {
      if (response.status !== 200) {
        // TODO: handle error
      } else {
        const years = response.data.years
        dispatch({ type: RECEIVED_YEAR_OPTIONS, years: years })
        dispatch({ type: UPDATE_SELECTED_YEAR, year: years[0] })
        loadContributions(entity, years[0])(dispatch)
      }
    })
}, 200)

export const updateSelectedEntity = (entity) => (dispatch) => {
  dispatch({ type: UPDATE_SELECTED_ENTITY, entity })
  return debouncedYearOptionsFetch(dispatch, entity)
}

export const updateSelectedYear = (year) => (dispatch, getState) => {
  dispatch({ type: UPDATE_SELECTED_YEAR, year })
  dispatch({ type: START_CONTRIBUTION_UPDATE })

  const entity = getState().entity

  return axios.get(`${BASE_URL}/v1/contributions`, { params: {entity, year} })
    .then((response) => {
      if (response.status !== 200) {
        // TODO: Handle error
      } else {
        dispatch({
          type: RECEIVED_CONTRIBUTION_DATA,
          data: response.data.contributions,
          entity: entity,
          year: year
        })
      }
    })
}
