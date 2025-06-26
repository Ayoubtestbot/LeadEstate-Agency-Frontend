# LeadEstate Agency Frontend

Complete CRM frontend for real estate agencies with full feature set.

## 🎯 Features

- **Dashboard**: Real-time statistics and overview
- **Leads Management**: Kanban board with drag & drop
- **Properties Management**: Property listings with images
- **Team Management**: User roles and permissions
- **Analytics**: Charts and comprehensive reporting
- **Settings**: Agency configuration and integrations
- **Sidebar Navigation**: Professional left navigation
- **Responsive Design**: Mobile-friendly interface
- **Multi-language**: French/English support

## 🚀 Development

```bash
npm install
npm run dev
```

Runs on http://localhost:5001

## 🏗️ Structure

```
src/
├── components/
│   ├── ui/           # UI components
│   ├── forms/        # Form components
│   ├── charts/       # Chart components
│   ├── kanban/       # Kanban board
│   ├── sidebar/      # Sidebar navigation
│   └── header/       # Header component
├── pages/
│   ├── dashboard/    # Dashboard pages
│   ├── leads/        # Lead management
│   ├── properties/   # Property management
│   ├── team/         # Team management
│   ├── analytics/    # Analytics pages
│   └── settings/     # Settings pages
├── contexts/         # React contexts
├── hooks/           # Custom hooks
└── utils/           # Utilities
```

## 🔧 Environment Variables

```env
VITE_API_URL=https://api-{agency-id}.leadestate.com
VITE_AGENCY_ID=agency-unique-id
```

## 📦 Deployment

- **Platform**: Vercel
- **Domain**: {agency-slug}.leadestate.com
- **Environment**: Multi-tenant (per agency)

## 📋 Next Steps

1. Copy your complete CRM code to src/
2. Configure environment variables
3. Test all features locally
4. Build and deploy to Vercel
