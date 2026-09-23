# Feedant Dash

Feedant Dash is a mobile competition discovery and registration application built with React Native. It allows users to create an account, log in, browse available competitions, view competition details, register for competitions, and withdraw from competitions they have already registered for.

The application consists of a React Native frontend and a Node.js/Express backend connected to MongoDB.

---

## Features

### Authentication

Users can:

- Register a new account
- Log in to an existing account
- Persist their authentication state locally

During registration, users provide:

- Username
- Email
- Password

During login, users provide:

- Username
- Password

The user's email is stored locally on the device and is used to check the user's authentication state when the application is opened.

### Competition Discovery

The Home tab displays the available competitions.

Users can:

- Browse available competitions
- Select a competition
- View detailed competition information
- View competition timing
- See time-related urgency information
- Check their registration status

Competition information includes:

- Competition name
- Judges
- Prize pool
- Competition type
- Entry fee
- Timing/deadline information
- Other competition details

### Competition Registration

Users can:

- Register for a competition
- View whether they are already registered
- Withdraw from a competition they have registered for

### Navigation

The application contains three main tabs for navigating through the application.

---

# Tech Stack

## Frontend

- React Native
- Expo
- NativeWind
- TypeScript / JavaScript
- Local Storage / AsyncStorage

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose

## Development and Deployment

- Git
- GitHub
- Expo
- EAS Build

---

# Project Structure

```text
Feedant-Dash/
│
├── client/
│   ├── app/
│   ├── components/
│   ├── assets/
│   ├── ...
│   └── package.json
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── ...
│   └── package.json
│
└── README.md

```

## Setup Guide

### Requirements

Make sure you have the following installed:

* Node.js
* npm
* Git
* MongoDB / MongoDB Atlas
* Android Studio (if using an Android Emulator)

### 1. Clone the Repository

```bash
git clone https://github.com/sankhidarjun123-web/Feedants-Competition-List.git
cd Feedants-Competition-List
```

### 2. Setup the Backend

Open a terminal and run:

```bash
cd server
npm install
```

Create a `.env` file inside the `server` folder:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
```

Replace `YOUR_MONGODB_CONNECTION_STRING` with your MongoDB connection string.

Start the backend:

```bash
npm run dev
```

The backend will run on:

`http://localhost:5000`

Keep the backend terminal running.

### 3. Setup the React Native App

Open a **new terminal** and run:

```bash
cd client
npm install
```

Configure the backend URL used by the client.

For an **Android Emulator**, use:

`http://10.0.2.2:5000`

For a **physical Android device**, use your computer's local IP address, for example:

`http://192.168.1.100:5000`

The phone and computer should be connected to the same network.

Start the React Native application:

```bash
npx expo start
```

### 4. Run the App

For an Android Emulator, start the emulator and press `a` in the Expo terminal.

For a physical Android device, open Expo Go and scan the QR code displayed by Expo.

### 5. Build the Android APK

From the `client` folder:

```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

EAS will build the Android application and provide a link to the generated build.

### Environment Variables

The backend requires:

```env
PORT=5000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
```

Do not commit the `.env` file to GitHub.

Add the following to `.gitignore`:

```gitignore
.env
node_modules/
```

### Quick Start

**Terminal 1 — Backend**

```bash
cd Feedants-Competition-List/server
npm install
npm run dev
```

**Terminal 2 — Client**

```bash
cd Feedants-Competition-List/client
npm install
npx expo start
```

Then press `a` for the Android Emulator or scan the Expo QR code on a physical Android device.

**Important:** Both the backend and the React Native client must be running for Feedant Dash to work correctly.
