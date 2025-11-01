# 🐙 GitHub Repository Setup

Your code is committed locally! Now push it to GitHub.

## Next Steps

### 1. Create Repository on GitHub

1. Go to: https://github.com/new
2. Repository name: `8bit-poker` (or your choice)
3. Description: "Texas Hold'em Poker game for Farcaster mini apps"
4. Visibility: **Public** or **Private** (your choice)
5. ⚠️ **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

### 2. Push Your Code

GitHub will show you commands. Use these:

```bash
git remote add origin https://github.com/YOUR_USERNAME/8bit-poker.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

### 3. Verify Upload

Go to your repo: `https://github.com/YOUR_USERNAME/8bit-poker`

You should see all your files!

### 4. Deploy to Vercel

Now that it's on GitHub:

1. Go to: https://vercel.com/new
2. Click "Import Git Repository"
3. Select your `8bit-poker` repo
4. Click "Deploy"
5. Wait 2-3 minutes

✅ **Done!** Your app is live!

You'll get a URL like: `https://8bit-poker.vercel.app`

---

## Troubleshooting

### "Repository not found"
- Check the URL is correct
- Make sure you created the repo on GitHub

### "Permission denied"
- You may need to authenticate
- Try: `gh auth login` (if using GitHub CLI)

### "Already exists"
- You might have already run this
- Check: `git remote -v`

---

**Your repo is ready! Push to GitHub now! 🚀**

