Server README

This folder is served by the Express server in server/app.js. The API endpoints in this prototype are minimal:

- GET /api/chapters -> list all chapter objects (reads server/data/chapters/*.json)
- GET /api/chapters/:id -> get single chapter by id

Run the server from the server folder:

  cd server
  npm install
  npm run migrate   # builds an index for chapters
  npm start

The prototype is intentionally small and synchronous for easy testing.
