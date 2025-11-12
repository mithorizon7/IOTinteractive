# Design Guidelines: IoT Interactive Learning Engine

## Design Approach

**Selected Approach**: Design System (Material Design 3) with Educational Platform References

**Justification**: This is a utility-focused learning tool requiring clarity, consistency, and accessibility. Drawing from Material Design's established patterns for information-dense applications, with inspiration from educational platforms like Khan Academy and Duolingo for approachable, stress-free learning interfaces.

**Key Principles**:
- Clarity over decoration: Every element serves learning
- Approachable professionalism: Friendly but credible
- Progressive disclosure: One concept per screen
- Accessibility-first: WCAG AA minimum

---

## Typography

**Font Stack**:
- **Primary**: Inter (via Google Fonts) - body text, UI labels, questions
- **Display**: Inter SemiBold/Bold - headings, outcomes, feedback states

**Hierarchy**:
- H1 (App title): text-3xl font-bold (30px)
- H2 (Section headers): text-xl font-semibold (20px)
- H3 (Card titles, outcomes): text-lg font-medium (18px)
- Body (Questions, content): text-base (16px)
- Small (Hints, metadata): text-sm (14px)
- Micro (Telemetry, timestamps): text-xs (12px)

**Line Height**: Generous spacing for readability - leading-relaxed (1.625) for body text

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **4, 6, 8, 12, 16, 20** for consistency
- Component padding: p-6 or p-8
- Section gaps: space-y-8 or gap-6
- Card margins: mb-8
- Button padding: px-6 py-3

**Container Strategy**:
- Max width: max-w-4xl (centered) for main learning area
- Wider container (max-w-6xl) for pre-start screen with outcomes list
- Full-width header with inner max-w-6xl

**Vertical Rhythm**: Consistent py-8 or py-12 for sections

---

## Component Library

### Core Layout Components

**Header**:
- Full-width sticky bar with subtle border-bottom
- Left: App title + subtitle (stacked on mobile)
- Right: Mastery progress indicators (streak badge, avg time, hints used)
- Height: py-4, inner container max-w-6xl

**Main Content Card**:
- Elevated card with rounded-2xl, shadow-lg
- White background (will be styled with colors later)
- Padding: p-8 on desktop, p-6 on mobile
- Top section: Pill badges showing objective ID, mechanic type, difficulty
- Main body: Game component or feedback screen
- Bottom: Hint panel (when active) or action buttons

**Outcomes List** (pre-start screen):
- Grid layout: grid-cols-1 md:grid-cols-2 gap-4
- Each outcome: card with border, p-4, flex items with checkmark icon
- Icon size: w-5 h-5

### Interactive Components

**Buttons**:
- Primary (Submit, Next): Solid, rounded-xl, px-6 py-3, medium font-weight, with icon
- Secondary (Hint, Reset): Outlined, same sizing
- Danger (Give up): Subtle variant
- All buttons: Flex items-center gap-2 for icon+text pairing

**Decision Buttons** (DecisionLab):
- Large touch targets: min-h-[60px]
- Rounded-xl borders
- Selected state: Border emphasis + subtle background shift
- Flex layout for multi-line text support

**Drag/Sort Cards** (Triage):
- Card-based with rounded-lg
- Padding: p-4
- Hover state: Subtle lift (shadow increase)
- Active drag: opacity-60
- Drop zones: Border-dashed, min-height indicators

**Sequence Controls** (Sequencer):
- Vertical list with numbered items
- Each item: Flex layout with up/down arrow buttons (icon-only, w-8 h-8)
- Clear visual order with numbers

**Match Pairs** (MatchPairs):
- Two-column grid on desktop, stacked on mobile
- Left column (terms/roles): Clickable cards with rounded-lg, border
- Right column (definitions): Same styling
- Active selection: Visual border emphasis
- Completed pairs: Checkmark indicator

### Feedback States

**Feedback Panel** (replaces game on completion):
- Top: Status badge (Correct/Incorrect) with icon - rounded-full, px-4 py-2
- Misconception feedback structure:
  - "Why": Bold label + explanation (text-base)
  - "Contrast": Indented block with subtle background, p-3, rounded
  - "Next try": Actionable tip
