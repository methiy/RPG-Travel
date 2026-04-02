# Authentication Flow Diagram

## 1. LOGIN/REGISTER PAGE DISPLAY

```
┌─────────────────────────────────────────────────────┐
│ User navigates to /login or /register               │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Global Middleware (auth.global.ts) runs            │
├─────────────────────────────────────────────────────┤
│ const publicPages = ['/login', '/register']        │
│ const isPublic = publicPages.includes(to.path)    │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
        ┌────────────────┐
        │ isPublic = ✓   │
        └────────┬───────┘
                 │
                 ▼ Middleware allows page to render
┌─────────────────────────────────────────────────────┐
│ Page component mounts (login.vue or register.vue)  │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ definePageMeta({ layout: false }) is applied       │
│ • Skips app/layouts/default.vue                    │
│ • Renders page directly without TopBar/MainNav     │
└────────────────┬────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────┐
│ Login/Register form shows                          │
│ ✓ auth-page (full screen)                         │
│ ✓ auth-card (centered container)                  │
│ ✓ auth-header (logo + title)                      │
│ ✓ auth-form (input fields + button)               │
│ ✓ auth-footer (link to other auth page)           │
└─────────────────────────────────────────────────────┘
```

---

## 2. PROTECTED PAGE ACCESS (Logged In)

```
┌─────────────────────────────────────┐
│ User navigates to /games (protected)│
└────────────────┬────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ Global Middleware runs                              │
├──────────────────────────────────────────────────────┤
│ if (authState.loading) {                            │
│   await fetchUser()  // Already logged in,         │
│ }                     // loading=false, user=set    │
│                                                      │
│ isPublic = false // /games not in publicPages      │
│                                                      │
│ if (!user && !isPublic)                             │
│   return navigateTo('/login')  // Skip, user exists │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼ Allows page render
┌──────────────────────────────────────────────────────┐
│ app/layouts/default.vue renders                     │
├──────────────────────────────────────────────────────┤
│ v-if="!authState.loading && authState.user"        │
│ // Both conditions TRUE → render full UI           │
└────────────────┬─────────────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ Layout renders:                                      │
│ ✓ TopBar     (profile, level, exp, stats)          │
│ ✓ MainNav    (navigation links)                    │
│ ✓ <slot />   (page content - games.vue)            │
│ ✓ Modals     (achievements)                        │
└──────────────────────────────────────────────────────┘
```

---

## 3. PROTECTED PAGE ACCESS (Not Logged In) - THE PROBLEM

```
┌─────────────────────────────────────┐
│ User navigates to /games (protected)│
│ (NOT logged in)                     │
└────────────────┬────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────────────┐
│ Global Middleware runs                              │
├──────────────────────────────────────────────────────┤
│ State: { loading: true, user: null }                │
│                                                      │
│ if (authState.loading) {                            │
│   await fetchUser()  // Start API call             │
│ }                                                    │
└────────────────┬─────────────────────────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌──────────────────┐  ┌──────────────────────────┐
│ Meanwhile...     │  │ API returns (fetchUser)  │
│ Layout renders   │  │ Sets: loading = false    │
│ with            │  │       user = null        │
│ loading = true  │  └──────────────┬───────────┘
│ user = null     │                 │
│                 │                 ▼
│ v-if="!true &&  │  Middleware continues:
│       null"     │
│ = false → skip  │  if (!user && !isPublic) {
│                 │    return navigateTo('/login')
│ v-else-if="     │  }
│  true"          │
│ = true → show!  │  Executes redirect
│                 │
│ Loading screen  │
│ shows 🌍        │  TIMING ISSUE:
│ "加载中..."     │  When does middleware
└──────────────┬──┘  redirect execute relative
               │      to layout re-render?
               ▼
┌──────────────────────────────────────────────────────┐
│ Layout updates when loading = false & user = null   │
├──────────────────────────────────────────────────────┤
│ v-if="!false && null"                               │
│ = false → don't show TopBar/MainNav/content        │
│                                                      │
│ v-else-if="false"                                   │
│ = false → don't show loading screen                │
│                                                      │
│ RESULT: Blank page! ❌                              │
└──────────────────────────────────────────────────────┘
                 │
                 ▼ (After middleware redirect)
┌──────────────────────────────────────────────────────┐
│ Browser navigates to /login                         │
│ (User sees brief blank flash, then login form)     │
└──────────────────────────────────────────────────────┘
```

