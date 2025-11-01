# Deployment Checklist

## ✅ Pre-Deployment Checklist

### Code Status
- [x] All dependencies installed
- [x] Build succeeds with zero errors
- [x] Linter passes with zero warnings
- [x] All TypeScript types are correct
- [x] All modules compile successfully

### Images (REQUIRED)
- [ ] **logo.png** created (200x200px, poker-themed)
- [ ] **og-image.png** created (1200x630px, 3:2 ratio)
- [ ] Images are optimized for web

### Farcaster Manifest (REQUIRED)
- [ ] Generate signature at https://farcaster.xyz/~/developers/mini-apps/manifest
- [ ] Update `public/.well-known/farcaster.json` with:
  - [ ] Header (base64 encoded)
  - [ ] Payload (base64 encoded)
  - [ ] Signature
- [ ] Verify manifest is accessible at `https://your-domain.com/.well-known/farcaster.json`

### Configuration Review
- [ ] Review chip prices in `config/monetization.config.ts`
- [ ] Review game rules in `config/game.config.ts`
- [ ] Adjust any settings as needed
- [ ] Test matchmaking timeout
- [ ] Verify AI difficulty settings

### Testing
- [ ] Test in local development
- [ ] Test with ngrok/localtunnel
- [ ] Test in Farcaster preview tool
- [ ] Verify wallet connection works
- [ ] Test game flow end-to-end

### Security
- [ ] Verify HTTPS is enabled
- [ ] Review payment flow security
- [ ] Check for sensitive data exposure
- [ ] Validate user inputs properly

### Deployment
- [ ] Choose hosting platform (Vercel recommended)
- [ ] Set up environment variables (if needed)
- [ ] Configure domain and DNS
- [ ] Enable HTTPS
- [ ] Deploy and verify

### Post-Deployment
- [ ] Test manifest accessibility
- [ ] Verify images load correctly
- [ ] Test wallet integration
- [ ] Check analytics (if set up)
- [ ] Monitor for errors

### Optional Enhancements
- [ ] Set up backend for chip storage
- [ ] Implement actual payment processing
- [ ] Add leaderboards
- [ ] Set up notifications
- [ ] Add analytics tracking
- [ ] Create marketing materials

## 🚨 Critical Before Launch

1. **Manifest Signature**: MUST be valid or app won't work in Farcaster
2. **Images**: MUST be real images, not placeholders
3. **HTTPS**: REQUIRED for Farcaster mini apps
4. **Domain**: MUST match manifest domain exactly

## 📝 Notes

- Local development: Use tunnels for testing
- Production: Deploy to HTTPS-enabled hosting
- Manifest: Regenerate if domain changes
- Updates: Rebuild after config changes

## 🎯 Success Criteria

App is ready when:
- ✅ Build succeeds
- ✅ Lint passes
- ✅ Manifest is signed
- ✅ Images are added
- ✅ Can be previewed in Farcaster
- ✅ Wallet connects
- ✅ Game starts and works

---

**You're almost there! 🎰**

