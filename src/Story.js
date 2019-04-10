'use strict'

const Archetype = require('archetype')

module.exports = new Archetype({
  asanaId: {
    $type: 'number',
    $required: true
  },
  external_id: {
    $type: 'string',
    $required: true
  },
  name: {
    $type: 'string',
    $required: true
  },
  description: {
    $type: 'string',
    $required: true,
    $default: ''
  },
  tasks: {
    $type: [Object],
    $required: true,
    $default: []
  },
  comments: {
    $type: [Object],
    $required: true,
    $default: []
  }
}).compile('Story')
