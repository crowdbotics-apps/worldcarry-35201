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

export const getNotification = (qs, token) => {
  return API.get(`api/v1/admin/notification/${qs}`, token)
}

export const createNotification = (body, token) => {
  return API.post(`api/v1/admin/notification/`, body, token)
}

export const registerDevice = (body, token) => {
  return API.post(`api/v1/admin/device/`, body, token)
}

export const createOrder = (body, token) => {
  return API.post(`api/v1/orders/`, body, token)
}

export const updateOrderStatus = (body, token) => {
  return API.put(`api/v1/orders/status/update`, body, token)
}

export const allNotificationRead = token => {
  return API.get(`api/v1/notifications/read/`, token)
}

export const notificationRead = (payload, token) => {
  return API.get(
    `api/v1/admin/notification/read_notification/${payload}`,
    token
  )
}

export const getOnrouteOrders = (payload, token) => {
  return API.get(`api/v1/orders/onroute/${payload}`, token)
}
