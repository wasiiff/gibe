# Gibe Design System

## Product Direction

Gibe is an AI game foundry, not a generic dashboard. The interface should feel like a playable control room: dense enough to feel powerful, but clean enough that users can move from prompt to live game in seconds.

Core tone:

- Futuristic without looking noisy
- Competitive and game-native rather than SaaS-generic
- Dark by default with sharp neon contrast
- Modular panels, strong borders, subtle glow, high information density

## Visual Language

### Color Tokens

Use these as the primary visual system.

```css
:root {
  --bg-0: #060816;
  --bg-1: #0b1020;
  --bg-2: #11182d;
  --bg-3: #171f38;
  --panel: rgba(14, 21, 41, 0.82);
  --panel-strong: rgba(12, 18, 36, 0.96);
  --panel-soft: rgba(20, 28, 52, 0.72);
  --line: rgba(114, 153, 255, 0.2);
  --line-strong: rgba(121, 177, 255, 0.42);
  --text-0: #f5f7ff;
  --text-1: #cad4f8;
  --text-2: #7f8bb4;
  --cyan: #4de2ff;
  --blue: #69a4ff;
  --mint: #7cffc5;
  --pink: #ff5fd2;
  --amber: #ffbe5c;
  --red: #ff6b7a;
  --shadow-lg: 0 24px 80px rgba(0, 0, 0, 0.45);
}
```

### Background Treatment

- Base background should be layered, not flat
- Use a combination of radial gradients, soft grid lines, and blurred color blooms
- Keep the background darker than the content panels so the editor and preview remain the focus

Recommended composition:

- Radial cyan bloom near top-left
- Pink-blue bloom near bottom-right
- Low-opacity grid overlay
- Large inset shadows to frame panels

## Typography

Typography should avoid plain system defaults.

- Primary display and UI font: `Orbitron`
- Secondary text font: `Space Grotesk`
- Code font: `Geist Mono`

Usage rules:

- Hero titles: uppercase or near-uppercase with tracking
- Section labels: compact, small caps feel
- Body copy: neutral and readable, avoid excessive tracking
- Code and metrics: monospace only where clarity benefits

## Iconography

Icons must be SVG-based and crisp at small sizes.

- Prefer a consistent line icon set such as `lucide-react`
- For key product moments, use custom inline SVG illustrations instead of emoji or raster art
- Hero surfaces should include at least one bespoke SVG treatment:
  - AI core / prompt engine
  - editor-preview pipeline
  - publish/share node map

Rules:

- Use 1.75px or 2px strokes for line icons
- Keep corners slightly rounded
- Accent important icons with gradient fills or glow wrappers, not just color swaps
- Avoid mixing unrelated icon sets

## Layout System

### Shell

Use a three-band layout:

1. Marketing/hero summary at top
2. Main workspace in the center
3. Saved/public game rails and metadata surfaces below or beside on large screens

### Workspace

The editor route should use a split layout:

- Left: prompt controls and code editors
- Right: live preview, runtime status, and debug actions

Desktop:

- 40/60 or 45/55 split
- Sticky prompt/action column
- Preview panel should dominate the visual hierarchy

Mobile:

- Stack prompt, preview, then code editors
- Use tabbed sections for HTML, CSS, JS

## Component Guidelines

### Panels

- Use translucent, layered panels with strong border contrast
- Rounded corners should be medium-large, around 20px to 28px
- Add subtle inner highlights and edge gradients

### Buttons

Button types:

- Primary: cyan-blue glow, used for generate/publish/fix flows
- Secondary: muted panel button with bright hover border
- Danger: red accent, reserved for destructive actions
- Ghost: low-emphasis text actions

Interaction:

- Visible hover elevation
- Fast but smooth press response
- Clear loading states with animated shine or pulse

### Inputs

- Dark surfaces with inset borders
- Placeholder text should stay readable, not washed out
- Focus rings should use cyan or blue, never browser default

### Editor Tabs

- HTML, CSS, and JS tabs should feel like compact arcade cartridges
- Active tab gets a bright top edge and glow
- Include file-type color accents:
  - HTML: amber
  - CSS: cyan
  - JS: mint

### Runtime Status

Expose state clearly:

- Ready
- Generating
- Runtime error
- Fixed
- Saved
- Published

Each state should have a matching icon, color, and compact badge treatment.

## Motion

Motion should support clarity, not decoration.

Use:

- Staggered reveal for hero/dashboard cards
- Soft hover parallax on large cards
- Panel shimmer during AI generation
- Status pulse for active preview or live regeneration

Avoid:

- Bouncy animations
- Continuous distracting loops
- Long transitions

Keep most transitions in the 180ms to 280ms range.

## Page-Specific Guidance

### Landing Page

Must communicate the full loop in one glance:

- Prompt
- Generate
- Play
- Fix
- Publish

The hero should show an actual mock editor/preview composition, not just text and buttons.

### Dashboard

Show:

- Create new game card
- Recent games
- Published games
- Stats or quick profile summary

Cards should feel collectible, like game cartridges or arena loadouts.

### Editor

The editor is the product core.

Must include:

- Prompt composer
- Prompt refinement summary
- Generate button
- Monaco editors for HTML/CSS/JS
- Live preview iframe
- Runtime errors panel
- Fix with AI action
- Save/publish controls

### Public Game Page

The public page should prioritize playability:

- Large preview first
- Metadata and creator below or beside
- Play, remix, and copy link actions

## Content Style

Interface copy should be concise and product-specific.

Prefer:

- "Forge a neon survival arena"
- "Runtime fault captured"
- "Patch with AI"
- "Ship to arcade"

Avoid:

- Generic productivity language
- Excessively formal empty filler
- Emoji-based visual cues

## Accessibility

Even with a stylized UI, maintain:

- AA contrast for text and important controls
- Visible keyboard focus states
- Proper labels for editors, forms, and iframe controls
- Motion reduction support for non-essential animation

## Security UX

Because user code runs in a sandboxed iframe:

- Make the boundary obvious in the UI
- Label the preview as isolated execution
- Surface blocked capabilities and runtime faults in plain language
- Never hide security-related failures behind generic error text

## Implementation Notes

- Build reusable SVG icon wrappers and panel primitives early
- Centralize tokens in global CSS variables
- Favor server-rendered data surfaces and keep interactivity in focused client components
- Keep the editor shell responsive from the start
- Preserve a single visual language across landing, dashboard, editor, and public game pages
