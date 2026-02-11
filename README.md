# Data Pipeline Configuration Web Application

A production-ready wizard interface for configuring data pipelines, built with Next.js, TypeScript, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Component Library**: shadcn/ui
- **Styling**: Tailwind CSS v4
- **State Management**: Zustand (Global Wizard State)
- **Data Fetching**: TanStack Query (React Query) v5
- **Forms**: React Hook Form
- **HTTP Client**: Axios

## Features

- **5-Step Configuration Wizard**:
  1. **Datasources**: Searchable grid of available datasources.
  2. **Credentials**: Selection of authenticated accounts for the chosen datasource.
  3. **Reports**: Multi-selection of available default report templates.
  4. **Levels**: Dynamic, hierarchical dropdowns for report level configuration.
  5. **Review**: Summary of all selections before submission.
- **Robust Error Handling**: Toast notifications and empty states for API failures.
- **Loading States**: Skeleton loaders for smooth UX.
- **Responsive Design**: Mobile-friendly layout.

## Setup & Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Configuration**:
   The project comes with a `.env.local` file pre-configured with the staging API details.
   ```
   NEXT_PUBLIC_API_BASE_URL=https://api-stage.datachannel.co
   ...
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

4. **Build for Production**:
   ```bash
   npm run build
   npm start
   ```

## Architecture

- **`lib/api-client.ts`**: Centralized Axios instance with interceptors and hardcoded headers (as per requirements).
- **`lib/hooks/`**: Custom React Query hooks for each API endpoint (`useDatasources`, `useCredentials`, etc.).
- **`store/pipeline-store.ts`**: Zustand store managing the entire wizard state (current step, selections, hierarchy).
- **`components/wizard/`**: Individual step components (`step-datasources.tsx`, etc.) and the main `wizard-container.tsx`.
- **`components/ui/`**: Reusable UI components from shadcn/ui.

## Testing

Run the build command to verify type safety and compilation:
```bash
npm run build
```