- Exemplar response: Bordered section, p-4, rounded-lg, labeled "Model answer"
- Telemetry snippet: Grid of micro-stats at bottom (time, hints, misconception ID)
- Action buttons: Retry or Next with appropriate prominence

**Hint Panel**:
- Below game component when active
- Rounded-xl with subtle background differentiation
- Icon (HelpCircle) + "Hint:" label + hint text
- Padding: p-4
- Border on left side for visual distinction

**Mastery Banner**:
- Full-width within card, above bottom actions
- Flex items-center gap-3
- Icon (ListChecks or trophy) + congratulatory text
- Rounded-lg, p-4
- Appears when mastery gate reached

### Utility Components

**Progress Indicators**:
- Streak: Badge with flame/check icon + number
- Avg time: Clock icon + seconds display
- Hints used: HelpCircle icon + count
- All: Flex gap-2 items-center, text-sm

**Telemetry Modal**:
- Full-screen overlay with semi-transparent backdrop
- Content panel: max-w-4xl, max-h-[80vh], overflow-y-auto
- Table layout for events: striped rows, sticky header
- Download CSV button at top

**Pills/Badges**:
- Small: px-3 py-1, text-xs, rounded-full
- Medium: px-4 py-2, text-sm, rounded-full
- Use for: difficulty levels, objective IDs, status indicators

---

## Animations

**Minimal, purposeful only**:
- Card entry: Subtle fade-in (200ms) when new item loads
- Button feedback: Scale down slightly on click (100ms)
- Feedback panel transition: Slide-up or fade (300ms)
- **No**: Continuous animations, decorative motion, parallax

---

## Accessibility Implementation

**Keyboard Navigation**:
- All interactive elements: Visible focus rings (ring-2 ring-offset-2)
- Tab order: Logical top-to-bottom, left-to-right
- Enter/Space: Activate buttons and selections
- Arrow keys: Navigate sequences, move focus in grids

**ARIA Labels**:
- Decision buttons: aria-label with full question context
- Drag items: aria-grabbed states
- Status badges: aria-live regions for screen reader announcements
- Hint panel: aria-describedby linking to active item

**Semantic HTML**:
- `<main>` for learning area
- `<article>` for each question card
- `<nav>` for header navigation
- Proper heading hierarchy (h1 → h2 → h3)

---

## Responsive Behavior

**Breakpoints**:
- Mobile (default): Single column, stacked layouts
- Tablet (md: 768px): Two columns where beneficial (outcomes, match pairs)
- Desktop (lg: 1024px): Full layout, side-by-side elements

**Mobile Adaptations**:
- Header: Stacked title/subtitle, mastery indicators wrap
- Cards: Full viewport width with px-4 padding
- Match Pairs: Vertical stack instead of grid
- Buttons: Full-width on small screens (w-full sm:w-auto)

---

## Images

**Hero Section**: Not applicable - this is a utility app, not a marketing page. Start directly with the pre-start learning screen.

**Iconography**: Use Lucide React icons throughout (already referenced in code: Check, X, HelpCircle, ChevronRight, etc.)

**No decorative images needed** - keep focus on learning content. If illustrations are desired later, use simple line-art SVGs for concept visualization within question stimuli.

---

## Pre-Start Screen Layout

- Centered container (max-w-6xl, px-4)
- Top: Large app title + subtitle (text-center, mb-12)
- Outcomes section: Heading + 2-column grid of outcome cards (mb-12)
- Primary CTA: Large "Start" button (centered, px-12 py-4)
- Secondary: Small "View Telemetry" link below (text-sm, muted)

## Practice Screen Layout

- Sticky header (as described above)
- Main content card (centered, max-w-4xl, mb-8)
- Telemetry toggle: Fixed bottom-right corner or within header
- Mastery banner: Above card when triggered

This design creates a focused, accessible, professional learning environment that minimizes cognitive load and maximizes clarity for non-technical learners.