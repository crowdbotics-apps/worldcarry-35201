import { API } from './'

export const getJourneys = (payload, token) => {
  return API.get(`api/v1/journeys/${payload}`, token)
}

export const createJourney = (body, token) => {
  return API.post(`api/v1/journeys/`, body, token)
}
