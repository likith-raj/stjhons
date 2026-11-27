# St. John's Player Auction - Deployment Guide

## Overview
Production-ready auction web app. This guide covers deployment to popular platforms.

---

## Pre-Deployment Checklist

- [x] Build passes: `npm run build ✓`
- [x] No console errors
- [x] All pages tested locally
- [x] Responsive design verified (360px-1920px)
- [x] CSV/Excel import working
- [x] Export options tested
- [x] Keyboard shortcuts working
- [x] localStorage persistence verified

---

## Option 1: Vercel (Recommended - 1 Click)

### Step 1: Prepare Repository
```bash
cd e:\stjhons\St Johns
git init
git add .
git commit -m "Initial commit: St Johns Player Auction v1.0.0"
```

### Step 2: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/st-johns-auction.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import GitHub repository
4. Framework: **Vite**
5. Build command: `npm run build` (auto-detected)
6. Output dir: `dist` (auto-detected)
7. Click "Deploy"

### Step 4: Done ✅
- URL: `https://your-project.vercel.app`
- Auto-deploys on git push
- Free HTTPS & CDN included

---

## Option 2: Netlify

### Step 1: Build Production Files
```bash
cd e:\stjhons\St Johns
npm install
npm run build
# Output: dist/ folder
```

### Step 2: Deploy to Netlify
**Method A: Via GitHub**
1. Push to GitHub (see Option 1, Step 2)
2. Go to https://netlify.com
3. Click "New site from Git"
4. Select GitHub repository
5. Build command: `npm run build`
6. Publish dir: `dist`
7. Click "Deploy"

**Method B: Via Drag & Drop (Quick)**
1. Build: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag `dist/` folder
4. Done! Get instant URL

### Result
- URL: `https://your-project.netlify.app`
- Auto-deploys from GitHub (Method A)

---

## Option 3: GitHub Pages

### Step 1: Configure Vite
Edit `vite.config.js`:
```javascript
export default defineConfig({
  base: '/st-johns-auction/', // Add this line
  // ... rest of config
})
```

### Step 2: Build & Push
```bash
npm run build
git add dist/
git commit -m "Build dist/"
git push origin main
```

### Step 3: GitHub Settings
1. Go to GitHub repository
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: `main`
5. Folder: `/ (root)`
6. Click "Save"

### Result
- URL: `https://YOUR_USERNAME.github.io/st-johns-auction/`
- Takes ~1 minute to deploy

---

## Option 4: Traditional Web Server (cPanel, Shared Hosting)

### Step 1: Build
```bash
npm install
npm run build
```

### Step 2: Upload via FTP
1. Connect to server via FTP client (FileZilla, Cyberduck)
2. Navigate to `public_html/` or `www/` folder
3. Create folder: `st-johns-auction/`
4. Upload contents of `dist/` folder
5. Done!

### Step 3: Verify
- URL: `https://yourdomain.com/st-johns-auction/`
- If root deployment, URL: `https://yourdomain.com/`

**Note:** Configure `.htaccess` for SPA routing:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /st-johns-auction/
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /st-johns-auction/index.html [L]
</IfModule>
```

---

## Option 5: Docker Container

### Step 1: Create Dockerfile
```dockerfile
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Step 2: Create nginx.conf
```nginx
server {
    listen 80;
    location / {
        root /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }
}
```

### Step 3: Build & Run
```bash
docker build -t st-johns-auction .
docker run -p 80:80 st-johns-auction
```

### Step 4: Deploy
Push to Docker Hub or deploy to:
- **Railway:** `railway deploy`
- **Render:** Connect GitHub repo
- **Fly.io:** `flyctl deploy`

---

## Option 6: Microsoft Azure

### Step 1: Create Static Web App
1. Go to https://portal.azure.com
2. Create "Static Web App"
3. Connect GitHub repository
4. Build preset: **Vite**
5. App location: `/`
6. API location: (leave empty)
7. Output location: `dist`
8. Click "Create"

### Step 2: GitHub Actions
- Azure automatically creates workflow
- Deploys on git push to `main`
- Status badge available

### Result
- URL: `https://your-app.azurestaticapps.net`
- Auto-deploys on push

---

## Option 7: AWS S3 + CloudFront

### Step 1: Create S3 Bucket
```bash
aws s3 mb s3://st-johns-auction
```

### Step 2: Build & Upload
```bash
npm run build
aws s3 sync dist/ s3://st-johns-auction --delete
```

### Step 3: Configure S3 for Web Hosting
1. AWS Console → S3
2. Select bucket
3. Properties → Static website hosting
4. Index document: `index.html`
5. Error document: `index.html`
6. Save

### Step 4: Create CloudFront Distribution
1. AWS Console → CloudFront
2. Create distribution
3. Origin: S3 bucket
4. Behavior: Cache policy "Managed-CachingOptimized"
5. Create

### Result
- URL: `https://your-cloudfront-id.cloudfront.net`
- Global CDN with low latency

---

## Environment Variables

