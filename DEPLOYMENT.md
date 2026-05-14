# Deployment and Hosting

## Environment Configuration

Environment Variable	Purpose
- **DATABASE_URL**: Supabase connection string
- **JWT_SECRET**: Authentication token signing
- **ADMIN_EMAIL**: Administrator login credential

Set these variables for any server/API services (Supabase or Render) — they are not required for the static frontend hosted on GitHub Pages.

## Hosting the Frontend on GitHub Pages

- Repo: https://github.com/LesleyMachoal/cybernova-website
- GitHub Pages URL (expected): https://lesleymachoal.github.io/cybernova-website/
- Admin portal (expected): https://lesleymachoal.github.io/cybernova-website/admin.html

The repository includes a GitHub Actions workflow at `.github/workflows/gh-pages.yml` that builds the Vite app in `cybernova-website_Machola` and deploys the `dist` folder to GitHub Pages when you push to `main`.

Note: Vite requires the `base` option when deploying to a project Pages URL. The repo's `vite.config.ts` now sets `base: '/cybernova-website/'` so assets load correctly at `https://<owner>.github.io/cybernova-website/`.

## Live System Access (existing)

- Public Website: https://cybernova-analytics.netlify.app
- Admin Portal: https://cybernova-analytics.netlify.app/admin.html
- API Endpoint: https://cybernova-api.onrender.com/api

## Next Steps

1. Push changes to the `main` branch on GitHub.
2. In the repository `Settings → Pages`, ensure Pages is set to `GitHub Actions` build and the site is published to the repository URL above.
3. For server/API, configure the environment variables on your host (Render, Supabase, or Netlify functions) using the names above.
