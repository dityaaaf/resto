# Nuxt Starter Template

[![Nuxt UI](https://img.shields.io/badge/Made%20with-Nuxt%20UI-00DC82?logo=nuxt&labelColor=020420)](https://ui.nuxt.com)

Use this template to get started with [Nuxt UI](https://ui.nuxt.com) quickly.

- [Live demo](https://starter-template.nuxt.dev/)
- [Documentation](https://ui.nuxt.com/docs/getting-started/installation/nuxt)

<a href="https://starter-template.nuxt.dev/" target="_blank">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://ui.nuxt.com/assets/templates/nuxt/starter-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="https://ui.nuxt.com/assets/templates/nuxt/starter-light.png">
    <img alt="Nuxt Starter Template" src="https://ui.nuxt.com/assets/templates/nuxt/starter-light.png" width="830" height="466">
  </picture>
</a>

> The starter template for Vue is on https://github.com/nuxt-ui-templates/starter-vue.

## Quick Start

```bash [Terminal]
npm create nuxt@latest -- -t ui
```

## Deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-name=starter&repository-url=https%3A%2F%2Fgithub.com%2Fnuxt-ui-templates%2Fstarter&demo-image=https%3A%2F%2Fui.nuxt.com%2Fassets%2Ftemplates%2Fnuxt%2Fstarter-dark.png&demo-url=https%3A%2F%2Fstarter-template.nuxt.dev%2F&demo-title=Nuxt%20Starter%20Template&demo-description=A%20minimal%20template%20to%20get%20started%20with%20Nuxt%20UI.)

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm dev
```

## Production

Build the application for production:

```bash
pnpm build
```

Locally preview production build:

```bash
pnpm preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Supabase admin dashboard

1. Run the SQL in `supabase/setup.sql` from the Supabase SQL Editor. It creates the profile table, row-level security policy, and profile trigger.
2. Register an account in the app. Existing accounts are also added to the profile table when the SQL is run.
3. To grant dashboard access, update that account's role from the SQL Editor:

   ```sql
   update public.users
   set role = 'admin'
   where email = 'your-account@example.com';
   ```

4. Add `NUXT_SUPABASE_SECRET_KEY` to `.env` using a Supabase secret key (or legacy `service_role` key). Find it in the project's API keys settings. This key is required by the server-side user-management API; never use a `NUXT_PUBLIC_` prefix or commit the key.
5. Open `/admin/users` to create, edit, and delete accounts. Every user-management endpoint verifies the signed-in user's `admin` role on the server.

The `/admin` page also has a navigation guard. Keep row-level security enabled; the secret key bypasses RLS and must remain server-only.

## Renovate integration

Install [Renovate GitHub app](https://github.com/apps/renovate/installations/select_target) on your repository and you are good to go.
