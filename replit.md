# IoT Interactive Learning Engine

## Overview
The IoT Interactive Learning Engine is an educational web application designed to teach foundational IoT (Internet of Things) concepts to beginners through interactive mini-games. Its primary purpose is to provide an engaging, mastery-based learning experience, tracking learner progress and misconceptions for continuous improvement. The project aims to make learning IoT accessible and fun, ensuring learners achieve competency before advancing.

## User Preferences
- **Design Aesthetic**: Clean, approachable, professional (educational platform style)
- **Typography**: Inter font exclusively for consistency
- **Color Scheme**: Indigo primary (educational feel), semantic colors (green/red/amber)
- **Interaction Style**: Minimal animations, clear feedback, progressive disclosure

## System Architecture

### UI/UX Decisions
The application features an accessible, responsive UI with light/dark mode support, inspired by Material Design 3 and educational platforms like Khan Academy and Duolingo. It exclusively uses the Inter font for typography and follows an indigo primary color scheme with semantic colors for feedback. Interaction design prioritizes clear feedback, progressive disclosure, and minimal animations.

### Technical Implementations
The frontend is a comprehensive React 18 application built with TypeScript, utilizing Shadcn/ui and Radix UI primitives for components, and Tailwind CSS for styling. State management is handled with React hooks. The application implements four core game mechanics: DecisionLab (multiple choice), Triage (drag-and-drop classification), Sequencer (ordering tasks), and MatchPairs (matching items). It includes a feedback system with misconception detection, mastery tracking (streak, average time, hints used), and a telemetry system for progress tracking and CSV export.

### Feature Specifications
- **Learning Progression**: A sequential-then-adaptive system ensures learners cover all items once before focusing on incorrectly answered or least-seen items.
- **Mastery Criteria**: Defined by a streak of 3 consecutive correct answers, an average response time of 30 seconds or less, and using 1 or fewer hints per item.
- **Feedback System**: Provides misconception-specific feedback and a progressive hint ladder.
- **Accessibility**: Full keyboard navigation, ARIA labels, WCAG AA compliant color contrast, semantic HTML, and `aria-live="polite"` regions for screen reader announcements are implemented.

### System Design Choices
The application is a pure frontend solution with no backend persistence, storing telemetry events and session progress in `localStorage`. Content is externalized in JSON translation files for easy internationalization, allowing for a self-contained, deployable unit without server-side dependencies beyond serving static files.

### Internationalization Architecture
The application uses react-i18next for multi-language support:

**Translation Structure**:
- **UI Strings**: `client/src/locales/{lang}/ui.json` - All interface text (buttons, labels, headings)
- **Educational Content**: `client/src/locales/{lang}/content.json` - Learning items (questions, hints, misconceptions, feedback)
- **Supported Languages**: Currently English only; Finnish and Russian infrastructure ready but awaiting translation

**Content Loading**:
- `getTranslatedContent()` function dynamically builds all 11 learning items from translation files
- Detector functions and scoring logic remain in code (non-translatable)
- Language changes reload content via i18n event subscription
- Language preference persisted in localStorage

**Translation Workflow for Educators**:
1. Copy `client/src/locales/en/ui.json` and `content.json` to new language folder (e.g., `fi/` or `ru/`)
2. Translate JSON values while preserving keys and structure
3. Uncomment language imports in `client/src/i18n/config.ts`
4. Add language code to `supportedLngs` array
5. Language switcher appears automatically when multiple languages configured

**No Code Knowledge Required**: Translators only edit JSON files - all game logic, detectors, and scoring remain unchanged in TypeScript code.

## External Dependencies
- **React**: Frontend library
- **TypeScript**: Superset of JavaScript for type safety
- **Wouter**: Client-side routing
- **Shadcn/ui & Radix UI**: UI component libraries
- **Tailwind CSS**: Utility-first CSS framework
- **TanStack Query**: Data fetching (configured but not actively used for external API calls in this version)
- **Lucide React**: Icon library
- **Vite**: Build tool
- **Express**: Node.js framework for serving the static frontend
- **Google Fonts**: Inter font
- **react-i18next & i18next**: Internationalization framework with language detection and persistence

