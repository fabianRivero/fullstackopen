import CountryWeather from "./CountryWeather"

const SingleCountry = ({ cn }) => {

    return(
        <div>
        <h2>{cn.name.common}</h2>
        
        <p>capital: 
            {
            cn.capital ?
            cn.capital[0] :
            'non-existent information'
            }
        </p>

        <p>area: 
            {
            cn.area ?
            cn.area :
            'non-existent information'
            }
        </p>

        <h3>Languages:</h3>
        <ul>

            {
                cn.languages ?
                Object.values(cn.languages).map((language) => (
                    <li key={language}>{language}</li>
                ))
                :
                'non-existent information'
            }
        </ul>
        <img src=
        {
            cn.flags.png ?
            cn.flags.png :
            'non-existent information'
        }
         alt="country flag" />

        <CountryWeather cn={cn}/>
        </div>        
    )
}

export default SingleCountry