# 🏗️ SD Auto Project Architecture - Dynamic Data Flow

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                                 │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  │ HTTP Request
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    NEXT.JS APPLICATION (Client-Side)                 │
│                                                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                         PAGES                                │   │
│  │  • Home (/)                    • Shipping (/shipping)        │   │
│  │  • About (/about)              • Policy (/policy)            │   │
│  │  • Gallery (/gallery)          • Contact (/contact)          │   │
│  │  • Genuine Parts (/genuine-parts)                            │   │
│  │  • Product Detail (/product/[id])                            │   │
│  │  • Services (/services)        • FAQ (/faq)                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                  │                                   │
│                                  │ Uses                              │
│                                  ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    CUSTOM HOOKS (useEffect)                  │   │
│  │                                                               │   │
│  │  • useHomeSettings()      • useShipping()                    │   │
│  │  • useSliders()           • usePolicies()                    │   │
│  │  • useDeliveryPartners()  • useFaqs()                        │   │
│  │  • useContacts()                                             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                  │                                   │
│                                  │ Calls                             │
│                                  ▼                                   │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    API SERVICE LAYER                         │   │
│  │                  (src/services/api.ts)                       │   │
│  │                                                               │   │
│  │  • getHomeSettings()      • getShipping()                    │   │
│  │  • getSliders()           • getPolicies()                    │   │
│  │  • getDeliveryPartners()  • getFaqs()                        │   │
│  │  • getContacts()                                             │   │
│  │                                                               │   │
│  │  Uses: fetch(url, config)                                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                  │                                   │
└──────────────────────────────────┼───────────────────────────────────┘
                                   │
                                   │ REST API Calls (fetch)
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    BACKEND REST API SERVER                           │
│                  https://api.sdauto.com.au/api                       │
│                                                                       │
│  Endpoints:                                                          │
│  • GET /home-settings          • GET /shipping                       │
│  • GET /sliders                • GET /policies                       │
│  • GET /delivery-partners      • GET /faqs                           │
│  • GET /contacts               • POST /contact                       │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
                                   │
                                   │ Database Queries
                                   ▼
┌─────────────────────────────────────────────────────────────────────┐
│                          DATABASE                                    │
│                     (MySQL/PostgreSQL)                               │
│                                                                       │
│  Tables:                                                             │
│  • home_settings               • shipping                            │
│  • sliders                     • policies                            │
│  • delivery_partners           • faqs                                │
│  • contacts                                                          │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Sequence

### Example: Loading Home Page

```
1. User visits https://sdauto.com.au/
   │
   ▼
2. Next.js renders Home page component
   │
   ▼
3. Page component calls custom hooks:
   - useHomeSettings()
   - useSliders()
   - useDeliveryPartners()
   - useShipping()
   │
   ▼
4. Each hook triggers useEffect on mount
   │
   ▼
5. useEffect calls API service methods:
   - apiService.getHomeSettings()
   - apiService.getSliders()
   - apiService.getDeliveryPartners()
   - apiService.getShipping()
   │
   ▼
6. API service makes fetch() calls:
   - fetch('https://api.sdauto.com.au/api/home-settings')
   - fetch('https://api.sdauto.com.au/api/sliders')
   - fetch('https://api.sdauto.com.au/api/delivery-partners')
   - fetch('https://api.sdauto.com.au/api/shipping')
   │
   ▼
7. Backend API processes requests
   │
   ▼
8. Database returns data
   │
   ▼
9. API returns JSON response
   │
   ▼
10. API service parses response
   │
   ▼
11. Hooks update state with data
   │
   ▼
12. React re-renders components with new data
   │
   ▼
13. User sees fully loaded page
```

---

## Component Hierarchy

