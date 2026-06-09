# Asset Dock

A digital asset management app built with Next.js, Prisma, and PostgreSQL. Supports images, videos, documents, and 3D models.

[Demo](/demo/one3d-demo.mp4)

## Prerequisites

- Node.js 18+
- A PostgreSQL database (e.g. [Neon](https://neon.tech))

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the env file and fill in your database URL:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
```

3. Run migrations and generate the Prisma client:

```bash
npm run db:migrate
```

4. (Optional) Seed the database:

```bash
npx prisma db seed
```

5. Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:migrate` | Run Prisma migrations |
| `npm run db:generate` | Regenerate Prisma client |

## Stack

- [Next.js 16](https://nextjs.org) — App Router
- [Prisma 6](https://prisma.io) — ORM
- [PostgreSQL](https://postgresql.org) — Database (via Neon)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) — 3D model viewer
- [Tailwind CSS 4](https://tailwindcss.com) — Styling
- [Zod 4](https://zod.dev) — Validation
