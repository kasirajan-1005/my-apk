# DM to Kasi

DM to Kasi is a full-stack real-time chat application with a mobile-only user login flow, a protected admin dashboard for Kasi, live Socket.IO messaging, user/admin wallpaper controls, and dynamic theme customization.

## Tech stack

- Frontend: Next.js 16 + React 19 + Tailwind CSS 4
- Backend: Node.js + Express
- Database: MongoDB Atlas with Mongoose
- Real-time: Socket.IO

## Features

- Mobile-number login for users with no password
- Admin login with mobile number + PIN
- Real-time one-to-one chat flow between each user and Kasi
- Upload profile pictures
- Personal chat wallpaper for users
- Global wallpaper and per-user wallpaper override for admin
- Dynamic theme color updates across the app
- Responsive, sky-blue, WhatsApp-inspired chat UI

## Folder structure

```text
DM kasi/
|-- backend/
|   |-- src/
|   |   |-- config/
|   |   |-- controllers/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routes/
|   |   `-- utils/
|   |-- .env.example
|   `-- package.json
|-- frontend/
|   |-- app/
|   |-- src/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   `-- lib/
|   |-- .env.example
|   `-- package.json
`-- README.md
```

## Admin credentials

- Mobile number: `7639750631`
- PIN: `2005`

For production, keep these values in backend environment variables instead of hardcoding them anywhere else.

## Database models

### User

- `mobileNumber`
- `profilePic`
- `wallpaper`

### Message

- `sender`
- `receiver`
- `message`
- `timestamp`

### Admin settings

- `globalWallpaper`
- `themeColor`

## Local setup

### 1. Install dependencies

Open two terminals and run:

```powershell
cd "D:\DM kasi\backend"
npm install
```

```powershell
cd "D:\DM kasi\frontend"
npm install
```

### 2. Create backend environment file

```powershell
Copy-Item .env.example .env
```

Inside [backend/.env.example](/D:/DM%20kasi/backend/.env.example), set real values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/dm-to-kasi
CLIENT_URL=http://localhost:3000
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=7d
ADMIN_MOBILE_NUMBER=7639750631
ADMIN_PIN=2005
```

### 3. Create frontend environment file

```powershell
cd "D:\DM kasi\frontend"
Copy-Item .env.example .env.local
```

Inside [frontend/.env.example](/D:/DM%20kasi/frontend/.env.example), use:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 4. Start the backend

```powershell
cd "D:\DM kasi\backend"
npm run dev
```

### 5. Start the frontend

```powershell
cd "D:\DM kasi\frontend"
npm run dev
```

Open `http://localhost:3000`.

## How login works

- A normal user enters only a mobile number.
- If that number does not match the admin mobile number, the backend creates or reuses a `User` document and issues a JWT.
- If the number matches the admin mobile number, the backend requires the admin PIN before issuing an admin JWT.
- The frontend stores the returned token in local storage and restores the session on refresh.

## API routes

### Auth

- `POST /api/auth/login`
- `GET /api/auth/me`

### Messages

- `GET /api/messages`
- `GET /api/messages?withMobile=<mobile>` for admin
- `POST /api/messages`

### User media

- `PUT /api/users/me/profile`
- `PUT /api/users/me/wallpaper`

### Admin controls

- `GET /api/admin/settings/public`
- `GET /api/admin/settings`
- `PUT /api/admin/settings`
- `GET /api/admin/chats`
- `PUT /api/admin/users/:mobileNumber/wallpaper`

## Socket events

- `message:new`
- `conversation:update`
- `settings:update`
- `profile:update`

## MongoDB Atlas setup

1. Create a cluster in MongoDB Atlas.
2. Create a database user with username/password access.
3. Add your IP address in Network Access for local development, or allow your hosting platform IPs in production.
4. Click Connect and copy the SRV connection string.
5. Replace the placeholder in `MONGODB_URI` with your real database name, username, and password.

Official Atlas connection guide: [MongoDB Atlas docs](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)

## Deploy backend on Render

1. Push this project to GitHub.
2. Create a new Web Service in Render and point it to the repository.
3. Set the root directory to `backend`.
4. Use:
   - Build command: `npm install`
   - Start command: `npm start`
5. Add environment variables:
   - `PORT`
   - `MONGODB_URI`
   - `CLIENT_URL`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `ADMIN_MOBILE_NUMBER`
   - `ADMIN_PIN`
6. After deploy, copy the backend URL, for example `https://dm-to-kasi-api.onrender.com`.
7. Update `CLIENT_URL` to your final Vercel frontend URL.

Render Node service docs: [Render documentation](https://render.com/docs)

## Deploy frontend on Vercel

1. Push this project to GitHub, GitLab, or Bitbucket.
2. In Vercel, create a new project and import the repository.
3. Because this repo has both `frontend` and `backend`, set the project Root Directory to `frontend`.
4. Vercel supports Next.js with zero-config, so you can keep the default framework detection.
5. Add frontend environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_API_URL=https://your-backend-url/api`
   - `NEXT_PUBLIC_SOCKET_URL=https://your-backend-url`
6. Deploy the project.
7. Copy the Vercel production URL and place it in the backend `CLIENT_URL` setting.
8. Redeploy the backend so CORS and Socket.IO accept the Vercel origin.

If you prefer the CLI flow, run `vercel` from [frontend](/D:/DM%20kasi/frontend) after linking the project.

Vercel docs:
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Project settings](https://vercel.com/docs/project-configuration/project-settings)
- [Monorepo support](https://vercel.com/docs/monorepos)
- [Environment variables](https://vercel.com/docs/environment-variables)

## Railway alternative

If you prefer Railway instead of Render:

1. Create a new service from the same repository.
2. Set the root directory to `backend`.
3. Add the same backend environment variables.
4. Use `npm install` for build and `npm start` for the launch command.

## Notes for production

- Uploaded profile pictures and wallpapers are currently stored as image data URLs in MongoDB for simplicity.
- For a larger production app, move images to object storage such as Cloudinary, S3, or Supabase Storage.
- Rotate the JWT secret and admin PIN for production.
- Restrict `CLIENT_URL` to your real frontend domain.

## Verification completed

- Backend JavaScript syntax checked with `node --check`
- Frontend production build verified with `npm run build`

## Official references used

- [Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
- [Next.js Turbopack config docs](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel environment variables](https://vercel.com/docs/environment-variables)
- [MongoDB Atlas connection guide](https://www.mongodb.com/docs/atlas/connect-to-database-deployment/)
