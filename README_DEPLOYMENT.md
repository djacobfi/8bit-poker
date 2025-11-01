# 🚀 Deploy 8 Bit Poker to Your Custom Domain

## ✅ Current Status

- ✅ Code complete and tested
- ✅ Builds successfully
- ✅ Pushed to GitHub: https://github.com/djacobfi/8bit-poker
- ⏳ Ready to deploy!

## 🎯 Deploy via Vercel Web UI (Recommended)

### Step 1: Go to Vercel
Visit: **https://vercel.com/new**

### Step 2: Import Your Repository
1. Sign in to Vercel (or create account)
2. Click **"Import Git Repository"**
3. Find and select **djacobfi/8bit-poker**
4. Click **"Import"**

### Step 3: Configure & Deploy
1. **Framework Preset**: Next.js (auto-detected) ✅
2. **Root Directory**: `./` (default)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. Click **"Deploy"**

⏱️ Wait 2-3 minutes for deployment

### Step 4: Get Your URL
After deployment, you'll get:
```
https://8bit-poker.vercel.app
```

OR if you configured a custom name:
```
https://your-project-name.vercel.app
```

---

## 🌐 Add Your Custom Domain

### Step 1: Go to Project Settings
1. Click on your project in Vercel dashboard
2. Go to **"Settings"** → **"Domains"**

### Step 2: Add Domain
1. Click **"Add Domain"**
2. Enter your domain:
   - Subdomain: `poker.yourdomain.com`
   - Or apex: `yourdomain.com`
3. Click **"Add"**

### Step 3: Configure DNS

Vercel will show you what DNS records to add:

**For subdomain (recommended):**
```
Type: CNAME
Name: poker
Value: cname.vercel-dns.com
TTL: 3600
```

**For apex domain:**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

### Step 4: Update Your DNS
1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add the DNS record(s) shown by Vercel
3. Wait 5-10 minutes for DNS propagation

### Step 5: Verify
Once DNS propagates:
- HTTPS is automatically enabled by Vercel
- SSL certificate is automatically provisioned
- Your app is live at your custom domain!

---

## 📝 After Deployment: Update Manifest

### Step 1: Generate Manifest Signature
1. Visit: https://farcaster.xyz/~/developers/mini-apps/manifest
2. Enter these details:
   - **Domain**: `poker.yourdomain.com` (or your custom domain)
   - **Name**: `8 Bit Poker`
   - **Description**: `Play Texas Hold'em Poker in 8-bit style! Buy chips with USDC, compete against AI, and win!`
   - **Home URL**: `https://poker.yourdomain.com/`
   - **Icon URL**: `https://poker.yourdomain.com/logo.png`
   - **Image URL**: `https://poker.yourdomain.com/og-image.png`
   - **Button Title**: `🎮 Play Poker`
   - **Cast Share URL**: `https://poker.yourdomain.com/share`
3. Click **"Generate Signature"**
4. Copy the 3 values (header, payload, signature)

### Step 2: Update Manifest File
Open `public/.well-known/farcaster.json` and replace:
```json
{
  "accountAssociation": {
    "header": "PASTE_YOUR_HEADER_HERE",
    "payload": "PASTE_YOUR_PAYLOAD_HERE",
    "signature": "PASTE_YOUR_SIGNATURE_HERE"
  },
  ...
}
```

### Step 3: Push Changes
```bash
git add public/.well-known/farcaster.json
git commit -m "Add manifest signature"
git push
```

Vercel will automatically redeploy!

---

## ✅ Test Your Deployment

### 1. Verify Manifest
```bash
curl https://poker.yourdomain.com/.well-known/farcaster.json
```

### 2. Test in Farcaster
1. Visit: https://farcaster.xyz/~/developers/mini-apps/preview
2. Enter: `https://poker.yourdomain.com`
3. Click "Preview"
4. Your app should open! 🎉

### 3. Test Images
Verify these load:
- `https://poker.yourdomain.com/logo.png`
- `https://poker.yourdomain.com/og-image.png`

---

## 🎉 You're Live!

Your 8 Bit Poker app is now live on your custom domain!

**What's Next?**
- Test the game flow
- Share with beta users
- Get feedback
- Iterate and improve
- Submit to Farcaster directory

---

## 📚 Quick Reference

**GitHub**: https://github.com/djacobfi/8bit-poker  
**Deploy**: https://vercel.com/new  
**Manifest Tool**: https://farcaster.xyz/~/developers/mini-apps/manifest  
**Preview Tool**: https://farcaster.xyz/~/developers/mini-apps/preview  

---

**Ready to deploy! 🚀🎰**

