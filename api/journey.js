import { API } from './'

export const getJourneys = (payload, token) => {
  return API.get(`api/v1/journeys/${payload}`, token)
}

export const getJourneyDetails = (id, token) => {
  return API.get(`api/v1/journeys/${id}/`, token)
}

export const getMyAddresses = token => {
  return API.get(`api/v1/locations/`, token)
}

export const createMyAddresses = (body, token) => {
  return API.post(`api/v1/locations/`, body, token)
}

export const makeOffer = (body, token) => {
  return API.post(`api/v1/journey/order/request`, body, token)
}

export const addReview = (body, token) => {
  return API.post(`api/v1/reviews/`, body, token)
}

export const createJourney = (body, token) => {
  return API.post(`api/v1/journeys/`, body, token)
}

export const deleteJourney = (id, token) => {
  return API.delete(`api/v1/journeys/${id}/`, {}, token)
}

export const getOnrouteJourneys = (payload, token) => {
  return API.get(`api/v1/journeys/onroute/${payload}`, token)
}