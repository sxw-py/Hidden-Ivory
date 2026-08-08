# Hidden Ivory

A premium, bespoke e-commerce platform built for a luxury streetwear brand. This full-stack web application delivers a seamless, high-end shopping experience, from product discovery to secure checkout.

## Key Features

*   **Luxury E-Commerce Experience:** A highly responsive, meticulously designed frontend featuring sleek micro-animations, a premium dark-mode aesthetic, and seamless cart state management.
*   **Custom Admin Dashboard:** A secure, role-based admin panel allowing store owners to:
    *   Manage inventory dynamically (Create, Update, Delete products).
    *   Upload and manage product imagery directly to cloud storage.
    *   Track and fulfill customer orders efficiently.
    *   Dynamically update site assets (like the Hero image) without code deployments.
*   **Secure Payment Gateway Integration:** Fully integrated with the **Yoco API** for secure, PCI-compliant payment processing.
*   **Automated Webhooks & Email Receipts:** Utilizing serverless edge functions to listen for Yoco payment webhooks, automatically update database order statuses, and trigger beautifully formatted email receipts via **Resend**.
*   **Authentication & Security:** Robust user authentication (email/password & Google OAuth) with Row Level Security (RLS) ensuring that customer data is strictly protected.

## Tech Stack

*   **Frontend:** React, TypeScript, Vite
*   **Backend & Database:** Supabase (PostgreSQL, Edge Functions, Storage)
*   **Payment Processing:** Yoco API
*   **Email Infrastructure:** Resend API
*   **Styling:** Tailwind CSS

## Some of the underlying architecture

*   **Edge Functions:** Serverless edge functions handle sensitive operations like initiating payment sessions and processing webhooks, ensuring API keys are never exposed to the client.
*   **Real-time Form Validation:** Asynchronous, real-time validation during checkout prevents erroneous submissions and enhances user experience.
*   **Optimized Asset Delivery:** All images (including user avatars and product photos) are served from optimized cloud buckets, with built-in robust fallbacks for missing assets.

---