```
App Layout (layout.tsx)
│
├── Navigation
│   └── Dynamic menu items
│
├── Page Components
│   │
│   ├── Home Page
│   │   ├── HeroCarousel (uses useSliders)
│   │   ├── WelcomeSection (uses useHomeSettings)
│   │   ├── DeliveryPartnersSection (uses useDeliveryPartners)
│   │   └── ProductList (static data)
│   │
│   ├── About Page
│   │   └── WelcomeSection (uses useHomeSettings)
│   │
│   ├── Shipping Page
│   │   ├── ShippingInfo (uses useShipping)
│   │   └── DeliveryPartners (uses useDeliveryPartners)
│   │
│   ├── Policy Page
│   │   └── PolicyContent (uses usePolicies)
│   │
│   ├── FAQ Page
│   │   └── FaqClient (uses useFaqs)
│   │
│   ├── Contact Page
│   │   └── ContactForm (POST to /api/contact)
│   │
│   ├── Genuine Parts Page
│   │   └── GenuinePartsClient (client-side filtering)
│   │
│   └── Product Detail Page
│       └── ProductDetailClient (client-side lookup)
│
└── Footer
    └── Dynamic footer content
```

---

## State Management Flow

```
┌──────────────────┐
│   Component      │
│   Mounts         │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   useEffect      │
│   Triggers       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Set Loading    │
│   State = true   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Call API       │
│   Service        │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│   Fetch Data     │
│   from Backend   │
└────────┬─────────┘
         │
         ├─── Success ───┐
         │               │
         │               ▼
         │        ┌──────────────────┐
         │        │   Set Data       │
         │        │   State          │
         │        └────────┬─────────┘
         │                 │
         │                 ▼
         │        ┌──────────────────┐
         │        │   Set Loading    │
         │        │   State = false  │
         │        └────────┬─────────┘
         │                 │
         │                 ▼
         │        ┌──────────────────┐
         │        │   Component      │
         │        │   Re-renders     │
         │        └──────────────────┘
         │
         └─── Error ─────┐
                         │
                         ▼
                  ┌──────────────────┐
                  │   Set Error      │
                  │   State          │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   Set Loading    │
                  │   State = false  │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   Show Error     │
                  │   Message        │
                  └──────────────────┘
```

---

## Key Features

### ✅ **Client-Side Rendering (CSR)**
- All pages use `"use client"` directive
- Data fetched after page loads
- Fast initial page load
- Dynamic content updates

### ✅ **Custom Hooks Pattern**
- Reusable data fetching logic
- Consistent error handling
- Loading states management
- Retry logic for failed requests

### ✅ **API Service Layer**
- Centralized API calls
- Error handling and logging
- Type-safe responses
- Easy to maintain and update

### ✅ **Responsive Loading States**
- Skeleton loaders during data fetch
- Error messages for failed requests
- Retry mechanisms for network issues
- Graceful fallbacks

---

## Performance Optimizations

1. **Lazy Loading**: Components load data only when needed
2. **Caching**: Browser caches API responses
3. **Retry Logic**: Automatic retry on network failures
4. **Error Boundaries**: Graceful error handling
5. **Loading States**: Skeleton screens for better UX

---

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    PRODUCTION SERVER                         │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │         Next.js Application (Node.js)              │    │
│  │                                                     │    │
│  │  • Serves static assets                            │    │
│  │  • Handles client-side routing                     │    │
│  │  • Proxies API requests                            │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
                           │
                           │ API Calls
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND API SERVER                        │
│              https://api.sdauto.com.au                       │
│                                                              │
│  • Handles all data requests                                │
│  • Manages database connections                             │
│  • Implements business logic                                │
│  • Provides REST API endpoints                              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Summary

Your SD Auto project now uses a **fully dynamic, client-side data fetching architecture**:

- ✅ No static generation
- ✅ All data fetched at runtime via REST API
- ✅ Uses `useEffect` hooks for data fetching
- ✅ Ready for server deployment
- ✅ Real-time data updates
- ✅ Scalable and maintainable

**The application is production-ready and can be deployed to any Node.js hosting platform!** 🚀
