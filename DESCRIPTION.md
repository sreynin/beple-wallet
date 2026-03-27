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
1. Open app → Link bank accounts
2. Connect Korbit exchange
3. Top up wallet from bank or sell crypto
4. Pay, transfer, withdraw — all in one app

---

## Three Layers Working Together

| Layer | Provider | What It Does |
|---|---|---|
| **Global Crypto** | Triple-A | Receives crypto from anywhere in the world (USDT, USDC, BTC, ETH) |
| **Local Exchange** | Korbit | Converts crypto ↔ KRW at real-time market rates |
| **Local Banking** | Korean Banks | Deposits, withdrawals, and direct payments to/from bank accounts |

**The magic:** These three layers connect through one wallet balance. Users don't need to think about which system they're using — it just works.

---

## Core Features

### Unified Wallet
One balance that receives money from **any source** — bank transfer, crypto deposit, or exchange conversion. Spend it anywhere with QR payments or ATM withdrawals.

### Currency Exchange
- **Crypto → KRW**: Send USDT from Binance, receive KRW in wallet
- **Bank → Wallet**: Transfer from linked Korean bank account
- **Exchange → Wallet**: Sell BTC on Korbit, receive KRW instantly

### Multi-Bank Integration
Link multiple Korean bank accounts. Choose which one to use for deposits or withdrawals. Manage them all from one screen.

### QR Payments
Scan merchant QR codes to pay instantly from wallet balance. Works at any participating store, cafe, or restaurant.

### ATM Cash Withdrawal
Need physical cash? Withdraw at any NICE ATM using QR code — no bank card needed.

---

## Who Uses This?

### Domestic Users (내국인)
- Have Korean bank accounts
- May hold crypto on Korbit
- Want one app to manage banking + crypto + payments
- **Charge limit:** 2,000,000 KRW

### Foreign Users (외국인)
- No Korean bank account required
- Hold crypto (USDT, USDC, BTC, ETH)
- Need to spend in KRW while visiting Korea
- **Charge limit:** 1,000,000 KRW (Minimal-KYC)

---

## Charging Methods

| Method | How It Works | Who Uses It |
|---|---|---|
| **Bank Account** | Direct transfer from linked account | Domestic |
| **Korbit Exchange** | Sell crypto on Korbit → KRW to wallet | Domestic |
| **Direct Transfer Crypto** | Send USDT/USDC on-chain → auto-convert to KRW | Foreign + Domestic |

---

## Security

| Feature | Detail |
|---|---|
| 6-digit PIN | Required for every payment and withdrawal |
| PIN Lockout | 5 wrong attempts → 5-minute lockout |
| Face ID | Optional biometric login |
| KYC | Passport OCR + face liveness for foreigners; ARS real-name for locals |
| Encrypted sessions | LocalStorage with persisted state |

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

## App Flow

```
New User:   Login → Terms → PIN → Home
                                    │
                    ┌───────────────┼───────────────┐
                    │               │               │
                 Charge            Pay             ATM
                    │               │               │
          ┌─────────┤          QR Scan          QR Scan
          │         │               │               │
       Korbit    Crypto          Confirm         Amount
          │      Transfer           │               │
       Sell →      │            Success          Withdraw
       KRW      Confirm            │               │
          │         │           Receipt          Receipt
          └────→ Balance ←─────────┘───────────────┘
```

---

## Languages

| Language | Coverage |
|---|---|
| Korean (한국어) | Full |
| English | Full |
| Chinese (中文) | Full |

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 + TypeScript | UI framework |
| Vite 8 | Build tool |
| Tailwind CSS 4 | Styling + dark mode |
| Zustand 5 | State management with localStorage persistence |
| React Router 7 | Client-side routing with auth guards |
| Lucide React | Icons |

---

## Future Potential

- **Merchant dashboard** — Store owners manage payments
- **Cross-border remittance** — Send money internationally
- **Multi-currency wallet** — USD, KHR, JPY alongside KRW
- **AI exchange optimization** — Best rate recommendations
- **Rewards & points** — Cashback on transactions
- **Offline payments** — NFC / contactless support

---

## Design Specification

Based on **비플월렛 UX/UI 상세 설계서 v1.02** covering:
- Target & policy principles for domestic + foreign users
- 71-slide wireframe with all screens
- State & error message catalog
- KYC failure definitions (OCR, face, stay permit)
- Account & coin registration flows

---

*Prototype — all data is client-side. No real banking or crypto transactions.*