This app requires **NO environment variables** (fully client-side).

If needed in future (backend):
```javascript
// .env
VITE_API_URL=https://api.example.com
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

Then access in code:
```javascript
const API_URL = import.meta.env.VITE_API_URL
```

---

## Post-Deployment Verification

After deploying, verify:

### ✅ Core Functionality
- [ ] Load intro page (6.5s animation)
- [ ] Click "START AUCTION" → goes to Setup
- [ ] Upload CSV/XLSX file
- [ ] Configure teams
- [ ] Start auction
- [ ] Place bids (1-9 keys)
- [ ] SELL/UNSOLD/UNDO work
- [ ] View results
- [ ] Export Excel/CSV

### ✅ Performance
- [ ] Page loads in <3 seconds
- [ ] No console errors
- [ ] Keyboard shortcuts responsive (<100ms)
- [ ] Confetti animation smooth

### ✅ Browser Compatibility
- [ ] Chrome/Edge latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

### ✅ Data Persistence
- [ ] Refresh page → data persists
- [ ] Close and reopen browser → data still there
- [ ] localStorage working

### ✅ Responsive Design
- [ ] 360px (mobile) - readable, all buttons accessible
- [ ] 768px (tablet) - full layout
- [ ] 1024px+ (desktop) - optimal spacing
- [ ] 1920px+ (large) - proper scaling

---

## Analytics & Monitoring (Optional)

### Google Analytics
Add to `src/main.jsx`:
```javascript
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Error Tracking (Sentry)
```bash
npm install @sentry/react
```

```javascript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  integrations: [new Sentry.Replay()],
  tracesSampleRate: 1.0,
});
```

---

## Maintenance

### Regular Tasks
- **Weekly:** Monitor error logs (if using Sentry)
- **Monthly:** Review usage analytics
- **Quarterly:** Update dependencies: `npm update`
- **Yearly:** Security audit: `npm audit`

### Update Dependencies
```bash
npm update
npm run build
npm run dev
# Test thoroughly
git add .
git commit -m "Update dependencies"
git push
```

### Rollback Deployment (Vercel)
1. Go to Vercel dashboard
2. Project → Deployments
3. Click previous successful deployment
4. Click "Promote to Production"

---

## Troubleshooting

### ❌ 404 on page refresh
**Solution:** Configure server to route all requests to `index.html`
- Vercel: Auto-configured for SPA
- Netlify: Auto-configured for SPA
- GitHub Pages: May need redirects (see Option 3)

### ❌ CSV upload fails
**Solution:** Check CORS headers (usually not an issue on same domain)

### ❌ localStorage not working
**Solution:** Check browser privacy settings
- Incognito mode disables localStorage
- Some corporate proxies block it
- User must enable cookies

### ❌ Keyboard shortcuts not working
**Solution:** Browser might intercept keys
- Ensure page has focus
- Some browser extensions override shortcuts

### ❌ Slow upload on mobile
**Solution:** Upload CSV on desktop before auction
- Save state to file
- Load on mobile later

---

## Security Considerations

### ✅ What's Secure
- All data stored locally (no server transmission)
- No authentication needed
- No API keys exposed
- HTTPS enforced (auto on all platforms)
- No user tracking/cookies

### ⚠️ Future Considerations
- If adding backend: use HTTPS only
- Validate all inputs server-side
- Use secure authentication (JWT)
- Implement rate limiting for API

---

## Scaling (For Large Events)

### Single Machine Limitation
- Current: Works great for 1-2 auction streams
- Max: ~100 concurrent users (browser/tab agnostic)

### For 100+ Concurrent Users
- Add backend (Node.js, Python, Go)
- Use WebSocket for real-time sync (instead of BroadcastChannel)
- Implement database (PostgreSQL, MongoDB)
- Use CDN for static files
- Add authentication/authorization

---

## Support Contact
For deployment issues, check:
1. **Vercel Docs:** https://vercel.com/docs
2. **Netlify Docs:** https://docs.netlify.com
3. **GitHub Pages:** https://pages.github.com

---

## Deployment Checklist Summary

| Platform | Difficulty | Cost | Time | Recommendation |
|----------|-----------|------|------|-----------------|
| **Vercel** | ⭐ Easy | Free | 2 min | ✅ Best |
| **Netlify** | ⭐ Easy | Free | 2 min | ✅ Alternative |
| **GitHub Pages** | ⭐ Easy | Free | 5 min | ✅ If no custom domain |
| **Railway** | ⭐⭐ Medium | $5+/mo | 10 min | For Docker |
| **Azure** | ⭐⭐ Medium | Free tier | 10 min | For Azure users |
| **AWS** | ⭐⭐⭐ Hard | $1-5/mo | 30 min | For high scale |
| **cPanel** | ⭐⭐⭐ Hard | $5-15/mo | 20 min | Existing hosting |

---

## Version History
- **v1.0.0** - Initial production release
- Deployment: 2026-11-27

---

**Ready to deploy?** Choose your platform above and get live in minutes! 🚀