---

## 4. AUTH STATE TRANSITIONS

```
Application Lifecycle:

┌─────────────┐
│ App Start   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│ Auth State Initialized          │
├─────────────────────────────────┤
│ {                               │
│   user: null,                   │
│   loading: true                 │
│ }                               │
└──────┬──────────────────────────┘
       │
       ├─────────────────────────────────────────┐
       │                                         │
       ▼                                         ▼
┌─────────────────────────┐          ┌──────────────────────┐
│ User on Public Page     │          │ User on Protected Page
│ (/login, /register)     │          │ (e.g., /games)
└──────┬──────────────────┘          └──────┬───────────────┘
       │                                     │
       ▼                                     ▼
    (No API call)                  fetchUser() called
   Middleware                      └──────┬──────────┘
   allows page                            │
   (isPublic = true)           ┌──────────┴──────────┐
                               │                     │
                               ▼                     ▼
                        ┌─────────────┐      ┌──────────────┐
                        │ Cookie has  │      │ No session   │
                        │ valid token │      │ / expired    │
                        └─────┬───────┘      └──────┬───────┘
                              │                     │
                              ▼                     ▼
                    ┌──────────────────┐  ┌──────────────────┐
                    │ State Update:    │  │ State Update:    │
                    │ loading = false  │  │ loading = false  │
                    │ user = {user}    │  │ user = null      │
                    └─────┬────────────┘  └──────┬───────────┘
                          │                      │
                          ▼                      ▼
        ┌─────────────────────────────┐  ┌──────────────────┐
        │ Layout renders with user    │  │ Middleware      │
        │ Shows TopBar/MainNav/content│  │ redirects to    │
        │                             │  │ /login          │
        └─────────────────────────────┘  └────────┬─────────┘
                                                   │
                                                   ▼
                                    ┌──────────────────────────┐
                                    │ User sees /login page    │
                                    │ (potential blank flash)  │
                                    └──────────────────────────┘
```

---

## 5. DEFAULT LAYOUT DECISION TREE

```
┌─────────────────────────────────────────────┐
│ Default Layout (default.vue) Renders       │
└────────────┬────────────────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │ authState.loading? │
    └───┬──────────┬─────┘
        │ YES      │ NO
        │          │
        ▼          ▼
    ┌────────┐  ┌─────────────────┐
    │ true   │  │ authState.user? │
    │        │  └──┬────────┬─────┘
    ▼        │     │ YES    │ NO
┌──────────┐ │     │        │
│ Show     │ │     ▼        ▼
│ Loading  │ │  ┌────────┐ ┌──────────┐
│ Screen   │ │  │ true   │ │ false/   │
│ 🌍       │ │  │        │ │ null     │
│ 加载中...  │ │  ▼        ▼ │
└──────────┘ │ ┌──────────────┐ ▼
             │ │ Show UI:     │ ┌──────────┐
             │ │ • TopBar     │ │ BLANK    │
             │ │ • MainNav    │ │ PAGE ❌  │
             │ │ • Content    │ │          │
             │ │ • Modals     │ └──────────┘
             │ └──────────────┘
             │
             └─────────────────> Nothing renders!
                                 (This is the bug)
```

---

## 6. ROUTER GUARDS vs LAYOUT CONDITIONS

