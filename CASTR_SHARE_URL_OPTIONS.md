# Cast Share URL - What to Enter

## ⚠️ The Manifest Tool Requires an Absolute HTTPS URL

When using the Farcaster Manifest Generator, the **Cast Share URL** field requires:

✅ **Must be HTTPS** (not HTTP)  
✅ **Must be a full URL** (not just `/share`)  
✅ **Must match your domain** (same as where you deploy)  

## Options for Testing/Deployment

### Option 1: Use Vercel (Recommended for Testing)

If you deploy to Vercel, your URL will be:
```
https://poker-farcaster-miniapp.vercel.app/share
```
or
```
https://your-custom-domain.vercel.app/share
```

### Option 2: Use Netlify

```
https://your-app.netlify.app/share
```

### Option 3: Your Own Domain

```
https://8bitpoker.com/share
```
or
```
https://poker.yourdomain.com/share
```

### Option 4: Use Tunnel for Testing (Temporary)

For testing with ngrok/localtunnel:
```
https://abc123.ngrok.io/share
```

⚠️ **Note**: Tunnel URLs are temporary and not suitable for production!

## What NOT to Enter

❌ `/share` (relative path - will be rejected)  
❌ `http://localhost:3000/share` (not HTTPS)  
❌ `localhost/share` (invalid)  
❌ `192.168.1.1/share` (IP address - invalid)  

## My Recommendation

**For now while you're testing**:  
```
https://8bitpoker.vercel.app/share
```

Then update after you actually deploy to match your real domain.

**For production**:  
Use your actual deployment domain:
```
https://your-actual-domain.com/share
```

## How the Cast Share Works

When a user shares a cast to your app:
1. Farcaster opens: `https://your-domain.com/share`
2. With parameters: `?castHash=0x...&castFid=123&viewerFid=456`
3. Your `/app/share/page.tsx` receives and displays the cast info
4. User can then play poker or take other actions

## Already Implemented!

✅ Your `/app/share/page.tsx` is ready  
✅ It receives cast parameters  
✅ It displays cast information  
✅ Everything is set up!  

Just enter the URL matching your deployment domain.

