# 🚀 GitHub Upload Guide - First Time Setup

Follow these steps to upload your Spotify Clone project to GitHub!

## Step 1: Create a GitHub Account (if you don't have one)

1. Go to https://github.com
2. Click "Sign up"
3. Follow the registration process

## Step 2: Create a New Repository on GitHub

1. Log in to GitHub
2. Click the "+" icon in the top right
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `spotify-clone` (or any name you like)
   - **Description**: "A music discovery and concert tracking app"
   - **Visibility**: Choose "Public" or "Private"
   - **DO NOT** initialize with README (we already have one)
5. Click "Create repository"

## Step 3: Initialize Git in Your Project

Open PowerShell in your project folder and run:

```powershell
cd d:\spotify-clone\spotify-clone

# Initialize git
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit - Spotify Clone with Stage 3 complete"
```

## Step 4: Connect to GitHub

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 5: Verify Upload

1. Go to your GitHub repository page
2. Refresh the page
3. You should see all your files!

## ⚠️ IMPORTANT: Your Friend Needs to Do This

After cloning your repository, your friend must:

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/spotify-clone.git
   cd spotify-clone
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Set up their own API keys**
   ```bash
   cd backend
   cp .env.example .env
   # Then edit .env and add their own API keys
   ```

4. **Initialize database**
   ```bash
   node db/initDb.js
   node add-sample-data.js
   ```

5. **Run the app**
   ```bash
   # Terminal 1 - Backend
   cd backend
   npm start
   
   # Terminal 2 - Frontend
   cd frontend
   npm start
   ```

## 📝 Notes

- Your `.env` file with API keys is **NOT** uploaded (it's in `.gitignore`)
- Your friend will need to get their own API keys
- The database file is also not uploaded (they'll create a fresh one)

## Need Help?

If you get stuck, common issues:
- **"git is not recognized"**: Install Git from https://git-scm.com/
- **Authentication error**: You may need to set up a Personal Access Token
- **Push rejected**: Make sure you're pushing to the correct repository

---

**Ready to upload? Start with Step 3!** 🚀
