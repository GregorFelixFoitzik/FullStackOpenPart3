require('dotenv').config()
const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('dist'))

const morgan = require('morgan')
morgan.token('body', (req) => {
  return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
const logMessage = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(logMessage))

const cors = require('cors')
app.use(cors())

const Person = require('./models/person')
// const { MongoNotConnectedError } = require('mongodb')


app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/info', (request, response) => {
  const location = 'en-GB'
  const day_options = {
    timeZone: 'US/Pacific',
    day: 'numeric',
    weekday: 'short',
    year: 'numeric',
    month: 'short',
  }
  const time_options = {
    timeZone: 'Europe/Helsinki',
    timeZoneName: 'long',

    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }
  const date = new Date()
  // const timezones = date.
  const fDate = date.toLocaleDateString(location, day_options)
  const fTime = date.toLocaleTimeString(location, time_options)

  Person.countDocuments({})
    .then(count => {
      const info = `
        <p>Phonebook has info for ${count} people</p>
        <p>${fDate} ${fTime}</p> 
      `
      response.send(info)
    })
    .catch(error => {
      console.error(error)
      response.status(500).json({ error: 'Internal server error' })
    })
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person)  {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.post('/api/persons', (request, response, next) => {
  const { name, number } = request.body

  const person = new Person({
    name: name,
    number: number,
  })

  person.save()
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(request.params.id, { name, number }, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.status(204).end()
      } else {
        response.status(404).json({ error: 'Person not found' })
      }
    })
  // .catch(error => next(error))
    .catch(error => {
      console.error(error)
      response.status(500).json({ error: 'Internal server error' })
    })
})



// Error handling middleware --> has to be thelast loaded middleware
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)



const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})