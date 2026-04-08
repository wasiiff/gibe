# Gibe Design System & UX Guidelines

## 🎨 Design Philosophy

**Gibe** is an AI-powered game generation platform that should feel:
- **Empowering** - Users feel like game creators, not just players
- **Intuitive** - Clear progression from idea to playable game
- **Immersive** - Games deserve full attention when playing
- **Professional** - Polished, modern, gaming-inspired aesthetic

---

## 🎯 User Experience Flows

### **1. Game Creation Flow (5 Steps)**

```
┌─────────────┐
│ Step 1:     │
│ DESCRIBE    │ ← User types natural language prompt
│ Your Idea   │    "A platformer where you jump between clouds"
└──────┬──────┘
       ↓
┌─────────────┐
│ Step 2:     │
│ GENERATE    │ ← AI refines prompt + generates HTML/CSS/JS
│ With AI     │    Shows progress, estimated time
└──────┬──────┘
       ↓
┌─────────────┐
│ Step 3:     │
│ PLAY &      │ ← Fullscreen preview, interactive gameplay
│ TEST        │    How-to-play instructions visible
└──────┬──────┘
       ↓
┌─────────────┐
│ Step 4:     │ ← If errors: "Fix with AI" button
│ REFINE      │ ← If OK: Edit code manually (optional)
│ (Optional)  │ ← Clear error messages with solutions
└──────┬──────┘
       ↓
┌─────────────┐
│ Step 5:     │ ← Save privately or publish publicly
│ PUBLISH     │ ← Get shareable link
│ & Share     │ ← Appears in public arcade
└─────────────┘
```

### **2. First-Time User Onboarding**

When users sign in for the first time:
1. **Welcome modal** - 30-second explanation of the platform
2. **Interactive tutorial** - Pre-loaded starter game with guided steps
3. **Example prompts** - Clickable templates for common game types
4. **Success metrics** - Show them what they can achieve

### **3. Game Playback Experience**

When playing a game:
1. **Fullscreen mode** - Distraction-free gameplay (F key or button)
2. **How to play** - Overlay instructions before starting
3. **Controls visible** - Keyboard/touch controls shown upfront
4. **Easy exit** - ESC to exit fullscreen, back button visible

---

## 🖼️ Visual Design System

### **Color Palette**

#### Primary Colors
```css
--cyan-400: #4DE2FF;    /* Primary action buttons, links */
--cyan-200: #A8F0FF;    /* Highlights, badges */
--pink-500: #FF5FD2;    /* Accent, warnings */
--amber-400: #FFBE5C;   /* HTML tab, attention */
--mint-400: #7CFFC5;    /* Success states, keywords */
--emerald-400: #6EE7B7; /* JavaScript tab */
```

#### Neutral Colors
```css
--bg-primary: #060816;      /* Main background */
--bg-secondary: #0A0F1E;    /* Panels, cards */
--bg-tertiary: #111827;     /* Inputs, code blocks */
--text-primary: #F5F7FF;    /* Headings, important text */
--text-secondary: #94A3B8;  /* Body text, descriptions */
--text-muted: #64748B;      /* Placeholders, hints */
```

#### Status Colors
```css
--success: #10B981;    /* Success messages, saved states */
--error: #EF4444;      /* Errors, warnings */
--info: #3B82F6;       /* Info messages */
--loading: #6366F1;    /* Loading states */
```

### **Typography**

#### Fonts
- **Display**: Orbitron - Headings, titles, badges
  - Uppercase, tracking 0.08em-0.18em
  - Sizes: text-xl to text-7xl
  
- **Body**: Space Grotesk - Descriptions, instructions
  - Normal case, tracking normal
  - Sizes: text-sm to text-lg
  - Line height: leading-7 (1.75rem)

- **Mono**: Geist Mono - Code, technical details
  - Used in Monaco Editor
  - Console output, stack traces

#### Type Scale
```
Hero:        text-7xl (4.5rem)      - Landing page headline
Page Title:  text-5xl (3rem)        - Section headlines
Card Title:  text-3xl (1.875rem)    - Game titles
Subsection:  text-2xl (1.5rem)      - Panel titles
Body:        text-sm (0.875rem)     - Default text
Small:       text-xs (0.75rem)      - Labels, badges
```

### **Spacing System**

Based on Tailwind's default scale:
```
Gap between sections:  gap-8 (2rem) / gap-10 (2.5rem)
Gap between panels:   gap-6 (1.5rem)
Padding in panels:    p-5 (1.25rem) / p-6 (1.5rem)
Input height:         h-12 (3rem)
Button sizes:         px-4 py-2 (sm), px-6 py-3 (lg)
```

### **Border Radius**

```css
Small:   rounded-lg (0.5rem)    - Buttons, small elements
Medium:  rounded-[22px]         - Cards, panels
Large:   rounded-[24px]         - Inputs, textareas
XL:      rounded-[28px]         - Preview iframe
```

### **Shadows & Effects**

```css
Panel shadow:     shadow-lg (0 10px 15px -3px rgba(0,0,0,0.3))
Glow effect:      box-shadow with color + blur
Gradient overlay: radial-gradient circles at corners
Grid pattern:     48px grid with 5.5% opacity
```

