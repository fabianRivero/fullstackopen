import { useState, useEffect } from 'react'
import NumberList from './components/NumberList'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filterResults, setFilterResults] = useState([])
  const [nameSearcher, setNameSearcher] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handlePersonSearcher = (event) => {
    setNameSearcher(event.target.value)
  }

  const searchPerson = (event) => {
    event.preventDefault()
    const recopilation = persons.filter((person) => 
    person.name.toLowerCase() === nameSearcher.toLowerCase()
    )
    if(recopilation.length > 0){
      setFilterResults(recopilation)
    }else(
      alert(`el nombre '${nameSearcher.toLowerCase()}' no esta registrado`)
    )
    
  }
  
  const addPerson = (event) => {
    event.preventDefault()
    const recopilation = persons.map((person) => {
      return person.name.toLowerCase()
    })

    if (recopilation.includes(newName.toLowerCase())) {
      alert(`${newName} ya esta registrado.`);
    } else {
      const newPerson = {name:newName, number:newNumber}
      personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
      })
    }
  }

  const deletePerson = (id) => {
    personService
    .del(id)
    .then(returnedPerson => {
      console.log(returnedPerson)
    })
    
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter persons={filterResults} value={nameSearcher} onChange={handlePersonSearcher} onClick={searchPerson} />
      
      <h2>add a new</h2>
      
      <PersonForm nameValue={newName} nameOnChange={handleNameChange} numberValue={newNumber} numberOnChange={handleNumberChange} onClick={addPerson} /> 

      <h2>Numbers</h2>
      
      <NumberList persons={persons} onClick={deletePerson}/>
    
    </div>
  )
}

export default App