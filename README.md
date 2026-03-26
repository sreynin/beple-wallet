# Bipple Wallet (비플월렛)

Hybrid payment wallet for domestic Korean users and foreign tourists — charge, pay, and withdraw KRW through crypto exchanges and stablecoin platforms.

> See [DESCRIPTION.md](DESCRIPTION.md) for full app documentation.

---

## Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x (comes with Node.js)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/yanchhuong/bipple-wallet.git
cd bipple-wallet

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

The app will open automatically at **http://localhost:3000**

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server (port 3000, auto-open browser) |
| `npm run build` | TypeScript compile + production build |
| `npm run preview` | Preview production build locally |

---

## Project Structure

```
bipple-wallet/
├── public/                     # Static assets
├── src/
│   ├── main.tsx                # App entry point
│   ├── App.tsx                 # Router with auth guard
│   ├── constants.ts            # App-wide constants (fees, limits)
│   ├── index.css               # Global styles + Tailwind theme
│   │
│   ├── components/             # Reusable UI components
│   │   ├── AuthGuard.tsx       # Route protection (login required)
│   │   ├── BottomNav.tsx       # Tab navigation (Home/History/Settings)
│   │   ├── BottomSheet.tsx     # Modal drawer
│   │   ├── Header.tsx          # Page header with back button
│   │   ├── MaintenanceModal.tsx# System maintenance dialog
│   │   ├── Modal.tsx           # Centered dialog
│   │   ├── PermissionDialog.tsx# Camera permission request
│   │   ├── PhoneFrame.tsx      # iPhone mockup wrapper
│   │   ├── PinInput.tsx        # 6-digit PIN keypad
│   │   └── Toast.tsx           # Toast notifications (info/success/error/warning)
│   │
│   ├── pages/                  # 34 page components
│   │   ├── LanguageSelect      # Language picker (KO/EN/ZH)
│   │   ├── Login / SignUp      # Auth (Google/Apple/Email/Phone)
│   │   ├── KycPassport/Face    # KYC with sample passport & face images
│   │   ├── Home                # Dashboard with balance & coin assets
│   │   ├── ChargeHub/Bank/Coin # Multiple charging methods
│   │   ├── PaymentPin/Scan     # QR payment with PIN lockout
│   │   ├── AtmScan/Amount      # ATM cash withdrawal
│   │   ├── Settings/Profile    # User type badges (Domestic/Foreigner)
│   │   └── ...                 # See App.tsx for full route map
│   │
│   ├── store/
│   │   └── useStore.ts         # Zustand store with localStorage persistence
│   │
│   ├── hooks/
│   │   └── useT.ts             # Translation hook
│   │
│   └── i18n/                   # Translations
│       ├── ko.ts               # Korean (600+ keys)
│       ├── en.ts               # English
│       └── zh.ts               # Chinese (Simplified)
│
├── DESCRIPTION.md              # Full app documentation
├── package.json                # Dependencies & scripts
├── tsconfig.json               # TypeScript config
└── vite.config.ts              # Vite build config
```

---

## Demo Walkthrough

1. **Select language** → Korean / English / Chinese
2. **Login** → Google, Apple, or Sign Up with email
3. **Accept terms** → Service terms & privacy policy
4. **Set PIN** → 6-digit transaction PIN
5. **Choose user type**:
   - **Domestic** → Auto-verified, goes to Home
   - **Foreigner** → KYC flow (Passport scan → Face recognition → HiKorea check)
6. **Home** → View balance, charge, pay, or ATM withdraw
7. **Settings** → Profile (shows user type badge), logout clears all data

### Demo Notes
- KYC pages have **"Simulate Failure"** buttons to test error states
- QR scan pages show **camera permission dialog** before scanning
- Korbit charging shows **maintenance modal** (demo of system state)
- All data **persists in localStorage** — refresh won't lose your session
- **Logout** resets everything back to initial state

---

## Tech Stack

- **React 19** + **TypeScript 5.9** + **Vite 8**
- **Tailwind CSS 4** (custom theme with CSS variables)
- **Zustand 5** (state management with `persist` middleware)
- **React Router 7** (client-side routing with auth guard)
- **Lucide React** (icons)

---

## Environment

- Developed on **Windows 11**
- Tested with **Node.js 18+**
- No backend required — all data is client-side (localStorage)

---

## License

Prototype / Proof-of-Concept. All rights reserved.