---

## 📐 Layout Patterns

### **1. Studio Layout (Desktop)**

```
┌─────────────────────────────────────────────────────┐
│ Prompt & Generation Controls (Left 40%)             │
│ ┌───────────────────────────────────────────────┐   │
│ │ • Prompt textarea                             │   │
│ │ • Title + Description inputs                  │   │
│ │ • Generate + Fix buttons                      │   │
│ │ • Status messages                             │   │
│ │ • Refined brief panel                         │   │
│ └───────────────────────────────────────────────┘   │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────┴──────────────────────────────────┐
│ Preview & Code (Right 60%)                          │
│ ┌───────────────────────────────────────────────┐   │
│ │ GAME PREVIEW (Large, resizable)               │   │
│ │ [Fullscreen button] [Share] [Play]            │   │
│ └───────────────────────────────────────────────┘   │
│ ┌───────────────────┐ ┌───────────────────────┐   │
│ │ CODE EDITOR       │ │ CONSOLE + INSTRUCTIONS│   │
│ │ [HTML][CSS][JS]   │ │ • Error messages      │   │
│ │ Monaco editor     │ │ • How to play         │   │
│ └───────────────────┘ └───────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### **2. Studio Layout (Mobile)**

Stack vertically with tabs:
```
┌──────────────────────┐
│ [Prompt] [Preview] [Code] │ (Tab switcher)
└──────────────────────┘
┌──────────────────────┐
│                      │
│   Active Tab Content │
│                      │
└──────────────────────┘
```

### **3. Play Page Layout**

```
┌────────────────────────────────────────┐
│ GAME TITLE              [Fullscreen]   │
│ Description             [Share]        │
├────────────────────────────────────────┤
│                                        │
│         GAME PREVIEW                   │
│         (Large, centered)              │
│                                        │
├────────────────────────────────────────┤
│ Creator: Name                          │
│ Controls: Arrow keys to move           │
│                                        │
│ [Remix] [Dashboard] [Home]             │
└────────────────────────────────────────┘
```

---

## 🎮 Game-Specific UX Components

### **1. Fullscreen Game Mode**

**Implementation:**
- Button in preview header (Maximize2 icon)
- Keyboard shortcut: F key
- ESC to exit
- Covers entire viewport
- Shows minimal UI (just game + exit button)
- Maintains sandbox security

**When to show:**
- Preview panel in studio (optional)
- Play page (prominent)
- Public arcade cards (click to play fullscreen)

### **2. How-To-Play Overlay**

**Before game starts:**
```
┌─────────────────────────────┐
│                             │
│    HOW TO PLAY              │
│                             │
│    🎮 Game Name             │
│                             │
│    Controls:                │
│    • Arrow keys to move     │
│    • Space to jump          │
│    • Collect orbs           │
│                             │
│    [START GAME]             │
│                             │
└─────────────────────────────┘
```

**Features:**
- Semi-transparent overlay
- Dismissible with "Start Game" or "Got it"
- Remembers if user dismissed it (localStorage)
- Accessible from help button during gameplay

### **3. Prompt Templates & Examples**

**Category cards on landing page:**
```
┌──────────────────┐
│ 🎯 Arcade        │
│ "Dodging game    │
│  with scoring"   │
│ [Use Template]   │
└──────────────────┘

┌──────────────────┐
│ 🧩 Puzzle        │
│ "Match-3 game    │
│  with combos"    │
│ [Use Template]   │
└──────────────────┘

┌──────────────────┐
│ 🏃 Platformer    │
│ "Side-scrolling  │
│  runner"         │
│ [Use Template]   │
└──────────────────┘
```

**Best practices for AI generation:**
1. Be specific about controls (keyboard, mouse, touch)
2. Mention visual style (neon, pixel art, minimal)
3. Define win/lose conditions
4. Specify single-player or turn-based
5. Keep scope MVP (no multiplayer, no external assets)

---

## 🔧 Component Specifications

### **1. Studio Shell (Redesigned)**

**Key improvements:**
- **Step indicator** at top (1-2-3-4-5)
- **Larger preview** by default (60% width)
- **Fullscreen button** prominent
- **How to play** always visible below preview
- **Better error messages** with suggested fixes
- **Progress indicators** during AI operations
- **Example prompts** library (collapsible)

### **2. Game Preview Component**

**Enhanced features:**
- Fullscreen toggle (F key)
- Refresh button (manual reload)
- Zoom controls (optional)
- "How to play" button (top-right)
- Responsive sizing (400px mobile → 600px desktop)
- Loading spinner while initializing
- Better error states with retry

### **3. Code Editor**

**Improvements:**
- Syntax highlighting per language
- Auto-save draft (localStorage)
- Undo/redo indicators
- Code folding (advanced)
- Search/replace (Ctrl+F)
- Tab size settings
- Word wrap toggle

### **4. Runtime Console**

**Better UX:**
- Color-coded errors (red=error, yellow=warning)
- Clickable stack traces
- "Fix with AI" next to each error
- Error count badge
- Clear all button
- Filter by type (errors, warnings, logs)

---

## 🚀 AI Model Optimization

### **System Prompt Best Practices**

**For Game Generation:**
```
You are an expert browser game developer.

