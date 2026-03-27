# Beple Wallet (비플월렛)

A hybrid wallet and exchange platform that unifies **fiat banking**, **local crypto exchanges**, and **global crypto networks** into one app — so both locals and foreigners can store, exchange, and spend money seamlessly.

---

## What Problem Does This Solve?

Today, managing money across banks, crypto exchanges, and international transfers requires multiple apps. Foreigners visiting Korea can't easily spend crypto at local stores. Locals juggle between banking apps and exchange platforms.

**Beple Wallet fixes this** by putting everything in one place:

```
┌─────────────────────────────────────────────────┐
│                  Beple Wallet                    │
│                                                  │
│   🌐 Global Crypto    🇰🇷 Local Exchange    🏦 Banks  │
│   (Triple-A)          (Korbit)           (Korean) │
│        │                   │                 │    │
│        └───────────┬───────┘─────────────────┘    │
│                    │                              │
│              [ Unified Wallet ]                   │
│              [ Pay / Withdraw / Send ]            │
└─────────────────────────────────────────────────┘
```

---

## How It Works (Simple Version)

### For Foreigners (No Korean bank needed)
1. Open app → Quick passport KYC
2. Send crypto (USDT/USDC) from any wallet
3. Crypto converts to KRW automatically
4. Pay at stores, withdraw cash at ATMs

### For Locals (Korean residents)
1. Open app → Phone OTP verification
2. Connect Korbit exchange (one-time OAuth via Korbit app)
3. Top up wallet from bank or sell crypto via Korbit API
4. Pay, transfer, withdraw — all in one app

---

## Three Layers Working Together

| Layer | Provider | What It Does |
|---|---|---|
| **Global Crypto** | Triple-A | Receives crypto from anywhere in the world (USDT, USDC) |
| **Local Exchange** | Korbit | Converts crypto ↔ KRW at real-time market rates via API |
| **Local Banking** | Korean Banks | Deposits, withdrawals, and direct payments to/from bank accounts |

**The magic:** These three layers connect through one wallet balance. Users don't need to think about which system they're using — it just works.

---

## User Types & Feature Access

| Feature | Domestic (내국인) | Foreigner (외국인) |
|---|---|---|
| **Charge: Bank Account** | ✅ | ❌ |
| **Charge: Korbit Exchange** | ✅ | ❌ |
| **Charge: Direct Transfer Crypto** | ✅ | ✅ |
| **QR Payment** | ✅ | ✅ |
| **ATM Withdrawal** | ✅ | ✅ |
| **Bank Account Management** | ✅ (Settings) | ❌ (hidden) |
| **Charge Limit** | 2,000,000 KRW | 1,000,000 KRW |
| **KYC Method** | Phone OTP + ARS real-name | Passport OCR + Face liveness |

**Key rule:** Foreigners (passport KYC) only see Direct Transfer Crypto. Bank and Korbit features are hidden — they require a Korean bank account.

---

## Onboarding Flow

```
Splash Screen
    │
    ├─→ "기존 사용자" (Existing) → Load demo data → Home
    │
    └─→ "새로운 사용자" (New) → Language Select
                                    │
                              ┌─────┴─────┐
                              │           │
                         Domestic    Foreigner
                              │           │
                    Phone OTP +      Passport KYC
                    ARS verify     (OCR + Face + HiKorea)
                              │           │
                         Bank Setup       │
                         or Korbit        │
                              │           │
                              └─────┬─────┘
                                    │
                              Terms → PIN → Home
```

---

## Korbit Integration (Domestic Only)

### First-Time Connection (OAuth via Korbit App)

Korbit app is needed **only once** for initial authentication. After that, everything works via API.

```
Beple Wallet                     Korbit App (simulated)
     │                                │
     │  "Connect to Korbit" →         │
     │                           ① 연동 Guide
     │                           ② 계좌 정보 확인
     │                           ③ 이용 동의 (3 terms)
     │                           ④ 인증 코드 확인 (6-digit)
     │                           ⑤ 비밀번호 + 2FA OTP
     │                           ⑥ 인증 완료 ✓
     │                                │
     │  ← Return to Beple             │
     │  "Korbit Connected!" ✓         │
     │                                │
     │  (subsequent charges use       │
     │   Korbit API only —            │
     │   no app needed)               │
```

