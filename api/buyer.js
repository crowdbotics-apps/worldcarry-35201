import { API } from './'

export const milkRequest = (body, token) => {
  return API.post(`api/v1/milk-requests/`, body, token)
}

export const getBuyerUser = (id, token) => {
  return API.get(`api/v1/users/${id}/`, token)
}
