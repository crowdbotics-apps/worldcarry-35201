import axios from 'axios'
import { API } from './'
import { API_URL } from './config'

export const signupUser = payload => {
  return API.post('api/v1/users/', payload)
}

export const loginUser = payload => {
  return API.post('api/v1/users/login/', payload)
}

export const resetEmail = payload => {
  return API.post('api/v1/users/reset/', payload)
}

export const verifyEmail = payload => {
  return API.post('api/v1/users/verify/', payload)
}

export const setPassword = (payload, token) => {
  return API.post('api/v1/users/password/', payload, token)
}

export const changePassword = (payload, token) => {
  return API.post('rest-auth/password/change/', payload, token)
}

export const updateProfile = async (payload, user_id, token) => {
  return API.patch(`api/v1/users/${user_id}/`, payload, token)
}

export const editProfile = (id, payload, token) => {
  return API.patch(`api/v1/users/${id}/`, payload, token)
}

export const deleteAccount = (client_id, token) => {
  return API.delete(`api/v1/client/${client_id}/`, {}, token)
}

export const forgotpasswordCode = payload => {
  return API.post('api/v1/forgotpasswordcode', payload)
}

export const forgotpassword = payload => {
  return API.post('api/v1/users/otp/', payload)
}

export const getProfile = (id, token) => {
  return API.get(`api/v1/users/${id}/`, token)
}

export const getMyReviews = (payload, token) => {
  return API.get(`api/v1/reviews/${payload}`, token)
}

export const getCategories = token => {
  return API.get('api/v1/categories/', token)
}

export const getFavoriteFoodtruck = token => {
  return API.get('api/v1/customers/favorite/', token)
}

export const addFavoriteFoodtruck = (body, token) => {
  return API.post('api/v1/customers/favorite/', body, token)
}

export const sendEmailForVerification = (body, token) => {
  return API.post('api/v1/users/verify_email/', body, token)
}

export const veriOTP = (body, token) => {
  return API.get(`api/v1/users/verify_email/${body}`, token)
}

export const sendOTPForVerification = (body, token) => {
  return API.post('api/v1/users/verify_phone/', body, token)
}

export const veriPhoneOTP = (body, token) => {
  return API.get(`api/v1/users/verify_phone/${body}`, token)
}

export const validatePassort = (body, token) => {
  return API.post(`api/v1/validate/passport`, body, token)
}

export const postSupport = (body, token) => {
  return API.post(`api/v1/support`, body, token)
}

export const postFeedback = (body, token) => {
  return API.post(`api/v1/feedback`, body, token)
}

export const getFAQ = token => {
  return API.get(`api/v1/faq?categories=ORDER`, token)
}
