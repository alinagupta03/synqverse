# SYNQVERSE

Synqverse is an end-to-end operational SaaS platform built to securely connect students, foster team formation, and accelerate college innovation. It combines identity verification, skills-based matching, and advanced workspace collaboration, augmented with a privacy-first AI intelligence layer.

## Architecture

Built entirely on the modern Next.js App Router stack.

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Vanilla CSS (Custom futuristic glassmorphism design system)
- **Database**: Prisma + SQLite (Easily swappable to PostgreSQL)
- **Icons**: Lucide React

## Core Modules

1. **Identity & Discovery**: Anonymous-first student profiles, protected discovery algorithms (Beginner Mode), connection requests, and real-time messaging.
2. **Team Formation**: Requirements-based team building, algorithmic skill-gap analysis, and secure invitations.
3. **Workspace Collaboration**: Fully featured project environment including chat channels, task Kanban boards, milestone roadmaps, idea labs, and meeting notes.
4. **Trust & Safety**: Five-tier moderation engine, reporting workflows, temporary communication restrictions, and admin oversight.
5. **SYNQ AI**: A mockable, persistent intelligence layer providing context-aware task breakdowns, roadmap generation, and project feedback without autonomous write privileges.
6. **SaaS Operations**: Feature entitlement abstraction (FREE, PRO, ORG), a global admin dashboard, analytics tracking, and full privacy/settings management (data export, account deletion).

## Getting Started

### Prerequisites
- Node.js 18+
- npm

### Setup

1. **Clone & Install**
   ```bash
   git clone <repo>
   cd synqverse
   npm install
   ```

2. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # Authentication
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

3. **Database Initialization**
   The application uses Prisma and SQLite for rapid local development.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your browser.

## SaaS Billing & Entitlements

The application is built with a future-proof `FeatureEntitlement` layer located in `src/lib/entitlements.ts`.
This cleanly abstracts Stripe/billing logic from the UI.
- **FREE**: Standard student discovery, limited teams/workspaces.
- **PRO**: Access to SYNQ AI tools, advanced matching, increased limits.
- **ORGANIZATION**: Admin dashboards, private university networks, unlimited resources.

To upgrade a user, simply modify their `tier` string in the `User` database schema.

## Security & Privacy Principles

- **Privacy-by-Default**: Identities are masked as "Anonymous Student" until explicit consent is granted via the mutual connection flow.
- **AI Safety**: The SYNQ AI layer operates strictly as an advisor. It generates JSON outputs and waits for explicit user confirmation before committing changes to the database. It cannot ban users.
- **Data Export**: Users have complete ownership of their data and can export it or permanently delete their accounts via the `/settings` pages.

## Future Roadmap

- Integrate an external LLM SDK (OpenAI/Anthropic) into `src/lib/ai.ts`.
- Wire up a payment gateway (Stripe/Lemonsqueezy) to automatically update the User `tier`.
- Deploy to Vercel and migrate the database to PostgreSQL (Supabase/Neon).
