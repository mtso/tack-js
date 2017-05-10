// Matthew Tso, 2017

'use strict'

const readline = require('readline')
const db = require('./db')

const reader = readline.createInterface({
  input: process.stdin
})

reader.on('line', (line) => {
  line = line.split(' ')

  let cmd = line[0].toLowerCase()
  let name = line[1]
  let value = line[2]

  if (db[cmd]) {
    let response = db[cmd](name, value)
    if (response !== undefined) {
      console.log(response)
    }
  }
})