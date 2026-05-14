# Render Deployment Guide for Cybernova Backend

## 📋 Prerequisites
- [x] Render account (free at https://render.com)
- [x] GitHub repo connected (LesleyMachoal/cybernova-website)
- [x] `.env` file with all credentials ready

---

## 🚀 Step 1: Deploy to Render

### 1.1 Go to Render Dashboard
1. Open https://dashboard.render.com
2. Sign in with GitHub
3. Click **"New +"** → **"Web Service"**

### 1.2 Connect GitHub Repository
1. Select **"Build and deploy from a Git repository"**
2. Search for `cybernova-website` repo
3. Click **Connect**

### 1.3 Configure the Service
Fill in these settings:

| Setting | Value |
|---------|-------|
| **Name** | `cybernova-api` |
| **Environment** | `Node` |
| **Region** | `Ohio` (or closest to you) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Build Command** | `npm install` |
| **Start Command** | `npm start` |
| **Plan** | `Free` (for testing) |

### 1.4 Click **"Create Web Service"**
Render will start building immediately!

---

## 🔑 Step 2: Add Environment Variables

### 2.1 In Render Dashboard
1. Go to your service: `cybernova-api`
2. Click **"Settings"**
3. Scroll to **"Environment"**
4. Click **"Add Environment Variable"**

### 2.2 Add Each Variable from Your `.env`

Copy **exactly** from your `.env` file:

```
PORT = 5999
JWT_SECRET = WyZ5KRvLlbApKrhrOLeIBoOU9brND+brjiiJGQjPTSKBofUh5mR7phkefcx3xux8qw64xtVlGkd4DhBD4Lrytg==
ADMIN_USERNAME = admin
ADMIN_PASSWORD = cybernova2026
JWT_EXPIRES_IN = 8h
SUPABASE_URL = https://bfijjzugbbxxcknjixth.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJmaWpqenVnYmJ4eGNrbmppeHRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzM3ODcxMiwiZXhwIjoyMDkyOTU0NzEyfQ.1gN-xnLykG1Zn72MYTfbJiFp7tYyI-LCS191COKMjoo
PGHOST = aws-1-eu-central-1.pooler.supabase.com
PGPORT = 5432
PGDATABASE = postgres
PGUSER = postgres.bfijjzugbbxxcknjixth
PGPASSWORD = Malese123@mac
DATABASE_URL = postgresql://postgres.bfijjzugbbxxcknjixth:Malese123%40mac@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
```

### 2.3 Click **"Save Changes"**
Render will automatically redeploy with the new variables!

---

## ✅ Step 3: Verify Deployment

### 3.1 Check Build Status
1. Go to **"Deploy"** tab
2. Wait for status to change to **"Live"** (usually 2-5 minutes)
3. You'll get a notification when complete

### 3.2 Get Your Backend URL
- Look for your service URL in the header
- Format: `https://cybernova-api.onrender.com`

### 3.3 Test the API
Open in browser or curl:
```bash
curl https://cybernova-api.onrender.com/api/health
```

Expected response:
```json
{ "status": "ok" }
```

---

## 🔗 Step 4: Connect Frontend to Backend

### 4.1 Update Vite Config (If Needed)
In `vite.config.ts`, update the proxy:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'https://cybernova-api.onrender.com',  // Add your Render URL
      changeOrigin: true,
      secure: false,
    },
    '/uploads': {
      target: 'https://cybernova-api.onrender.com',
      changeOrigin: true,
      secure: false,
    },
  },
},
```

### 4.2 Create Environment Variable for Production
Create `server/.env.production`:
```
VITE_API_URL=https://cybernova-api.onrender.com
```

### 4.3 Rebuild & Deploy Frontend
```bash
npm run build
git add .
git commit -m "Deploy: Update API URL for Render backend"
git push
```

GitHub Pages will automatically update!

---

## 📊 Render Features (Free Plan)

| Feature | Free | Notes |
|---------|------|-------|
| Deployments | Unlimited | Auto-deploy on push |
| Sleep | After 15 min inactivity | Wakes on first request |
| Memory | 512 MB | Sufficient for Node.js |
| Storage | Ephemeral | Data lost on restart |
| Bandwidth | Limited | Sufficient for testing |

---

## 🆘 Troubleshooting

### Build Failed
- Check logs in Render dashboard
- Ensure `server/package.json` exists
- Verify start command: `npm start`

### Backend not responding
- Check all environment variables are added
- Verify Supabase URL and keys are correct
- Look at runtime logs in Render dashboard

### CORS errors
- Verify CORS config includes your GitHub Pages URL
- Check: `https://lesleymachoal.github.io/cybernova-website/`

### Database connection issues
- Test credentials locally first
- Verify PostgreSQL firewall allows Render IP
- Check Supabase connection pooler is enabled

---

## 📱 Test Commands

```bash
# Test API health
curl https://cybernova-api.onrender.com/api/health

# Test article endpoint
curl https://cybernova-api.onrender.com/api/articles

# Test with authentication
curl -H "Authorization: Bearer <your_jwt_token>" \
  https://cybernova-api.onrender.com/api/admin/users
```

---

## ⚠️ Important Notes

1. **Free tier sleeps** - If not accessed for 15 min, the service sleeps and takes 30-60 seconds to wake
2. **Data is ephemeral** - Any uploaded files are lost when service restarts
3. **To keep 24/7** - Upgrade to Render's Starter plan ($7/month)
4. **GitHub sync** - Any push to `main` triggers auto-deployment

---

## 🎉 You're Live!

- **Frontend**: https://lesleymachoal.github.io/cybernova-website/
- **Backend**: https://cybernova-api.onrender.com
- **Admin Login**: cybernova2026 (password)