OUTPUT FORMAT:
{
  "title": "Game Name",
  "description": "Short description",
  "html": "...",
  "css": "...",
  "js": "...",
  "howToPlay": ["Control 1", "Control 2", "Control 3"]
}

GAME DESIGN RULES:
1. Single-screen gameplay only
2. No external libraries or assets
3. Keyboard AND touch controls
4. Clear score or progression system
5. Win/lose conditions
6. Responsive layout
7. No syntax errors
8. Immediate playability

VISUAL STYLE:
- Modern, polished aesthetics
- Neon or gradient backgrounds
- Smooth animations
- High contrast for readability
- Satisfying feedback (particles, shakes)

CODE QUALITY:
- Clean, well-structured JavaScript
- Use requestAnimationFrame for game loop
- Proper event listeners
- No global variable pollution
- Comment complex logic
```

**For Prompt Refinement:**
```
You transform vague game ideas into specific, actionable briefs.

INPUT: "Make a fun racing game"
OUTPUT: {
  "title": "Neon Speed Run",
  "description": "A top-down racing game with neon aesthetics",
  "gameplayLoop": [
    "Steer car around track avoiding obstacles",
    "Collect boost pads for speed increases",
    "Complete laps before time runs out"
  ],
  "visualStyle": ["neon glow effects", "top-down perspective", "dynamic lighting"],
  "constraints": ["single track", "timer-based", "keyboard arrows + WASD"]
}
```

**For Error Repair:**
```
You are a debugging expert.

Given:
1. Original game code
2. Runtime error message
3. Original prompt intent

Return:
{
  "summary": "What you fixed",
  "html": "corrected",
  "css": "corrected",
  "js": "corrected"
}

RULES:
- Fix ONLY the error, don't redesign
- Maintain original gameplay
- Add error prevention where possible
- Explain what went wrong
```

---

## 📱 Responsive Breakpoints

```
Mobile:     < 768px   - Single column, stacked
Tablet:     768-1024px - Two columns where possible
Desktop:    1024-1280px - Full studio layout
Large:      > 1280px  - Extra-wide preview
```

---

## ✨ Microinteractions & Animations

### **Button States**
```
Hover:      Scale 1.02, brighter color
Active:     Scale 0.98, darker
Disabled:   Opacity 0.5, no pointer events
Loading:    Spinner icon, disabled state
```

### **Panel Transitions**
```
Appear:     Fade in + slide up (200ms ease-out)
Dismiss:    Fade out (150ms ease-in)
Error:      Shake animation (300ms)
Success:    Green flash + checkmark
```

### **Preview Loading**
```
1. Skeleton with shimmer effect
2. "Loading game..." text
3. Spinner animation
4. Fade in when ready
```

---

## 🎯 Success Metrics

### **User Engagement**
- Time to first game generated: < 2 minutes
- Games published per user: > 1.5
- Public games played by others: > 30%
- Remix rate: > 10% of public games

### **Quality Indicators**
- AI generation success rate: > 85%
- Repair success rate: > 70%
- User satisfaction (rating): > 4/5
- Error rate in generated games: < 20%

### **Performance Targets**
- Page load time: < 2 seconds
- AI generation time: < 15 seconds
- Preview load time: < 1 second
- Time to interactive: < 3 seconds

---

## 🎨 Design Inspiration

**Visual Style:**
- Vercel dashboard (clean, modern)
- Linear app (dark theme, gradients)
- Raycast (gaming aesthetic)
- itch.io (indie game platform)

**UX Patterns:**
- Figma (tool panels, properties)
- CodeSandbox (live preview)
- Replit (collaborative editing)
- GitHub Copilot (AI assistance)

---

## ♿ Accessibility Guidelines

- **Keyboard navigation** - All actions accessible
- **Focus indicators** - Clear outline on focused elements
- **Alt text** - Descriptive text for images
- **ARIA labels** - Screen reader support
- **Color contrast** - WCAG AA minimum (4.5:1)
- **Reduced motion** - Respect prefers-reduced-motion
- **Font scaling** - Support browser zoom

---

## 📋 Implementation Checklist

### **Phase 1: Core UX (Current)**
- [x] Step-by-step flow indicators
- [x] Fullscreen game mode
- [x] How-to-play overlay
- [x] Better error messages
- [x] Prompt templates
- [x] Mobile responsive layout

### **Phase 2: Polish**
- [ ] Onboarding tutorial
- [ ] Auto-save drafts
- [ ] Game categories
- [ ] Search/filter arcade
- [ ] User profiles
- [ ] Achievement badges

### **Phase 3: Advanced**
- [ ] Multiplayer support
- [ ] Asset uploads
- [ ] Leaderboards
- [ ] Game analytics
- [ ] Social sharing
- [ ] Rating system

---

**Version:** 1.0  
**Last Updated:** April 2026  
**Maintained By:** Gibe Team
