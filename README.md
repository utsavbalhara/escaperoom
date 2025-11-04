# 🎮 Escape Room Challenge System

A comprehensive, real-time escape room management system built with Next.js, TypeScript, and Firebase. Designed for running live escape room events with multiple teams across 6 different rooms.

## ✨ Features

### 🎯 Player Features
- **6 Unique Rooms** - Basecamp (Room 1) + 5 challenge rooms + final room
- **Real-time Countdown Timer** - Configurable per room with visual alerts
- **Female Robotic TTS Voice** - Auto-plays instructions with manual replay option
- **Answer Validation** - Numeric code entry with attempt tracking (default 5 attempts)
- **Hint System** - Toggleable hints for each room
- **Live Leaderboard** - Real-time rankings sorted by rooms completed → time
- **Level-up Screens** - Animated success screens with custom messages
- **Game Over Screens** - Displayed on timeout or failed attempts
- **Victory Screen** - Special celebration for completing all rooms

### 🎛️ Admin Features
- **Password Protected** - Secure admin access
- **Global Dashboard** - Overview of all 6 rooms and team statuses
- **Room-by-Room Control**:
  - Select teams from eligible pool
  - Start/pause/resume/reset timers
  - Manual TTS trigger
  - Live content editing (question, TTS text, hints, codes, timer duration, max attempts)
- **Team Management**:
  - Create teams on-the-fly
  - View all team statuses
  - Manual status overrides
  - Delete teams
- **Real-time Updates** - All changes sync instantly to player screens

### 🔥 Technical Features
- **Firebase Firestore** - Real-time database with automatic synchronization
- **20+ Concurrent Teams** - Handles multiple teams simultaneously
- **Auto-eligibility** - Teams automatically become eligible for next room on success
- **History Tracking** - All attempts logged with timestamps
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Dark Cyberpunk Theme** - Neon green terminal aesthetic

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js 18+ installed
- Firebase project created
- npm or yarn package manager

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable **Firestore Database**:
   - Go to Build → Firestore Database
   - Click "Create database"
   - Start in **test mode** (or production mode with custom rules)
4. Get your Firebase config:
   - Go to Project Settings → General
   - Scroll to "Your apps" → Web app
   - Copy the config values

### 3. Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### 4. Configure Environment Variables

Edit `.env.local` with your Firebase credentials:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Admin Password
NEXT_PUBLIC_ADMIN_PASSWORD=escaperoom2024
```

### 5. Initialize Database

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000/setup](http://localhost:3000/setup) and click **"Initialize Database"**

This will create:
- 6 rooms with default challenges
- Active room records for real-time tracking

### 6. You're Ready!

- **Player Screens**: `http://localhost:3000/room/1` through `/room/6`
- **Admin Panel**: `http://localhost:3000/admin` (password: `escaperoom2024`)
- **Home Page**: `http://localhost:3000`

---

## 📖 Usage Guide

### For Operators

#### Initial Setup
1. Open Admin Panel (`/admin`)
2. Login with password (from `.env.local`)
3. Go to **Teams** tab
4. Create all participating teams

#### Running a Game Session

**Room 1 (Basecamp):**
1. Team arrives at Room 1 screen
2. Team selects their name from dropdown
3. Clicks "Start Challenge"
4. Listens to welcome message and rules
5. Clicks "Continue" to become eligible for Room 2

**Rooms 2-6:**
1. Team arrives at Room N screen
2. Team/operator selects team name (only eligible teams shown)
3. Clicks "Start Challenge"
4. Timer starts automatically
5. TTS plays question automatically
6. Team enters numeric code
7. On success → Level-up screen → Team moves to next room
8. On failure → Game over screen → Team eliminated

#### Admin Controls (During Game)

**From Global Dashboard:**
- Monitor all 6 rooms simultaneously
- See which teams are in each room
- Quick status checks

**From Room Controller:**
- **Select Team**: Choose from eligible teams and start them
- **Timer Controls**: Start, pause, resume, reset timer
- **Manual TTS**: Force replay audio on player screen
- **Edit Content**: Change question, TTS text, hints, codes, timer duration
- **Clear Room**: Remove current team and reset room

### For Teams

1. **Select Team** → Choose your team name
2. **Listen** → Audio plays automatically with text display
3. **Solve Puzzle** → Work together to find the numeric code
4. **Enter Code** → Type code and submit
5. **Use Hints** → Click hint button if stuck (optional)
6. **Watch Timer** → Complete before time runs out
7. **Track Progress** → View leaderboard in sidebar

---

