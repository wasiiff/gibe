# Gibe - AI-Powered Game Generation Platform

## 🎮 Overview

Gibe is a full-stack platform where users can generate simple browser-based games using natural language prompts. The system refines user prompts and uses AI to generate working games with HTML, CSS, and JavaScript, featuring live preview and AI-powered debugging support.

---

## ✨ Core Features

### 1. **Prompt-to-Game Generation**
- Natural language prompt input
- Two-stage AI pipeline:
  1. **Prompt Refinement**: Structures the prompt into a clear game brief (title, description, gameplay loop, visual style, constraints)
  2. **Game Generation**: Generates complete HTML/CSS/JS code bundle
- Model: LongCat Flash Chat via Vercel AI Gateway

### 2. **Live Preview Environment**
- Sandboxed iframe execution (`sandbox="allow-scripts allow-pointer-lock"`)
- Real-time preview with auto-refresh on code changes
- Content Security Policy (CSP) enforcement
- Runtime error capture via `postMessage`

### 3. **AI-Powered Debugging Loop**
- Automatic runtime error detection from sandbox
- Clear error display in "Fault Trace" console
- **"Fix with AI" button**: Sends error + code to AI for automated repair
- Iterative repair loop until functional

### 4. **Code Editor**
- Monaco Editor integration (same engine as VS Code)
- Custom "gibe-night" theme with neon accents
- HTML, CSS, and JavaScript tabs
- Live sync with preview (changes reflect immediately)
- Options: word wrap, smooth scrolling, rounded selection

### 5. **Game Publishing System**
- **Save Private**: Store as private draft in dashboard
- **Publish Public**: Make publicly accessible with shareable link
- Public games include:
  - Unique slug-based URL (`/play/[slug]`)
  - Playable by anyone
  - Creator attribution and metadata
  - Remix capability

### 6. **Version History**
- Save manual versions of your game
- Restore any previous version
- Track changes over time
- Up to 20 versions retained per game

### 7. **Remix/Clone Games**
- Clone any public game to your studio
- Modify and iterate on others' creations
- Give credit to original creators

### 8. **Game Deletion**
- Delete your own games with confirmation
- Cascade deletion to versions and related data
- Immediate dashboard refresh

### 9. **User Authentication**
- Better Auth with Next.js
- Google Sign-In (OAuth 2.0)
- Session management with cookies
- Protected routes (dashboard, studio)

### 10. **Rate Limiting**
- AI generation: 5 requests per 10 minutes per IP
- AI repair: 10 requests per 10 minutes per IP
- Headers included in responses (`X-RateLimit-*`)

---

## 🏗️ Tech Stack

### Frontend
- **Next.js 16.2.2** (App Router, React Compiler enabled)
- **React 19.2.4**
- **Tailwind CSS 4** (gaming-style UI)
- **Monaco Editor** (@monaco-editor/react v4.7.0)
- **Lucide React** (icons)
- **Orbitron + Space Grotesk + Geist Mono** fonts

### Backend
- **Next.js API Routes** (Node.js runtime)
- **Server Actions** for client-server communication
- **Zod** for schema validation

### Database
- **PostgreSQL** via Neon (serverless)
- **Prisma ORM** v7.6.0
- **Neon Adapter** (@prisma/adapter-neon)

### AI Integration
- **Vercel AI SDK** v6.0.149 (`ai` package)
- **Vercel AI Gateway**
- **Model**: LongCat Flash Chat (`meituan/longcat-flash-chat`)

### Authentication
- **Better Auth** v1.6.0
- **Prisma Adapter** for Better Auth
- **Google OAuth** (conditional on env vars)

---

## 📁 Project Structure

```
D:\Projects\gibe\
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/[...all]/       # Better Auth handler
│   │   ├── ai/
│   │   │   ├── generate/        # POST: Generate game from prompt
│   │   │   └── fix/             # POST: Repair game with AI
│   │   ├── games/
│   │   │   ├── route.ts         # POST: Create game
│   │   │   ├── [gameId]/        # PATCH/DELETE: Update/delete game
│   │   │   ├── remix/           # POST: Remix/cline public game
│   │   │   └── versions/        # GET/POST/PATCH: Version history
│   ├── dashboard/                # User dashboard (auth required)
│   ├── play/[slug]/             # Public game play page
│   ├── sign-in/                  # Sign-in page
│   ├── studio/
│   │   ├── new/                  # New game studio
│   │   └── [gameId]/            # Edit existing game
│   ├── layout.tsx                # Root layout with fonts
│   ├── page.tsx                  # Landing page + arcade
│   ├── error.tsx                 # Global error boundary
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Tailwind + custom styles
├── components/
│   ├── game-studio/
│   │   ├── studio-shell.tsx     # Main studio orchestrator
│   │   ├── code-editor.tsx      # Monaco Editor wrapper
│   │   ├── game-preview.tsx     # Sandboxed iframe preview
│   │   ├── version-history.tsx  # Version tracking panel
│   │   └── studio-*.tsx         # Loading/error boundaries
│   ├── game/
│   │   ├── game-card.tsx        # Game display card
│   │   ├── share-link-button.tsx
│   │   ├── remix-button.tsx     # Remix/cline button
│   │   └── delete-game-button.tsx
│   ├── auth/
│   │   └── google-sign-in-panel.tsx
│   ├── navigation/
│   │   ├── site-header.tsx
│   │   └── auth-status.tsx
│   ├── brand/
│   │   ├── gibe-mark.tsx
│   │   └── pipeline-graphic.tsx
│   └── ui/
│       ├── button.tsx
│       ├── panel.tsx
│       ├── badge.tsx
│       └── section-heading.tsx
├── lib/
│   ├── ai.ts                     # AI prompt refinement & generation
│   ├── auth.ts                   # Better Auth configuration
│   ├── db.ts                     # Prisma client setup
│   ├── games.ts                  # Game CRUD operations
│   ├── session.ts                # Session helpers
│   ├── env.ts                    # Environment variable access
│   ├── preview-document.ts       # HTML document builder
│   ├── slug.ts                   # Slug generation utilities
│   ├── rate-limit.ts             # Rate limiting middleware
│   ├── starter-game.ts           # Starter template
│   ├── types.ts                  # TypeScript types
│   └── utils.ts                  # Utility functions
├── prisma/
│   └── schema.prisma             # Database schema
└── package.json
```

