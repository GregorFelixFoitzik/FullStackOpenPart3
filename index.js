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


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



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

    const info = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${fDate} ${fTime}</p> 
    `    
    //${fTime}
    response.send(info)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)  
    })
})
  
app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id).then(person => {
        response.json(person)
    })
})


const generateId = () => {
    // const maxId = persons.length > 0
    // ? Math.max(...persons.map(n => Number(n.id)))
    // : 0
  
    const randId = Math.round(Math.random() * 1_000_000)
    return String(randId + 1)
}
  
app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        const missingFields = [];
        if (!body.name) missingFields.push('name');
        if (!body.number) missingFields.push('number');
    
        return response.status(400).json({ 
            error: `Content missing: ${missingFields.join(', ')}` 
        })
    }

    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Person.findByIdAndDelete(id)
        .then(result => {
            if (result) {
                response.status(204).end()
            } else {
                response.status(404).json({ error: 'Person not found' })
            }
        })
        .catch(error => {
            console.error(error)
            response.status(500).json({ error: 'Internal server error' })
        })
    
    // const id = request.params.id
    // persons = persons.filter(person => person.id !== id)
  
    // response.status(204).end()
})


const PORT = process.env.PORT
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



