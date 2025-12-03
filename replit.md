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
- **Feedback System**: Provides misconception-specific feedback and a progressive hint ladder. The Triage game now features an inline feedback system, keeping the user on the same page until all answers are correct, with visual cues (blue/amber borders) and tooltips for incorrect cards.
- **Accessibility**: Full keyboard navigation, ARIA labels, WCAG AA compliant color contrast, semantic HTML, and `aria-live="polite"` regions for screen reader announcements are implemented.

### System Design Choices
The application is a pure frontend solution with no backend persistence, storing telemetry events and session progress in `localStorage`. Content is externalized in JSON translation files for easy internationalization, allowing for a self-contained, deployable unit without server-side dependencies beyond serving static files. The internationalization architecture uses `react-i18next` with a clear separation of UI strings and educational content, enabling translators to work solely with JSON files.

## Translation Workflow

### Internationalization Architecture
The application supports multiple languages (English, Russian, Latvian) using `react-i18next`. Content is separated into:
- **UI strings** (`client/src/locales/{lang}/ui.json`): Button labels, titles, static text
- **Educational content** (`client/src/locales/{lang}/content.json`): Questions, options, hints, feedback

### Key i18n Design Decisions
1. **Locale-Independent Evaluation**: All answer evaluation uses stable IDs instead of text comparison:
   - DecisionLab: `option_ids` array with `answer_correct_id` (e.g., `opt_yes`, `opt_no`)
   - MatchPairs: `answer_correct_indices` for index-based pair matching
   - Triage: Card indices for classification validation

2. **Translation Workflow**:
   - Translators only edit JSON files in `client/src/locales/{lang}/`
   - No code changes required for adding translations
   - Keep `option_ids` and `answer_correct_indices` identical across all locales

3. **Adding a New Language**:
   - Copy `client/src/locales/en/` folder to new locale (e.g., `de/`)
   - Translate all string values in `ui.json` and `content.json`
   - Add the locale to `client/src/i18n/config.ts` resources
   - Add language option to `LanguageSwitcher` component

### Content Structure
```json
// content.json structure for DecisionLab items
{
  "ITEM-ID": {
    "stimulus": "Question text",
    "option_ids": ["opt_a", "opt_b", "opt_c"],  // Stable IDs
    "options": ["Option A text", "Option B text", "Option C text"],
    "answer_correct_id": "opt_a",  // Correct answer ID
    "answer_correct": "Option A text"  // Display text
  }
}

// content.json structure for MatchPairs items
{
  "MATCH-ID": {
    "pairs_left": ["Term 1", "Term 2"],
    "pairs_right": ["Definition 1", "Definition 2"],
    "answer_correct_indices": {"0": 0, "1": 1}  // Index mapping
  }
}
```

## Error Handling
- **ErrorBoundary**: Wraps the main application to catch and gracefully handle runtime errors
- **Session Persistence**: Automatically saves progress to localStorage, allowing session recovery

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