# IoT Interactive Learning Engine

## Overview
An educational web application featuring interactive mini-games designed to teach IoT (Internet of Things) concepts to beginners. The application implements a sequential-then-adaptive progression system with mastery tracking, misconception-specific feedback, and comprehensive telemetry.

## Purpose & Goals
- **Educational Focus**: Teach foundational IoT concepts through active learning
- **Engaging Experience**: Use game mechanics to make learning interactive and fun
- **Mastery-Based Progression**: Ensure learners achieve competency before moving forward
- **Data-Driven**: Track learner progress and misconceptions for continuous improvement

## Current State
**Status**: Fully functional MVP with all core features implemented

**Completed Features**:
- ✅ Four game mechanics (DecisionLab, Triage, Sequencer, MatchPairs)
- ✅ Sequential-then-adaptive progression system
- ✅ Mastery tracking (streak, average time, hints used)
- ✅ Misconception-specific feedback system
- ✅ Hint ladder with progressive disclosure
- ✅ Telemetry recording and export (CSV download)
- ✅ Pre-start screen with learning outcomes
- ✅ Accessible, responsive UI with light/dark mode support
- ✅ Material Design 3 inspired aesthetic with Inter font
- ✅ Comprehensive test IDs for all interactive elements

## Recent Changes
**Date**: 2025-11-12

1. **Design System Setup**
   - Generated design guidelines based on Material Design 3 and educational platforms (Khan Academy, Duolingo)
   - Configured Tailwind with Inter font exclusively
   - Updated index.html to load only Inter font from Google Fonts
   - Established color tokens in index.css (indigo primary, semantic colors for success/error/warning)

2. **Complete Frontend Implementation**
   - Created comprehensive `client/src/pages/iot-learning.tsx` (1622 lines)
   - Implemented all four game mechanics with beautiful, accessible UI
   - Built feedback system with misconception detection and targeted remediation
   - Added mastery tracking with visual progress indicators
   - Implemented telemetry system with localStorage persistence and CSV export
   - Created sequential-then-adaptive progression orchestrator

3. **Content Integration**
   - Integrated 10 learning items across 5 learning objectives
   - Configured mastery criteria: 3 correct streak, ≤30s avg time, ≤1 hint
   - Added misconception detectors and feedback for common errors

## User Preferences
- **Design Aesthetic**: Clean, approachable, professional (educational platform style)
- **Typography**: Inter font exclusively for consistency
- **Color Scheme**: Indigo primary (educational feel), semantic colors (green/red/amber)
- **Interaction Style**: Minimal animations, clear feedback, progressive disclosure

## Project Architecture

### Frontend Structure
```
client/src/
├── pages/
│   ├── iot-learning.tsx    # Main learning engine (1622 lines)
│   └── not-found.tsx        # 404 page
├── components/ui/          # Shadcn components
├── lib/
│   └── queryClient.ts      # TanStack Query setup
└── App.tsx                 # Root component with routing
```

### Key Components
1. **IoTLearningLab** (Main Orchestrator)
   - State management for session, items, history, mastery
   - Sequential-then-adaptive progression logic
   - Event handlers for submit, hint, retry, next

2. **Game Mechanics**
   - `DecisionLab`: Multiple choice with rationale
   - `Triage`: Drag-and-drop binary classification
   - `Sequencer`: Ordering/sequencing tasks
   - `MatchPairs`: Matching left/right items

3. **Supporting Components**
   - `Header`: Sticky header with mastery indicators
   - `Feedback`: Misconception-specific feedback panel
   - `TelemetryPanel`: Modal for viewing/downloading telemetry
   - `OutcomeList`: Pre-start learning outcomes display

### Data Model
**Item Structure** (from `attached_assets/io_t_mini_games_beginner_interactive_react_app_1762978302524.jsx`):
- `objective_id`: Learning outcome reference
- `mechanic`: Game type (DecisionLab, Triage, Sequencer, Match)
- `stimulus`: Question text and optional media
- `response_type`: Expected response format
- `answer_key`: Correct answer(s)
- `misconceptions`: Array of detectors and feedback
- `hint_ladder`: Progressive hints
- `exemplar_response`: Model answer

