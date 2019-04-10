#!/usr/bin/env node

'use strict'

const commander = require('commander')
const spinner = require('ora')('Initializing...').start()
const options = require('./src/options')
const asana = require('./src/asana')
const clubhouse = require('./src/clubhouse')

for (const o of options) {
  commander.option(o.flag, o.description)
}

// Required for automated help to work
commander.parse(process.argv)

// Invoke the main program routine
run()

// ----------------------------------------------------------------------------
// Main program routine that builds Clubhouse Project Stories
// from Asana Project Tasks
// ----------------------------------------------------------------------------
async function run () {
  // Initialize Asana and Clubhouse libraries
  asana.init(commander.asanaToken)
  clubhouse.init(commander.clubhouseToken)

  // Fetch all Asana Tasks for this project import
  spinner.text = 'Fetching Tasks from Asana Project'
  let stories = await asana.getTasks(commander.from)

  // Include Asana subtasks for each task, if any
  spinner.text = 'Fetching Subtasks for each Asana Task'
  for (const story of stories) {
    story.subtasks = await asana.getSubtasks(story)
  }

  // Include Asana comments for each task, if any
  spinner.text = 'Including any comments that you might have'
  for (const story of stories) {
    story.comments = await asana.getComments(story)
  }

  // Create a new Clubhouse Story for each Asana Task
  spinner.text = 'Creating stories in your Clubhouse project'
  for (const story of stories) {
    clubhouse.createStory({
      project_id: commander.to,
      name: story.name,
      description: story.description,
      comments: story.comments
    })
  }

  spinner.succeed('Finished migrating Asana Tasks to Clubhouse Stories!')
}
