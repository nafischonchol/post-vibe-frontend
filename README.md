# Post-Vibe

Post-Vibe is a Next.js 16 SaaS platform for automated video syndication and publishing workflows.

It includes:

- A tenant-facing portal for managing source videos, publishing workflows, quotas, and analytics.
- A platform admin area for monitoring and controlling the system.
- AI-assisted metadata generation for multi-platform publishing across social video channels.

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- ESLint 9
- shadcn-style UI components

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

3. Update `.env.local` with your local values:

```env
NODE_ENV=development
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
APP_URL=http://localhost:3000
APP_NAME="Post-Vibe"
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app in the browser:

```text
http://localhost:3092
```

## Available Scripts

- `npm run dev`: Start the Next.js development server on port `3092`.
- `npm run build`: Create a production build.
- `npm run start`: Start the production server on port `3092`.
- `npm run lint`: Run ESLint checks.

## Project Structure

```text
frontend/
├── app/
│   ├── admin/              # Admin portal pages and dashboard routes
│   ├── tenant/             # Tenant dashboard and management pages
│   ├── login/              # Tenant login flow
│   ├── page.tsx            # Marketing / landing page
│   └── layout.tsx
├── components/
│   ├── admin/
│   └── ui/
├── hooks/
├── lib/
├── public/
├── services/
├── .env.example
├── .env.local
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```

## App Access

- Tenant login: `/login`
- Admin login: `/admin/login`
- Default landing page: `/`

## Notes

- The frontend is built for a Laravel/Backend API environment and expects the API base URL in `NEXT_PUBLIC_API_BASE_URL`.
- The app uses the port `3092` in development and production startup scripts.
- The project is designed for multi-tenant automated publishing workflows, including posting, quota tracking, source management, and analytics.

## Deployment

- Set `NEXT_PUBLIC_API_BASE_URL` to your production backend URL.
- Ensure `APP_URL` matches the public frontend domain.
- Use HTTPS in production for secure session behavior and correct cookie handling.