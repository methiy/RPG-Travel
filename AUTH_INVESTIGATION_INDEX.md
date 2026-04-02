# Authentication & Login/Register UI Investigation Index

**Investigation Date:** March 20, 2026  
**Project:** 旅行者传说 (Travel Legend RPG) - Nuxt 4 Vue 3  
**Status:** Complete Analysis

---

## 📑 Documentation Files

This investigation produced comprehensive analysis of how the login/register pages are shown and why login UI appears on game content pages.

### 1. **LOGIN_UI_ARCHITECTURE.md** (11 KB)
**Comprehensive architectural breakdown**

Contains:
- Page structure overview
- Layout system explanation
- Authentication flow details
- Critical timing issues explained
- Key findings and root causes
- Directory structure mapping
- Auth state diagram
- Summary tables

**Best for:** Understanding the complete system, finding the root cause

---

### 2. **AUTH_FLOW_DIAGRAMS.md** (23 KB)
**Visual flowcharts and diagrams**

Contains:
- Login/Register page display flowchart
- Protected page access scenarios (logged in, not logged in)
- Auth state transitions timeline
- Layout decision tree
- Router guards vs layout conditions
- Component hierarchy
- API call sequence
- State machine diagram

**Best for:** Visual learners, understanding flows and timing

---

### 3. **AUTH_INVESTIGATION_INDEX.md** (This file)
**Quick reference and navigation guide**

**Best for:** Finding specific information quickly

---

## 🎯 Quick Answers

### How are login/register pages shown?

**Answer:** 4 mechanisms work together:

1. **File-based routing** (`app/pages/login.vue`, `app/pages/register.vue`)
2. **Layout override** (`definePageMeta({ layout: false })`)
3. **Global middleware** (automatic redirects when not authenticated)
4. **Auth state management** (tracks loading and user object)

---

### Why does login UI appear on game content pages?

**Answer:** Race condition in layout rendering:

- User tries to access `/games` (protected page)
- Global middleware calls `fetchUser()` API to check authentication
- **BEFORE redirect completes**, layout re-renders
- With `loading=false && user=null`, layout shows nothing (blank page)
- **THEN** middleware redirects to `/login`
- User sees brief blank flash before login form appears

**Root cause:** Incomplete conditional in `app/layouts/default.vue`

```vue
<!-- Missing case: what if loading=false AND user=null? -->
<template v-if="!authState.loading && authState.user">
  <!-- Show UI -->
</template>
<div v-else-if="authState.loading">
  <!-- Show loading -->
</div>
<!-- BLANK PAGE ❌ -->
```

---

### What files control login/register visibility?

**Critical files (modify to fix issues):**
1. `app/layouts/default.vue` - Layout conditional rendering
2. `app/middleware/auth.global.ts` - Route guard logic
3. `app/composables/useAuth.ts` - Auth state management

**UI files (render the forms):**
1. `app/pages/login.vue` - Login form
2. `app/pages/register.vue` - Register form

**Helper components (shown when logged in):**
1. `app/components/TopBar.vue` - User profile bar
2. `app/components/MainNav.vue` - Navigation

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────┐
│ Entry Point                                 │
├─────────────────────────────────────────────┤
│ app/app.vue → <NuxtLayout> → <NuxtPage>   │
└─────────────┬───────────────────────────────┘
              │
    ┌─────────┴──────────┐
    │                    │
    ▼                    ▼
Login/Register      Protected Pages
(layout: false)     (default layout)
    │                    │
    ├─── /login          ├─── /
    ├─── /register       ├─── /games
    │                    ├─── /medals
    │                    └─── /[id]/...
    │
    └─── Rendered directly
         without layout
    
Protected pages rendered with:
  • TopBar (user profile)
  • MainNav (navigation)
  • Page content
  • Modals


Global Middleware (auth.global.ts):
  ├─ On EVERY route change
  ├─ Fetches user if needed: fetchUser()
  ├─ Redirects if not authenticated
  └─ Redirects if already authenticated on auth page
```

---

## 🔍 State Diagram

```
Initial:  { loading: true, user: null }

Navigate to /login or /register
  → isPublic = true
  → Layout bypassed (layout: false)
  → Auth form shows ✓

Navigate to /games (NOT logged in)
  → isPublic = false
  → fetchUser() called
  → API returns 401
  → Sets: { loading: false, user: null }
  → Layout renders but shows BLANK ⚠️
  → Middleware then redirects to /login
  → /login renders ✓

Navigate to /games (logged in)
  → fetchUser() called
  → API returns user data
  → Sets: { loading: false, user: {...} }
  → Layout renders with UI ✓
