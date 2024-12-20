import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const getAll = async() => {
  const request = await axios.get(baseUrl)
  return request.data
}

const getSpecificBlog = async(id) => {
  const request = await axios.get(`${baseUrl}/${id}`)
  return request.data
}

const createNewBlog = async newObject => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const updateBlog = async (id, newObject) => {

  const config = {
    headers: { Authorization: token },
  }

  const request = await axios.put(`${baseUrl}/${id}`, newObject, config, { new: true })
  return request.data
}

const deleteBlog = async (id) => {
  const config = {
    headers: { Authorization: token },
  }

  const request = await axios.delete(`${baseUrl}/${id}`, config)
  return request.data
}

export default { getAll, getSpecificBlog, createNewBlog, updateBlog, deleteBlog, setToken }