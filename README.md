# MinddShopp - Premium Fashion & Beauty Marketplace

A luxury e-commerce platform for premium footwear, clothing, jewelry, and beauty products.

## Features

- Responsive design for all device sizes
- Dark mode support
- Product catalog with filtering and search
- User authentication and account management
- Shopping cart and wishlist functionality
- Checkout process
- Admin dashboard for product and order management
- Blog with categories and search
- Specialty stores (Bridal Boutique, Festive Store)
- SEO optimized with structured data
- Accessibility compliant

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth, Database, Storage)
- React Router
- Zustand (State Management)
- Framer Motion (Animations)
- Lucide React (Icons)
- React Hook Form

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

The optimized production build will be available in the `dist` directory.

### Deployment

The project is configured for deployment on Netlify. The `netlify.toml` file contains the necessary configuration.

#### Manual Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` directory to your hosting provider

#### Netlify Deployment

1. Connect your repository to Netlify
2. Set the build command to `npm run build`
3. Set the publish directory to `dist`
4. Add the required environment variables

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── admin/        # Admin dashboard components
│   ├── common/       # Shared components
│   ├── home/         # Homepage components
│   ├── layout/       # Layout components
│   ├── shop/         # Shop components
│   └── theme/        # Theme components
├── hooks/            # Custom React hooks
├── lib/              # Library configurations
├── pages/            # Page components
│   ├── account/      # User account pages
│   ├── admin/        # Admin pages
│   ├── auth/         # Authentication pages
│   └── specialty/    # Specialty store pages
├── scripts/          # Utility scripts
├── stores/           # Zustand stores
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Performance Optimizations

- Code splitting with React.lazy and Suspense
- Image optimization with lazy loading
- Bundle optimization with Vite
- Tree shaking to remove unused code
- Minification of JavaScript and CSS
- Efficient state management with Zustand

## Accessibility

This project follows WCAG 2.1 guidelines for accessibility:

- Semantic HTML
- ARIA attributes where necessary
- Keyboard navigation support
- Focus management
- Color contrast compliance
- Screen reader friendly

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is proprietary and confidential.

## Acknowledgements

- [Pexels](https://www.pexels.com/) for stock photos
- [Lucide Icons](https://lucide.dev/) for icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Supabase](https://supabase.io/) for backend services