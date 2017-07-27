import axios from 'axios'
import {
  RECEIVED_CONTRIBUTION_DATA,
  START_CONTRIBUTION_UPDATE,
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

export const updateSelectedYear = (year) => {
  return { type: UPDATE_SELECTED_YEAR, year }
}

export const updateSelectedEntity = (entity) => {
  return { type: UPDATE_SELECTED_ENTITY, entity }
}
