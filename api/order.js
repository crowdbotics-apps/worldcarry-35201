import { API } from './'

export const getNotification = token => {
  return API.get(`api/v1/notifications/`, token)
}

export const notificationRead = (body, token) => {
  return API.post(`api/v1/motifications/read/`, body, token)
}

export const allNotificationRead = token => {
  return API.get(`api/v1/motifications/read/`, token)
}