### Korbit Charging Flow (API-based, after OAuth)
1. Select asset to sell (BTC, ETH, XRP — fetched via Korbit API)
2. Enter sell quantity
3. Confirm sale at market price
4. Processing timeline (sell → KRW transfer → wallet charge)
5. Balance updated

---

## Direct Transfer Crypto (All Users)

5-step flow for on-chain crypto deposits:

```
① Request receiving address (select coin + network)
② Open external crypto wallet app
③ Copy address & transfer (QR code + wallet address + 30-min timer)
④ Wait for deposit confirmation (blockchain confirmations)
⑤ Complete (balance updated)
```

**MetaMask-style simulation:** When user copies the deposit address, a simulated crypto wallet UI appears showing the transfer process (Send → To → Amount → Review → Confirmed).

Supported: USDT, USDC on ERC-20 / TRC-20 / Solana networks.

---

## State Management

### Session Isolation
- Uses **`sessionStorage`** (not `localStorage`) for Zustand persist
- Each browser tab = completely independent state
- New tab = fresh onboarding (blank state)
- Same tab refresh = state preserved
- Close tab = data wiped

### Key State
```
bippleMoney: number          // KRW wallet balance
korbitConnected: boolean     // Korbit OAuth completed
userType: 'domestic' | 'foreigner'
bankAccounts: BankAccount[]  // Linked Korean banks
transactions: Transaction[]  // Full transaction history
pin: string                  // 6-digit transaction PIN
```

---

## Security

| Feature | Detail |
|---|---|
| 6-digit PIN | Required for every payment and withdrawal |
| PIN Lockout | 5 wrong attempts → 5-minute lockout with countdown |
| Face ID | Optional biometric login (toggle in Settings) |
| KYC | Passport OCR + face liveness for foreigners; Phone OTP + ARS for locals |
| Auth Guard | Protected routes redirect to login if not authenticated |
| Session isolation | Each tab has independent state via sessionStorage |

---

## Common Rules

| Rule | Value |
|---|---|
| ATM fee | 1,300 KRW per transaction |
| ATM daily limit | 300,000 KRW |
| ATM unit | 10,000 KRW increments |
| Crypto charge fee | 1% |
| PIN digits | 6 |
| Domestic charge limit | 2,000,000 KRW |
| Foreigner charge limit | 1,000,000 KRW |

---

## Languages

| Language | Coverage |
|---|---|
| Korean (한국어) | Full (690+ keys) |
| English | Full |
| Chinese (中文) | Full |

---

## Responsive Design

| Screen | Behavior |
|---|---|
| Desktop (>500px) | iPhone mockup frame with notch + status bar |
| Mobile (≤500px) | Full screen, no frame, native feel |
| Dark mode | System / Light / Dark toggle in Settings |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling + dark mode |
| Zustand 5 | State management with sessionStorage persistence |
| React Router 7 | Client-side routing with auth guards |
| Lucide React | Icons |

---

## Backend Developer Guide

This section documents what a backend team needs to build to replace the current client-side simulation with real APIs.

### API Domains to Implement

