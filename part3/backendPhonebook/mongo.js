const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fabianRivero:${password}@cluster0.xroqi.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`

const generateId = () => {
  return Math.floor(Math.random() * 1000000)
}

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  id: generateId(),
  name: process.argv[3],
  number: process.argv[4]
})

if (process.argv.length>4) {
  person.save().then(result => {
    console.log(result)
    console.log(`added ${person.name}, number ${person.number}`)
    mongoose.connection.close()
  })
}else{
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
