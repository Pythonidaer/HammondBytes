# Deployment Instructions

## 1. Prepare for Deployment

### Frontend Setup
1. Create a `.env` file in your frontend directory:
```env
VITE_API_URL=http://localhost:1337  # We'll change this to production URL later
```

2. Update your API configuration to use the environment variable:
```javascript
// src/api/strapi.js
export const strapiApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});
```

## 2. Push to GitHub

1. Initialize Git repository (if not already done):
```bash
cd c:/Users/codef/Documents/HammondBytes
git init
```

2. Create .gitignore:
```
# Frontend
frontend/node_modules
frontend/.env
frontend/dist

# Backend
backend/node_modules
backend/.env
backend/build
backend/.tmp
backend/.cache
```

3. Add and commit files:
```bash
git add .
git commit -m "Initial commit"
```

4. Create a new repository on GitHub (don't initialize with README)

5. Push your code:
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

## 3. Deploy Backend (Strapi)

1. Sign up for Railway.app (recommended for free tier)
2. Create new project from GitHub
3. Add environment variables:
```
NODE_ENV=production
ADMIN_JWT_SECRET=your-super-secret-key
API_TOKEN_SALT=another-super-secret-key
APP_KEYS=comma-separated-keys
DATABASE_URL=your-postgres-url (Railway will provide this)
```

4. Add the following buildpack commands:
```
npm install
npm run build
npm start
```

5. Once deployed, copy your production URL (e.g., https://your-app.railway.app)

## 4. Deploy Frontend (Netlify)

1. Sign up for Netlify
2. Connect your GitHub repository
3. Configure build settings:
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
4. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: Your Strapi production URL (from step 3)

## 5. Final Configuration

1. In Strapi admin panel (production):
   - Go to Settings > Roles > Public
   - Enable "find" and "findOne" permissions for Post content type
   - Enable "find" permission for Upload content type

2. Test your production site:
   - Create a new post in Strapi admin
   - Verify it appears on your Netlify site
   - Test images and content rendering

## Troubleshooting

If you encounter CORS issues:
1. In Strapi admin panel:
   - Settings > Security > CORS
   - Add your Netlify domain to allowed origins

If media files don't load:
1. Configure Strapi to use a cloud provider like Cloudinary for media storage
2. Update media URLs in your frontend code accordingly

## Important URLs to Save
- Frontend: Your Netlify URL (e.g., https://hammondbytes.netlify.app)
- Backend API: Your Railway URL (e.g., https://your-app.railway.app)
- Strapi Admin: Your Railway URL + /admin (e.g., https://your-app.railway.app/admin)
