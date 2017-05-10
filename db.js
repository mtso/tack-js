// Matthew Tso, 2017

'use strict'

var store = {}
var count = {}
var block = []
var isUndo = false

// Transaction helper function

function stage(name) {
  if (!isUndo && block.length > 0 && !block[block.length - 1][name]) {
    block[block.length - 1][name] = store[name]
  }
}

// Commands

function get(name) {
  return store[name] || 'NULL'
}

function numequalto(value) {
  return count[value] || 0
}

function set(name, value) {
  stage(name)
  unset(name)
  store[name] = value
  count[value] = count[value] + 1 || 1
}

function unset(name) {
  stage(name)
  let value = get(name)
  if (count[value] > 1) {
    count[value] -= 1
    delete store[name]
  } else {
    delete count[value]
    delete store[name]
  }
}

function end() {
  process.exit()
}

// Transactions

function begin() {
  block.push({})
}

function rollback() {
  if (block.length === 0) {
    return 'NO TRANSACTION'
  }
  isUndo = true
  let last = block.pop()
  let undo = function(key) {
    if (last[key]) {
      set(key, last[key])
    } else {
      unset(key)
    }
  }
  Object.keys(last).forEach(undo)
  isUndo = false
}

function commit() {
  if (block.length === 0) {
    return 'NO TRANSACTION'
  }
  block = []
}

module.exports = {
  get: get,
  set: set,
  unset: unset,
  numequalto: numequalto,
  end: end,
  begin: begin,
  rollback: rollback,
  commit: commit,
}