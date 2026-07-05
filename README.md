# 🏫 Premium Islamic School Platform

A state-of-the-art educational platform designed to deliver a highly cinematic public frontend for visitors and an ultra-premium, clean enterprise CMS for administrators. Built with Next.js 15, Tailwind CSS, and GSAP.

## ✨ Key Features

### 🎬 Cinematic Public Frontend
- **High-End Visuals:** Dark cinematic aesthetic with warm golden accents and deep Islamic greens, designed for an Awwwards-quality experience.
- **Micro-Interactions:** Buttery-smooth scroll animations, dynamic parallax effects, and premium hover states powered by GSAP.
- **Performance Optimized:** Server-side rendering (SSR) and optimized asset delivery via Next.js App Router.

### 💼 Ultra-Premium Studio CMS (Internal Tool)
- **Role-Based Access Control (RBAC):** Secure middleware-protected admin area with `Publisher` (Admin) and `Writer` roles. Writers can draft content but are systematically locked from publishing or deleting.
- **Clean Enterprise Design:** A stark contrast to the frontend—the CMS utilizes a crisp `Ghost White` canvas with sharp `Slate` typography, inspired by high-end SaaS dashboards (like Stripe and Linear).
- **Notion-Style Editor:** Distraction-free, markdown-supported writing experience with real-time metadata binding.

## 🚀 Tech Stack

- **Framework:** [Next.js 15+](https://nextjs.org/) (App Router, Server Components, API Routes)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Custom Design System with strictly enforced typography and layout discipline)
- **Animation:** [GSAP](https://gsap.com/) (ScrollTrigger for high-performance scroll storytelling)
- **Language:** TypeScript
- **Auth:** Custom Cookie-Based Secure Authentication (Edge Middleware)

## 📦 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rakizu/website.git
   cd website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Public Website: `http://localhost:3000`
   - Admin Studio: `http://localhost:3000/admin` (Credentials: `admin`/`123` or `writer`/`123`)

## 🎨 Design Philosophy

This project strictly adheres to a dual-philosophy design system:
- **The "Stage" (Frontend):** Emotional, cinematic, and dramatic. Uses `charcoal-ink`, `accent-gold`, and deep `primary` greens. High motion intensity.
- **The "Backstage" (Admin):** Utilitarian, highly legible, and incredibly clean. Uses `Ghost White` (`#F8F8FF`) and `Slate` color scales. Tactile micro-interactions and high data density.

---
*Built with passion for excellence in Islamic Education.*
