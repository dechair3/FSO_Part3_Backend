const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
morgan.token('type', (req) =>{
  const method = req.method
  if(method === "POST"){
    return console.log(req.body)
  }
})
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :type')
app.use(express.json())
app.use(logger)
app.use(cors())

let data = [
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
    let date = new Date()
    response.send(`The phonebook has ${data.length} people's information on it <br/> ${date}`)
})
app.get('/api/persons', (request, response) => {
    response.json(data)
})
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    person = data.find(entry => entry.id === id)
    if(person){ // Objects are truthy, null is falsey :|
      response.json(person)
    }
    else{
      response.status(404).end()
    }
})
app.post('/api/persons', (request, response) => {
  const body = request.body
  if(!(body.name)){
    return response.status(400).json({
      'error' : 'Name is missing'
    })
  }
  if(!(body.number)){
    return response.status(400).json({
      'error' : 'Number is missing'
    })
  }
  duplicate_name = data.find(entry => entry.name === body.name)
  if(duplicate_name){
    return response.status(400).json({
      'error' : 'Duplicate Name'
    })
  }

  entry = {
    'id' : Math.floor(Math.random()*999),
    'name' : body.name,
    'number' : `${body.number}`
  }

  data = data.concat(entry)

  response.json(data)


})
app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  data = data.filter(entry => entry.id !== id)
  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })