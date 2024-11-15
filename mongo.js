// require('dotenv').config()
// const mongoose = require('mongoose')
// const url = process.env.MONGODB_URI

// // if (process.argv.length < 3 || process.argv.length === 4 || process.argv.length > 5) {
// //     console.log('Display all entries need 3 arguments -> node mongo.js <pw>')
// //     console.log('Adding a person needs 5 arguments -> node mongo.js <pw> <name> <number>')
// //     process.exit(1)
// // }

// mongoose.set('strictQuery',false)
// mongoose.connect(url)

// const personSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     minLength: 3,
//     maxLength: 4,
//     required: true
//   },
//   number: {
//     type: String,
//     required: true
//   },
//   id: Number,
// })

// const Person = mongoose.model('Person', personSchema)

// // const person = new Person({
// //   name: process.argv[3],
// //   number: process.argv[4],
// //   id: 5
// // })


// if (process.argv.length === 3) {
//   console.log('phonebook:')
//   Person.find({})
//     .then(result => {
//       result.forEach(person => {
//         console.log(`${person.name}, ${person.number}`)
//       })
//       mongoose.connection.close()
//     })
//     .catch(error => console.log(error))
// }

// if (process.argv.length === 5) {
//   person.save().then(result => {
//     console.log(`added ${process.argv[3]} number ${process.argv[4]} to phonebook`)
//     mongoose.connection.close()
//   })
//     .catch(error => console.log(error))
// }


