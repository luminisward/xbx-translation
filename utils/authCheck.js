import { getToken } from './request'
import jwt_decode from 'jwt-decode'

export default function authCheck(router) {
  if (typeof window !== 'undefined') {
    const jwt = getToken()
    if (jwt) {
      const { username } = jwt_decode(jwt)
      if (username) {
        return
      }
    }
    router.push('/')
  }
}
