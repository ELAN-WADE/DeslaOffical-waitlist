# DeslaOffical-waitlist

A luxury, high-conversion beauty commerce application and VIP waitlist system for **Desla Official**, built with Next.js 16 (App Router), TypeScript, SQLite (WAL mode), Tailwind CSS, and transactional SMTP email delivery.

---

## 📖 Backend & Executive Console

For complete technical and operational documentation, refer to:
👉 **[ADMIN_BACKEND_GUIDE.md](./ADMIN_BACKEND_GUIDE.md)**

It covers:
- **Executive Console**: Secured with password authentication and cryptographic session tokens at `/manage.elantheadmin.waitlist`.
- **Transactional Outbox Pattern**: Asynchronous background queueing for instant registrations and zero-drop email dispatches.
- **Excel & CSV Exporting**: Clean, deduplicated waitlist exports formatted for Microsoft Excel.
- **Broadcast Announcements**: Send custom editorial and launch updates to all members or filtered roles.
- **Inbox Deliverability**: Optimized anti-spam headers, SPF/DKIM alignment, and real brand logo integration.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create or verify `.env.local`:
```env
# Production/App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Executive Admin Security
ADMIN_PASSWORD=your_secure_password_here

# SMTP Email Configuration (Gmail or Custom SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
SMTP_FROM="Desla Official <your_email@gmail.com>"
```

### 3. Run Development Server
```bash
npm run dev
```
The application will be live at:
- **Storefront**: [http://localhost:3000](http://localhost:3000)
- **VIP Waitlist**: [http://localhost:3000/waitlist](http://localhost:3000/waitlist)
- **Executive Console**: [http://localhost:3000/manage.elantheadmin.waitlist](http://localhost:3000/manage.elantheadmin.waitlist)

---

## 🛠️ Project Structure

```
├── data/
│   ├── desla_waitlist.csv   # Pre-generated Excel-ready member export
│   └── emails/             # Persisted HTML audit copies of sent emails
├── src/
│   ├── app/
│   │   ├── manage.elantheadmin.waitlist/ # Secure Executive Console
│   │   ├── waitlist/       # Standalone VIP Waitlist landing page
│   │   ├── api/            # Route handlers (waitlist, admin auth, worker, export)
│   │   └── page.tsx        # Storefront with 3D Prism Carousel
│   ├── components/         # Luxury UI components & Routine Builder
│   └── lib/
│       ├── admin-auth.ts   # SHA-256 session token verification
│       ├── db.ts           # SQLite client & schema initialization
│       ├── email-service.ts# Role-based & broadcast HTML email generators
│       └── worker.ts       # Asynchronous transactional outbox processor
├── ADMIN_BACKEND_GUIDE.md  # Detailed admin & backend guide
└── render.yaml             # Render deployment blueprint
```
