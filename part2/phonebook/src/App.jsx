import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Person from './components/Person'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [filterResults, setFilterResults] = useState([])
  const [nameSearcher, setNameSearcher] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [confirmationMessage, setConfirmationMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

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

    const person = persons.find(p => p.name.toLowerCase() === newName.toLowerCase())
    if (person === undefined) {
      const newPerson = {name:newName, number:newNumber}
      personService
      .create(newPerson)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setConfirmationMessage(
          `'${newName}' added to phonebook`
        )
        setTimeout(() => {
          setConfirmationMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
        setErrorMessage(null)
      })
      .catch(error => {
        setErrorMessage(error.response.data.error)
      })
    } else {
      if (window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)) {
        const updatedPerson = {...person, number: newNumber}
        updateNumber(person.id, updatedPerson)
        setConfirmationMessage(
          `'${person.name}' updated`
        )
        window.location.reload();
        setTimeout(() => {
          setConfirmationMessage(null)
        }, 5000)
        setNewName('')
        setNewNumber('')
        setErrorMessage(null)
      } 
    }
  }

  const updateNumber = (id, updatedPerson) => {
    personService
    .update(id, updatedPerson)
    .then(returnedPerson => {
      setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
    })
  }

  const deletePerson = (person) => {
    personService
    .del(person.id)
    .then(setPersons(persons.filter(p => p.id !== person.id)))
    .catch(error => {
      setErrorMessage(
        `Information of '${person.name}' was already removed from server`
      )
      setPersons(persons.filter(p => p.id !== person.id))
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setConfirmationMessage(null)
    })
  }

  const confirmation = (person) => {
    if (window.confirm(`Do you really want to delete to ${person.name}?`)) {
      deletePerson(person)
    } 
  }



  return (
    <div>
      <h1>Phonebook</h1>
      <Notification confirmationMessage={confirmationMessage} errorMessage={errorMessage} />

      <Filter persons={filterResults} value={nameSearcher} onChange={handlePersonSearcher} onClick={searchPerson} />
      
      <h2>add a new</h2>
      
      <PersonForm nameValue={newName} nameOnChange={handleNameChange} numberValue={newNumber} numberOnChange={handleNumberChange} onClick={addPerson} /> 

      <h2>Numbers</h2>
        <ul>
        {
        persons.map(person => (
          <Person key={person.id} person={person} confirmation={() => confirmation(person)}/>
        ))
        }
        </ul>
    </div>
  )
}

export default App