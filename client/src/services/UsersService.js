import Api from '@/services/Api'

export default {
  login (params) {
    return Api().post('login', params)
  },
  register (params) {
    return Api().post('register', params)
  },
  flash () {
    return Api().get('flash')
  },
  getLogin () {
    return Api().get('login')
  },
  logOut () {
    return Api().get('logout')
  },
  auth (params) {
    return Api().post('auth', params)
  }
}
