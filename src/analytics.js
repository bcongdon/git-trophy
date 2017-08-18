import ReactGA from 'react-ga'

ReactGA.initialize('UA-72102716-3', {
  titleCase: false
})

function sendEvent (event) {
  if (process.env.NODE_ENV !== 'production') {
    return
  }

  ReactGA.event(event)
}

export function registerDownload (entity, year) {
  sendEvent({
    category: 'Export',
    action: 'Download',
    label: `${entity}-${year}`
  })
}

export function registerShapewaysExport (entity, year) {
  sendEvent({
    category: 'Export',
    action: 'Shapeways',
    label: `${entity}-${year}`
  })
}

export function registerChartDownload (entity, year) {
  sendEvent({
    category: 'Chart',
    action: 'Load',
    label: `${entity}-${year}`
  })
}
