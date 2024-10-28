import { useEffect, useState } from "react";
import GetCountryWeather from "../services/weather.js"

const CountryWeather = ({ cn }) => {
    const [weatherData, setWeatherData] = useState(null)
    const tld = cn.tld[0].slice(1)
        
    useEffect(() => {
        const fetchWeather = async () => {
            const data = await GetCountryWeather(cn.capital[0], tld)
            setWeatherData(data)
        };
    
        fetchWeather()
    }, [cn, tld])

    return(
        <div>
        <h2>Weather in {cn.capital[0]}:</h2>
        {weatherData ? (
            <>
                <p>Temperature: {(weatherData.main.temp - 273).toFixed(2)} Celsius</p>
                <div>
                <img src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt="" />
                <p>wind {weatherData.wind.speed}m/s</p>
                </div>
            </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}
export default CountryWeather