---

## 🗄️ Database Schema

### Models

#### User
- Core user profile from Better Auth
- Relations: games, sessions, accounts

#### Game
- `id`, `userId`, `slug` (unique)
- `title`, `description`, `prompt`, `refinedPrompt`
- `htmlCode`, `cssCode`, `jsCode` (Text fields)
- `isPublic`, `publishedAt`
- `createdAt`, `updatedAt`
- Indexes: `(userId, updatedAt DESC)`, `(isPublic, publishedAt DESC)`

#### GameVersion (NEW)
- `id`, `gameId`, `title`, `description`
- `htmlCode`, `cssCode`, `jsCode`
- `createdAt`
- Index: `(gameId, createdAt DESC)`

#### Session, Account, Verification
- Better Auth internal models

---

## 🔐 Security Considerations

### Sandboxed Execution
- Iframe with `sandbox="allow-scripts allow-pointer-lock"`
- No `allow-same-origin`, `allow-forms`, or `allow-popups`
- Prevents access to parent DOM and cookies

### Content Security Policy (CSP)
```
default-src 'none'
img-src https: data: blob:
media-src https: data: blob:
style-src 'unsafe-inline'
script-src 'unsafe-inline'
connect-src https:
font-src https: data:
```

### Input Validation
- Zod schemas on all API endpoints
- Max length limits on all text fields
- Prompt length: 8-2000 characters
- Code fields: 8-120,000 characters

### Rate Limiting
- In-memory rate limiter with cleanup
- Per-IP tracking via `x-forwarded-for`
- Generation: 5 requests / 10 minutes
- Repair: 10 requests / 10 minutes

### Authorization
- Session-based auth with Better Auth
- Ownership checks on game updates/deletes
- Cascade delete on user deletion

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL database (Neon recommended)
- Vercel AI Gateway API key
- Google OAuth credentials (optional)

### Environment Variables

Copy `.env.example` to `.env` and fill in:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DB?sslmode=require"
BETTER_AUTH_SECRET="replace-with-a-32-plus-character-secret"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
AI_GATEWAY_API_KEY="your-vercel-ai-gateway-api-key"
AI_GAME_MODEL="meituan/longcat-flash-chat"
```

### Installation

```bash
# Install dependencies
npm install

# Generate Prisma client
npm run prisma:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm run prisma:generate  # Generate Prisma client
npm run prisma:push      # Push schema to DB (dev only)
npm run prisma:migrate   # Create and apply migration
npm run prisma:studio    # Open Prisma Studio GUI
npm run db:push          # Same as prisma:push
npm run db:migrate       # Same as prisma:migrate
```

---

## 🎯 User Flow

### Creating a Game

1. **Sign In** → Google OAuth or create account
2. **Open Studio** → Navigate to `/studio/new`
3. **Enter Prompt** → Describe your game idea (8-2000 chars)
4. **Generate** → AI refines prompt and generates code
5. **Preview** → Play the game in sandboxed iframe
6. **Debug (if needed)** → Click "Fix with AI" on runtime errors
7. **Edit (optional)** → Manually tweak code in Monaco editor
8. **Save** → Save as private draft or publish publicly
9. **Share** → Copy public URL or play from arcade

### Remixing a Game

1. **Browse Arcade** → Visit home page or `/play/[slug]`
2. **Click Remix** → Creates a copy in your studio
3. **Modify** → Edit prompt, regenerate, or manually edit code
4. **Publish** → Save your version publicly

### Version Management

1. **Save Version** → Click "Save Version" in studio
2. **View History** → Expand version history panel
3. **Restore** → Click "Restore" on any previous version
4. **Continue Editing** → Iterate from restored state

---

## 🎨 UI/UX Features

### Design System
- **Theme**: Dark neon (gaming aesthetic)
- **Colors**:
  - Background: `#060816` (deep navy)
  - Foreground: `#F5F7FF` (off-white)
  - Cyan accent: `#4DE2FF`
  - Pink accent: `#FF5FD2`
  - Amber accent: `#FFBE5C`
  - Mint accent: `#7CFFC5`
