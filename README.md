# Lira Grand Hotel — Website & Booking Platform

A production-ready hotel & tourism website for a hotel in **Lira City, Uganda**, built with Next.js
(App Router), TypeScript, Tailwind CSS, Prisma, and PostgreSQL.

> **Demo content notice:** "Lira Grand Hotel" is a placeholder brand. Room prices, facilities,
> tourism attractions, testimonials, and photography are demo/sample data for development purposes.
> Replace them via `config/site.ts`, the admin dashboard, and `prisma/seed.ts` before going live.

## Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Framer Motion, Lucide React icons
- React Hook Form + Zod validation
- PostgreSQL + Prisma ORM
- Nodemailer (email), WhatsApp deep links, Google Maps embed
- JWT + bcrypt admin authentication (httpOnly cookie sessions)

## Project Structure

```
app/                # Routes (public site, booking, admin, API)
components/         # ui/, layout/, home/, rooms/, booking/, gallery/, admin/, ...
config/site.ts       # Central branding & contact configuration
lib/                # prisma client, auth, email, booking logic, validations, utils
prisma/              # schema.prisma, seed.ts
public/              # static assets
types/                # shared TypeScript types
```

## 1. Prerequisites

- Node.js 20+
- PostgreSQL 14+ (local install or Docker)

## 2. Install Dependencies

```bash
npm install
```

## 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in real values:

```bash
cp .env.example .env
```

| Variable | Description |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Long random string used to sign admin session tokens |
| `ADMIN_INITIAL_PASSWORD` | Strong, unique password used when creating the initial admin account |
| `ADMIN_SESSION_COOKIE_NAME` | Cookie name for admin sessions (default provided) |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (used for metadata & sitemap) |
| `SMTP_*` | SMTP credentials for booking/contact email notifications (optional) |
| `CLOUDINARY_*` | Cloudinary credentials for image uploads (optional) |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Only needed if you swap the map embed for the JS API |

## 4. Set Up PostgreSQL

Create a database, e.g.:

```bash
createdb lira_grand_hotel
```

Or with Docker:

```bash
docker run --name lira-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=lira_grand_hotel -p 5432:5432 -d postgres:16
```

Update `DATABASE_URL` in `.env` to match your credentials.

## 5. Run Migrations

```bash
npx prisma migrate dev --name init
```

(Or `npm run db:push` for a quick schema sync without migration history during early development.)

## 6. Seed the Database

Set `ADMIN_INITIAL_PASSWORD` to a strong, unique password in `.env` before seeding. Do not use a
shared or default password.

```bash
npm run db:seed
```

This creates:
- 1 admin user — `admin@liragrandhotel.com` (use the password supplied through `ADMIN_INITIAL_PASSWORD`)
- 5 room types, 8 facilities, 10 menu items, 15 gallery images, 6 tourism attractions, 4 testimonials,
  3 special offers, 2 conference halls

## 7. Deploy with GitHub Actions and Railway

1. Create a Railway project with a PostgreSQL database and a Node.js service.
2. Generate a public domain for the app service in its **Settings → Networking** page.
3. In the app service, set `DATABASE_URL` to a reference to the PostgreSQL service's `DATABASE_URL`.
   Also set a strong `JWT_SECRET`, a unique `ADMIN_INITIAL_PASSWORD`, and `NEXT_PUBLIC_SITE_URL` to
   the generated domain. Add the optional `SMTP_*`, `CLOUDINARY_*`, and Google Maps variables if you
   use those integrations.
4. In GitHub repository **Settings → Secrets and variables → Actions**, add these repository secrets:
   `RAILWAY_TOKEN` (a project token), `RAILWAY_PROJECT_ID`, `RAILWAY_ENVIRONMENT_ID`, and
   `RAILWAY_SERVICE_ID`.
5. Add repository variables `RAILWAY_DEPLOY_ENABLED=true` and `NEXT_PUBLIC_SITE_URL` set to the same
   generated domain.
6. In **Actions**, run **Deploy to Railway** manually once. Later pushes to `main` will build and
   deploy automatically.

The Railway pre-deploy step applies Prisma migrations and seeds the database with demo content.
After the first successful deployment, remove `ADMIN_INITIAL_PASSWORD` from the Railway service
variables; the seed process only needs it when creating the initial admin account. The seed is
idempotent for existing records, but deleted demo records can be recreated on subsequent deploys.
Replace the documented sample hotel content with verified production information before accepting
real bookings.

## 8. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000`. Admin dashboard: `http://localhost:3000/admin/login`.

## 9. Creating the First Admin Account

The seed script creates one automatically. To create additional admins, use Prisma Studio
(`npm run db:studio`) and insert a `User` row with a bcrypt-hashed password, or add a small script
using `lib/auth.ts`'s `hashPassword()` helper.

## 10. Configuring Integrations

- **WhatsApp**: set `whatsapp` (digits only, no `+`) in `config/site.ts`.
- **Google Maps**: update `coordinates`, `googleMapsUrl`, and `googleMapsEmbedSrc` in `config/site.ts`.
- **Email**: set `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM` in `.env`. If
  unset, booking/contact emails are skipped (logged to console) rather than failing the request.
- **Cloudinary**: set `CLOUDINARY_*` env vars and wire the admin Gallery/Facilities/Rooms forms to
  Cloudinary's unsigned upload API for direct image uploads (URLs can currently be pasted manually).

## 11. Branding

All hotel identity (name, tagline, logo, contact info, address, hours, currency, brand colors) lives
in [`config/site.ts`](config/site.ts). Update this single file to rebrand the entire site.

## 12. Build for Production

```bash
npm run build
npm run start
```

## 13. Docker Deployment (VPS)

A minimal production Dockerfile:

```dockerfile
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/package.json ./package.json
COPY --from=base /app/prisma ./prisma
EXPOSE 3000
CMD ["npm", "run", "start"]
```

Run behind an Nginx reverse proxy with TLS termination (Let's Encrypt / Certbot), and run
`npx prisma migrate deploy` as a release step against your production `DATABASE_URL`.

## Notes on Admin Access Control

Admin routes live under `app/admin/(dashboard)/*` and are protected by a server-side session check
in `app/admin/(dashboard)/layout.tsx`. All admin API routes and Server Actions independently verify
the session (`lib/auth.ts`) before mutating data — never rely on UI-only protection.
