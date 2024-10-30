const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const app = express()

const postData = ((request, respose, next) => {
if (request.method === 'POST') {
    console.log(`Body: ${JSON.stringify(request.body)}`)
}
next()
})

app.use(express.static('dist'))
app.use(bodyParser.json())
app.use(morgan('tiny'))
app.use(express.json())
app.use(postData)


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/info', (request, response) => {
    if(request.method){
        const now = new Date()    
        response.send(`<p>Phonebook has info for ${persons.length} people</p><br/><p>${now}</p>`)
    }
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const generateId = () => {
  return Math.floor(Math.random() * 1000000)

    //return Date.now().toString(36) + Math.random().toString(36).substring(2)
  };

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'Name or number missing' 
    })
  }
  if(persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())){
    return response.status(400).json({ 
        error: 'Name must be unique' 
      })
  }
  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})