# 🚀 Deploy 8 Bit Poker to flappyx.xyz

## Your Domain Setup

**Main domain:** `flappyx.xyz`  
**Poker subdomain:** `poker.flappyx.xyz` (recommended)  
Or use: `8bitpoker.flappyx.xyz`

---

## Step-by-Step Deployment

### Step 1: Deploy to Vercel

1. Visit: **https://vercel.com/new**
2. Import repository: **djacobfi/8bit-poker**
3. Click **"Deploy"**
4. Wait 2-3 minutes

You'll get: `https://8bit-poker.vercel.app` (temporary)

---

### Step 2: Add Your Custom Domain

Once deployed:

1. Go to your Vercel project dashboard
2. Click **"Settings"** → **"Domains"**
3. Click **"Add Domain"**

**Choose one:**

**Option A: Subdomain (Recommended)**
```
poker.flappyx.xyz
```
✅ Easier DNS setup  
✅ Allows other subdomains for different projects

**Option B: Other subdomain**
```
8bitpoker.flappyx.xyz
```

**Option C: Main domain** (if poker is your only app)
```
flappyx.xyz
```

---

### Step 3: Configure DNS

Vercel will show you the DNS records to add.

#### For Subdomain (poker.flappyx.xyz):

Go to your domain registrar and add:
```
Type: CNAME
Name: poker
Value: cname.vercel-dns.com
TTL: 3600
```

#### For Apex Domain (flappyx.xyz):

```
Type: A
Name: @
Value: 76.76.21.21
TTL: 3600
```

**Where to add DNS:**
- Go to your domain registrar (Namecheap, GoDaddy, etc.)
- Find DNS settings
- Add the record(s) Vercel provides

⏱️ Wait 5-10 minutes for DNS propagation

---

### Step 4: Verify HTTPS

Vercel automatically:
- ✅ Enables HTTPS
- ✅ Provisions SSL certificate
- ✅ Updates DNS

Check: Visit `https://poker.flappyx.xyz`

---

### Step 5: Generate Manifest Signature

Now generate your Farcaster manifest:

1. Visit: **https://farcaster.xyz/~/developers/mini-apps/manifest**

2. Enter these values:

```
Domain: poker.flappyx.xyz
Name: 8 Bit Poker
Description: Play Texas Hold'em Poker in 8-bit style! Buy chips with USDC, compete against AI, and win!
Home URL: https://poker.flappyx.xyz/
Icon URL: https://poker.flappyx.xyz/logo.png
Image URL: https://poker.flappyx.xyz/og-image.png
Button Title: 🎮 Play Poker
Cast Share URL: https://poker.flappyx.xyz/share
```

3. Click **"Generate Signature"**
4. Copy all 3 values (header, payload, signature)

---

### Step 6: Update Manifest File

1. Open `public/.well-known/farcaster.json`
2. Replace the placeholder values:

```json
{
  "accountAssociation": {
    "header": "PASTE_YOUR_HEADER_HERE",
    "payload": "PASTE_YOUR_PAYLOAD_HERE",
    "signature": "PASTE_YOUR_SIGNATURE_HERE"
  },
  "miniapp": {
    "version": "1",
    "name": "8 Bit Poker",
    "iconUrl": "/logo.png",
    "homeUrl": "/",
    "imageUrl": "/og-image.png",
    "buttonTitle": "🎮 Play Poker",
    "splashImageUrl": "/logo.png",
    "splashBackgroundColor": "#0d6e47",
    "webhookUrl": "",
    "castShareUrl": "/share",
    "description": "Play Texas Hold'em Poker in 8-bit style! Buy chips with USDC, compete against AI, and win!",
    "requiredChains": ["eip155:8453"],
    "requiredCapabilities": ["wallet.getEthereumProvider", "actions.composeCast"]
  }
}
```

---

### Step 7: Push Changes

```bash
git add public/.well-known/farcaster.json
git commit -m "Add manifest signature for flappyx.xyz"
git push
```

Vercel will automatically redeploy!

---

## Verify Everything Works

### Test Manifest
```bash
curl https://poker.flappyx.xyz/.well-known/farcaster.json
```

### Test Images
- https://poker.flappyx.xyz/logo.png
- https://poker.flappyx.xyz/og-image.png

### Test in Farcaster
1. Visit: https://farcaster.xyz/~/developers/mini-apps/preview
2. Enter: `https://poker.flappyx.xyz`
3. Click "Preview"
4. Your app opens! 🎉

---

## Your URLs

✅ **App URL**: `https://poker.flappyx.xyz`  
✅ **Manifest**: `https://poker.flappyx.xyz/.well-known/farcaster.json`  
✅ **Share**: `https://poker.flappyx.xyz/share`  
✅ **GitHub**: https://github.com/djacobfi/8bit-poker

---

## Troubleshooting

### "Domain not verified"
- Wait longer for DNS propagation
- Check DNS records are correct
- Clear browser cache

### "Invalid signature"
- Make sure domain matches exactly
- Regenerate signature if domain changed
- Wait for Vercel redeploy

### "Manifest not found"
- Check `.well-known/farcaster.json` is in `public/` folder
- Verify it's deployed
- Check Vercel build logs

---

**Ready to deploy! Your Poker app will be live at poker.flappyx.xyz! 🎰**

