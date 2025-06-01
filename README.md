# MinddShopp - Premium Fashion & Beauty Marketplace

A luxury e-commerce platform for premium footwear, clothing, jewelry, and beauty products.

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment variables:
   ```bash
   cp .env.example .env
   ```
4. Update the `.env` file with your Supabase credentials:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

### Development

Start the development server:

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Deployment

The project is configured for deployment on Netlify. The `netlify.toml` file contains the necessary configuration.

## Features

- User authentication
- Product browsing and filtering
- Shopping cart
- Wishlist
- Checkout process
- Order management
- Admin dashboard
- Blog
- Coupons and discounts
- Responsive design

## Technology Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- React Router
- Zustand
- Framer Motion
- Lucide React (Icons)