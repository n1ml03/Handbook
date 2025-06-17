# DOAX Venus Vacation Handbook - Frontend

A modern React application for managing and viewing DOAX Venus Vacation game data, built with TypeScript, Vite, and Tailwind CSS.

## 🚀 Features

- **Modern React Architecture**: Built with React 19, TypeScript, and modern hooks
- **Component Library**: Comprehensive UI components using Radix UI primitives
- **Rich Text Editor**: TipTap editor for content creation and editing
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Performance Optimized**: Code splitting, lazy loading, and bundle optimization
- **Accessibility**: WCAG compliant with proper ARIA attributes
- **Theme Support**: Dark/light mode with system preference detection

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (Radix UI based)
│   ├── layout/         # Layout components (Header, Footer, etc.)
│   └── features/       # Feature-specific components
├── pages/              # Page components for routing
├── hooks/              # Custom React hooks
├── services/           # API services and external integrations
├── contexts/           # React Context providers
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── assets/             # Static assets (images, icons)
└── styles/             # CSS and styling files
```

## 🛠 Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Router**: React Router DOM 7
- **State Management**: Zustand + React Context
- **Rich Text**: TipTap Editor
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm, yarn, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd handbook/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   VITE_API_URL=http://localhost:3001/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   bun dev
   ```

   The application will be available at `http://localhost:3000`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

## 🏗 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 🎨 Customization

### Theming

The application supports light/dark themes. Theme preferences are stored in localStorage and sync across browser tabs.

### Adding New Components

1. Create component in appropriate directory under `src/components/`
2. Export from `src/components/index.ts` if reusable
3. Add proper TypeScript types
4. Include accessibility features

### API Integration

API services are located in `src/services/api.ts`. All API calls go through a centralized service layer with error handling and type safety.

## 🔧 Configuration

### Vite Configuration

The `vite.config.ts` includes:
- Path aliases (`@/*` -> `./src/*`)
- Bundle optimization
- Development proxy for API calls
- TypeScript support

### TypeScript Configuration

- Strict mode enabled
- Path mapping for clean imports
- Modern ES features support

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for all new code
3. Ensure components are accessible
4. Add proper error handling
5. Test your changes thoroughly

## 📦 Dependencies

### Core Dependencies
- React 19 with TypeScript
- React Router for navigation
- Radix UI for accessible components
- TailwindCSS for styling
- TipTap for rich text editing

### Development Dependencies
- Vite for building and development
- ESLint and Prettier for code quality
- TypeScript for type safety

## 🔄 Backend Integration

The frontend communicates with the backend API through:
- RESTful API calls
- Centralized error handling
- Type-safe request/response models
- Environment-based configuration

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is private and confidential. 