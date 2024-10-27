const SingleCountry = ({ cn }) => {

    return(
        <div>
        <h2>{cn.name.common}</h2>
        
        <p>capital: 
            {
            cn.capital ?
            cn.capital[0] :
            'informacion inexistente'
            }
        </p>

        <p>area: 
            {
            cn.area ?
            cn.area :
            'informacion inexistente'
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
                'informacion inexistente'
            }
        </ul>
        <img src=
        {
            cn.flags.png ?
            cn.flags.png :
            'informacion inexistente'
        }
         alt="" />
        </div>        
    )
}



export default SingleCountry