```

---

## 📍 File Locations Quick Reference

```
AUTHENTICATION SYSTEM
  app/composables/useAuth.ts         - State + methods
  app/middleware/auth.global.ts      - Route guard
  server/api/auth/                   - API endpoints

PAGES
  app/pages/login.vue                - Login form (public)
  app/pages/register.vue             - Register form (public)
  app/pages/index.vue                - World map (protected)
  app/pages/games.vue                - Games (protected)
  app/pages/medals.vue               - Medals (protected)

LAYOUTS & COMPONENTS
  app/layouts/default.vue            - Main layout ⚠️ THE BUG
  app/components/TopBar.vue          - User profile bar
  app/components/MainNav.vue         - Navigation
  app/components/AchievementModal.vue - Modal

CONFIGURATION
  nuxt.config.ts                     - Nuxt config (ssr: false)
  app/app.vue                        - Root component
```

---

## 🛠️ For Fixing Issues

**If you need to fix the blank page issue:**

Go to `app/layouts/default.vue` and add the missing case for when the user is not authenticated:

Current (incomplete):
```vue
<template v-if="!authState.loading && authState.user">
  <!-- Content -->
</template>
<div v-else-if="authState.loading">
  <!-- Loading -->
</div>
<!-- Missing: else for loading=false && user=null -->
```

Potential fix options:
1. Keep showing loading screen until redirect
2. Show a redirect notice
3. Let middleware handle it (keep blank)

**If you need to understand the redirect flow:**

Check `app/middleware/auth.global.ts` - lines 9-18 show the guard logic

**If you need to modify auth state:**

Edit `app/composables/useAuth.ts` - contains all state management

---

## 📊 Condition Matrix

| loading | user | Should Show | Current | Fixed |
|---------|------|------------|---------|-------|
| true | any | Loading screen | ✓ | ✓ |
| false | {...} | UI + TopBar + MainNav | ✓ | ✓ |
| false | null | ? | ❌ Blank | ✓ |

The third case is missing!

---

## 🎓 Key Concepts

### File-Based Routing
- Nuxt automatically creates routes from files in `app/pages/`
- `/` → `app/pages/index.vue`
- `/login` → `app/pages/login.vue`
- `/games` → `app/pages/games.vue`
- `/chapter/[id]` → `app/pages/chapter/[id].vue`

### Layout System
- Default layout in `app/layouts/default.vue`
- Pages can override with `definePageMeta({ layout: false })`
- Layout wraps page content (except when overridden)

### Global Middleware
- `auth.global.ts` (global = runs on every route)
- Executes before page renders
- Can redirect with `navigateTo()`

### Auth State
- Stored in Vue's `useState()` (reactive across page navigation)
- Managed by `useAuth()` composable
- Two properties: `user` (null or object) and `loading` (boolean)

### The Issue
- Layout renders too early relative to middleware
- Creates timing gap where blank page shows
- Middleware eventually redirects to login

---

## 🔗 Related Information

**API Endpoints:**
- `GET /api/auth/me` - Check if logged in
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout

**Configuration:**
- `ssr: false` - Client-side only (no server-side rendering)
- `compatibilityDate: 2025-07-15` - Nuxt version compatibility

**Technologies:**
- Nuxt 4
- Vue 3
- Vue Router 5 (file-based routing)
- ES modules (`"type": "module"`)

---

## 📝 Summary

**How are login/register pages shown?**
1. File-based routing directs to `/login` or `/register`
2. `definePageMeta({ layout: false })` bypasses default layout
3. Auth forms render directly without TopBar/MainNav
4. Global middleware redirects unauthenticated users to `/login`

**Why does login UI appear on game pages?**
1. Race condition between layout rendering and middleware redirect
2. Incomplete layout conditional creates blank page
3. When `loading=false && user=null`, nothing renders
4. Brief blank flash before middleware redirect to `/login`

**What to modify:**
1. `app/layouts/default.vue` - Add missing conditional case
2. `app/middleware/auth.global.ts` - Adjust guard timing if needed
3. `app/composables/useAuth.ts` - Modify state behavior if needed

---

## ✅ Investigation Complete

All files have been analyzed. The root cause is identified. Two detailed analysis documents have been created with diagrams and explanations.

**Files created:**
- `LOGIN_UI_ARCHITECTURE.md` - Full breakdown
- `AUTH_FLOW_DIAGRAMS.md` - Visual diagrams
- `AUTH_INVESTIGATION_INDEX.md` - This guide

**Ready for:** Implementation of fixes based on analysis

