# Curiosity Quest

Curiosity Quest is a cross‑platform educational application designed to ignite curiosity and critical thinking. It presents users with a variety of topical challenges—from climate change to space exploration—and rewards deeper engagement through gamified points and badges. A stubbed AI integration simulates dynamic question generation that can later be replaced with a real OpenAI API call.

This repository is structured as a monorepo with three major parts:

* **`backend/`** – a lightweight Node.js/Express API that serves topics, handles authentication and simulates AI‑powered prompts.
* **`web/`** – a React + Tailwind CSS Progressive Web App (PWA) suitable for deployment to Netlify, Vercel or any static hosting provider.
* **`mobile/`** – a React Native application built with Expo that runs on Android, iOS and the web.

## Features

* **Challenge/Task Dashboard** – lists engaging topics such as climate change, AI, space exploration, ocean conservation and renewable energy.
* **Explore More Button** – reveals a GPT‑like deeper question and awards points/badges for continued exploration.
* **Gamification Layer** – users accumulate points and unlock badges (e.g. “Curious Explorer”) as they interact with content.
* **User Accounts** – simple email/password authentication with JSON Web Tokens (JWT). Credentials are stored in memory for demo purposes but can be swapped for Firebase Auth or another provider.
* **Multilingual Ready** – currently supports English and Chinese with a translation context; easily extendable to more languages.
* **Responsive UI** – uses Tailwind CSS on the web and carefully chosen styles on mobile for a clean, modern interface.
* **PWA & Native** – the web client can be installed as a progressive web app while the Expo project targets Android, iOS and the browser.

## Getting Started

### Prerequisites

* [Node.js ≥ 18](https://nodejs.org/) and npm.
* (For mobile development) [Expo CLI](https://docs.expo.dev/) and either Android Studio/Xcode simulators or physical devices.

### 1. Clone and Install Dependencies

```sh
git clone <repository‑url>
cd curiosity-quest

# install backend dependencies
cd backend
npm install

# install web dependencies
cd ../web
npm install

# install mobile dependencies
cd ../mobile
npm install
```

### 2. Run the Backend

The API runs on `http://localhost:3001` by default.

```sh
cd backend
npm start
```

Endpoints include:

* `GET /api/topics` – list topics.
* `GET /api/topics/:id` – get a specific topic with deeper prompts.
* `POST /api/auth/signup` – create a new user (email, password, displayName).
* `POST /api/auth/login` – authenticate an existing user.
* `POST /api/user/reward` – award points or badges (requires JWT).
* `GET /api/ai/generate?topicId=1&lang=en` – return a random deeper question.

> **Note:** The backend stores users in memory and resets whenever the process restarts. Replace this with a persistent datastore (e.g. Firebase Firestore) for production use.

### 3. Run the Web App

```sh
cd web
npm run dev
```

The development server runs on [http://localhost:5173](http://localhost:5173). The app will automatically reload when you make changes. To build a production bundle, run `npm run build` which outputs static files to the `dist/` directory. Deploy the contents of `dist/` to Netlify, Vercel or your preferred hosting provider.

If your backend is not running on `http://localhost:3001`, set the API base URL via an environment variable when starting the dev server:

```sh
VITE_API_BASE_URL="https://your‑api.domain" npm run dev
```

### 4. Run the Mobile App

The mobile client uses [Expo](https://expo.dev/) which streamlines React Native development.

```sh
cd mobile
npm run start
```

When Expo CLI loads, follow the instructions to run the app on an Android or iOS simulator, physical device, or in a web browser. The mobile client defaults to `http://localhost:3001` for API calls; override this using an environment variable:

```sh
EXPO_PUBLIC_API_BASE_URL="https://your‑api.domain" npm run start
```

### 5. Building for Production

#### Web (PWA)

1. Run `npm run build` inside the `web` directory to generate optimized static assets.
2. Deploy the `web/dist/` folder to a static hosting service such as Netlify or Vercel. Both providers detect Vite projects automatically.

#### Mobile (Expo EAS)

1. Install the [EAS CLI](https://docs.expo.dev/build/setup/) globally: `npm install -g eas-cli`.
2. Log in to your Expo account: `eas login`.
3. Configure your project for EAS builds: `eas build:configure`.
4. To build for Android and iOS, run:

   ```sh
   eas build --platform android   # for an Android APK/AAB
   eas build --platform ios       # for an iOS .ipa
   ```

Follow the prompts to upload keystores or request Expo to handle credentials. After the build completes, download the artifacts and submit them to Google Play or the Apple App Store.

## Project Structure

```
curiosity-quest/
├── backend/             # Node.js/Express API
│   ├── data/topics.json # Sample topics with translations and prompts
│   ├── routes/          # (empty – routes defined in server.js)
│   ├── server.js        # API entry point
│   └── package.json     # Backend dependencies and scripts
├── web/                 # React + Vite + Tailwind PWA
│   ├── index.html       # HTML entry point
│   ├── src/             # React components, contexts and translations
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json     # Web dependencies and scripts
├── mobile/              # React Native (Expo) app
│   ├── App.js           # App entry with navigation and context
│   ├── app.json         # Expo configuration
│   ├── assets/          # Placeholder icons and splash images
│   ├── src/             # Mobile screens, contexts and translations
│   └── package.json     # Mobile dependencies and scripts
└── README.md            # This file
```

## Extending the Application

* **Persistent Users** – swap the in‑memory user store for a database such as Firebase Firestore or SQLite. Replace the `/api/auth/*` and `/api/user/reward` implementations accordingly.
* **Real GPT Integration** – replace the stubbed `/api/ai/generate` endpoint with calls to OpenAI’s API. Remember to secure your API key and implement rate limiting.
* **Additional Languages** – add more entries to the `locales/` folder and extend the language selector. The translation context will handle the rest.
* **Design Enhancements** – leverage additional Tailwind utility classes on the web or adopt a component library like NativeBase for mobile to polish the UI.

## License

This project is provided as‑is for educational purposes. Feel free to adapt and expand it for your own use cases.