| Domain | Endpoints Needed | Current Simulation |
|---|---|---|
| **Auth** | POST /auth/login, POST /auth/signup, POST /auth/otp/send, POST /auth/otp/verify | Phone OTP with auto-fill |
| **KYC** | POST /kyc/passport, POST /kyc/face, GET /kyc/status, POST /kyc/hikorea-check | Simulated OCR + face matching |
| **Wallet** | GET /wallet/balance, POST /wallet/charge, POST /wallet/pay, POST /wallet/withdraw | Zustand state with sessionStorage |
| **Korbit** | POST /korbit/connect (OAuth), GET /korbit/assets, POST /korbit/sell, GET /korbit/status | Simulated OAuth + mock assets |
| **Crypto** | POST /crypto/address/generate, GET /crypto/deposit/status, GET /crypto/confirmations | Mock address + timer |
| **Bank** | GET /bank/accounts, POST /bank/register, DELETE /bank/remove, POST /bank/ars-verify | Mock ARS code verification |
| **Transaction** | GET /transactions, GET /transactions/:id, POST /transactions/refund | In-memory array |
| **Payment** | POST /payment/qr-scan, POST /payment/confirm, GET /payment/receipt/:id | Simulated QR decode |
| **ATM** | POST /atm/qr-scan, POST /atm/withdraw, GET /atm/daily-limit | Mock withdrawal |

### External Integrations

| Service | Integration Type | When Used |
|---|---|---|
| **Korbit** | REST API (HMAC-SHA256 auth) | Domestic charging — asset sell + KRW withdrawal |
| **Triple-A** | REST API + Webhooks | Direct Transfer Crypto — deposit address + confirmation |
| **Korean Banks** | Open Banking API | Bank account linking + ARS verification + transfers |
| **HiKorea** | Government API | Foreigner residence status verification during KYC |

### Korbit API Details
- **Base URL:** `https://api.korbit.co.kr`
- **Auth:** API Key + HMAC-SHA256 signature per request
- **Key endpoints:** `/v2/tickers` (prices), `/v2/balance` (assets), `/v2/orders` (sell), `/v2/krw/withdraw` (KRW out)
- **Rate limits:** 50 req/s public, 30 req/s orders
- **First-time OAuth** requires Korbit app; subsequent calls are API-only

### State Machines for Backend

```
KYC Status:    pending → scanning → verified | failed → retry
Charge Status: initiated → processing → completed | failed
Payment:       scanned → pin_verified → confirmed → settled
ATM:           scanned → amount_set → pin_verified → dispensing → completed
Korbit Sell:   order_placed → filled → krw_withdrawn → wallet_charged
```

### Database Entities

| Entity | Key Fields |
|---|---|
| User | id, phone, name, residenceId, userType, kycStatus, pinHash |
| Wallet | userId, balance, currency |
| BankAccount | userId, bankName, accountNumber, holderName, isDefault |
| KorbitConnection | userId, apiKey, apiSecret, connectedAt |
| Transaction | id, userId, type, amount, balance, status, createdAt |
| KYCRecord | userId, passportNo, nationality, faceScore, hikoreaStatus |
| CryptoDeposit | userId, coin, network, address, amount, confirmations, status |

### Key Business Rules for Backend
1. **Foreigner users** can ONLY charge via Direct Transfer Crypto — reject Bank/Korbit API calls
2. **Korbit OAuth** is one-time — store API keys after first auth, never require app again
3. **ATM fee** (1,300 KRW) must be logged as separate transaction
4. **PIN** should be hashed server-side (never stored in plaintext)
5. **Transaction IDs** must be globally unique (UUID v4)
6. **Double-charge prevention** — use idempotency keys on all charge/pay endpoints
7. **Session** should use JWT with short expiry + refresh tokens

---

## Future Potential

- **Merchant dashboard** — Store owners manage payments
- **Cross-border remittance** — Send money internationally
- **Multi-currency wallet** — USD, KHR, JPY alongside KRW
- **AI exchange optimization** — Best rate recommendations
- **Rewards & points** — Cashback on transactions
- **Offline payments** — NFC / contactless support
- **ATM map** — Nearby NICE ATM locations

---

## Design Specification

Based on **비플월렛 UX/UI 상세 설계서 v1.02** covering:
- Target & policy principles for domestic + foreign users
- 71-slide wireframe with all screens
- State & error message catalog
- KYC failure definitions (OCR, face, stay permit)
- Account & coin registration flows

---

*This is a confirmed UI prototype. All data is client-side (sessionStorage). Backend implementation should follow the API and entity specs above.*
