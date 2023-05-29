const mongoose = require('mongoose')
let mode = ''

if(process.argv.length == 3){
    mode = 'GET'
}
else if(process.argv.length >= 5){
    mode = 'POST'
}
else{
    console.log("Insufficient Parameters to execute")
    process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://dechair3:${password}@cluster0.82vgnal.mongodb.net/Phonebook_DB?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const entrySchema = new mongoose.Schema({
    name: String,
    number: String
})

const Entry = new mongoose.model('Entry', entrySchema)

if(mode == 'GET'){
    console.log('Phonebook Entries:')
    Entry.find({}).then(result => {
        result.forEach(entry => {
          console.log(entry)
        })
        mongoose.connection.close()
      })
}
else if(mode == 'POST'){
    const name = process.argv[3]
    const number = process.argv[4]
    const newEntry = new Entry({
        name: name,
        number: number
    })

    newEntry.save().then(result => {
        console.log(`Added ${name}, Number: ${number} to phonebook `)
        mongoose.connection.close()
    })
}