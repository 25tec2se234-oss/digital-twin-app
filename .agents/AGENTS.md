# Project Infrastructure Rules

- **Hosting & Operations**: This website follows a decoupled architecture:
  - **Frontend**: Hosted on **Vercel**. All static files are in the `public` directory. A `vercel.json` rewrite configuration proxies `/api` traffic to the backend.
  - **Backend**: Hosted on **Render**. The Node.js Express API server runs here.
  - **Database**: Hosted on **Neon PostgreSQL**.
  - **Storage**: Hosted on **Cloudflare R2** (S3-compatible).
  - **Email**: Delivered via **Brevo API**.
  - **Payments**: Handled by **Razorpay**.
  - **Monitoring**: Handled by **Sentry**.
- Always assume deployments and server management follow this split architecture.