**Mastery Tracking**:
- Current streak (consecutive correct)
- Average response time (milliseconds)
- Total hints used
- Mastery criteria: streak ≥ 3, avg time ≤ 30s, hints ≤ 1

**Telemetry Events**:
- `session_start`: Learner begins session
- `hint_shown`: Hint revealed (includes index and text)
- `attempt`: Response submitted (includes correctness, latency, hints, misconception)

### Progression Logic
1. **Sequential Phase**: All learners go through all items once
2. **Adaptive Phase**: After seeing all items, system prioritizes:
   - Items answered incorrectly (least-seen first)
   - Items seen least frequently overall

This ensures broad coverage before adaptive remediation.

### Storage
- **In-Memory**: Application state (React hooks)
- **LocalStorage**: Telemetry events (key: `iot_minigames_telemetry_v1`)
- **No Backend Storage**: Pure frontend application (no database, no server-side storage)

## Technology Stack
- **Frontend**: React 18, TypeScript, Wouter (routing)
- **UI Components**: Shadcn/ui, Radix UI primitives
- **Styling**: Tailwind CSS, custom design tokens
- **State Management**: React hooks (useState, useMemo, useEffect)
- **Data Fetching**: TanStack Query v5 (configured but not used in this app)
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Server**: Express (serves Vite frontend)

## Content Source
Content adapted from `attached_assets/What is IoT__1762978302523.docx`:
- 5 learning objectives covering IoT fundamentals
- 10 learning items with misconception detection
- Real-world scenarios (RFID warehouses, smart thermostats, cellular connectivity)
- Security concepts (vulnerabilities vs mitigations)

## Design Guidelines
See `design_guidelines.md` for comprehensive design specifications including:
- Material Design 3 approach with educational platform references
- Color system (light/dark modes)
- Typography scale (Inter exclusively)
- Component library specifications
- Accessibility requirements (WCAG AA)
- Responsive breakpoints

## Accessibility Features
- **Keyboard Navigation**: Full keyboard support, visible focus rings
- **ARIA Labels**: Comprehensive labeling for screen readers
- **Color Contrast**: WCAG AA compliant (4.5:1 text, 3:1 UI)
- **Semantic HTML**: Proper heading hierarchy, landmark regions
- **Test IDs**: All interactive elements have `data-testid` attributes
- **Live Regions**: Feedback announced via `aria-live="polite"`

## Testing Strategy
- **Manual Testing**: Interactive gameplay testing in browser
- **E2E Testing**: Playwright-based testing via `run_test` tool
- **Accessibility Testing**: Keyboard navigation, screen reader compatibility
- **Telemetry Validation**: CSV export verification

## Known Limitations
- No backend persistence (all data in browser)
- No user accounts or multi-user support
- Content hardcoded in frontend (no CMS)
- No analytics dashboard (only raw telemetry export)
- Progression resets on page refresh (no session restoration)

## Future Enhancements (Not Implemented)
- Backend API for persistence
- User authentication and profiles
- Admin dashboard for telemetry analysis
- Content management system
- Adaptive difficulty adjustment
- Social features (leaderboards, peer comparison)
- Mobile app versions
- Internationalization (i18n)

## Development Commands
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Type checking
npm run typecheck
```

## File Organization Notes
- **Single-File Component**: `iot-learning.tsx` is intentionally comprehensive to minimize file navigation
- **Content Co-location**: Learning content lives in the same file as the engine for easy editing
- **Design Guidelines**: Separated into `design_guidelines.md` for reference
- **No Backend**: Server only serves static frontend (Express + Vite middleware)

## Credits
- **Design Inspiration**: Khan Academy, Duolingo, Material Design 3
- **UI Components**: Shadcn/ui, Radix UI
- **Content Source**: IoT beginner curriculum (see attached assets)
