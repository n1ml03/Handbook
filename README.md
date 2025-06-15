# Handbook

A comprehensive web application for managing Dead or Alive Xtreme Venus Vacation game data including girls, swimsuits, accessories, and game statistics.

## Features

- 📊 **Character Management**: Track girls, their stats, levels, and equipment
- 👙 **Swimsuit Database**: Comprehensive swimsuit collection with rarities and stats
- 🎯 **Parameter Calculator**: Calculate optimal builds and stat combinations
- 💎 **Venus Board Tracker**: Track and manage Venus Board progress
- 📝 **Advanced Text Editor**: Rich text editing with TipTap for documentation
- 🌐 **Multi-language Support**: English, Japanese, Chinese support
- 🎨 **Modern UI**: Beautiful, responsive design with dark/light theme
- 💾 **Database Support**: Both browser storage and PostgreSQL support

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) runtime
- [PostgreSQL](https://www.postgresql.org/) (optional, for database features)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd doaxvv-handbook
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Set up environment (optional)**
   ```bash
   cp env.example .env
   # Edit .env file if you want to use PostgreSQL
   ```

4. **Start the application**
   ```bash
   # Start the web server
   bun run start
   
   # Or for development
   bun run dev
   ```

The application will be available at `http://localhost:5173`

## Database Options

### Browser Storage (Default)
- No setup required
- Data stored in browser's IndexedDB
- Perfect for personal use
- Data persists across browser sessions

### MySQL (Optional)
- Set `USE_MYSQL=true` in your `.env` file
- Requires local MySQL installation
- Better for production or shared environments
- See `README-LOCAL-SETUP.md` for detailed setup instructions

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run preview` - Preview production build
- `bun run start` - Start web server
- `bun run db:migrate` - Run database migrations


## Text Editor Features

The documentation platform includes a powerful text editor built with TipTap:

- **Rich Text Formatting**: Bold, italic, strikethrough, highlighting
- **Advanced Typography**: Headings, lists, blockquotes, code blocks
- **Media Support**: Images, tables, links with auto-formatting
- **Interactive Features**: Bubble menu for quick formatting
- **Code Highlighting**: Syntax highlighting for technical documentation
- **Extensible Architecture**: 25+ TipTap extensions available

## Technologies Used

- **Frontend**: React 18, TypeScript, Vite
- **UI**: Tailwind CSS, Radix UI, Framer Motion
- **Text Editor**: TipTap with 25+ extensions for rich content editing
- **Database**: PostgreSQL (optional), IndexedDB (browser storage)
- **State**: Zustand
- **Internationalization**: i18next
- **Build**: Vite, Bun