# G-Scores

A full-stack web application for searching and analyzing the **2024 Vietnam National High School Examination** results.[https://github.com/TomNTG/g-scores](https://github.com/TomNTG/g-scores)

## Live Demo

**Website:** [https://gscores-thpt.netlify.app/](https://gscores-thpt.netlify.app/)

**GitHub:**&#x20;

> The backend is hosted on Render's free tier, so the first request may take additional time to respond.

## Features

- Search exam scores by registration number.
- View score statistics for each subject across four score ranges.
- Display the top 10 students in Group A (Mathematics, Physics, Chemistry).
- Responsive dashboard for desktop and mobile devices.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, React Router, Recharts
- **Backend:** NestJS, TypeScript, TypeORM
- **Database:** MongoDB Atlas
- **Deployment:** Netlify and Render

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/TomNTG/g-scores.git
cd g-scores
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside `backend/`:

```env
MONGODB_URI=your_mongodb_connection_string
```

If using an empty database, place `diem_thi_thpt_2024.csv` in the `dataset/` directory and import the data:

```bash
npx tsx scripts/import-exam-results.ts
```

Start the backend:

```bash
npm run start:dev
```

The API runs at `http://localhost:3000`.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

```bash
npm run dev
```

Open [**http://localhost:5173/**](http://localhost:5173/) in your browser.

## API Endpoints

| Method | Endpoint               | Description                     |
| ------ | ---------------------- | ------------------------------- |
| GET    | `/api/scores/:sbd`     | Search exam scores              |
| GET    | `/api/statistics`      | Get subject statistics          |
| GET    | `/api/ranking/group-a` | Get the top 10 Group A students |

## Reference

[Golden Owl Asia — Web Developer Intern Assignment #3](https://github.com/GoldenOwlAsia/webdev-intern-assignment-3)
