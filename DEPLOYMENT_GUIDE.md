# 🚀 How to Deploy 8 Bit Poker

## Quick Deploy Options

### Option 1: Vercel (Recommended - Easiest) ⭐

**Why Vercel?**
- Zero configuration needed
- Automatic HTTPS
- Free tier available
- Instant deployments

**Steps:**

1. **Push to GitHub**:
```bash
# If not already a git repo
git init
git add .
git commit -m "Initial commit: 8 Bit Poker"
git branch -M main

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/8bit-poker.git
git push -u origin main
```

2. **Import to Vercel**:
   - Go to: https://vercel.com/new
   - Import your GitHub repository
   - Vercel auto-detects Next.js
   - Click "Deploy"
   - Wait 2-3 minutes

3. **Get Your URL**:
   - Vercel gives you: `https://your-app-name.vercel.app`
   - Or set custom domain if you have one

4. **Done!** ✅
   - Your app is live at: `https://your-app-name.vercel.app`
   - Manifest at: `https://your-app-name.vercel.app/.well-known/farcaster.json`

### Option 2: Netlify

1. **Push to GitHub** (same as above)

2. **Import to Netlify**:
   - Go to: https://app.netlify.com/start
   - Import from GitHub
   - Build settings auto-detected
   - Click "Deploy site"

3. **Get Your URL**:
   - Netlify gives you: `https://your-app-name.netlify.app`

### Option 3: Railway

1. Go to: https://railway.app/new
2. Deploy from GitHub
3. Railway auto-detects Next.js
4. Deploy

## After Deployment - Generate Manifest Signature

Once deployed, generate your manifest signature:

1. Visit: https://farcaster.xyz/~/developers/mini-apps/manifest
2. Enter these URLs:

```
Domain: your-app-name.vercel.app
Name: 8 Bit Poker
Description: Play Texas Hold'em Poker in 8-bit style! Buy chips with USDC, compete against AI, and win!
Home URL: https://your-app-name.vercel.app/
Icon URL: https://your-app-name.vercel.app/logo.png
Image URL: https://your-app-name.vercel.app/og-image.png
Button Title: 🎮 Play Poker
Cast Share URL: https://your-app-name.vercel.app/share
```

3. Click "Generate Signature"
4. Copy the 3 values (header, payload, signature)
5. Update `public/.well-known/farcaster.json`
6. **Commit and push** your changes
7. Vercel auto-redeploys

## Testing Your Deployed App

### 1. Verify Manifest is Accessible

```bash
curl https://your-app-name.vercel.app/.well-known/farcaster.json
```

Should return your manifest JSON.

### 2. Test in Farcaster Preview

1. Visit: https://farcaster.xyz/~/developers/mini-apps/preview
2. Enter: `https://your-app-name.vercel.app`
3. Click "Preview"
4. Your app should open! 🎉

### 3. Check Images Load

Verify these URLs work:
- `https://your-app-name.vercel.app/logo.png`
- `https://your-app-name.vercel.app/og-image.png`

## Environment Variables (If Needed)

If you add backend features later, set environment variables in Vercel:

1. Go to Project Settings → Environment Variables
2. Add variables like:
   - `NEYNAR_API_KEY` (if using Neynar)
   - `DATABASE_URL` (if adding database)
   - etc.

## Custom Domain Setup (Optional)

If you have your own domain:

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS as instructed
4. SSL automatically provisioned

### Update Manifest:
After adding custom domain:
1. Regenerate manifest signature with new domain
2. Update `public/.well-known/farcaster.json`
3. Redeploy

## Deployment Checklist

**Pre-Deployment:**
- [ ] Code pushed to GitHub
- [ ] Build works locally: `npm run build`
- [ ] No linter errors: `npm run lint`

**Deployment:**
- [ ] App deployed to Vercel/Netlify
- [ ] Manifest accessible at `/.well-known/farcaster.json`
- [ ] All images loading correctly

**Post-Deployment:**
- [ ] Generate manifest signature with deployed URL
- [ ] Update `public/.well-known/farcaster.json`
- [ ] Push signature changes
- [ ] Wait for auto-redeploy
- [ ] Test in Farcaster preview tool
- [ ] Verify wallet connection works

## Quick Commands Reference

```bash
# Build locally (test before deploying)
npm run build

# Lint check
npm run lint

# Start production server locally
npm start

# Deploy to Vercel (if using Vercel CLI)
vercel --prod

# Check deployment status
vercel ls
```

## Troubleshooting

### "Build Failed"
- Check Node.js version (needs 22.11.0+)
- Run `npm run build` locally to see errors
- Check build logs in Vercel dashboard

### "Manifest Not Found"
- Verify `.well-known/farcaster.json` is in `public/` folder
- Check it's been deployed
- Clear browser cache

### "Invalid Signature"
- Domain must match exactly
- Regenerate signature if you changed domain
- Wait for redeploy after updating manifest

### "Images Not Loading"
- Verify `logo.png` and `og-image.png` are in `public/` folder
- Check file sizes are reasonable
- Clear CDN cache in Vercel dashboard

## Next Steps After Deployment

1. **Test thoroughly** in Farcaster
2. **Get feedback** from beta users
3. **Add backend** if needed (for chip storage, etc.)
4. **Implement payments** (USDC transactions)
5. **Submit to Farcaster** mini app directory
6. **Promote** your app!

## Support

- **Vercel Docs**: https://vercel.com/docs
- **Farcaster Docs**: https://miniapps.farcaster.xyz
- **Issues**: Open on GitHub

---

**Ready to go live? Let's deploy! 🚀**

