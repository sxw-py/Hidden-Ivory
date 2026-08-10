# Hidden Ivory 

Welcome to the repo for **Hidden Ivory**—a premium, luxury streetwear brand built from the ground up.

## How it's hosted

- **Frontend Hosting:** Vercel (for that instant, edge-network speed and automated CI/CD).
- **Backend & Database:** Supabase (PostgreSQL database, Serverless Edge Functions, and Storage).
- **DNS & Domain:** Hostinger.
- **Frontend Framework:** Vite + React (TypeScript) with pure, hand-written CSS for absolute design freedom.

##  Key Features & Integrations

### 1. The Modular Admin Panel
I built a completely custom, highly modular Admin Panel from scratch. Instead of relying on a clunky third-party CMS, I manage the entire store directly from a secure route on the site. I can instantly add products, upload high-res images (which stream securely to Supabase Storage buckets), toggle inventory sizes. It's built to be completely dynamic—if I want to drop a new collection tomorrow, the admin panel handles it flawlessly without me having to touch a single line of code.

### 2. Yoco Payment Webhooks
Payments are fully integrated using **Yoco's API**. But I didn't just plug in a checkout button; I built a robust, serverless backend. When a customer pays, Yoco fires a secure Webhook to my Supabase Edge Function in the background. The server verifies the cryptographic signature (to prevent spoofing), updates the PostgreSQL database, and processes the order entirely behind the scenes. 

### 3. Automated Resend Emails
The moment a payment clears, the backend automatically triggers **Resend's API** to fire off a custom-designed, fully responsive HTML receipt directly to the customer's inbox. 

### 4. Seamless Google Auth
I integrated **Google OAuth** (via Google Cloud & Supabase Auth) so users can sign in with one tap. The system is also designed to handle full guest checkouts seamlessly, tying their guest email to their order history automatically.

---
Live Link: https://www.hiddenivory.com/
