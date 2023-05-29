require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
const Entry = require('./models/entry')
morgan.token('type', (req) =>{
  const method = req.method
  if(method === 'POST'){
    return console.log(req.body)
  }
})
const logger = morgan(':method :url :status :res[content-length] - :response-time ms :type')
app.use(express.json())
app.use(logger)
app.use(cors())
app.use(express.static('build'))


app.get('/info', (request, response) => {
  const date = new Date()
    
  Entry.countDocuments({}).then((result) =>{
    const length = result
    response.send(`The phonebook has ${length} people's information on it <br/> ${date}`)
  })
    
})
app.get('/api/persons', (request, response) => {
  Entry.find({}).then((result) =>{
    console.log(result)
    response.json(result)
      
  })
    
})
app.get('/api/persons/:id', (request, response, next) => {
  const id = (request.params.id)
  Entry.findById(id).then(result => {
    if(result){ // Objects are truthy, null is falsey :|
      response.json(result)
    }
    else{
      response.status(404).end()
    }
      
  }).catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
  const id = (request.params.id)
  console.log(request)
  const body = request.body
  const entry = {
    name: body.name,
    number: body.number
  }
  Entry.findByIdAndUpdate(id, entry).then(result => {
    response.json(result)
    
  }).catch(error => next(error))
})
app.post('/api/persons', (request, response, next) => {
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
 
  

  const entry = new Entry({
    'name' : body.name,
    'number' : `${body.number}`
  })
  console.log(entry)
  entry.save().then(entry =>{
    console.log(`Saved ${body.name}, Number: ${body.number} to phonebook`)
    response.json(entry)
    
  }).catch(error => next(error))


})
app.delete('/api/persons/:id', (request, response) => {
  const id = (request.params.id)
  Entry.findByIdAndDelete(id).then(() => {
    response.status(204).end()
    
  })
})


const errorHandler = (error, request, response, next) => {

  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).send({error: error.message})
  } 

  next(error)
}

app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})