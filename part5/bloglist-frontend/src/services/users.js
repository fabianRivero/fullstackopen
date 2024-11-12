import axios from 'axios'
const baseUrl = '/api/users'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async() => {
  const request = await axios.get(baseUrl)
  return request.data
}

const getSpecificUser = async(id) => {
    const request = await axios.get(`${baseUrl}/${id}`)
    return request.data
  }


export default { getAll, getSpecificUser, setToken }