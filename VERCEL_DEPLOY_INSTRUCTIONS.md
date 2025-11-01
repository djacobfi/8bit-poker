# 🚀 Deploy to Vercel with Custom Domain

## Option 1: Deploy via Web UI (Easiest)

### Step 1: Go to Vercel
Visit: **https://vercel.com/new**

### Step 2: Import Repository
1. Click "Import Git Repository"
2. Find **djacobfi/8bit-poker**
3. Click "Import"

### Step 3: Deploy
1. Click "Deploy"
2. Wait for deployment to complete
3. You'll get: `https://8bit-poker.vercel.app`

### Step 4: Add Custom Domain
1. Go to your project dashboard
2. Click "Settings" → "Domains"
3. Click "Add Domain"
4. Enter your custom domain (e.g., `poker.yourdomain.com`)
5. Follow DNS configuration instructions

---

## Option 2: Deploy via CLI

### Step 1: Login
```bash
vercel login
```

### Step 2: Link Project
```bash
vercel link
```
Follow prompts to link to your GitHub repo

### Step 3: Deploy
```bash
vercel --prod
```

### Step 4: Add Domain
```bash
vercel domains add yourdomain.com
```

---

## DNS Configuration

After adding domain in Vercel, update your DNS:

### If using subdomain (recommended):
```
Type: CNAME
Name: poker (or whatever subdomain)
Value: cname.vercel-dns.com
```

### If using apex domain:
```
Type: A
Name: @
Value: 76.76.21.21
```

Wait 5-10 minutes for DNS to propagate.

---

## Next: Update Manifest

Once your custom domain is live:

1. Go to: https://farcaster.xyz/~/developers/mini-apps/manifest
2. Enter your custom domain URL
3. Generate signature
4. Update `public/.well-known/farcaster.json`
5. Commit and push to trigger redeploy

---

**Ready to deploy! 🎰**

