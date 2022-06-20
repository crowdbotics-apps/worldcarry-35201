import { API } from './'

export const getNotification = token => {
  return API.get(`api/v1/notifications/`, token)
}

export const createProduct = (payload, token) => {
  return API.post(`api/v1/products/`, payload, token)
}

export const getMilkRequest = (payload, token) => {
  return API.get(`api/v1/milk-requests/${payload}`, token)
}

export const allNotificationRead = token => {
  return API.get(`api/v1/motifications/read/`, token)
}
