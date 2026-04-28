# Bold Logistics Frontend MVP

**Bold Technology Solutions Inc. — Logistics Automation Platform**

Bold Logistics Frontend MVP is a professional web interface for a logistics automation platform designed for small and mid-sized transportation businesses. The application provides a clean dashboard experience for managing customers, orders, dispatch operations, drivers, vehicles, documents, notifications, and operational reports.

This frontend is intended to demonstrate the user-facing experience of a secure, scalable logistics automation platform that can support transportation workflow modernization and small-business digital infrastructure.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Core Features](#core-features)
- [Technology Stack](#technology-stack)
- [Application Pages](#application-pages)
- [Backend API Integration](#backend-api-integration)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Available Scripts](#available-scripts)
- [Recommended Project Structure](#recommended-project-structure)
- [Demo Data](#demo-data)
- [Production Readiness Roadmap](#production-readiness-roadmap)
- [Business Purpose](#business-purpose)
- [Company](#company)

---

## Project Overview

The platform is built to help transportation and logistics businesses reduce manual work, improve customer communication, organize transportation documents, and gain better visibility into daily operations.

Small and mid-sized transportation companies often rely on phone calls, text messages, spreadsheets, email threads, and disconnected tools to manage business workflows. This frontend demonstrates how those workflows can be organized into a centralized digital platform.

The interface supports:

- Operational dashboard visibility
- Customer records
- Transportation order management
- Dispatch workflow coordination
- Driver and vehicle records
- Document tracking
- Notification and communication records
- Reporting and analytics views

---

## Core Features

### Dashboard

The dashboard provides a high-level overview of business activity, including active orders, pending dispatches, document activity, customer updates, and operational metrics.

### Customer Management

Users can view and manage customer records, including company name, contact name, email address, phone number, and business address.

### Order Management

Users can create and track transportation orders with pickup location, delivery location, customer assignment, order status, and created date.

### Dispatch Management

The dispatch module connects transportation orders with drivers and vehicles. It supports operational coordination and status tracking for scheduled, in-progress, delivered, or cancelled dispatches.

### Driver and Vehicle Records

The platform includes driver and vehicle management screens to support better dispatch planning and operational recordkeeping.

### Document Tracking

The document module is designed to organize transportation-related records such as rate confirmations, bills of lading, proof of delivery, insurance documents, registration documents, and other business files.

### Notifications

The notification module supports tracking of customer, broker, driver, or internal communication records.

### Reports

The reporting section is intended to provide operational insight into order volume, dispatch status, document tracking, customer communication, and business performance.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React / TypeScript or JavaScript |
| Styling | CSS / Tailwind CSS or equivalent UI styling |
| API Communication | REST API integration |
| Backend Target | Spring Boot REST API |
| Local Development | Node.js and npm |
| Build Tool | Vite or equivalent frontend build system |
| Deployment Target | Static hosting, cloud hosting, or backend-integrated deployment |

> The frontend is designed to connect with a Spring Boot backend running on `http://localhost:8080`.

---

## Application Pages

The frontend may include the following pages or views:

| Page | Purpose |
|---|---|
| Login | User authentication and session entry |
| Dashboard | Business overview and KPI metrics |
| Customers | Customer records and contact management |
| Orders | Transportation order creation and tracking |
| Dispatch | Driver, vehicle, and order assignment |
| Drivers | Driver records and status |
| Vehicles | Vehicle records and availability |
| Documents | Transportation document tracking |
| Notifications | Communication and alert records |
| Reports | Operational metrics and business insights |

---

## Backend API Integration

The frontend is designed to integrate with the Bold Logistics Spring Boot backend.

Default backend URL:

```text
http://localhost:8080
```

Main API endpoints:

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Demo login |
| GET | `/api/dashboard/summary` | Dashboard summary metrics |
| GET | `/api/customers` | Get all customers |
| POST | `/api/customers` | Create a customer |
| GET | `/api/orders` | Get all orders |
| POST | `/api/orders` | Create an order |
| PATCH | `/api/orders/{id}/status?status=DELIVERED` | Update order status |
| GET | `/api/dispatches` | Get dispatch records |
| POST | `/api/dispatches` | Create a dispatch record |
| PATCH | `/api/dispatches/{id}/status?status=IN_PROGRESS` | Update dispatch status |
| GET | `/api/drivers` | Get all drivers |
| POST | `/api/drivers` | Create a driver |
| GET | `/api/vehicles` | Get all vehicles |
| POST | `/api/vehicles` | Create a vehicle |
| GET | `/api/documents` | Get all documents |
| POST | `/api/documents` | Create a document record |
| GET | `/api/notifications` | Get all notifications |

---

## Getting Started

### Prerequisites

Install the following tools before running the frontend:

- Node.js 18 or higher
- npm or yarn
- Running backend API service

Check versions:

```bash
node -v
npm -v
```

### Install Dependencies

From the frontend project directory, run:

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

The frontend will usually be available at:

```text
http://localhost:5173
```

If your project uses another port, check the terminal output after running the development server.

---

## Environment Configuration

Create a `.env` file in the frontend project root if environment variables are required.

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Recommended API client configuration:

```ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
```

---

## Available Scripts

Common frontend scripts:

```bash
npm run dev
```

Runs the local development server.

```bash
npm run build
```

Builds the application for production.

```bash
npm run preview
```

Previews the production build locally.

```bash
npm run lint
```

Runs code quality checks if linting is configured.

---

## Recommended Project Structure

A clean frontend structure may look like this:

```text
src
 ├── api
 │   └── apiClient.ts
 ├── components
 │   ├── layout
 │   ├── dashboard
 │   ├── tables
 │   └── forms
 ├── pages
 │   ├── Dashboard.tsx
 │   ├── Customers.tsx
 │   ├── Orders.tsx
 │   ├── Dispatches.tsx
 │   ├── Drivers.tsx
 │   ├── Vehicles.tsx
 │   ├── Documents.tsx
 │   └── Reports.tsx
 ├── types
 │   └── index.ts
 ├── utils
 ├── App.tsx
 └── main.tsx
```

---

## Demo Data

The platform may use demo data for early testing and demonstration.

Example demo customers:

- HTL Auto Transport Inc.
- JKU Spa Nails LLC d/b/a Hi5 Nails & Spa
- Smooth Nail Lounge Inc. d/b/a Smooth Nail Lounge

Example logistics records:

- Chicago, IL to Dallas, TX
- Elgin, IL to Atlanta, GA
- Vernon Hills, IL to Indianapolis, IN

---

## Production Readiness Roadmap

For a production-ready version, the following upgrades are recommended:

- Implement real authentication with JWT or OAuth 2.0
- Add role-based access control
- Add frontend route protection
- Add error boundaries
- Add form validation
- Add loading and empty states for all pages
- Add audit log views
- Add real file upload support
- Add cloud document storage integration
- Add notification integration with email or SMS
- Add user profile and organization settings
- Add responsive mobile optimization
- Add automated tests
- Add CI/CD deployment workflow
- Add production environment configuration

---

## Business Purpose

This frontend supports the proposed development of a logistics automation and small-business digital infrastructure platform by Bold Technology Solutions Inc.

The MVP demonstrates how the platform can help businesses:

- Reduce manual dispatch tracking
- Improve customer and broker communication
- Organize transportation documents
- Centralize driver and vehicle records
- Improve operational visibility
- Support recurring digital platform services
- Create a foundation for future reusable software modules

---

## Company

**Bold Technology Solutions Inc.**  
Deerfield, Illinois  
Founder: Oyunbold Ganbold

---

## Status

This project is an early-stage MVP and is intended for demonstration, technical validation, and continued platform development.
