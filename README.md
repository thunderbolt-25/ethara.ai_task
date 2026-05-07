# Team Task Manager

## Folder Structure
- `backend` for Express + MongoDB APIs
- `frontend` for React app

## Run Backend
```bash
cd backend
npm install
# copy .env.example to .env and update values
npm run dev
```

## Run Frontend
```bash
cd frontend
npm install
# copy .env.example to .env
npm start
```

## API Endpoints
- POST `/api/auth/signup`
- POST `/api/auth/login`
- GET `/api/projects`
- POST `/api/projects` (Admin)
- PATCH `/api/projects/:projectId/members`
- GET `/api/tasks`
- POST `/api/tasks`
- PATCH `/api/tasks/:taskId/status`
- GET `/api/dashboard`

## Railway Deployment
- Deploy `backend` as one Railway service
- Deploy `frontend` as second service
- Set environment variables from `.env`
