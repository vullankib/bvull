# Bharath Vullanki Leadership Site

Static personal website with:

- Leadership-focused positioning
- Top-level pages: Home, About, Projects, Blog, and "Take a Step Back" video hub
- Migrated blog items from `bharathvullanki.com`
- SEO baseline (metadata, Open Graph, Twitter, schema, sitemap, robots)
- Google Analytics 4 integration

## Structure

- `index.html`
- `about.html`
- `projects.html`
- `blog.html`
- `videos.html`
- `posts/*.html` (migrated blog posts)
- `assets/css/styles.css`
- `assets/js/site-config.js`
- `assets/js/analytics.js`
- `assets/js/main.js`
- `sitemap.xml`
- `robots.txt`

## Google Analytics

GA is configured in `assets/js/site-config.js`:

```js
window.SITE_CONFIG = {
  gaMeasurementId: "G-2B5YL8GQGV"
};
```

Update `gaMeasurementId` if you want to use a different GA4 property.

## SEO

- Canonicals point to `https://bharathvullanki.com`
- JSON-LD is included on primary pages and post pages
- `sitemap.xml` includes all top-level pages and migrated post pages
- `robots.txt` references the sitemap

## Video Series Notes

The video hub is wired with a 3-episode layout.

- Episode 2 has a directly indexed LinkedIn post URL.
- Episode 1 and Episode 3 currently point to the LinkedIn video feed URL.
- Replace those two links with direct LinkedIn post URLs when available.

## Strava YTD Run Widget

The homepage has a Strava widget that reads from:

- `assets/data/strava-ytd.json`

To sync this file from Strava:

1. Create a Strava API app at [developers.strava.com](https://developers.strava.com).
2. Collect these values from your app/OAuth flow:
   - `STRAVA_CLIENT_ID`
   - `STRAVA_CLIENT_SECRET`
   - `STRAVA_REFRESH_TOKEN`
   - Optional: `STRAVA_ATHLETE_ID`
3. Run locally:

```bash
STRAVA_CLIENT_ID=... \
STRAVA_CLIENT_SECRET=... \
STRAVA_REFRESH_TOKEN=... \
node scripts/update-strava-ytd.mjs
```

4. Commit the updated `assets/data/strava-ytd.json`.

GitHub Actions workflow `.github/workflows/update-strava-ytd.yml` can refresh this daily using repository secrets with the same names.

## Publish

Deploy this folder to any static host (GitHub Pages, Netlify, Vercel static, Cloudflare Pages, S3/CloudFront).
