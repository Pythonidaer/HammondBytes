# Netlify Deployment Guide

## 1. First, push your code to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

## 2. Deploy Backend (Strapi) on Netlify

1. Create a new site on Netlify
2. Choose "Import from Git" and select your repository
3. Configure the build settings for the backend:
   - Base directory: `backend`
   - Build command: `npm install && npm run build`
   - Publish directory: `backend/build`
   
4. Add these environment variables in Netlify:
```
HOST=0.0.0.0
PORT=8082
NODE_VERSION=18.17.0
NODE_ENV=production
ADMIN_JWT_SECRET=your-super-secret-key
API_TOKEN_SALT=another-super-secret-key
APP_KEYS=key1,key2
JWT_SECRET=your-jwt-secret
DATABASE_URL=your-database-url  # You'll need to set up a database (e.g., Postgres on Supabase)
```

5. Create a `netlify.toml` in your backend directory:
```toml
[build]
  base = "backend"
  command = "npm install && npm run build"
  publish = "build"

[build.environment]
  NODE_VERSION = "18.17.0"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/api/:splat"
  status = 200
```

## 3. Deploy Frontend on Netlify

1. Create another site on Netlify
2. Choose "Import from Git" and select your repository
3. Configure the build settings:
   - Base directory: `frontend`
   - Build command: `npm install && npm run build`
   - Publish directory: `frontend/dist`

4. Add environment variables:
```
VITE_API_URL=https://your-backend-netlify-url
```

## 4. Update CORS Settings

1. In your Strapi project (backend/config/middlewares.js):
```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'https:'],
          'media-src': ["'self'", 'data:', 'blob:', 'https:'],
          upgradeInsecureRequests: null,
        },
      },
      cors: {
        origin: ['http://localhost:5173', 'https://your-frontend-netlify-url.netlify.app'],
      },
    },
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## 5. Final Steps

1. After both deployments are complete:
   - Go to your Strapi admin panel (https://your-backend-url/admin)
   - Configure permissions (Settings → Roles → Public)
   - Enable "find" and "findOne" for Posts
   - Enable "find" for Upload

2. Test your production site:
   - Create a test post in Strapi admin
   - Verify it appears on your frontend site
   - Check images and content rendering

## Important Notes

1. For media storage in production:
   - Consider using Cloudinary or similar service
   - Update Strapi's upload provider accordingly

2. For database:
   - Consider using Supabase (free PostgreSQL database)
   - Update DATABASE_URL in your backend environment variables

3. Troubleshooting:
   - Check Netlify deploy logs for any build errors
   - Verify environment variables are set correctly
   - Ensure CORS is properly configured
   - Check network requests in browser dev tools
