# 🚀 Quick Setup Guide

## Step-by-Step Setup (5 minutes)

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Create Firebase Project
1. Go to https://console.firebase.google.com/
2. Click "Create a project"
3. Enter project name (e.g., "escape-room")
4. Disable Google Analytics (optional)
5. Click "Create Project"

### 3️⃣ Enable Firestore
1. In your Firebase project, click "Build" → "Firestore Database"
2. Click "Create database"
3. Select "Start in test mode"
4. Choose your location
5. Click "Enable"

### 4️⃣ Get Firebase Config
1. Click the gear icon ⚙️ → "Project settings"
2. Scroll to "Your apps"
3. Click the web icon `</>`
4. Register app with nickname (e.g., "escaperoom-web")
5. Copy the `firebaseConfig` object

### 5️⃣ Configure Environment
Create `.env.local` file in project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456

NEXT_PUBLIC_ADMIN_PASSWORD=escaperoom2024
```

### 6️⃣ Start Development Server
```bash
npm run dev
```

### 7️⃣ Initialize Database
1. Open http://localhost:3000/setup
2. Click "Initialize Database"
3. Wait for success message

### 8️⃣ Test the System

**Create Teams:**
1. Go to http://localhost:3000/admin
2. Login with password: `escaperoom2024`
3. Click "Teams" tab
4. Create 2-3 test teams

**Test Player Flow:**
1. Open http://localhost:3000/room/1 in another tab
2. Select a team
3. Click "Start Challenge"
4. Test the basecamp flow

**Test Admin Controls:**
1. Go back to admin panel
2. Click on Room 2
3. Try selecting a team
4. Test timer controls

### ✅ You're Done!

---

## Firestore Security Rules (Optional)

For production, update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to all
    match /{document=**} {
      allow read: if true;
    }

    // Allow write only from authenticated sources
    match /{document=**} {
      allow write: if true; // Change this for production!
    }
  }
}
```

---

## Common Issues

**"Firebase not found"**
- Make sure you created `.env.local`
- Restart the dev server after adding env vars

**"Permission denied"**
- Check Firestore rules are in test mode
- Verify Firebase project is active

**"No teams showing"**
- Create teams via Admin Panel first
- Check browser console for errors

---

## URLs Reference

- Home: `http://localhost:3000`
- Setup: `http://localhost:3000/setup`
- Admin: `http://localhost:3000/admin`
- Room 1: `http://localhost:3000/room/1`
- Room 2: `http://localhost:3000/room/2`
- Room 3: `http://localhost:3000/room/3`
- Room 4: `http://localhost:3000/room/4`
- Room 5: `http://localhost:3000/room/5`
- Room 6: `http://localhost:3000/room/6`

---

## Default Admin Password
```
escaperoom2024
```

Change it in `.env.local`:
```env
NEXT_PUBLIC_ADMIN_PASSWORD=your_new_password
```

---

Need help? Check the main [README.md](./readme.md) for detailed documentation!
