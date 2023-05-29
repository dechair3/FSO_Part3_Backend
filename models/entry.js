const mongoose = require('mongoose')
mongoose.set('strictQuery',false)
const url = process.env.MONGODB_URL
mongoose.connect(url).then(() => {
  console.log('Connected to MongoDB')
})
  .catch(error => {
    console.log('Could not connect due to ', error.message)
  })

const entrySchema = new mongoose.Schema({
  name: {type: String, minlength: 3}, 
  number: String
})

entrySchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Entry = new mongoose.model('Entry', entrySchema)

module.exports = Entry