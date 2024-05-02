# AutoFlow: Effortless Task Automation

AutoFlow is a comprehensive task automation tool designed to simplify and streamline the management of repetitive tasks such as database backups, file transfers, and getting timely notification alerts. AutoFlow allows users to create, schedule, and monitor automated tasks.

## Table of Contents
1. [Introduction](#introduction)
2. [Project Overview](#project-overview)
3. [Technologies Used](#technologies-used)
4. [Getting Started](#getting-started)
   - [Installation](#installation)
   - [Configuration](#configuration)
5. [Usage](#usage)
   - [Authentication](#authentication)
   - [Task Management](#task-management)
   - [API Endpoints](#api-endpoints)
6. [Examples](#examples)
   - [Sample Requests](#sample-requests)
   - [Response Formats](#response-formats)
7. [Troubleshooting](#troubleshooting)

## 1. Introduction
Welcome to the AutoFlow documentation! This guide provides an in-depth explanation of AutoFlow, a task scheduling and automation platform built on Node.js.

## 2. Project Overview
AutoFlow is a Node.js-based application designed to automate various tasks such as database backups, file transfers, and notification alerts. It offers a RESTful API for task management and utilizes the Agenda library for job scheduling.

## 3. Technologies Used
AutoFlow leverages the following technologies:
- **Node.js**: A JavaScript runtime environment for server-side applications.
- **Express.js**: A minimalist web framework for Node.js.
- **MongoDB**: A NoSQL database for storing task data.
- **Agenda**: A job scheduling library for Node.js.
- **Winston**: A versatile logging library for Node.js.
- **Mailgun**: An email service provider for sending notification alerts.
  You can sign up for a mailgun account [here](https://signup.mailgun.com).


## 4. Getting Started
### Installation
To run AutoFlow locally, follow these steps:
1. Clone the AutoFlow repository from GitHub.
2. Navigate to the project directory and install dependencies using `npm install`.
3. Configure environment variables by creating a `.env` file based on `.env.example`.
4. Start the server using `npx tsx app.ts` or `npm start`.

### Configuration
AutoFlow requires configuration for database connection, API keys, and other settings. Refer to the `.env.example` file for a template and adjust it according to your environment.

## 5. Usage
### Authentication
AutoFlow does not currently implement authentication. Ensure the server is running in a secure environment and restrict access to authorized users.

### Task Management
Tasks can be managed via the provided API endpoints. Users can create, retrieve, update, and delete tasks using RESTful operations.

### API Endpoints
Run `npm start` in one terminal to get the server running:
```bash
npm start

> AutoFlow@1.0.0 start
> npx tsx app.ts

info:    Server running on port 3000...
info:    MongoDB connected
info:    MongoDB ready to receive requests...
info:    No scheduled jobs found
```
#### GET /api/tasks
- Retrieves a list of all tasks. The tasks are displayed as an array of JSON data.


#### POST /api/tasks
- Creates a new task.
You can create a new task based on the predefined models [here](https://github.com/tim-ngeno/AutoFlow/blob/main/backend/models/Task.js).

The models have 3 required attributes, and a timestamp for time of modification:

- `task`: The name of your task.
- `type`: The type of task you're creating. Currently the following types are supported (case-sensitive): `Database Backup`, `File Transfer`, `Notification Alert`.
- `schedule`: The time period for when you want the job to be run.


#### GET /api/tasks/:id
- Retrieves a specific task by its ID.


#### PUT /api/tasks/:id
- Updates an existing task. You can modify the parameters set here in the request body.

#### DELETE /api/tasks/:id
- Deletes a task by its ID.


## 6. Examples
### Sample Requests
#### Create a New Task
Example:
```bash
curl -X POST -H "Content-Type: application/json"   -d ' {
    "task": "Database Backup Job",
    "type": "Database Backup",
    "schedule": "5 seconds",
    "taskData": {
      "dbName": "Flow",
      "compressionType": "gzip"
    }
  }'   localhost:3000/api/tasks; echo

```
This returns a response on the server like so:
```bash
New task created: {
  task: 'Database Backup Job',
  type: 'Database Backup',
  schedule: '5 seconds',
  taskData: { dbName: 'Flow', compressionType: 'gzip' },
  _id: new ObjectId('66082d1dba7ec311a731afef'),
  modified_at: 2024-03-30T15:17:49.547Z,
  __v: 0
}

```

#### Retrieve All Tasks
```bash
curl localhost:3000/api/tasks; echo
```

#### Retrieve a specific task by its ID
```bash
curl localhost:3000/api/tasks/66082d1dba7ec311a731afef; echo

{"_id":"66082d1dba7ec311a731afef","task":"Database Backup Job","type":"Database Backup","schedule":"5 seconds","taskData":{"dbName":"Flow","compressionType":"gzip"},"modified_at":"2024-03-30T15:17:49.547Z","__v":0}

```

#### Delete a  task by its ID
```bash
curl -X DELETE localhost:3000/api/tasks/66082d1dba7ec311a731afef; echo

{"message":"Deleted successfully"}
```

### Response Formats
#### Success Response
```json
{
  "message": "success",
  "data": { ... }
}
```

#### Error Response
```json
{
  "error": "Error message"
}
```

## 7. Troubleshooting
AutoFlow uses winston logging to document the program logs. check the logs for detailed error messages and insights into the application.

---
