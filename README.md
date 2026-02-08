# Portfolio Generator - AI-Powered Resume-to-Portfolio Platform

A production-ready fullstack web application that automatically generates professional portfolio websites from developers' digital footprints (GitHub, LinkedIn, Resume). Built with Next.js 14, TypeScript, Supabase, and Google Gemini AI.

## 🚀 Features

- **AI-Powered Generation**: Uses Google Gemini 1.5 Pro to create compelling project narratives and career stories
- **Multi-Source Integration**: Connect GitHub, LinkedIn, and upload resumes for comprehensive data
- **Smart Dashboard**: Analytics, progress tracking, and portfolio management
- **Multiple Templates**: Modern, Minimal, Creative, Professional, and Startup themes
- **ATS Optimization**: Built-in ATS scoring and optimization suggestions
- **Real-time Preview**: Live portfolio preview with instant updates
- **Analytics Tracking**: Visitor analytics and engagement metrics
- **Responsive Design**: Mobile-first design with Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **Next.js 14+** with App Router and TypeScript
- **Tailwind CSS** for styling
- **Shadcn/ui** for components
- **Framer Motion** for animations
- **Recharts** for data visualization
- **React Hook Form + Zod** for validation
- **Zustand** for state management

### Backend
- **Supabase** (PostgreSQL database)
- **Supabase Auth** (GitHub OAuth, Email/Password)
- **Supabase Storage** (file uploads)
- **Supabase Edge Functions** (serverless processing)
- **Supabase Realtime** (live updates)

### AI/ML
- **Google Gemini 1.5 Pro** (primary AI)
- **Google Gemini 1.5 Flash** (quick operations)
- **Gemini grounding** for fact verification

### External APIs
- **GitHub REST API**
- **GitHub GraphQL API** (for optimization)
- **PDF parsing libraries** (pdf-parse, pdf.js)

### Deployment
- **Vercel** (main application)
- **Vercel Edge Functions**
- **Custom domain support**

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Gemini API key
- GitHub OAuth app

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd resume-to-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env-config.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Google Gemini AI Configuration
   GEMINI_API_KEY=your_gemini_api_key

   # GitHub OAuth Configuration
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret

   # Next.js Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_PORTFOLIO_DOMAIN=yourportfolio.vercel.app
   ```

4. **Set up Supabase database**
   - Create a new Supabase project
   - Run the migration files in `supabase/migrations/`
   - Set up GitHub OAuth in Supabase Auth settings

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** with your browser

## 📁 Project Structure

```
/app
  /(auth)              # Authentication pages
  /(dashboard)         # Dashboard pages
  /(portfolio)         # Public portfolio pages
  /api                 # API routes
  page.tsx            # Landing page

/components
  /dashboard           # Dashboard components
  /portfolio           # Portfolio templates
  /ui                  # Reusable UI components
  /forms               # Form components
  /shared              # Shared components

/lib
  /supabase           # Supabase client configuration
  /ai                 # AI integration (Gemini)
  /github             # GitHub API integration
  /parsers            # Resume/LinkedIn parsers
  /generators         # Portfolio generation logic
  /utils              # Utility functions
  /hooks              # Custom React hooks
  /store              # State management
  /constants          # Constants and enums
  /types              # TypeScript types

/supabase
  /migrations         # Database migrations
  /functions          # Edge functions

/public
  /templates          # Template assets
  /icons              # Icon assets
  /images             # Image assets
```

## 🔧 Key Features Implementation

### AI Generation System
- **Project Narratives**: AI analyzes GitHub repos and creates compelling stories
- **Career Summaries**: Generates professional "About Me" sections
- **Code Quality Analysis**: Evaluates code patterns and best practices
- **ATS Optimization**: Analyzes and optimizes for applicant tracking systems

### GitHub Integration
- **Smart Caching**: Reduces API calls with intelligent caching
- **GraphQL Optimization**: Efficient data fetching for large repositories
- **Contribution Analysis**: Analyzes coding patterns and consistency
- **Repository Insights**: Extracts key metrics and achievements

### Portfolio Generation
- **Multi-Source Merging**: Combines data from GitHub, LinkedIn, and resumes
- **Template System**: Multiple responsive templates with customization
- **Real-time Preview**: Live preview of portfolio changes
- **SEO Optimization**: Automatic meta tags and structured data

## 🎨 Templates

### Modern Template
- Clean, contemporary design
- Bold typography and gradients
- Single-page layout with smooth scrolling

### Minimal Template
- Minimalist design focusing on content
- Black and white color scheme
- Typography-first approach

### Creative Template
- Vibrant colors and animations
- Multi-page layout
- Interactive elements

### Professional Template
- Corporate-friendly design
- Subtle styling and colors
- Traditional layout

### Startup Template
- Modern startup aesthetic
- Bold colors and typography
- Dynamic sections

## 📊 Analytics & Insights

- **Visitor Tracking**: Page views, sessions, and user behavior
- **Engagement Metrics**: Click tracking and time on page
- **Geographic Data**: Visitor location and demographics
- **Referral Sources**: Traffic sources and channels
- **Performance Analytics**: Portfolio performance metrics

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Custom Domain Setup
1. Add custom domain in Vercel dashboard
2. Configure DNS records
3. Set up SSL certificates
4. Update portfolio subdomain settings

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Contact the development team

---

Built with ❤️ using Next.js, Supabase, and Google Gemini AI
