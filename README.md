# ReviewRadar — AI Review Response & Reputation Manager

AI-powered review management built for South African local businesses. Auto-respond to Google and Facebook reviews in your brand voice, flag negative reviews for human escalation, and generate monthly reputation reports.

## Problem

- 50% of SA businesses never respond to reviews
- Slow responses hurt SEO and customer trust
- Manual responses take 2+ hours/week

## Solution

ReviewRadar uses AI to auto-respond to all reviews in your brand voice, flags negative reviews for human follow-up, and generates monthly reputation reports with actionable insights.

## Target Market (ICP)

SA local businesses with 50+ Google Reviews — dentists, mechanics, restaurants, salons, chiropractors.

## Features

- **AI Auto-Responses** — Respond to every Google/Facebook review in seconds using your configured brand voice
- **Smart Escalation** — Negative reviews are auto-flagged and routed for human follow-up
- **Sentiment Analysis** — AI-powered sentiment detection and keyword extraction
- **Monthly Reports** — Automated reputation reports with trends, breakdowns, and AI recommendations
- **Brand Voice Config** — Train the AI on your unique communication style
- **Multi-Platform** — Manage Google and Facebook reviews from one dashboard
- **PayFast Billing** — ZAR pricing with PayFast subscription management

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth + RLS)
- **AI**: Groq (Llama 3.1 via OpenAI-compatible API)
- **Payments**: PayFast (SA payment gateway)
- **Charts**: Recharts
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Supabase project
- Groq API key

### Setup

```bash
# Clone the repo
git clone https://github.com/mikewithoutthemechanics/review-radar.git
cd review-radar

# Install dependencies
npm install

# Copy env file and fill in your keys
cp .env.example .env.local

# Run the database migration
# Copy supabase/migrations/001_initial_schema.sql into your Supabase SQL Editor

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `GROQ_API_KEY` | Groq Cloud API key for AI responses |
| `PAYFAST_MERCHANT_ID` | PayFast merchant ID (10000100 for sandbox) |
| `PAYFAST_MERCHANT_KEY` | PayFast merchant key |
| `PAYFAST_PASSPHRASE` | PayFast security passphrase |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/callback/     # Supabase auth callback
│   │   ├── payfast/notify/    # PayFast ITN webhook
│   │   ├── reports/           # Report generation endpoint
│   │   └── reviews/
│   │       ├── escalate/      # Review escalation endpoint
│   │       └── respond/       # AI response generation
│   ├── dashboard/
│   │   ├── escalations/       # Escalation management
│   │   ├── reports/           # Reputation reports
│   │   ├── reviews/           # Review management
│   │   └── settings/          # Business settings
│   ├── login/                 # Login page
│   └── signup/                # Signup page
├── components/
│   ├── dashboard/             # Dashboard components
│   ├── landing/               # Landing page components
│   └── ui/                    # Shared UI components
├── lib/
│   ├── demo-data.ts           # Demo/seed data
│   ├── groq.ts                # Groq AI client
│   ├── payfast.ts             # PayFast integration
│   └── supabase.ts            # Supabase client
└── types/
    └── index.ts               # TypeScript types
```

## Pricing (ZAR)

| Plan | Price | Reviews/month |
|------|-------|--------------|
| Starter | R499 | 100 |
| Professional | R999 | 500 |
| Enterprise | R2,499 | Unlimited |

## License

MIT
