import { API } from './'

export const getOrders = (payload, token) => {
  return API.get(`api/v1/orders/${payload}`, token)
}

export const getNotification = token => {
  return API.get(`api/v1/notifications/`, token)
}

export const createOrder = (body, token) => {
  return API.post(`api/v1/orders/`, body, token)
}

export const allNotificationRead = token => {
  return API.get(`api/v1/motifications/read/`, token)
}
