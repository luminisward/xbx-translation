import axios from 'axios'
import { message } from 'antd'
import Cookies from 'js-cookie'
import jwt_decode from 'jwt-decode'

const tokenKey = 'token'

export const getToken = () => {
  return window.localStorage.getItem(tokenKey)
}
export const setToken = (token) => {
  window.localStorage.setItem(tokenKey, token)
  const jwt = jwt_decode(token)
  Cookies.set('isLogin', '1', { expires: 180 })
}

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
})

instance.interceptors.request.use(
  (config) => {
    if (getToken()) {
      config.headers.Authorization = 'Bearer ' + getToken()
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    // console.log('interceptor', error)
    // if (error.message) {
    //   message.error(error.message)
    // }
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error.response?.data?.message ? new Error(error.response?.data?.message) : error)
  }
)

export default instance
