# Local Essentials Backend

A production-ready NestJS modular monolith for a local essentials delivery platform
(Gas, Water, Groceries, Medicines, Food, Laundry).

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | NestJS 10 (TypeScript) |
| Database | PostgreSQL 16 via TypeORM 0.3 |
| Auth | JWT (access + refresh tokens) |
| Payments | Paystack |
| Media | Cloudinary |
| Scheduling | @nestjs/schedule (cron jobs) |
| Deployment | Render.com |

---

## Local Development

### Prerequisites
- Node.js >= 20
- PostgreSQL 16 running locally (or Docker)

### Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env
# Edit .env and fill in your values

# 3. Create the database
createdb local_essentials

# 4. Start in dev mode (with DB_SYNCHRONIZE=true it auto-creates tables)
npm run start:dev

# 5. (Optional) Seed initial data
npm run seed
```

API: http://localhost:3000/api/v1
Swagger: http://localhost:3000/api/v1/docs
Health: http://localhost:3000/api/v1/health

### Docker (alternative)

```bash
cp .env.example .env
docker-compose up -d
```

---

## Deployment on Render

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/local-essentials-backend.git
git push -u origin main
```

### Step 2 — Create Render Account
Go to https://render.com and sign up with your GitHub account.

### Step 3 — Deploy with Blueprint (render.yaml)

1. In the Render dashboard click **New → Blueprint**
2. Connect your GitHub repository
3. Render reads `render.yaml` and creates both the **web service** and **PostgreSQL database** automatically
4. Click **Apply**

### Step 4 — Set Secret Environment Variables

In the Render dashboard → your web service → **Environment** tab, add:

| Variable | Value |
|----------|-------|
| `JWT_ACCESS_SECRET` | Generate: `openssl rand -base64 64` |
| `JWT_REFRESH_SECRET` | Generate: `openssl rand -base64 64` |
| `PAYSTACK_SECRET_KEY` | From Paystack dashboard |
| `PAYSTACK_PUBLIC_KEY` | From Paystack dashboard |
| `PAYSTACK_CALLBACK_URL` | `https://your-app.onrender.com/api/v1/payments/paystack/callback` |
| `CLOUDINARY_CLOUD_NAME` | From Cloudinary console |
| `CLOUDINARY_API_KEY` | From Cloudinary console |
| `CLOUDINARY_API_SECRET` | From Cloudinary console |
| `CORS_ORIGINS` | Your frontend URL e.g. `https://yourfrontend.com` |

> DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME are injected automatically from the linked PostgreSQL service.

### Step 5 — Run Migrations

After first deployment, open the Render **Shell** tab and run:

```bash
npm run migration:run
```

Then seed admin users:

```bash
npm run seed
```

### Step 6 — Verify Deployment

```bash
curl https://your-app.onrender.com/api/v1/health
```

Expected:
```json
{
  "status": "ok",
  "services": {
    "database": { "status": "ok" },
    "api": { "status": "ok" }
  }
}
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run start:dev` | Start with hot-reload (development) |
| `npm run build` | Compile TypeScript to /dist |
| `npm run start:prod` | Start compiled production build |
| `npm run migration:run` | Apply all pending migrations |
| `npm run migration:revert` | Roll back last migration |
| `npm run migration:generate -- src/database/migrations/Name` | Generate migration from entity changes |
| `npm run seed` | Seed admin users and sample data |

---

## API Modules

| Module | Base Path | Description |
|--------|-----------|-------------|
| Auth | `/auth` | Register, login, refresh, logout |
| Users | `/users` | Profile management |
| Vendors | `/vendors` | Vendor onboarding and management |
| Categories | `/categories` | Product category tree |
| Products | `/products` | Product catalogue |
| Inventory | `/inventory` | Stock management |
| Cart | `/cart` | Shopping cart |
| Orders | `/orders` | Order lifecycle |
| Payments | `/payments` | Paystack + wallet payments |
| Wallet | `/wallet` | Balance and transactions |
| Riders | `/riders` | Rider profiles and status |
| Delivery | `/delivery` | Delivery assignment and tracking |
| Reviews | `/reviews` | Ratings and reviews |
| Notifications | `/notifications` | In-app notifications |
| Promotions | `/promotions/coupons` | Discount coupons |
| Analytics | `/analytics` | Sales and revenue reports |
| Health | `/health` | Service health check |

---

## User Roles

| Role | Description |
|------|-------------|
| `customer` | Place orders, review vendors |
| `vendor` | Manage products, view orders |
| `rider` | Accept and complete deliveries |
| `admin` | Approve vendors, assign riders |
| `super_admin` | Full platform access |