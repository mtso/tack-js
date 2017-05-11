// Matthew Tso, 2017

'use strict'

var store = {}
var count = {}
var block = []

// Transaction helper function

function stash(name) {
  let current = block.length - 1
  if (block.length > 0 && !block[current][name]) {
    block[current][name] = store[name]
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
  unset(name)
  store[name] = value
  count[value] = count[value] + 1 || 1
}

function unset(name) {
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
  let last = block.pop()
  let undo = function(key) {
    if (last[key]) {
      set(key, last[key])
    } else {
      unset(key)
    }
  }
  Object.keys(last).forEach(undo)
}

function commit() {
  if (block.length === 0) {
    return 'NO TRANSACTION'
  }
  block = []
}

// Export command table, wrapping set and unset with stash.

module.exports = {
  set: function(name, value) {
    stash(name)
    set(name, value)
  },
  unset: function(name) {
    stash(name)
    unset(name)
  },
  get: get,
  numequalto: numequalto,
  end: end,
  begin: begin,
  rollback: rollback,
  commit: commit,
}
