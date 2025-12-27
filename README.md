# Daily Darshan - Pearl

This project consists of three parts:
1. **Backend**: Node.js/Express server with MongoDB.
2. **Admin Panel**: React.js Web Dashboard.
3. **Mobile App**: React Native (Expo) Application.

## Prerequisites
- Node.js installed.
- MongoDB installed and running locally, or a MongoDB Atlas URI.
- Cloudinary Account (for image hosting).

## Setup & Running

### 1. Backend
Navigate to the backend directory:
```bash
cd backend
```
Install dependencies (if not already done):
```bash
npm install
```
Create a `.env` file based on `.env.example` and fill in your details:
```bash
cp .env.example .env
```
Start the server:
```bash
npm run dev
```
The server runs on `http://localhost:5000`.

### 2. Admin Panel
Navigate to the admin directory:
```bash
cd admin
```
Install dependencies:
```bash
npm install
```
Start the development server:
```bash
npm run dev
```
Access the admin panel at `http://localhost:5173` (or the port shown in terminal).

**Initial Admin User**: You may need to register an admin via Postman/Curl to `/api/admin/register` first, or check `backend/controllers/adminController.js` logic.

### 3. Mobile App
Navigate to the mobile directory:
```bash
cd mobile
```
Install dependencies:
```bash
npm install
```
Start the Expo server:
```bash
npm run android
# or
npx expo start
```
Use the Expo Go app on your phone or an Emulator.

## Features
- **Mobile**: View Temples, Daily Darshan (Today/Yesterday), Download & Share.
- **Admin**: Manage Temples, Upload Daily Darshan.
- **Backend**: API logic, Auto-filter old Darshan.
