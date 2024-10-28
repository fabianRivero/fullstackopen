import axios from "axios"

const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?q='
const key = import.meta.env.VITE_API_KEY

const GetCountryWeather = (capital, tld) => {
    const request = axios.get(`${baseUrl}${capital},${tld}&APPID=${key}`)
    return request.then(response => response.data)
}

export default GetCountryWeather

