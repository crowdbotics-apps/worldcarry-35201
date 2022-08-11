import { makeRequest } from './requestBuilder'

export const API = {
  get: (url, token) =>
    makeRequest({
      method: 'get',
      url,
      token
    }),

  post: (url, body, token, formdata) =>
    makeRequest({
      method: 'post',
      body,
      url,
      token,
      formdata
    }),

  patch: (url, body, token) =>
    makeRequest({
      method: 'patch',
      body,
      url,
      token
    }),

  put: (url, body,token) =>
    makeRequest({
      method: 'put',
      body,
      url,
      token
    }),

  delete: (url, body, token) =>
    makeRequest({
      method: 'delete',
      url,
      body,
      token
    })
}
