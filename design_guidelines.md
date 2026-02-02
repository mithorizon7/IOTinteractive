# Design Guidelines: IoT Interactive Learning Engine

## Design Approach

**Selected Approach**: Material Design 3 with Educational Platform References (Khan Academy, Duolingo)

**Justification**: Utility-focused learning tool requiring clarity, consistency, and accessibility. Material Design 3's adaptive color system supports both light/dark modes while maintaining educational approachability.

**Key Principles**:

- Clarity over decoration: Every element serves learning
- Approachable professionalism: Friendly but credible
- Progressive disclosure: One concept per screen
- Adaptive theming: Seamless light/dark mode transitions

---

## Color System

**Light Mode**:

- Primary: Indigo-600 (#4F46E5) - buttons, links, active states
- Primary Container: Indigo-50 (#EEF2FF) - selected items, backgrounds
- Surface: White (#FFFFFF) - cards, main backgrounds
- Surface Variant: Gray-50 (#F9FAFB) - subtle differentiation
- Outline: Gray-300 (#D1D5DB) - borders, dividers
- On-Surface: Gray-900 (#111827) - primary text
- On-Surface Variant: Gray-600 (#4B5563) - secondary text

**Dark Mode**:

- Primary: Indigo-400 (#818CF8) - adjusted for dark backgrounds
- Primary Container: Indigo-950 (#1E1B4B) - selected items
- Surface: Gray-900 (#111827) - cards, main backgrounds
- Surface Variant: Gray-800 (#1F2937) - subtle differentiation
- Outline: Gray-700 (#374151) - borders, dividers
- On-Surface: Gray-50 (#F9FAFB) - primary text
- On-Surface Variant: Gray-400 (#9CA3AF) - secondary text

**Semantic Colors** (consistent across modes with appropriate contrast):

- Success: Green-500 (#22C55E) light / Green-400 (#4ADE80) dark
- Error: Red-500 (#EF4444) light / Red-400 (#F87171) dark
- Warning: Amber-500 (#F59E0B) light / Amber-400 (#FBBF24) dark
- Info: Blue-500 (#3B82F6) light / Blue-400 (#60A5FA) dark

**Elevation Shadows** (light mode only, dark mode uses subtle borders):

- Card: shadow-lg with slight indigo tint
- Modal: shadow-2xl
- Hover states: shadow-xl

---

## Typography

**Font**: Inter exclusively (Google Fonts, weights: 400, 500, 600, 700)

**Scale**:

- H1 (App title): text-3xl font-bold (30px)
- H2 (Section headers): text-xl font-semibold (20px)
- H3 (Card titles): text-lg font-semibold (18px)
- Body: text-base leading-relaxed (16px, 1.625 line-height)
- Small: text-sm (14px)
- Micro: text-xs (12px)

---

## Layout System

**Spacing Primitives**: Tailwind units of **4, 6, 8, 12, 16** for consistency

**Containers**:

- Main learning area: max-w-4xl centered
- Pre-start screen: max-w-6xl
- Header inner: max-w-6xl with px-4

**Vertical Rhythm**: py-8 for sections, py-12 for major separations

---

## Component Library

### Header

- Sticky full-width with border-b
- Left: App title + subtitle (stacked on mobile)
- Right: Progress indicators (streak badge, avg time, hints counter)
- Inner container: max-w-6xl px-4 py-4

### Main Content Card

- Rounded-2xl with elevation (shadow in light, border in dark)
- Padding: p-8 (desktop) / p-6 (mobile)
- Top badges: Objective ID, mechanic type, difficulty (pill badges)
- Game component area with clear boundaries
- Bottom: Hint panel (collapsible) or action buttons

### Pre-Start Screen

- Centered max-w-6xl container
- Hero-style title section: text-center mb-12
- Outcomes grid: 2-column (desktop) / 1-column (mobile) with gap-4
- Each outcome card: border rounded-lg p-4 with checkmark icon (w-5 h-5)
- Large primary CTA button: "Begin Learning Journey" (px-12 py-4, centered)
- Secondary: "View Telemetry" link below (text-sm)

### Interactive Components

**Buttons**:

- Primary: Solid indigo background, white text, rounded-xl px-6 py-3, icon + text
- Secondary: Outlined with primary color, same sizing
- Danger: Red variant for destructive actions
- All: Focus ring (ring-2 ring-offset-2), flex items-center gap-2

**Decision Buttons** (DecisionLab):

- Large targets: min-h-[60px], rounded-xl
- Selected state: Primary border + primary container background
- Unselected: Outline border
- Multi-line text support with padding p-4

**Drag Cards** (Triage):

- Rounded-lg p-4 with border
- Hover: Subtle shadow increase
- Dragging: opacity-60 + cursor-grabbing
- Drop zones: border-dashed-2 with primary color, min-h-[80px]

**Match Pairs**:

- Two-column grid (desktop) / stacked (mobile)
- Each card: rounded-lg border p-4
- Selected: Primary border emphasis
- Matched: Success color border + checkmark

**Sequence Controls** (Sequencer):

- Vertical list with numbered circles
- Up/down icon buttons: w-8 h-8 rounded-lg
- Clear visual hierarchy with connecting lines

### Feedback Components

**Feedback Panel**:

- Replaces game on completion
- Status badge at top: rounded-full px-4 py-2 with semantic color
- Misconception structure: Bold "Why" + explanation + "Contrast" (indented block with surface-variant background p-3 rounded) + "Next Try" tip
- Exemplar response: bordered section p-4 rounded-lg labeled clearly
- Telemetry grid: micro-stats at bottom (text-xs)
- Action buttons: "Try Again" or "Next Challenge"

**Hint Panel**:

- Below game component when active
- Surface-variant background, rounded-xl p-4
- HelpCircle icon + "Hint:" label + hint text
- Subtle left border in primary color

**Mastery Banner**:

- Full-width celebration when mastery reached
- Success color background, rounded-lg p-4
- Trophy/badge icon + congratulatory message
- Appears above action buttons

### Progress Indicators

- Streak: Flame icon + number in badge
- Avg Time: Clock icon + seconds
- Hints Used: HelpCircle icon + count
- All: flex gap-2 items-center text-sm in pill badges

### Telemetry Modal

- Full-screen overlay with backdrop blur
- Panel: max-w-4xl max-h-[80vh] overflow-y-auto
- Table with sticky header, striped rows
- Download CSV button (top-right)

---

## Animations

**Minimal and purposeful**:

- Feedback panel: Slide-up 300ms ease-out
- Button press: Scale-down 100ms
- Card entry: Fade-in 200ms
- Theme toggle: 200ms transition on background/text colors
- **No continuous animations or decorative motion**

---

## Accessibility

**Keyboard Navigation**:

- Visible focus rings: ring-2 ring-offset-2 in primary color
- Logical tab order, Enter/Space activation
- Arrow keys for sequences and grids

**ARIA Implementation**:

- Buttons: aria-label with full context
- Drag items: aria-grabbed states
- Status badges: aria-live="polite" for announcements
- Hint panel: aria-describedby

**Color Contrast**: WCAG AA minimum (4.5:1 for text, 3:1 for UI components) maintained across both themes

---

## Responsive Behavior

**Breakpoints**:

- Mobile (base): Stacked layouts, full-width buttons
- Tablet (md: 768px): 2-column grids where applicable
- Desktop (lg: 1024px): Full multi-column layouts

**Mobile Adaptations**:

- Header: Stacked title, wrapped progress indicators
- Cards: px-4 full viewport width
- Match Pairs: Vertical stack
- Buttons: w-full on mobile, w-auto on desktop

---

## Images

**No hero section** - this is a utility learning app. Start directly with pre-start screen.

**Iconography**: Lucide React icons exclusively for consistency (Check, X, HelpCircle, ChevronRight, Flame, Clock, Trophy, ListChecks, etc.)

**Optional concept illustrations**: Simple line-art SVGs within question stimuli if needed for visual learning (e.g., network diagrams, device schematics) - use sparingly and purposefully.
