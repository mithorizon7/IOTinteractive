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
The application is a pure frontend solution with no backend persistence, storing telemetry events and session progress in `localStorage`. Content is hardcoded within the frontend, allowing for a self-contained, deployable unit without server-side dependencies beyond serving static files.

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

## Recent Changes

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

**Design Integration**:
- Indigo primary-colored intro box (border-primary/20, bg-primary/5)
- Consistent icon reuse (AlertTriangle for vulnerabilities, Shield for mitigations)
- Color coding matches bin styling (red for vulnerability, green for mitigation)
- Clear visual hierarchy separates intro from interactive game area

**Pedagogical Benefits**:
- Scaffolds learning by explicitly defining core concepts upfront
- Reduces cognitive load during game interaction
- Reinforces visual-conceptual associations (red=danger, green=safety)
- Prompts metacognitive reflection before decision-making

**Architect Status**: ✅ Approved as production-ready