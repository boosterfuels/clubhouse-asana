'use strict'

const Asana = require('asana')
const Story = require('./Story')

let asana

// ----------------------------------------------------------------------------
// Initialize Asana client
// ----------------------------------------------------------------------------
exports.init = function (token) {
  asana = Asana.Client.create().useAccessToken(token)
}

// ----------------------------------------------------------------------------
// Get all tasks for the given Asana project and store the
// relevant bits of data within a `Story` Object
// ----------------------------------------------------------------------------
exports.getTasks = async function (projectId) {
  let stories = []
  let tasks = await asana.tasks.findByProject(projectId)
  tasks = await tasks.fetch()

  for (const t of tasks) {
    let task = await getTaskDetails(t.id)
    if (task && !task.completed) {
      stories.push(new Story({
        asanaId: task.id,
        name: task.name,
        description: task.notes
      }))
    }
  }

  return stories
}

// ----------------------------------------------------------------------------
// Get all subtaks for the given Asana task. Only the name will be
// used as the description for the Clubhouse Story task.
// ----------------------------------------------------------------------------
exports.getSubtasks = async function (story) {
  let storyTasks = []
  let subtasks = await asana.tasks.subtasks(story.asanaId)

  for (const st of subtasks.data) {
    let subtask = await getTaskDetails(st.id)
    if (subtask && !subtask.completed) { storyTasks.push(subtask.name) }
  }

  return storyTasks
}

// ----------------------------------------------------------------------------
// Asana calls all comments and status changes on a Task a 'Story'
// ----------------------------------------------------------------------------
exports.getComments = async function (story) {
  let storyComments = []
  let asanaStories = await asana.tasks.stories(story.asanaId)

  for (const s of asanaStories.data) {
    if (s.type === 'comment') { storyComments.push({ text: s.text }) }
  }

  return storyComments
}

// ----------------------------------------------------------------------------
// Get the task details, but ignore tasks that are sections
// ----------------------------------------------------------------------------
async function getTaskDetails (taskId) {
  const task = await asana.tasks.findById(taskId)
  return task.resource_subtype !== 'section' ? task : null
}
