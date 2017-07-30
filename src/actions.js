import axios from 'axios'
import debounce from 'debounce'
import {
  RECEIVED_CONTRIBUTION_DATA,
  RECEIVED_YEAR_OPTIONS,
  START_CONTRIBUTION_UPDATE,
  START_YEARS_UPDATE,
  START_DOWNLOAD_LOAD,
  START_EXPORT_LOAD,
  START_AUTHENTICATION,
  FINISHED_EXPORT_LOAD,
  FINISHED_DOWNLOAD_LOAD,
  UPDATE_SELECTED_YEAR,
  UPDATE_SELECTED_ENTITY,
  UPDATE_SCENE_CONTAINER,
  ERRORED_YEAR_FETCH,
  ERRORED_CONTRIBUTIONS_FETCH } from './types'
import exportSceneX3D from './x3d-exporter'
import download from 'downloadjs'
import authConfig from './oauth'
import { login } from 'redux-implicit-oauth2'

const BASE_URL = 'http://08ab6eb8.ngrok.io'

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
  if (!entity) {
    return
  }

  dispatch({type: START_YEARS_UPDATE})
  return axios.get(`${BASE_URL}/v1/years`, { params: {entity} })
    .then((response) => {
      if (response.status !== 200) {
        // TODO: handle error
      } else {
        const years = response.data.years
        dispatch({ type: RECEIVED_YEAR_OPTIONS, years: years })

        if (years) {
          const previousYear = (new Date().getFullYear() - 1).toString()
          const defaultYear = years.includes(previousYear) ? previousYear : years[0]
          dispatch({ type: UPDATE_SELECTED_YEAR, year: defaultYear })
          loadContributions(entity, defaultYear)(dispatch)
        }
      }
    })
    .catch(() => {
      dispatch({type: ERRORED_YEAR_FETCH})
    })
}, 200)

export const updateSelectedEntity = (entity) => (dispatch, getState) => {
  entity = entity.toLocaleLowerCase()
  if (entity === getState().app.entity) {
    return
  }

  dispatch({ type: UPDATE_SELECTED_ENTITY, entity })
  return debouncedYearOptionsFetch(dispatch, entity)
}

export const fetchContributionsData = (entity, year) => (dispatch) => {
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
    .catch(() => {
      dispatch({type: ERRORED_CONTRIBUTIONS_FETCH})
    })
}

export const updateSelectedYear = (year) => (dispatch, getState) => {
  if (year === getState().app.year) {
    return
  }
  dispatch({ type: UPDATE_SELECTED_YEAR, year })

  const entity = getState().app.entity
  return fetchContributionsData(entity, year)(dispatch)
}

export const setSceneContainer = (container) => {
  return {type: UPDATE_SCENE_CONTAINER, container}
}

export const downloadModel = () => (dispatch, getState) => {
  dispatch({type: START_DOWNLOAD_LOAD})
  const { container, entity, year } = getState().app
  const scene = container.refs.preview.refs.scene
  const fileName = `${entity.replace('/', '-')}-${year}.x3d`

  // Yield control to the renderer
  return setTimeout(() => {
    const x3dData = exportSceneX3D(scene)
    download(x3dData, fileName, 'model/x3d+xml')
    dispatch({type: FINISHED_DOWNLOAD_LOAD})
  }, 5)
}

export const exportModel = () => (dispatch, getState) => {
  if (!getState().auth.isLoggedIn) {
    dispatch(login(authConfig))
    return
  }

  const { container, entity, year } = getState().app
  dispatch({type: START_EXPORT_LOAD})

  // Yield control to the renderer
  return new Promise((resolve, reject) => {
    const scene = container.refs.preview.refs.scene
    const x3dData = exportSceneX3D(scene)

    const { token } = getState().auth

    const payload = {
      file: Buffer.from(x3dData).toString('base64'),
      fileName: `${entity.replace('/', '-')}-${year}.x3d`,
      uploadScale: 0.022352, // 88% of 1 inch
      hasRightsToModel: true,
      acceptTermsAndConditions: true,
      title: `Git Trophy - ${entity} (${year})`
    }

    axios.post('https://api.shapeways.com/model/v1', payload,
      {headers: {'Authorization': 'Bearer ' + token}}
    ).then((response) => {
      window.location = response.data.urls.editModelUrl.address
      dispatch({type: FINISHED_EXPORT_LOAD})
      resolve()
    }).catch((err) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(err)
        console.log(err.response)
      }
      dispatch({type: FINISHED_EXPORT_LOAD})
      reject(err)
    })
  })
}
