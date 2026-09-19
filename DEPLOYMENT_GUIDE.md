# Deployment Guide: Shivangi Mobile

This project is separated into a standalone **Backend (MVC architecture on Render)** and **Frontend (React + Vite on Vercel)**.

---

## Part 1: Deploy Backend on Render

1. Go to [render.com](https://render.com) and log in.
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository (`Mobile-E-commerce-`).
4. Configure the Web Service settings:
   - **Name:** `shivangi-mobile-api` (or your preferred name)
   - **Region:** Singapore / Frankfurt / Oregon (any near your users)
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free
5. Add **Environment Variables** (under *Environment* tab):
   - `PORT`: `5001` (Render will assign its own, but 5001 is good as default)
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `mongodb+srv://loveinsights880_db_user:J3lHDClrgm3IH1c0@cluster0.elbb06n.mongodb.net/shivangi_mobile?retryWrites=true&w=majority&appName=Cluster0`
   - `CLOUDINARY_CLOUD_NAME`: `corwtx6y`
   - `CLOUDINARY_API_KEY`: `967325253961334`
   - `CLOUDINARY_API_SECRET`: `9L209cMYfyuW9YKJmzsznbL4oTg`
   - `FRONTEND_URL`: `https://your-frontend-domain.vercel.app`
6. Click **Deploy Web Service**.
7. Once deployed, copy your Render URL: e.g. `https://shivangi-mobile-api.onrender.com`.
8. Verify it by visiting: `https://shivangi-mobile-api.onrender.com/api/health` — it will return:
   ```json
   { "status": "ok", "service": "Shivangi Mobile Backend (MVC)" }
   ```

---

## Part 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) and log in.
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository (`Mobile-E-commerce-`).
4. Configure the Project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./` (Leave as root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`
5. Add **Environment Variables** (under *Environment Variables* tab):
   - `VITE_API_URL`: `https://shivangi-mobile-api.onrender.com/api` (Replace with your actual Render backend URL)
   - `VITE_CLERK_PUBLISHABLE_KEY`: Your Clerk Publishable Key from [clerk.com](https://clerk.com) Dashboard → API Keys
   - `VITE_CLOUDINARY_CLOUD_NAME`: `corwtx6y`
   - `VITE_CLOUDINARY_UPLOAD_PRESET`: `shivangi_preset`
6. Click **Deploy**.
7. Vercel will build and deploy your frontend in seconds with full SPA client-side routing support via `vercel.json`.

---

## Local Development

You can run both concurrently on your local machine:

- **Frontend:**
  ```bash
  npm run dev
  ```
  Accessible at: `http://localhost:5173`

- **Backend:**
  ```bash
  npm run server
  ```
  Accessible at: `http://localhost:5001`
