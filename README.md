# BidRank - Live Bid-to-Rank Product Leaderboard

A competitive product directory where founders bid to claim the top spot. The highest bidder wins the #1 rank, with all payments processed securely via Razorpay.

## Tech Stack

- **Framework:** Next.js 16 (App Router, React 19)
- **Language:** TypeScript 5
- **Database:** SQLite via Prisma ORM
- **Auth:** NextAuth.js v4
- **Payments:** Razorpay (orders, webhooks, refunds)
- **Styling:** Tailwind CSS v4
- **Validation:** Zod v4
- **State:** React Hook Form + Zustand
- **Charts:** Recharts
- **Icons:** Lucide React

## Local Setup

### Prerequisites

- Node.js 20+
- npm 10+

### 1. Clone and install

```bash
git clone https://github.com/your-org/bidrank.git
cd bidrank
npm install
```

### 2. Environment variables

```bash
cp .env.example .env
```

Edit `.env` with your values. At minimum, generate a strong `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database setup

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 4. Start dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | Prisma database URL (default: `file:./dev.db`) |
| `NEXTAUTH_SECRET` | Yes | Random secret for session encryption |
| `NEXTAUTH_URL` | Yes | App URL for auth callbacks |
| `RAZORPAY_KEY_ID` | Yes | Razorpay API key |
| `RAZORPAY_KEY_SECRET` | Yes | Razorpay API secret |
| `RAZORPAY_WEBHOOK_SECRET` | Yes | Razorpay webhook signing secret |
| `NEXT_PUBLIC_APP_URL` | Yes | Public-facing app URL |
| `NEXT_PUBLIC_APP_NAME` | Yes | App display name |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Yes | Client-safe Razorpay key |
| `S3_BUCKET` | No | S3 bucket for uploads |
| `S3_REGION` | No | S3 region |
| `S3_ACCESS_KEY` | No | S3 access key |
| `S3_SECRET_KEY` | No | S3 secret key |
| `SMTP_HOST` | No | SMTP host for emails |
| `SMTP_PORT` | No | SMTP port |
| `SMTP_USER` | No | SMTP username |
| `SMTP_PASS` | No | SMTP password |
| `EMAIL_FROM` | No | Sender email address |
| `REDIS_URL` | No | Redis URL for caching |
| `ADMIN_EMAILS` | No | Comma-separated admin emails |

## Database Schema (Prisma)

Key models:

- **User** — Auth users with roles
- **Category** — Listing categories (16 built-in)
- **Listing** — Submitted startups (pending → approved → featured)
- **Bid** — Bid records with payment tracking
- **RankSnapshot** — Point-in-time rank data
- **Payment** — Razorpay order/payment records
- **Refund** — Refund tracking
- **Invoice** — Auto-generated GST invoices
- **ClickEvent** — Click analytics with bot detection
- **Notification** — In-app notification feed
- **AuditLog** — Webhook and admin action log

### Reset database

```bash
rm prisma/dev.db
npx prisma db push
npx prisma db seed
```

## Razorpay Setup

### 1. Create account

Sign up at [razorpay.com](https://razorpay.com) and complete KYC.

### 2. Get API keys

Navigate to **Settings → API Keys** and generate test/live key pairs.

### 3. Configure webhooks

In Razorpay Dashboard → **Settings → Webhooks**:

- **Webhook URL:** `https://indbid.salarypitcher.com/api/webhooks/razorpay`
- **Secret:** Generate and store in `RAZORPAY_WEBHOOK_SECRET`
- **Events to subscribe:**
  - `payment.captured`
  - `payment.failed`
  - `payment.refunded`

### 4. Test webhooks locally

Use the Razorpay CLI or ngrok:

```bash
npx ngrok http 3000
# Use the ngrok URL in Razorpay webhook settings
```

## API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/bids` | List bids with filtering and pagination |
| `POST` | `/api/bids` | Create a new bid (validates amount, creates Razorpay order) |
| `GET` | `/api/listings` | List public approved listings |
| `POST` | `/api/listings` | Submit a new listing for review |
| `GET` | `/api/listings/[slug]` | Get listing detail by slug |
| `POST` | `/api/webhooks/razorpay` | Razorpay webhook handler (idempotent) |
| `POST` | `/api/analytics/click` | Track listing click with bot detection |
| `GET` | `/api/leaderboard` | Return ranked leaderboard data |

## Deployment

### indbid.salarypitcher.com

#### Option A: Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel dashboard
3. Set environment variables
4. Add custom domain `indbid.salarypitcher.com`
5. Update DNS records (see below)

#### Option B: Self-hosted (Docker)

```bash
docker build -t indbid .
docker run -p 3000:3000 --env-file .env indbid
```

### Post-deploy

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

## DNS Configuration

Add these records at your domain registrar:

| Type | Name | Value | TTL |
|---|---|---|---|
| A | `indbid` | `76.76.21.21` (Vercel) | 300 |
| CNAME | `indbid` | `cname.vercel-dns.com` | 300 |
| TXT | `_vercel` | `vc-domain-verify=...` | 300 |

For Vercel, the custom domain configuration is handled in the dashboard under **Settings → Domains**.

### SSL/TLS

Vercel provisions SSL automatically. For self-hosted, use Let's Encrypt:

```bash
certbot --nginx -d indbid.salarypitcher.com
```

## Operational Runbook

### Common Issues

#### Webhook not processing

1. Check `RAZORPAY_WEBHOOK_SECRET` matches Razorpay dashboard
2. Verify endpoint URL is accessible: `curl -I https://indbid.salarypitcher.com/api/webhooks/razorpay`
3. Check Vercel function logs or server logs for errors
4. Review `AuditLog` table for `webhook:*` entries

#### Bid amount validation failing

1. Check minimum increment logic in `src/lib/ranking/index.ts`
2. Increments: <₹1K → ₹1, <₹10K → ₹10, <₹1L → ₹100, ≥₹1L → ₹1,000
3. Ensure `amount` is in whole rupees (not paise)

#### Listing not appearing

1. Verify listing `status` is `approved` in database
2. Check if category exists and is active
3. Run `npx prisma studio` to inspect data

#### Ranking not updating

1. Trigger manually: call `calculateRankings` from `src/lib/ranking`
2. Check `RankSnapshot` table for stale data
3. Verify webhook processed `payment.captured` event

### Monitoring Checklist

- [ ] Razorpay webhook delivery status in dashboard
- [ ] Vercel function error rates
- [ ] Database size and query performance
- [ ] Click event bot detection rate
- [ ] Invoice generation completeness

### Rollback Procedure

1. **Webhook issue:** Replay events from Razorpay dashboard
2. **Bad deploy:** Rollback via Vercel dashboard or `vercel rollback`
3. **Database:** Restore from backup, re-run `prisma db push`

### Key Contacts

- **Razorpay Support:** [dashboard.razorpay.com/support](https://dashboard.razorpay.com/support)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)
- **DNS Provider:** Manage at your registrar's dashboard

## License

Proprietary — IndBid Technologies Pvt. Ltd.