- **Typography**:
  - Display: Orbitron (uppercase, tracked out)
  - Body: Space Grotesk
  - Mono: Geist Mono

### Responsive Design
- Mobile-first breakpoints
- Adaptive layouts (`md:`, `lg:`, `xl:`)
- Touch-friendly controls
- Reduced iframe height on mobile (400px → 520px)

### Loading States
- Skeleton loaders for dashboard and studio
- Spinner animations during async operations
- Disabled button states with feedback

### Error Handling
- Global error boundary (`app/error.tsx`)
- 404 page with navigation links
- Runtime fault trace console in studio
- Form validation with Zod errors

---

## 🧪 Testing Recommendations

### Manual Testing Checklist

- [ ] Sign in with Google OAuth
- [ ] Generate a game from prompt
- [ ] Preview game in sandboxed iframe
- [ ] Trigger runtime error and verify capture
- [ ] Use "Fix with AI" to repair error
- [ ] Edit HTML/CSS/JS manually in Monaco editor
- [ ] Save game as private draft
- [ ] Publish game publicly
- [ ] Play game at `/play/[slug]`
- [ ] Remix a public game
- [ ] Delete a game from dashboard
- [ ] Save and restore version history
- [ ] Test rate limiting (5 generations / 10 min)
- [ ] Verify mobile responsiveness

### API Testing

```bash
# Generate game
curl -X POST http://localhost:3000/api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"prompt": "A simple Pong game"}'

# Repair game
curl -X POST http://localhost:3000/api/ai/fix \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "...",
    "runtimeError": "Uncaught TypeError...",
    "refinement": {...},
    "bundle": {"html": "...", "css": "...", "js": "..."}
  }'

# Create game (requires auth cookie)
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -b "better-auth.session_token=..." \
  -d '{...game data}'

# Remix game
curl -X POST http://localhost:3000/api/games/remix \
  -H "Content-Type: application/json" \
  -b "better-auth.session_token=..." \
  -d '{"gameId": "game-slug"}'
```

---

## 📈 Performance Optimizations

### Next.js Features
- **React Compiler**: Enabled for automatic memoization
- **Dynamic Imports**: Monaco Editor loaded client-side only
- **Server Components**: Most pages are server-rendered
- **Revalidation**: Path-based cache invalidation on mutations
- **Streaming**: Suspense boundaries for progressive loading

### Database Optimizations
- Composite indexes on frequent queries
- Selective field inclusion (`select`, `include`)
- Connection pooling via Neon serverless driver
- Global Prisma client singleton (dev mode)

### Client-Side Optimizations
- `useDeferredValue` for non-blocking preview updates
- `useTransition` for async operation states
- Message capping (max 8 runtime errors displayed)
- Monaco Editor minimap disabled for performance

---

## 🔮 Future Enhancements (Bonus Features)

### Already Implemented ✅
- ✅ Version history
- ✅ Remix/clone games
- ✅ Game deletion
- ✅ Rate limiting
- ✅ Loading states
- ✅ Error boundaries

### Potential Additions
- [ ] Like/favorite system for public games
- [ ] Comment system on games
- [ ] Game categories/tags
- [ ] Search and filter in arcade
- [ ] Leaderboard/high scores
- [ ] Game analytics dashboard
- [ ] Export as ZIP download
- [ ] Embed widget for external sites
- [ ] AI game suggestions/improvements
- [ ] Multiplayer support (WebSockets)
- [ ] Asset upload (sprites, sounds)
- [ ] Template gallery
- [ ] Achievement system
- [ ] User profiles with avatars
- [ ] Social sharing (Twitter, Discord)
- [ ] Game jam events
- [ ] Rating system (1-5 stars)

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Regenerate Prisma client
npm run prisma:generate

# Clear Next.js cache
rm -rf .next
npm run build
```

### Database Schema Out of Sync
```bash
# Push schema to database
npm run db:push

# Or create migration
npm run db:migrate
```

### AI Generation Errors
- Verify `AI_GATEWAY_API_KEY` is set correctly
- Check model availability in Vercel AI Gateway
- Increase model timeout if needed
- Try a more capable model (`AI_GAME_MODEL`)

### Google OAuth Not Working
- Ensure `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
- Add authorized redirect URI in Google Cloud Console:
  `http://localhost:3000/api/auth/callback/google`
- Set `BETTER_AUTH_URL` to your domain

### Monaco Editor Not Loading
- Check for SSR issues (must be dynamic import)
- Verify `@monaco-editor/react` is installed
- Clear browser cache

---

## 📄 License

MIT License - feel free to use this project for learning or production.

---

## 🙏 Credits

Built with:
- Next.js team for the amazing framework
- Vercel AI SDK for AI integration
- Better Auth for authentication
- Prisma for database tooling
- Monaco Editor from Microsoft

---

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check the documentation above
- Review the code comments

---

**Happy Game Building! 🎮✨**
