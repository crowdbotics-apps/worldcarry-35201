import { API } from './'

export const getDashboard = token => {
  return API.get(`api/v1/admin/dashboard/`, token)
}

export const getAllUsers = (payload, token) => {
  return API.get(`api/v1/admin/users/${payload}`, token)
}

export const getZipcodes = (payload, token) => {
  return API.get(`api/v1/admin/zipcodes/${payload}`, token)
}

export const updateZipcodes = (id, payload, token) => {
  return API.patch(`api/v1/admin/zipcodes/${id}/`, payload, token)
}

export const updateUser = (id, payload, token) => {
  return API.patch(`api/v1/admin/users/${id}/`, payload, token)
}

export const deleteZipcodes = (id, token) => {
  return API.delete(`api/v1/admin/zipcodes/${id}/`, {}, token)
}

export const deleteOrder = (id, token) => {
  return API.delete(`api/v1/admin/orders/${id}/`, {}, token)
}

export const deleteUser = (id, token) => {
  return API.delete(`api/v1/admin/users/${id}/`, {}, token)
}

export const addZipcodes = (payload, token) => {
  return API.post(`api/v1/admin/zipcodes/`, payload, token)
}

export const getOrders = (payload, token) => {
  return API.get(`api/v1/admin/orders/${payload}`, token)
}

export const getOrderDetails = (id, token) => {
  return API.get(`api/v1/admin/orders/${id}/`, token)
}

export const getFeedbacks = (payload, token) => {
  return API.get(`api/v1/admin/feedbacks/${payload}`, token)
}
