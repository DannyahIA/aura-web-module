# Aura Web Module - Personal Automation Hub

Personal Automation Hub (AutoHub) is a Portuguese-language Next.js web application that provides financial management, home automation control, and personal productivity features.

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

## Working Effectively

### Required Dependencies and Setup
- **Node.js**: Use version 20.19.5 or higher (validated to work)
- **Package Manager**: MUST use pnpm (project uses pnpm-lock.yaml)
  - Install pnpm: `npm install -g pnpm`
  - Verify installation: `pnpm --version` (should show 10.15.1 or higher)

### Bootstrap, Build, and Test the Repository
1. Install dependencies:
   ```bash
   pnpm install
   ```
   - Takes 12 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
   - May show warnings about ignored build scripts (@tailwindcss/oxide, sharp) - this is normal

2. Development server:
   ```bash
   pnpm run dev
   ```
   - Starts in 1.4 seconds
   - Runs on http://localhost:3000
   - Supports hot reload

3. Production build:
   ```bash
   pnpm run build
   ```
   - **CRITICAL ISSUE**: Build FAILS with Google Fonts network error due to firewall restrictions
   - **WORKAROUND**: Temporarily remove Google Fonts import from `app/layout.tsx`:
     - Remove import: `import { Montserrat, Open_Sans } from "next/font/google"`
     - Remove font configurations and variables
     - Change className from `${montserrat.variable} ${openSans.variable}` to just basic classes
   - With workaround: Takes 24 seconds. NEVER CANCEL. Set timeout to 60+ minutes.
   - Without Google Fonts, build produces 10 static pages successfully

4. Production server:
   ```bash
   pnpm run start
   ```
   - Requires successful build first
   - Starts in 351ms
   - Runs on http://localhost:3000

5. Linting:
   ```bash
   pnpm run lint
   ```
   - **FIRST RUN**: Will prompt to install ESLint config (choose "Strict (recommended)")
   - First-time setup takes 5+ minutes. NEVER CANCEL. Set timeout to 10+ minutes.
   - Subsequent runs take 4 seconds
   - **EXPECTED**: Multiple linting errors in existing code - this is normal

## Validation Scenarios

### Manual Testing Requirements
**ALWAYS test these scenarios after making changes:**

1. **Login Flow**:
   - Navigate to http://localhost:3000
   - Use ANY email and password (demo mode)
   - Test credentials: `test@example.com` / `password123`
   - Verify successful login to dashboard

2. **Dashboard Navigation**:
   - Test all sidebar navigation links:
     - Dashboard (/) - Shows financial overview, upcoming bills, home automation, AI suggestions
     - Transações (/transacoes) - Transaction management
     - Finanças (/financas) - Financial analysis with charts and insights
     - Bancos (/bancos) - Bank account management
     - Calendário (/calendario) - Calendar events
     - Automação (/automacao) - Home automation controls
     - Perfil (/perfil) - User profile
   - Verify each page loads without errors

3. **Core Functionality**:
   - Financial widgets show data correctly
   - Home automation controls are interactive
   - Bank account listings display properly
   - Charts and graphs render in Finanças section

### Build Validation
- **ALWAYS** run `pnpm run build` with Google Fonts workaround before final commits
- **ALWAYS** run `pnpm run lint` and address any NEW errors introduced by your changes
- **DO NOT** fix existing linting errors unrelated to your changes

## Key Technical Details

### Technology Stack
- **Framework**: Next.js 15.2.4 with App Router
- **React**: Version 19.1.1
- **TypeScript**: Version 5.9.2
- **Styling**: Tailwind CSS 4.1.12 with shadcn/ui components
- **UI Components**: Radix UI primitives
- **Package Manager**: pnpm 10.15.1

### Project Structure
```
/app/                 # Next.js app directory
  /automacao/         # Home automation page
  /bancos/            # Bank management page  
  /calendario/        # Calendar page
  /financas/          # Financial analysis page
  /perfil/            # Profile page
  /transacoes/        # Transactions page
  layout.tsx          # Root layout with auth providers
  page.tsx            # Dashboard home page
  globals.css         # Global styles
/components/          # Reusable React components
  /auth/              # Authentication components
  /dashboard/         # Dashboard widgets
  /layout/            # Layout components (sidebar, header)
  /ui/                # shadcn/ui base components
/contexts/            # React contexts (auth, layout)
/hooks/               # Custom React hooks
/lib/                 # Utility functions
```

### Known Issues and Workarounds
1. **Google Fonts Network Error**: 
   - Build fails due to firewall blocking fonts.googleapis.com
   - Workaround: Temporarily remove Google Fonts imports during build
   - Alternative: Use local fonts or system fonts

2. **ESLint Configuration**:
   - First lint run requires interactive setup
   - Many existing linting errors (expected)
   - Focus only on NEW errors from your changes

3. **Peer Dependency Warnings**:
   - vaul package has React 19 compatibility warnings
   - These are warnings only and don't affect functionality

## Common Development Tasks

### File Locations
- **Main layout**: `/app/layout.tsx` (contains font imports)
- **Authentication**: `/contexts/auth-context.tsx`
- **Dashboard**: `/components/dashboard/customizable-dashboard.tsx`
- **Sidebar navigation**: `/components/layout/sidebar.tsx`
- **Login page**: `/components/auth/login-page.tsx`

### Quick Commands Reference
```bash
# Install dependencies (12 seconds)
pnpm install

# Start development (1.4 seconds)
pnpm run dev

# Build for production (24 seconds with workaround)
pnpm run build

# Start production server (351ms)
pnpm run start

# Run linting (4 seconds after initial setup)
pnpm run lint
```

### Development Tips
- Use Portuguese language for UI text (application is in Portuguese)
- Test authentication flow with any credentials
- Verify responsive design on different screen sizes
- Check console for warnings during development
- Hot reload works reliably in development mode

### Critical Reminders
- **NEVER CANCEL** long-running commands - builds may take several minutes
- **ALWAYS** use appropriate timeouts (60+ minutes for builds, 10+ minutes for lint setup)
- **ALWAYS** test login and navigation after UI changes
- **ALWAYS** validate financial data displays correctly
- **NEVER** commit temporary Google Fonts workarounds to production code