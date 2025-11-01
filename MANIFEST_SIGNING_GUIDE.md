# How to Generate and Add the Manifest Signature

## Overview

The manifest signature proves you own the domain where your Poker mini app is hosted. This is **REQUIRED** for your app to work in Farcaster.

## Step-by-Step Guide

### Step 1: Access the Manifest Tool

Visit the Farcaster Manifest Generator:
```
https://farcaster.xyz/~/developers/mini-apps/manifest
```

**Important**: You must be logged into Farcaster to use this tool.

### Step 2: Enter Your Domain

Enter your domain where the app will be hosted. Examples:
- `poker.mydomain.com`
- `myapp.com` 
- `playpoker.online`

**⚠️ WARNING**: The domain you enter here MUST exactly match where you deploy your app. No trailing slashes, no www unless you use it.

### Step 3: Fill in App Details

You'll need to provide:

#### Required Fields:
- **App Name**: "8 Bit Poker"
- **Description**: "Play Texas Hold'em Poker in 8-bit style! Buy chips with USDC, compete against AI, and win!"
- **Home URL**: Where users land when opening the app (usually `https://your-domain.com/`)
- **Icon URL**: Link to your logo (`https://your-domain.com/logo.png`)
- **Image URL**: Social sharing image (`https://your-domain.com/og-image.png`)
- **Button Title**: "🎮 Play Poker" (shown on the button in feeds)

#### Optional Fields:
- **Splash Image URL**: Logo shown while loading
- **Splash Background Color**: Hex color (e.g., `#0d6e47`)
- **Webhook URL**: For notifications (leave empty for now)
- **Cast Share URL**: `/share` (enables share extension feature) ✅ Already added

#### Capabilities (Already Set):
✅ Wallet provider (for USDC payments)  
✅ Compose cast (for sharing games)

### Step 4: Generate Signature

Click the "Generate Signature" button. This will:
1. Create a cryptographic signature using your Farcaster account
2. Generate three values:
   - `header`: Base64-encoded header
   - `payload`: Base64-encoded payload containing your domain
   - `signature`: Cryptographic signature

### Step 5: Copy the Values

You'll see something like this:

```json
{
  "header": "eyJmaWQiOjEyMzQ1In0...",
  "payload": "eyJkb21haW4iOiJwb2tlci5leGFtcGxlLmNvbSJ9",
  "signature": "0x1234567890abcdef..."
}
```

**Copy all three values.**

### Step 6: Update Your Manifest File

Open `public/.well-known/farcaster.json` and replace the placeholder values:

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

### Step 7: Verify Your Manifest

After deploying, verify your manifest is accessible:

```bash
curl https://your-domain.com/.well-known/farcaster.json
```

You should see your full manifest with the signature.

### Step 8: Test in Farcaster

1. Visit https://farcaster.xyz/~/developers/mini-apps/preview
2. Enter your deployed URL
3. Click "Preview"
4. Your app should open in the Farcaster interface!

## Troubleshooting

### "Invalid signature" error
- **Cause**: Domain mismatch
- **Fix**: Make sure the domain in the manifest matches exactly where you deployed

### "Manifest not found" error
- **Cause**: File not accessible
- **Fix**: Verify `.well-known/farcaster.json` is in the `public/` folder and deployed correctly

### Signature doesn't work
- **Cause**: Outdated signature
- **Fix**: Regenerate a new signature if you change domains

### Can't access the manifest tool
- **Cause**: Not logged into Farcaster
- **Fix**: Log in at https://farcaster.xyz first

## Important Notes

### Domain Matching
The domain you sign must EXACTLY match where you deploy:
- ❌ Wrong: Sign `example.com`, deploy to `www.example.com`
- ❌ Wrong: Sign `app.com`, deploy to `app.com/poker`
- ✅ Right: Sign `poker.example.com`, deploy to `poker.example.com`

### Changes Require New Signature
If you change any of these, regenerate:
- Domain
- App name
- Owner account

### Security
- The signature is tied to YOUR Farcaster account
- Don't share your signature publicly (it's in the manifest anyway)
- If compromised, regenerate a new one

## Example Completed Manifest

Here's what a properly signed manifest looks like:

```json
{
  "accountAssociation": {
    "header": "eyJmaWQiOjM2MjEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgxMjM0In0",
    "payload": "eyJkb21haW4iOiJwb2tlci5leGFtcGxlLmNvbSJ9",
    "signature": "0xabcd1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef"
  },
  "miniapp": {
    "version": "1",
    "name": "Poker on Farcaster",
    "iconUrl": "/logo.png",
    "homeUrl": "/",
    "imageUrl": "/og-image.png",
    "buttonTitle": "🎮 Play Poker",
    "splashImageUrl": "/logo.png",
    "splashBackgroundColor": "#0d6e47",
    "webhookUrl": "",
    "description": "Play Texas Hold'em Poker. Buy chips with USDC, compete against AI, and win!",
    "requiredChains": ["eip155:8453"],
    "requiredCapabilities": ["wallet.getEthereumProvider", "actions.composeCast"]
  }
}
```

## Quick Checklist

Before deploying, verify:
- [ ] Signed manifest with correct domain
- [ ] Manifest file is in `public/.well-known/farcaster.json`
- [ ] All three signature values are filled in
- [ ] Manifest is accessible at your domain
- [ ] Tested in Farcaster preview tool

## Still Need Help?

- **Farcaster Docs**: https://miniapps.farcaster.xyz/docs/guides/publishing
- **Farcaster Discord**: Get help from the community
- **Base Docs**: https://docs.base.org/mini-apps

---

**Once signed, your app is ready to launch! 🎰**

