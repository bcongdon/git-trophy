import axios from 'axios'
import debounce from 'debounce'
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
  START_YEARS_UPDATE,
  UPDATE_SCENE_CONTAINER,
  UPDATE_SELECTED_ENTITY,
  UPDATE_SELECTED_YEAR } from './types'
import exportSceneX3D from './x3d-exporter'
import download from 'downloadjs'
import authConfig from './oauth'
import { login } from 'redux-implicit-oauth2'
import {
  registerDownload,
  registerShapewaysExport,
  registerChartDownload } from './analytics'

const BASE_URL = 'https://xfrua0iqkc.execute-api.us-east-1.amazonaws.com/dev'

export const loadContributions = (entity, year) => (dispatch, getState) => {
  dispatch({ type: START_CONTRIBUTION_UPDATE })
  registerChartDownload(entity, year)
  return axios.get(`${BASE_URL}/v1/contributions`, { params: {entity, year} })
    .then((response) => {
      if (entity !== getState().app.entity) {
        return
      }

      updateQueryString(entity, year)
      dispatch({
        type: RECEIVED_CONTRIBUTION_DATA,
        data: response.data.contributions,
        entity: entity,
        year: year
      })
    })
    .catch(() => {
      if (entity !== getState().app.entity) {
        return
      }

      dispatch({type: ERRORED_CONTRIBUTIONS_FETCH})
    })
}

const debouncedYearOptionsFetch = debounce((dispatch, getState, entity, year) => {
  if (!entity) {
    return
  }

  dispatch({type: START_YEARS_UPDATE})
  return axios.get(`${BASE_URL}/v1/years`, { params: {entity} })
    .then((response) => {
      if (entity !== getState().app.entity) {
        return
      }

      const years = response.data.years
      dispatch({ type: RECEIVED_YEAR_OPTIONS, years: years })

      if (!years) {
        dispatch({type: ERRORED_YEAR_FETCH})
      }

      const previousYear = (new Date().getFullYear() - 1).toString()
      let defaultYear
      if (year && years.includes(year)) {
        defaultYear = year
      } else if (years.includes(previousYear)) {
        defaultYear = previousYear
      } else {
        defaultYear = years[0]
      }
      dispatch({ type: UPDATE_SELECTED_YEAR, year: defaultYear })
      loadContributions(entity, defaultYear)(dispatch, getState)
    })
    .catch(() => {
      if (entity !== getState().app.entity) {
        return
      }

      dispatch({type: ERRORED_YEAR_FETCH})
    })
}, 300)

export const updateSelectedEntity = (entity, year) => (dispatch, getState) => {
  entity = entity.toLocaleLowerCase()

  dispatch({ type: UPDATE_SELECTED_ENTITY, entity })
  return debouncedYearOptionsFetch(dispatch, getState, entity, year)
}

const updateQueryString = (entity, year) => {
  let newUrl = `?entity=${encodeURIComponent(entity)}`
  newUrl += `&year=${year}`
  history.replaceState('', '', newUrl)
}

export const updateSelectedYear = (year) => (dispatch, getState) => {
  if (year === getState().app.year) {
    return
  }
  dispatch({ type: UPDATE_SELECTED_YEAR, year })

  const entity = getState().app.entity
  return loadContributions(entity, year)(dispatch, getState)
}

export const setSceneContainer = (container) => {
  return {type: UPDATE_SCENE_CONTAINER, container}
}

export const downloadModel = () => (dispatch, getState) => {
  dispatch({type: START_DOWNLOAD_LOAD})
  const { container, entity, year } = getState().app
  registerDownload(entity, year)
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
  registerShapewaysExport(entity, year)

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
