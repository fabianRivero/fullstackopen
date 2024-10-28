import { useState, useEffect } from 'react'
import countryService from "./services/countries"
import SingleCountry from './components/SingleCountry'
import Message from './components/Message'
import Country from './components/Country'

function App() {
  const [countrySearch, setCountrySearch] = useState("")
  const [allCountries, setAllCountries] = useState([])
  const [singleCountry, setSingleCountry] = useState( {} )
  const [filteredCountries, setFilteredCountries] = useState([])
  const [message, setMessage] = useState("")
  const [showList, setShowList] = useState(false)
  const [showMessage, setShowMessage] = useState(true)


  useEffect(() => {
    countryService
    .getAll()
    .then((countryList) => {
      setAllCountries(countryList); // Guardar la lista completa en `allCountries`
    });
  }, []);

  useEffect(() => {
    if (allCountries.length === 0) return; 

    const selected = allCountries.filter((country) =>
      country.name.common.toLowerCase().includes(countrySearch.toLowerCase())
    );

    let option = selected.length;


    if (option === 0) {

      setShowList(false)
      setShowMessage(true)
      setMessage("the list is empty")

    } else if (option <= 10 && option > 1) {

      setShowList(true)
      setShowMessage(false)
      setFilteredCountries(selected)

    } else if (option === 1) {

      setShowList(false)
      setShowMessage(false)
      setSingleCountry(selected[0])

    } else if (option > 10 && option < allCountries.length) {

      setShowList(false)
      setShowMessage(true)
      setMessage("Too many matches, specify another filter")

    } else if (option === allCountries.length) {

      setShowList(false)
      setShowMessage(true)
      setMessage("the list is empty")

    }
  }, [countrySearch, allCountries]);

  const handlePersonSearcher = (event) => {
    setCountrySearch(event.target.value)
  }

  const pressButton = (country) => {
    setShowList(false)
    setShowMessage(false)
    setSingleCountry(country)
}

  return (
    <>
      <div>
        find countries <input type="search" value={countrySearch} onChange={handlePersonSearcher} />
      </div>
      <div>
        {
        showList ?
        <ul>
        {
            filteredCountries.map((cn) => (
                <Country key={cn.name.common} cn={cn} onClick={() => pressButton(cn)} />    
            ))
        }
        </ul>
        :
        showMessage ?
        <Message mes={message} />
        :
        <SingleCountry cn={singleCountry}/>
        }
      </div>
    </>
  )
}

export default App
