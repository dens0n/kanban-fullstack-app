# Trullo

Trullo är en kanban-applikation byggd med React, TypeScript och Express. Den är designad för att hjälpa användare att organisera sina uppgifter och projekt på ett visuellt sätt.

## Funktioner

-   Skapa, läsa, uppdatera och ta bort projekt.
-   Hantera uppgifter inom olika kolumner (t.ex. "Att göra", "Pågående", "Färdig").
-   Drag-and-drop-funktionalitet för att flytta uppgifter mellan kolumner.
-   Användarautentisering och sessionshantering.

## Teknologier

-   **Frontend**: React, TypeScript, Tailwind CSS
-   **Backend**: Node.js, Express, MongoDB
-   **Verktyg**: Vite, ESLint, Prettier

## Installation

### Förutsättningar

Se till att du har följande installerat:

-   Node.js
-   npm eller yarn
-   MongoDB

### Klona repot

```bash
git clone https://github.com/ditt-användarnamn/trullo.git
cd trullo
```

### Installera beroenden

För både klient och server:

```bash
bash
cd client
npm install
cd ../server
npm install
```

### Konfigurera miljövariabler

Skapa en `.env`-fil i `server`-mappen och lägg till följande:

```env
DB_URI=din_mongodb_uri
JWT_SECRET=din_hemliga_nyckel
```

### Starta applikationen

För att starta server, använd följande kommando:

```bash
cd server
npm run dev
```

Öppna en ny terminal för att starta client, använd följande kommando:

```bash
cd client
npm run dev
```

# API Reference

## Project routes:

#### Get all projects

```http
GET http://localhost:3000/api/projects
```

#### Get project by ID

```http
GET http://localhost:3000/api/projects/${projectID}
```

#### Create new project

```http
GET http://localhost:3000/api/projects

body:
{
"name": "project-1"
}
```

#### Update project name by ID

```http
PATCH http://localhost:3000/api/projects/${projectID}

body:
{
"name": "updated-project-name-1"
}
```

#### Delete project by ID

```http
DELETE http://localhost:3000/api/projects/${projectID}
```

## Task routes

#### Get all tasks by project ID

```http
GET http://localhost:3000/api/tasks/${projectID}/tasks
```

#### Add task to project column

```http
PATCH http://localhost:3000/api/tasks/add-task

body:
{
"projectId": "projectId",
"columnId": "columnId"
}
```

#### Move a task between columns

```http
PATCH http://localhost:3000/api/tasks/move-task

body:
{
"projectId": "projectId",
"taskId": "taskId",
"sourceColumnId": "sourceColumnId",
"destinationColumnId": "destinationColumnId"
}
```

#### Update task by ID

```http
PATCH http://localhost:3000/api/tasks/${taskID}

body:
{
"newContent": "newContent"
}
```

#### Delete a task by ID

```http
DELETE http://localhost:3000/api/tasks/${id}
```

#### Update all tasks in a project by ID

```http
PATCH http://localhost:3000/api/tasks/${projectID}/update-tasks

body:
[
    {
        "content": "newContent",
        "columnId": "columnId",
        "_id": "taskID"
    },
    {
        "content": "newContent",
        "columnId": "columnId",
        "_id": "TaskID"
    }
]
```

## User endpoints

#### Get all users

```http
GET http://localhost:3000/api/users
```

#### Create a new user

```http
POST http://localhost:3000/api/users

body:
{
"name":"John Doe",
"email": "johndoe@john.se",
"password": "john123"
}
```

#### Delete a user by ID

```http
DELETE http://localhost:3000/api/users/${userID}
```

#### Log in a user

```http
POST http://localhost:3000/api/login

body:
{
"email": "johndoe@john.se",
"password": "john123"
}
```

#### Log out a user

```http
POST http://localhost:3000/api/logout
```
