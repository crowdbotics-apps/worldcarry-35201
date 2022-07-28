import { API } from './'

export const getOrders = (payload, token) => {
  return API.get(`api/v1/orders/${payload}`, token)
}

export const getProductDetails = (payload, token) => {
  return API.get(`api/v1/get_product_detail${payload}`, token)
}

export const getOrderDetails = (id, token) => {
  return API.get(`api/v1/orders/${id}/`, token)
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

export const getOnrouteOrders = (payload, token) => {
  return API.get(`api/v1/orders/onroute/${payload}`, token)
}
