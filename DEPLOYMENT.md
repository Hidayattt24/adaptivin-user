# 🚀 Adaptivin User - Deployment Guide

Panduan lengkap untuk deployment aplikasi Adaptivin User ke Vercel.

## 📋 Pre-requisites

- Node.js 18.x atau lebih tinggi
- npm atau yarn
- Akun Vercel
- Backend API sudah running (di Vercel atau server lain)
- Supabase project sudah setup

## 🔍 Pre-Build Checklist

Sebelum build, pastikan semua requirement terpenuhi:

```bash
npm run pre-build
```

Script ini akan mengecek:

- ✅ Environment variables
- ✅ Project structure
- ✅ Dependencies
- ✅ TypeScript configuration
- ✅ Next.js configuration
- ✅ Critical source files
- ✅ API integration files
- ✅ Public assets

## 🛠️ Setup Environment Variables

### 1. Create `.env.local` file

Copy dari `.env.example`:

```bash
cp .env.example .env.local
```

### 2. Update values

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://your-backend-api.vercel.app/api

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 🏗️ Local Build Test

Test build di local sebelum deploy:

```bash
# Install dependencies
npm install

# Run pre-build check
npm run pre-build

# Build for production
npm run build

# Test production build locally
npm run start
```

Buka http://localhost:3000 untuk verify build berhasil.

## 🚀 Deploy ke Vercel Desktop

### Method 1: Vercel Desktop App

1. **Install Vercel Desktop**

   - Download dari: https://vercel.com/download
   - Install dan login dengan akun Vercel

2. **Import Project**

   - Buka Vercel Desktop
   - Klik "Import Project"
   - Pilih folder `adaptivin-user`

3. **Configure Project**

   ```
   Framework Preset: Next.js
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

4. **Set Environment Variables**

   - Di Vercel Dashboard, pergi ke Project Settings
   - Klik "Environment Variables"
   - Tambahkan semua variabel dari `.env.local`:
     ```
     NEXT_PUBLIC_API_URL
     NEXT_PUBLIC_SUPABASE_URL
     NEXT_PUBLIC_SUPABASE_ANON_KEY
     ```

5. **Deploy**
   - Klik "Deploy"
   - Wait for build to complete
   - Vercel akan memberikan URL deployment

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (production)
vercel --prod

# Atau deploy preview
vercel
```

## 🔧 Vercel Configuration

File `vercel.json` sudah disediakan dengan konfigurasi:

- ✅ Build command
- ✅ Environment variables reference
- ✅ Security headers
- ✅ Framework detection

## 📝 Post-Deployment Checklist

Setelah deploy, verify:

1. **Homepage loads** - https://your-app.vercel.app
2. **Auth flows work**
   - Login Guru
   - Login Siswa
3. **API connection**
   - Check browser console untuk API calls
   - Verify data loading
4. **Images load**
   - Logo
   - Mascot
   - User uploads
5. **Navigation works**
   - All routes accessible
   - No 404 errors

## 🐛 Troubleshooting

### Build Errors

**Error: Type errors**

```bash
# Check types locally
npm run build

# Fix all TypeScript errors
# Then redeploy
```

**Error: Environment variables not found**

- Pastikan semua env vars sudah diset di Vercel Dashboard
- Variable names harus EXACT match dengan `.env.local`
- Redeploy setelah update env vars

**Error: Module not found**

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Runtime Errors

**API Connection Failed**

- Check `NEXT_PUBLIC_API_URL` di Vercel env vars
- Pastikan backend sudah running
- Check CORS settings di backend

**Images Not Loading**

- Verify Supabase URL di env vars
- Check `next.config.ts` remote patterns
- Pastikan storage bucket public

**Auth Not Working**

- Verify Supabase keys
- Check cookie settings
- Verify middleware.ts configuration

## 🔄 Update Deployment

### Auto-deploy (Recommended)

1. Connect repository ke Vercel
2. Push changes ke main branch
3. Vercel auto-deploy

### Manual deploy

```bash
# Pull latest changes
git pull origin main

# Deploy
vercel --prod
```

## 📊 Performance Optimization

Sudah termasuk di `next.config.ts`:

- ✅ Image optimization (AVIF, WebP)
- ✅ Console.log removal di production
- ✅ Package import optimization
- ✅ React strict mode

## 🔒 Security

Security headers sudah dikonfigurasi:

- ✅ X-Content-Type-Options: nosniff
- ✅ X-Frame-Options: DENY
- ✅ X-XSS-Protection: 1; mode=block

## 📱 Custom Domain (Optional)

1. Beli domain
2. Di Vercel Dashboard → Project → Settings → Domains
3. Add domain dan follow DNS configuration
4. Wait for DNS propagation

## 🎯 Production URLs

Setelah deploy, app akan tersedia di:

- Production: `https://adaptivin-user.vercel.app`
- Preview: `https://adaptivin-user-git-branch.vercel.app`

## 📞 Support

Jika ada masalah:

1. Check Vercel deployment logs
2. Check browser console
3. Verify environment variables
4. Test API endpoint langsung

## 🎉 Done!

Aplikasi Adaptivin User sudah siap di production! 🚀

---

**Last Updated**: November 10, 2025