## 🎨 Customization

### Changing Room Content

**Via Admin Panel (Live):**
1. Go to Admin Panel → Select Room
2. Edit any field in Content Editor
3. Click "Save Changes"
4. Changes appear instantly on player screens

**Via Code (Before Initialization):**
Edit `src/constants/index.ts`:

```typescript
export const DEFAULT_ROOMS_DATA = [
  {
    roomNumber: 2,
    questionText: 'Your custom question here...',
    ttsText: 'What the voice will say...',
    correctCode: '1234',
    hintText: 'Your hint here...',
    timerDuration: 300, // 5 minutes
    maxAttempts: 5,
    levelUpMessage: 'Success message...',
    gameOverMessage: 'Failure message...',
    sequence: 2,
  },
  // ... more rooms
];
```

### Changing Admin Password

Edit `.env.local`:
```env
NEXT_PUBLIC_ADMIN_PASSWORD=your_new_password
```

### Changing Room Count

Edit `src/constants/index.ts`:
```typescript
export const TOTAL_ROOMS = 6; // Change to desired number
```

Then update `DEFAULT_ROOMS_DATA` array accordingly.

### Styling

All styles use Tailwind CSS with custom cyberpunk theme:
- Colors defined in `tailwind.config.ts`
- Global styles in `src/app/globals.css`
- Primary color: `#00ff41` (neon green)
- Secondary color: `#00d9ff` (cyan)
- Danger color: `#ff0040` (red)

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Styling**: Tailwind CSS
- **TTS**: Web Speech API

### Project Structure
```
src/
├── app/                    # Next.js pages
│   ├── page.tsx           # Home page
│   ├── room/[roomId]/     # Player screens
│   ├── admin/             # Admin panel
│   └── setup/             # Database setup
├── components/
│   ├── player/            # Player UI components
│   ├── admin/             # Admin UI components
│   └── shared/            # Reusable components
├── lib/
│   ├── firebase.ts        # Firebase config
│   ├── tts.ts            # TTS service
│   ├── utils.ts          # Utilities
│   └── db/               # Database functions
│       ├── teams.ts
│       ├── rooms.ts
│       ├── progress.ts
│       ├── activeRooms.ts
│       ├── leaderboard.ts
│       └── init.ts
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript types
└── constants/            # App constants
```

### Database Schema

**Collections:**
- `teams` - Team information and status
- `rooms` - Room configurations
- `teamProgress` - Progress tracking per team/room
- `activeRooms` - Real-time room state
- `leaderboard` - Rankings and statistics

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables (from `.env.local`)
4. Deploy
5. Run `/setup` on deployed URL to initialize database

### Other Platforms

Works on any platform supporting Next.js 14:
- Netlify
- Railway
- AWS Amplify
- Self-hosted with Node.js

---

## 🐛 Troubleshooting

### Firebase Errors

**"Permission denied"**
- Check Firestore security rules
- Temporarily use test mode: `allow read, write: if true;`

**"Firebase not initialized"**
- Verify `.env.local` values are correct
- Restart dev server after changing env vars

### TTS Not Working

- Check browser support (works in Chrome, Edge, Safari)
- Enable audio autoplay in browser settings
- Check browser console for errors

### Teams Not Showing

- Ensure teams are created via Admin Panel
- Check team `currentRoom` matches room number
- Verify team status is not "eliminated"

### Real-time Updates Not Working

- Check Firebase connection
- Verify Firestore rules allow reads
- Check browser console for WebSocket errors

---

## 📝 License

MIT License - feel free to use for your events!

---

## 🎯 Event Tips

### Before the Event
1. Initialize database with `/setup`
2. Create all teams in advance
3. Customize all room content
4. Test with 2-3 dummy teams
5. Prepare backup codes/hints

### During the Event
1. Have admin panel open on operator device
2. Monitor global dashboard
3. Use timer controls as needed
4. Be ready to provide manual hints
5. Watch for teams needing help

### Physical Setup
1. One screen per room (6 total)
2. Each screen open to its room URL (e.g., `/room/2`)
3. Operator device with admin panel
4. Good speakers for TTS audio
5. Clear team flow instructions

---

## 💡 Future Enhancements (TODOs)

- [ ] Firestore security rules template
- [ ] Team authentication/login option
- [ ] Analytics and reports
- [ ] Export game history
- [ ] Multi-language support
- [ ] Custom sound effects
- [ ] Video hints support
- [ ] Team photos/avatars
- [ ] SMS/email notifications

---

Built with ❤️ for escape room enthusiasts!
