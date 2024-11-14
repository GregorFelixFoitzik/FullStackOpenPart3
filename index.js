const express = require('express')
const morgan = require('morgan')
const app = express()
app.use(express.json())


morgan.token('body', (req) => {
    return req.method === 'POST' ? JSON.stringify(req.body) : ''
})
const logMessage = ':method :url :status :res[content-length] - :response-time ms :body'
app.use(morgan(logMessage));



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
    response.json(persons)
})
  
app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
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

    // request is not complete
    if (!body.name || !body.number) {
        const missingFields = [];
        if (!body.name) missingFields.push('name');
        if (!body.number) missingFields.push('number');
    
        return response.status(400).json({ 
            error: `Content missing: ${missingFields.join(', ')}` 
        });
    }

    // request already exists
    if (persons.find(person => person.name === body.name)) {
        return response.status(400).json({ 
            error: 'name must be unique' 
        });
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId(),
    }
  
    persons = persons.concat(person)
  
    response.json(person)
})

const PORT = 3001
    app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})



