# Upload To GitHub

This project is ready to upload as a normal Next.js repository. Do not upload `node_modules` or `.next`; GitHub and Vercel rebuild those from `package.json` and `package-lock.json`.

## Option 1: Upload In Browser

1. Go to [github.com/new](https://github.com/new).
2. Repository name: `moa-cinematic-sales-experience`.
3. Choose **Public** if you need to share the code link with the hiring team.
4. Do not add a README, `.gitignore`, or license on GitHub because this project already has them.
5. Click **Create repository**.
6. On the new repository page, choose **uploading an existing file**.
7. Upload everything from this project folder except:
   - `node_modules`
   - `.next`
   - `.git`
   - `tmp-chrome-profile`
   - `tmp-edge-profile`
   - `media_sources`
   - log files
   - QA screenshots
8. Commit the upload.

## Option 2: Upload With Git Commands

Replace `YOUR_USERNAME` with your GitHub username:

```bash
git add .
git commit -m "Build cinematic Mall of America sales experience"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/moa-cinematic-sales-experience.git
git push -u origin main
```

If `git remote add origin` says the remote already exists, run:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/moa-cinematic-sales-experience.git
git push -u origin main
```

## Deploy To Vercel

1. Go to [vercel.com/new](https://vercel.com/new).
2. Import the GitHub repository.
3. Framework preset: **Next.js**.
4. Build command: `npm run build`.
5. Output directory: leave blank.
6. Click **Deploy**.

After deployment, send the hiring team:

- Live Vercel URL
- GitHub repository URL
- The write-up from `README.md`, especially the Design Decisions and AI Tools Used sections

## Verify Before Sending

Run these locally:

```bash
npm install
npm run build
npm run typecheck
npm run qa
```

The optimized videos and images are already inside `public/media`, so the deployed site does not depend on external video/image URLs.
