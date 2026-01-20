# POS Microservices Monorepo

This project is a monorepo for a Point of Sale (POS) system, built with Next.js and TurboRepo.

## Structure
- **apps/**
  - `menu`
  - `sales`
  - `credit`
  - `inventory`
  - `payroll`
  - `providers`
- **packages/**
  - `@repo/database`: Shared database configuration (Supabase)
  - `tsconfig`: Shared TypeScript configuration
  - `ui`: Shared UI components (if applicable)

## Getting Started

### Prerequisites
- Node.js
- npm (verified with v11.6.2)

### Installation
```bash
npm install
```

### Building
```bash
npm run build
```

### Running (Development)
To start all microservices in parallel:
```bash
npm run dev
```

## Troubleshooting

### Windows PowerShell "UnauthorizedAccess" Error
If you see an error like `running scripts is disabled on this system` when running `npm` commands in PowerShell:

**Option 1: Use Command Prompt (cmd)**
Run the command via `cmd`:
```bash
cmd /c "npm run dev"
```

**Option 2: Change Execution Policy**
Allow scripts to run in your current user session:
1. Open PowerShell.
2. Run:
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
   ```
