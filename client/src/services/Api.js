import axios from 'axios'

const baseURL = process.env.NODE_ENV === 'production' ? 'https://immense-waters-10825.herokuapp.com/' : 'http://localhost:8081'

function validToken () {
  return localStorage.getItem('token')
}

// const config = {
//   headers: {
//     'Authorization': 'Bearer ' + validToken()
//   }
// }

export default() => {
  return axios.create({
    baseURL: baseURL,
    headers: {
      'Authorization': 'Bearer ' + validToken(),
      'Accept': 'application/json'
    }
  })
}
