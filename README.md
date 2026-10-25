# Feedback App

A simple full-stack feedback board. Users submit a name, a 1-5 rating and a message. Entries are stored in SQLite and shown with live stats. Built to demonstrate deploying a Node.js web service to the cloud.

**Live demo:** https://feedback-app-y3u9.onrender.com
## Tech Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js, Express
- Database: SQLite (better-sqlite3)
- Hosting: Render (Web Service)

## Features

- Submit feedback with name, rating and message
- Server-side validation
- Live stats: total responses and average rating
- Newest-first feedback list
- Health check endpoint for cloud monitoring

## Project Structure

```
feedback-app/
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── server.js
├── package.json
├── .gitignore
└── README.md
```

## Getting Started

Requires Node.js 20 or later.

```bash
git clone https://github.com/spriyag006/feedback-app.git
cd feedback-app
npm install
npm start
```

Open http://localhost:3000.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/feedback` | List all feedback, newest first |
| POST | `/api/feedback` | Add feedback `{ name, rating, message }` |
| GET | `/api/stats` | Total count and average rating |
| GET | `/health` | Health check |

## Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `PORT` | `3000` | Server port (set by Render) |
| `DB_PATH` | `feedback.db` | SQLite file location |

## Deploy on Render

1. Push the project to GitHub.
2. Render: **New → Web Service**, connect the repo.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Health Check Path: `/health`

Note: on the free tier the disk is temporary, so data resets on redeploy. For persistence, attach a Render Disk and set `DB_PATH=/var/data/feedback.db`.

## Author

**Sangeetha Priya** ([@spriyag006](https://github.com/spriyag006))
