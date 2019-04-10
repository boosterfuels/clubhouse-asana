'use strict'

const Clubhouse = require(`clubhouse-lib`)

let clubhouse

// ----------------------------------------------------------------------------
// Initialize Clubhouse client
// ----------------------------------------------------------------------------
exports.init = function (token) {
  clubhouse = Clubhouse.create(token)
}

// ----------------------------------------------------------------------------
// Create a new Story inside Clubhouse
// ----------------------------------------------------------------------------
exports.createStory = async function (params) {
  return clubhouse.createStory(params)
}
