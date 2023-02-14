import { API } from "./"

export const getDashboard = token => {
  return API.get(`api/v1/admin/dashboard/`, token)
}

export const getAllUsers = (payload, token) => {
  return API.get(`api/v1/admin/user/${payload}`, token)
}

export const getUserPayment = (payload, token) => {
  return API.get(`api/v1/admin/user/payments/${payload}`, token)
}

export const banUnbanUser = (payload, token) => {
  return API.post(`api/v1/admin/user/status/`, payload, token)
}

export const createNotification = (payload, token) => {
  return API.post(`api/v1/admin/notification/`, payload, token)
}

export const bulkNotification = (payload, token) => {
  return API.post(
    `api/v1/admin/notification/bulk_notification/`,
    payload,
    token
  )
}

export const getNotifications = (payload, token) => {
  return API.get(`api/v1/admin/notification/${payload}`, token)
}

export const updateNotification = (id, payload, token) => {
  return API.patch(`api/v1/admin/notification/${id}/`, payload, token)
}

export const updateUser = (id, payload, token) => {
  return API.patch(`api/v1/admin/users/${id}/`, payload, token)
}

export const deleteNotification = (id, token) => {
  return API.delete(`api/v1/admin/notification/${id}/`, {}, token)
}

export const updateOrder = (id, payload, token) => {
  return API.patch(`api/v1/orders/${id}/`, payload, token)
}

export const deleteOrder = (id, token) => {
  return API.delete(`api/v1/orders/${id}/`, {}, token)
}

export const deleteUser = (id, token) => {
  return API.delete(`api/v1/admin/user/${id}/`, {}, token)
}

export const addNotification = (payload, token) => {
  return API.post(`api/v1/admin/notification/`, payload, token)
}

export const getOrders = (payload, token) => {
  return API.get(`api/v1/orders/${payload}`, token)
}

export const getOrderDetails = (id, token) => {
  return API.get(`api/v1/admin/orders/${id}/`, token)
}

export const getFeedbacks = (payload, token) => {
  return API.get(`api/v1/admin/feedback/${payload}`, token)
}

export const replyFeedback = (id, payload, token) => {
  return API.put(`api/v1/admin/feedback/${id}/`, payload, token)
}