## Recent Changes

### **2025-11-13** - Internationalization Infrastructure

**I18n Framework Implementation**:
- Installed and configured react-i18next with language detection and persistence
- Created namespace-based architecture: `ui` for interface strings, `content` for educational materials
- Externalized all strings from code into JSON translation files for easy editing

**Translation-Ready Architecture**:
- `getTranslatedContent()` function builds all 11 learning items dynamically from locales
- All 10 components refactored to use `useTranslation()` hook
- Language change subscription reloads content without page refresh
- Main component manages translated content via state

**Translator-Friendly Workflow**:
- Zero coding required - translators only edit JSON files
- Finnish and Russian stub files ready for population
- Clear separation: human text in JSON, logic/detectors in code
- Language switcher appears automatically when multiple languages configured
- Currently English-only in production until translations complete

**File Structure**:
```
client/src/
├── i18n/config.ts              # i18n setup
├── locales/
│   ├── en/
│   │   ├── ui.json             # All UI strings
│   │   └── content.json        # All educational content
│   ├── fi/                     # Finnish (stub, awaiting translation)
│   └── ru/                     # Russian (stub, awaiting translation)
└── pages/iot-learning.tsx      # Uses useTranslation hook
```

**Architect Status**: ✅ Architect-reviewed implementation, production-ready for English

### **2025-11-13** - Educational Enhancements to Triage Game

**Added Educational Introduction**:
- Created comprehensive intro section explaining vulnerabilities vs mitigations
- Non-technical language: "weak spot" vs "step that helps reduce risks"
- Connection to prior learning: IoT as "networks of connected devices and sensors"
- Visual reinforcement with color-coded icons (AlertTriangle/Shield)
- Reflective prompt: "Does this make the system weaker, or safer?"

**Added Bin Micro-Definitions**:
- Vulnerability bin: "Makes the system weaker"
- Mitigation bin: "Makes the system safer"
- Subtle text-muted-foreground styling, positioned below bin headers

**Rewrote Card Text for True Beginners**:
Updated all 6 cards to use concrete, accessible language for learners with zero IT background:

*Vulnerabilities (Before → After):*
1. ~~"Default password on outdoor camera"~~ → "Using the factory-set default password on an outdoor security camera."
2. ~~"No remote update mechanism"~~ → "IoT device that cannot be updated over the network (you must visit it in person to install updates)."
3. ~~"Physically accessible device enclosure"~~ → "IoT device installed where anyone can easily reach it and open its case."

*Mitigations (Before → After):*
1. ~~"Network segmentation (separate IoT VLAN)"~~ → "Putting IoT devices on their own separate network so they cannot directly reach more sensitive systems."
2. ~~"Strong, unique credentials"~~ → "Using strong, unique passwords for each IoT device and login."
3. ~~"Regular patching policy"~~ → "Regularly installing software updates on all IoT devices."

**Text Improvements Rationale**:
- **Concrete over abstract**: "security camera" vs "outdoor camera", "case" vs "enclosure"
- **Explain technical concepts**: Added parenthetical explanations (e.g., "you must visit it in person")
- **Remove jargon**: Dropped "VLAN", replaced "credentials" with "passwords"
- **Real-world consequences**: "anyone can easily reach it" makes tampering risk obvious
- **Tie to readings**: "software updates" connects to article's "outdated software" language

**Design Integration**:
- Indigo primary-colored intro box (border-primary/20, bg-primary/5)
- Consistent icon reuse (AlertTriangle for vulnerabilities, Shield for mitigations)
- Color coding matches bin styling (red for vulnerability, green for mitigation)
- Clear visual hierarchy separates intro from interactive game area

**Pedagogical Benefits**:
- Scaffolds learning by explicitly defining core concepts upfront
- Reduces cognitive load during game interaction
- Card text accessible to complete beginners while preserving security concepts
- Reinforces visual-conceptual associations (red=danger, green=safety)
- Prompts metacognitive reflection before decision-making

**Architect Status**: ✅ Approved as production-ready