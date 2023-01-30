import axios from 'axios'
import { API } from './'
import { API_URL } from './config'

export const signupUser = payload => {
  return API.post('api/v1/users/', payload)
}

export const loginUser = payload => {
  return API.post('api/v1/users/login/', payload)
}

export const facebookLoginUser = payload => {
  return API.post('users/facebook/login/', payload)
}

export const appleLoginUser = payload => {
  return API.post('users/apple/login/', payload)
}

export const googleLoginUser = payload => {
  return API.post('users/google/login/', payload)
}

export const verifyEmail = payload => {
  return API.post('api/v1/users/verify/', payload)
}

export const resendOTP = payload => {
  return API.post('api/v1/users/otp/', payload)
}

export const setPassword = (payload, token) => {
  return API.post('api/v1/users/password/', payload, token)
}

export const updateProfile = (payload, id, token) => {
  return API.patch(`api/v1/users/${id}/`, payload, token)
}

export const editProfile = (payload, token) => {
  const options = {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
      Authorization: `Token ${token}`
    }
  }
  return API.patch(`api/v1/client/edit/`, payload, token)
  // return axios.patch(`${API_URL()}api/v1/client/edit/`, payload, options)
}

export const deleteAccount = (user_id, token) => {
  return API.delete(`api/v1/users/${user_id}/`, {}, token)
}

export const getNotification = token => {
  return API.get(`api/v1/notifications/`, token)
}

export const forgotpasswordCode = payload => {
  return API.post('api/v1/forgotpasswordcode', payload)
}

export const forgotpassword = payload => {
  return API.post('api/v1/forgotpassword', payload)
}

export const addAddress = (payload, token) => {
  return API.post('api/v1/address/', payload, token)
}

export const changePassword = (payload, token) => {
  return API.post('api/v1/users/password/', payload, token)
}

export const removeAddress = (id, token) => {
  return API.delete(`api/v1/address/${id}/`, {}, token)
}

export const updateAddress = (id, payload, token) => {
  return API.patch(`api/v1/address/${id}/`, payload, token)
}

export const getProfile = (id, token) => {
  return API.get(`api/v1/users/${id}/`, token)
}

export const getZipcodes = () => {
  return API.get('api/v1/zipcodes/?status=true')
}

export const getMyReviews = token => {
  return API.get('api/v1/my-reviews/', token)
}

export const getFavorites = token => {
  return API.get('api/v1/client/favorites/', token)
}
