# Migrating from Fly.io to Railway for Backend and PostgreSQL

## **Step 1: Remove Fly.io from Your Backend Codebase**

### **1. Remove Fly.io Dependencies**
#### **A. Check `package.json` for Fly.io dependencies**
Run:
```sh
cat package.json
```
Look for any Fly.io dependencies (e.g., `flyctl`, `@fly/fly`). If found, remove them by running:
```sh
npm uninstall flyctl @fly/fly
```
Then, delete the references from `package.json` manually.

#### **B. Remove Fly.io Configuration Files**
Delete Fly.io-specific files in your backend directory:
```sh
rm -rf fly.toml
rm -rf .fly/
```

#### **C. Remove Fly.io Scripts from `package.json`**
In `package.json`, locate and remove any scripts related to Fly.io:
```json
"scripts": {
  "deploy": "fly deploy",
  "start-fly": "flyctl start"
}
```
After removing these lines, save the file.

#### **D. Unlink Fly.io Git Remote (if applicable)**
If Fly.io was added as a Git remote, remove it:
```sh
git remote -v
```
If `fly` appears as a remote, remove it:
```sh
git remote remove fly
```

## **Step 2: Set Up Railway Backend Hosting**

### **1. Create a New Railway Project**
1. Go to [Railway.app](https://railway.app/)
2. Click **New Project**
3. Select **Deploy from GitHub**
4. Connect your repository and **import the backend service**

### **2. Set Up Environment Variables**
1. Go to your Railway **Project Dashboard**.
2. Click on your newly created backend service.
3. Navigate to the **Environment Variables** tab.
4. Add necessary environment variables (these were previously in Fly.io secrets):
   - `DATABASE_HOST`
   - `DATABASE_NAME`
   - `DATABASE_USERNAME`
   - `DATABASE_PASSWORD`
   - `DATABASE_PORT`
   - `DATABASE_SSL` (set to `false` for internal connections)

## **Step 3: Set Up PostgreSQL on Railway**

### **1. Add a PostgreSQL Service**
1. Inside your **Railway project**, click **New Service**.
2. Select **PostgreSQL** from the available services.
3. Railway will create a PostgreSQL database instance automatically.

### **2. Get PostgreSQL Connection Details**
1. Click on the **PostgreSQL service**.
2. Find the **Connection Details** section.
3. Copy the following values:
   - `DATABASE_URL`
   - `HOST`
   - `PORT`
   - `USERNAME`
   - `PASSWORD`
   - `DATABASE`

### **3. Update Your Backend Configuration (`config/database.js`)**
Edit your `backend/config/database.js` file to use Railway’s PostgreSQL:
```js
module.exports = ({ env }) => ({
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME'),
      user: env('DATABASE_USERNAME'),
      password: env('DATABASE_PASSWORD'),
      ssl: env.bool('DATABASE_SSL', false),
    },
    pool: { min: 2, max: 10 },
  },
});
```
Then, save and push changes:
```sh
git add .
git commit -m "Updated database config for Railway"
git push origin main
```

## **Step 4: Deploy Your Backend on Railway**

### **1. Deploy the Backend**
Railway will automatically **build and deploy** your backend when you push to GitHub.
If you want to trigger a manual deployment:
1. Go to your **Railway Project**.
2. Click **Deployments**.
3. Click **Trigger Deployment**.

### **2. Verify the Deployment**
Check the **logs** to see if everything is running correctly:
```sh
railway logs
```

Test the deployment by visiting your Railway backend URL, which can be found under **Settings → Domains**.

## **Step 5: Connect Frontend to New Backend**
1. If your frontend is hosted on **Netlify/Vercel**, update the `API_BASE_URL` to point to your new Railway backend.
2. Commit the changes:
```sh
git add .
git commit -m "Updated frontend API URL"
git push origin main
```
3. Redeploy your frontend on Netlify/Vercel.

---

## **🎯 Summary**
✅ Removed Fly.io from the backend  
✅ Created a new backend service on Railway  
✅ Set up a PostgreSQL database on Railway  
✅ Updated the backend to use Railway’s database  
✅ Deployed the backend on Railway  
✅ Connected the frontend to the new backend  

🚀 Your backend is now fully running on Railway! 🚀