```
Two-Layer Protection:

LAYER 1: Route Guard (Middleware)
┌──────────────────────────────────────────────┐
│ auth.global.ts                              │
├──────────────────────────────────────────────┤
│ • Checks if user is authenticated           │
│ • If not + page protected → navigateTo login│
│ • If yes + page public → navigateTo home    │
│                                              │
│ Prevents navigation to unauthorized routes  │
└──────────────────────────────────────────────┘
                   ▼
LAYER 2: Layout Rendering
┌──────────────────────────────────────────────┐
│ default.vue                                 │
├──────────────────────────────────────────────┤
│ • Conditionally renders TopBar/MainNav      │
│ • Based on authState (loading, user)        │
│ • Shows loading screen or content           │
│                                              │
│ Determines what UI is shown to user         │
└──────────────────────────────────────────────┘

ISSUE: Layer 2 has incomplete conditions!
```

---

## 7. COMPONENT HIERARCHY

```
app.vue
│
└── <NuxtLayout>
    │
    ├── app/layouts/default.vue (conditionally renders:)
    │   │
    │   ├── TopBar.vue
    │   │   └── user profile, level, exp, stats
    │   │
    │   ├── MainNav.vue
    │   │   └── navigation buttons
    │   │
    │   └── <slot /> (page content)
    │       │
    │       └── <NuxtPage>
    │           └── Actual page component
    │               ├── app/pages/index.vue
    │               ├── app/pages/games.vue
    │               ├── app/pages/medals.vue
    │               ├── app/pages/[id].vue
    │               ├── app/pages/login.vue (layout: false)
    │               └── app/pages/register.vue (layout: false)
    │
    └── AchievementModal.vue


Login/Register pages:
app/pages/login.vue
├── definePageMeta({ layout: false })
│
└── No layout wrapper, renders full screen
    └── auth-page
        └── auth-card
            ├── auth-header
            ├── auth-form
            └── auth-footer


Protected pages:
app/pages/games.vue
├── Uses default layout
│
└── Renders within TopBar + MainNav + layout
```

---

## 8. API CALL SEQUENCE

```
User navigates to /games (not logged in)
│
├─► Global Middleware executes
│   │
│   ├─► Check if authState.loading === true
│   │   YES → call fetchUser()
│   │
│   └─► fetchUser() runs:
│       │
│       ├─► POST /api/auth/me
│       │   └─► Server checks auth cookie
│       │       └─► Returns 401 (not logged in)
│       │
│       ├─► Catch error
│       │   └─► Set state.user = null
│       │
│       └─► Set state.loading = false
│
└─► Back to middleware:
    │
    ├─► Check: if (!user && !isPublic)
    │   YES → navigateTo('/login')
    │
    └─► Navigation happens
        └─► /login page loads
            └── Shows auth form
```

---

## 9. STATE MACHINE

```
START
  │
  ├─ loading: true
  ├─ user: null
  │
  ▼
┌────────────────────────────┐
│ Page Navigation Triggered   │
└────────────┬────────────────┘
             │
        ┌────┴──────────────────────────────┐
        │                                   │
        ▼                                   ▼
   PUBLIC PAGE               PROTECTED PAGE
   (/login, /register)       (other routes)
        │                         │
        ▼                         ▼
   NO API CALL            Middleware calls
   Layout: false          fetchUser()
        │                         │
        ▼                ┌────────┴────────┐
   Show auth form        │                 │
        │                ▼                 ▼
        │          User exists      No session
        │          in cookie         in cookie
        │                │                 │
        │                ▼                 ▼
        │           Set user data    loading=false
        │           loading=false    user=null
        │                │                 │
        │                ▼                 ▼
        │           Show UI with      Check if
        │           TopBar/MainNav   page is
        │                │           protected
        │                ▼                │
        │           Protected page    Is protected?
        │           content loads        YES
        │                │               │
        │                │               ▼
        │                │           Redirect to
        │                │           /login
        │                │               │
        ▼                ▼               ▼
   ┌─────────────────────────────────────────────┐
   │ Final rendered state                        │
   ├─────────────────────────────────────────────┤
   │ • Login/register form, OR                   │
   │ • Protected page with TopBar/MainNav, OR    │
   │ • Redirecting to login (blank page flash)   │
   └─────────────────────────────────────────────┘
```

