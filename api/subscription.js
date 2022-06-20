import { API } from './'

export const createSubscription = (body, token) => {
  return API.post(`api/v1/subscriptions/subscribe/`, body, token)
}

export const getPlans = token => {
  return API.get(`api/v1/subscriptions/plans/`, token)
}
