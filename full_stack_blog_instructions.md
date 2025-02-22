# 📝 Full-Stack Blog with React, Vite, Strapi, TailwindCSS, and Cloudinary

## 📌 Project Overview
This project is a **full-stack blog** built using **React (Vite), Strapi (headless CMS), and SQLite** for local development, with the future option to deploy Strapi on **Railway**.

### **Key Features**
- **Authentication** (login/logout) for blog post management
- **Full CRUD (Create, Read, Update, Delete)**
- **Image Uploads** via **Cloudinary**
- **Optimized Performance** with `useMemo`, `React.lazy()`, `Suspense`, etc.
- **Global State Management** using **Redux Toolkit or Zustand**
- **Data Fetching with React Query**
- **TailwindCSS** for styling
- **Deployment** on **Netlify** (frontend) and **Railway** (backend)

---

## 🚀 Tech Stack
### **Frontend (Vite + React)**
- **Vite** (Fast development server)
- **React Router** (Routing)
- **Redux Toolkit or Zustand** (State management)
- **React Query** (Efficient API caching)
- **TailwindCSS** (Styling)
- **React.lazy & Suspense** (Code splitting)
- **Error Boundaries** (Error handling)

### **Backend (Strapi)**
- **Strapi** (Headless CMS)
- **SQLite (local)**, with the future option to use **PostgreSQL on Railway**
- **JWT Authentication** (login, role-based access)
- **Cloudinary** (Image hosting)

---

## 🛠 Project Setup

### **1️⃣ Install Strapi Locally**
```sh
npx create-strapi-app my-strapi-blog --quickstart
```
- This starts **Strapi with SQLite** (default).
- Runs on `http://localhost:1337/admin`.

---

### **2️⃣ Configure Strapi Admin**
1. Open `http://localhost:1337/admin`
2. Create an **admin user** (email, password).
3. Log in.

---

### **3️⃣ Create Blog Content Type**
Inside Strapi, go to **Content-Type Builder** and create:

#### **Post**
- **title** (Text)
- **content** (Rich Text)
- **coverImage** (Media, Single Image)
- **author** (Relation → `User` `hasOne` `Post`)
- **publishedAt** (Date)

Click **Save**, and Strapi will restart.

---

### **4️⃣ Enable Public API Access**
1. Go to **Settings → Roles → Public**.
2. Under **Permissions → Post**, check:
   - ✅ `find` (Read all posts)
   - ✅ `findOne` (Read a single post)
3. Click **Save**.

Now, test the API:
```sh
curl http://localhost:1337/api/posts
```

---

## 🎨 Set Up Vite + React Frontend

### **1️⃣ Create Vite App**
```sh
npm create vite@latest my-blog --template react
cd my-blog
npm install
```

### **2️⃣ Install Dependencies**
```sh
npm install axios react-router-dom tailwindcss @reduxjs/toolkit react-redux zustand @tanstack/react-query
```

- **Axios** → API calls
- **React Router** → Routing
- **Redux Toolkit/Zustand** → Global state
- **React Query** → API caching
- **TailwindCSS** → Styling

---

### **3️⃣ Set Up API Client**
Create `src/api.js`:
```js
import axios from 'axios';

const API_URL = "http://localhost:1337/api";

export const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});
```

---

### **4️⃣ Set Up Redux Store (Optional)**
Create `src/store.js`:
```js
import { configureStore, createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "posts",
  initialState: [],
  reducers: {
    setPosts: (state, action) => action.payload,
  },
});

export const { setPosts } = postSlice.actions;
export const store = configureStore({ reducer: { posts: postSlice.reducer } });
```

---

### **5️⃣ Fetch Posts with React Query**
Modify `src/components/PostList.jsx`:
```js
import { useQuery } from "@tanstack/react-query";
import { api } from "../api";

export default function PostList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => (await api.get("/posts?populate=*")).data.data,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts</p>;

  return (
    <div>
      {data.map((post) => (
        <article key={post.id}>
          <h2>{post.attributes.title}</h2>
          <img src={post.attributes.coverImage.url} alt={post.attributes.title} />
          <p>{post.attributes.content}</p>
        </article>
      ))}
    </div>
  );
}
```

---

## 🔐 Authentication (Login & Protected Routes)
Strapi provides **JWT authentication**.

### **1️⃣ API Authentication**
Modify `src/api.js`:
```js
export const login = async (identifier, password) => {
  const res = await api.post("/auth/local", { identifier, password });
  return res.data;
};
```

---

### **2️⃣ Zustand Auth Store**
Create `src/store/auth.js`:
```js
import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
```

---

## 🖼 Cloudinary Image Uploads
### **1️⃣ Configure Cloudinary in Strapi**
1. Install Cloudinary Strapi plugin:
   ```sh
   npm install strapi-provider-upload-cloudinary
   ```
2. Add **Cloudinary keys** to `config/plugins.js`:
   ```js
   module.exports = {
     upload: {
       provider: "cloudinary",
       providerOptions: {
         cloud_name: "YOUR_CLOUD_NAME",
         api_key: "YOUR_API_KEY",
         api_secret: "YOUR_API_SECRET",
       },
     },
   };
   ```

---

## 🚀 Deployment
### **1️⃣ Deploy Frontend to Netlify**
```sh
npm run build
netlify deploy --prod
```

### **2️⃣ Deploy Strapi on Railway**
1. Push backend to **GitHub**.
2. Create a **PostgreSQL database**.
3. Set `.env`:
   ```sh
   DATABASE_URL=postgres://user:password@host:5432/dbname
   ```

---

## 🎯 Features Covered
✅ API integration with Strapi  
✅ Authentication (JWT)  
✅ React Hooks (`useState`, `useEffect`, `useReducer`, `useMemo`, etc.)  
✅ State Management (Redux or Zustand)  
✅ Data Fetching (React Query)  
✅ Lazy Loading (`React.lazy()`, `Suspense`)  
✅ CRUD operations (Create, Read, Update, Delete)  
✅ Image Uploads (Cloudinary)  
✅ Deployment (Netlify & Railway)  

---

## ✅ Next Steps
- 🚀 Implement UI Components
- ⚡ Optimize Performance with `useMemo` & `React Query`
- 🛠 Test and Debug
