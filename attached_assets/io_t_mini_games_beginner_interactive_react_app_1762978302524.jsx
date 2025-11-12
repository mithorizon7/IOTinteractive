import React, { useEffect, useMemo, useState } from "react";
import { Check, X, HelpCircle, TimerReset, RefreshCw, ChevronRight, ListChecks, Undo2 } from "lucide-react";

/**
 * IoT Mini‑Games (Beginner) — v1.2
 *
 * Fixes & changes in this revision:
 *  - Fix: previous file was truncated near the end ("const items" without initializer) → SyntaxError.
 *  - Stable rotation: rotate through all items with a recent‑items buffer and least‑seen fallback to avoid loops.
 *  - Confidence slider and review plan removed, as requested.
 *  - Added lightweight dev test cases for pure helpers (arraysEqual, evaluate on SEQ‑1).
 */

/*************************
 * Localization strings  *
 *************************/
const STRINGS = {
  en: {
    app_title: "IoT Mini‑Games (Beginner)",
    app_sub: "Apply‑what‑you‑just‑read, no jargon, quick feedback.",
    start: "Start",
    continue: "Continue",
    next_item: "Next",
    try_again: "Try again",
    show_hint: "Hint",
    use_hint: "Use hint",
    give_up: "Reveal answer",
    submit: "Submit",
    correct: "Correct",
    incorrect: "Not quite",
    rationale_prompt: "Why? (one sentence)",
    mastery_progress: "Mastery Progress",
    streak: "Streak",
    avg_time: "Avg time",
    seconds: "s",
    hints_used: "Hints",
    view_log: "Telemetry",
    hide_log: "Hide telemetry",
    outcomes_header: "Learning outcomes",
    outcome1: "Decide whether a scenario is IoT and explain why/why not.",
    outcome2: "Choose appropriate connectivity (internet vs private networks; Wi‑Fi, cellular, RFID).",
    outcome3: "Match overlapping tech to its role (5G, big data/AI, digital twins, cybersecurity).",
    outcome4: "Spot common IoT security pitfalls and choose effective mitigations.",
    outcome5: "Sequence the IoT data loop: Sense → Share → Process → Act.",
    you_took_longer: (v: string) => `Right. You took longer here; watch ${v}. One quicker check is to scan the rule first.`,
    blank_guess: "Make your best attempt first; then we’ll help.",
    mastery_unlocked: "Mastery gate met!",
    retry_required: "Let’s correct this and retry once.",
    bin_vulnerability: "Vulnerability",
    bin_mitigation: "Mitigation",
    reset: "Reset",
  },
};

/*************************
 * Content pack (JSON)   *
 *************************/

/** Item schema (adapted to our engine) matches the blueprint keys */

/**
 * Helper note: The content below is authored from the article "What is IoT?" (definition; networks vs internet; overlaps with
 * 5G / big data+AI / digital twins; cybersecurity risks; why now). Each stimulus keeps reading level ≤8.
 */

const CONTENT = {
  metadata: {
    version: "1.2",
    locale: "en",
    outcomes: [
      { id: "OBJ-1", text: STRINGS.en.outcome1 },
      { id: "OBJ-2", text: STRINGS.en.outcome2 },
      { id: "OBJ-3", text: STRINGS.en.outcome3 },
      { id: "OBJ-4", text: STRINGS.en.outcome4 },
      { id: "OBJ-5", text: STRINGS.en.outcome5 },
    ],
    mastery: { streak: 3, max_avg_time_ms: 30000, max_hints: 1 },
  },
  items: [
    /** OBJ‑1 — Decision Lab: Is it IoT (and why)? */
    {
      objective_id: "OBJ-1",
      id: "IOT-1",
      difficulty: "easy",
      mechanic: "DecisionLab",
      stimulus: {
        text: "Bluetooth headphones stream music from a phone. Is this IoT by the definition used here?",
        media: null,
      },
      parameters: {},
      response_type: "decision+rationale",
      options: ["Yes", "No"],
      answer_key: {
        correct: "No",
        rules: ["IoT applications sense an environment, then share, process, and act on that info."],
      },
      misconceptions: [
        {
          id: "any_connected_is_iot",
          detector: (resp: any) => resp?.choice === "Yes",
          feedback: {
            why: "Being wireless alone isn’t enough.",
            contrast: "IoT involves sensing something about the world and acting on it.",
            next_try: "Check whether environment sensing or actuation is present.",
          },
        },
      ],
      hint_ladder: [
        "Does this device sense the environment or act on it automatically?",
        "Our definition needs: sense → share → process → act.",
        "Headphones play audio but don’t sense/act on the environment.",
      ],
      exemplar_response:
        "No. Headphones don’t sense the environment or act on sensed data.",
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["decision buttons"], reading_level: "≤8" },
    },
    {
      objective_id: "OBJ-1",
      id: "IOT-2",
      difficulty: "easy",
      mechanic: "DecisionLab",
      stimulus: {
        text: "A warehouse uses RFID tags on pallets. Gates read the tags and update the inventory system. Is this IoT?",
        media: null,
      },
      parameters: {},
      response_type: "decision+rationale",
      options: ["Yes", "No"],
      answer_key: {
        correct: "Yes",
        rules: ["The system senses (RFID), shares data, processes it, then triggers actions like stock updates."],
      },
      misconceptions: [
        {
          id: "rfid_not_iot",
          detector: (resp: any) => resp?.choice === "No",
          feedback: {
            why: "RFID can be part of IoT when it senses and shares object state.",
            contrast: "RFID readers sense tags and update systems in real time.",
            next_try: "Re‑evaluate with the ‘sense → share → process → act’ loop.",
          },
        },
      ],
      hint_ladder: [
        "What is being sensed here?",
        "RFID readers collect tag IDs at the gate.",
        "The data updates inventory—this is the act step.",
      ],
      exemplar_response:
        "Yes. RFID readers sense tag data and trigger inventory actions.",
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["decision buttons"], reading_level: "≤8" },
    },
    {
      objective_id: "OBJ-1",
      id: "IOT-3",
      difficulty: "medium",
      mechanic: "DecisionLab",
      stimulus: {
        text: "A smart thermostat uses motion sensors and a schedule to heat your house automatically. IoT?",
        media: null,
      },
      parameters: {},
      response_type: "decision+rationale",
      options: ["Yes", "No"],
      answer_key: {
        correct: "Yes",
        rules: ["Sensors detect occupancy; data is processed; heating is adjusted (act)."],
      },
      misconceptions: [
        {
          id: "needs_internet",
          detector: (resp: any) => resp?.choice === "No",
          feedback: {
            why: "The ‘internet’ isn’t required—only a device network that senses and acts.",
            contrast: "IoT can run on local/private networks.",
            next_try: "Focus on the loop, not the public internet.",
          },
        },
      ],
      hint_ladder: [
        "Does it sense the environment?",
        "What is the action taken based on sensed data?",
        "Heating adjusts based on motion/time: classic IoT.",
      ],
      exemplar_response: "Yes—senses motion and time, then acts by changing heat.",
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["decision buttons"], reading_level: "≤8" },
    },
    {
      objective_id: "OBJ-1",
      id: "IOT-4",
      difficulty: "easy",
      mechanic: "DecisionLab",
      stimulus: { text: "A laptop browses the web. Is that IoT?", media: null },
      parameters: {},
      response_type: "decision+rationale",
      options: ["Yes", "No"],
      answer_key: { correct: "No", rules: ["General‑purpose computers are not IoT by themselves."] },
      misconceptions: [
        {
          id: "internet_equals_iot",
          detector: (resp: any) => resp?.choice === "Yes",
          feedback: {
            why: "Internet use alone ≠ IoT.",
            contrast: "We need sensing/actuation of the physical world.",
            next_try: "Look for sense→share→process→act.",
          },
        },
      ],
      hint_ladder: [
        "Is anything physical being sensed?",
        "Browsing alone doesn’t sense the environment.",
        "So this is not IoT.",
      ],
      exemplar_response: "No—no environment sensing or actuation.",
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["decision buttons"], reading_level: "≤8" },
    },

    /** OBJ‑2 — Networks & the myth that IoT requires the internet */
    {
      objective_id: "OBJ-2",
      id: "NET-1",
      difficulty: "medium",
      mechanic: "DecisionLab",
      stimulus: {
        text: "A factory’s sensors report to a local server on the shop floor only. Pick the best connectivity.",
        media: null,
      },
      parameters: {},
      response_type: "decision+rationale",
      options: [
        "Private/local network (no internet)",
        "Public internet via Wi‑Fi",
        "Cellular (4G/5G) + internet",
        "RFID‑only readers (no active radio on sensors)",
      ],
      answer_key: { correct: "Private/local network (no internet)", rules: ["IoT doesn’t require the public internet."] },
      misconceptions: [
        {
          id: "must_use_internet",
          detector: (resp: any) => resp?.choice === "Public internet via Wi‑Fi" || resp?.choice === "Cellular (4G/5G) + internet",
          feedback: {
            why: "The public internet isn’t required for IoT to work.",
            contrast: "Local networks can fully support IoT apps.",
            next_try: "Choose a non‑internet option when scope is on‑prem only.",
          },
        },
      ],
      hint_ladder: [
        "Where does the data need to go?",
        "Only to a local server.",
        "Then a private/local network fits best.",
      ],
      exemplar_response: "Private/local network—keeps data on site; internet not required.",
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["decision buttons"], reading_level: "≤8" },
    },
    {
      objective_id: "OBJ-2",
      id: "NET-2",
      difficulty: "medium",
      mechanic: "DecisionLab",
      stimulus: { text: "A delivery firm tracks boxes at gates with short‑range readers. Best connectivity?", media: null },
      parameters: {},
      response_type: "decision+rationale",
      options: [
        "RFID‑only readers (no active radio on sensors)",
        "Public internet via Wi‑Fi",
        "Cellular (4G/5G) + internet",
        "Private/local network (no internet)",
      ],
      answer_key: { correct: "RFID‑only readers (no active radio on sensors)", rules: ["RFID gates scan passive tags."] },
      misconceptions: [
        {
          id: "rfid_misunderstood",
          detector: (resp: any) => resp?.choice !== "RFID‑only readers (no active radio on sensors)",
          feedback: {
            why: "The scenario uses passive RFID tags.",
            contrast: "Readers sense tags; items don’t need Wi‑Fi/cellular radios.",
            next_try: "Pick the RFID option.",
          },
        },
      ],
      hint_ladder: ["What tech scans tags at gates?", "Think RFID.", "Choose RFID readers."],
      exemplar_response: "RFID readers—gates scan passive tags; no Wi‑Fi on boxes.",
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["decision buttons"], reading_level: "≤8" },
    },
    {
      objective_id: "OBJ-2",
      id: "NET-3",
      difficulty: "hard",
      mechanic: "DecisionLab",
      stimulus: { text: "A car uploads maintenance data to the manufacturer from anywhere. Best connectivity?", media: null },
      parameters: {},
      response_type: "decision+rationale",
      options: [
        "Private/local network (no internet)",
        "Public internet via Wi‑Fi",
        "Cellular (4G/5G) + internet",
        "RFID‑only readers (no active radio on sensors)",
      ],
      answer_key: { correct: "Cellular (4G/5G) + internet", rules: ["Wide‑area connectivity is needed on the road."] },
      misconceptions: [
        {
          id: "wifi_everywhere",
          detector: (resp: any) => resp?.choice === "Public internet via Wi‑Fi",
          feedback: {
            why: "Wi‑Fi lacks coverage away from hotspots.",
            contrast: "Cellular is designed for mobility & coverage.",
            next_try: "Pick cellular + internet.",
          },
        },
      ],
      hint_ladder: ["Does it need coverage while moving?", "Wi‑Fi is limited to hotspots.", "Use cellular + internet."],
      exemplar_response: "Cellular + internet for coverage anywhere.",
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["decision buttons"], reading_level: "≤8" },
    },

    /** OBJ‑3 — Overlaps & roles (Match pairs) */
    {
      objective_id: "OBJ-3",
      id: "MATCH-1",
      difficulty: "medium",
      mechanic: "Match",
      stimulus: {
        text: "Match each technology to the role it plays in IoT.",
        media: null,
      },
      parameters: {},
      response_type: "match",
      pairs_left: ["5G", "Big data / AI", "Digital twin", "Cybersecurity"],
      pairs_right: [
        "High‑capacity wireless for many devices",
        "Analyze large sensor streams to find patterns",
        "Live virtual copy of a physical system",
        "Reduce risks (patching, segmentation, physical safeguards)",
      ],
      answer_key: {
        correct: {
          "5G": "High‑capacity wireless for many devices",
          "Big data / AI": "Analyze large sensor streams to find patterns",
          "Digital twin": "Live virtual copy of a physical system",
          "Cybersecurity": "Reduce risks (patching, segmentation, physical safeguards)",
        },
      },
      misconceptions: [
        {
          id: "twin_as_3d_only",
          detector: (resp: any) => resp?.pairs && resp.pairs["Digital twin"] === "High‑capacity wireless for many devices",
          feedback: {
            why: "A digital twin isn’t just 3D or network tech; it’s a live data‑fed model.",
            contrast: "Sensors feed the twin to mirror the real object.",
            next_try: "Match digital twin to ‘live virtual copy’.",
          },
        },
      ],
      hint_ladder: [
        "Which tech talks; which tech thinks; which tech mirrors; which tech protects?",
        "5G talks; AI thinks; twin mirrors; security protects.",
        "Map accordingly.",
      ],
      exemplar_response: "5G→capacity; AI→analyze; twin→live copy; security→reduce risk.",
      scoring: { base: 1, time_ms_cap: 60000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["left list", "right list", "pair buttons"], reading_level: "≤8" },
    },

    /** OBJ‑4 — Security triage (click‑to‑bin) */
    {
      objective_id: "OBJ-4",
      id: "TRIAGE-1",
      difficulty: "medium",
      mechanic: "Triage",
      stimulus: {
        text: "Sort each card into Vulnerability or Mitigation.",
        media: null,
      },
      parameters: {},
      response_type: "triage",
      cards: [
        "Default password on outdoor camera",
        "No remote update mechanism",
        "Network segmentation (separate IoT VLAN)",
        "Strong, unique credentials",
        "Physically accessible device enclosure",
        "Regular patching policy",
      ],
      bins: [STRINGS.en.bin_vulnerability, STRINGS.en.bin_mitigation],
      answer_key: {
        correct: {
          Vulnerability: [
            "Default password on outdoor camera",
            "No remote update mechanism",
            "Physically accessible device enclosure",
          ],
          Mitigation: [
            "Network segmentation (separate IoT VLAN)",
            "Strong, unique credentials",
            "Regular patching policy",
          ],
        },
      },
      misconceptions: [
        {
          id: "segmentation_confused",
          detector: (resp: any) => Array.isArray(resp?.bins?.Vulnerability) && resp.bins.Vulnerability.includes("Network segmentation (separate IoT VLAN)"),
          feedback: {
            why: "Segmentation limits blast radius if a device is compromised.",
            contrast: "It’s a defensive control, not a risk by itself.",
            next_try: "Place segmentation under Mitigation.",
          },
        },
      ],
      hint_ladder: [
        "Ask: does this increase risk or reduce it?",
        "Passwords & patching reduce risk.",
        "Physical access & default creds increase risk.",
      ],
      exemplar_response:
        "Vulns: default creds, no updates, physical access. Mitigations: segmentation, strong creds, patching.",
      scoring: { base: 1, time_ms_cap: 60000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["cards", "bins"], reading_level: "≤8" },
    },

    /** OBJ‑5 — Sequencer (order the loop) */
    {
      objective_id: "OBJ-5",
      id: "SEQ-1",
      difficulty: "easy",
      mechanic: "Sequencer",
      stimulus: { text: "Order the IoT loop from first to last.", media: null },
      parameters: {},
      response_type: "order",
      steps: ["Act", "Share", "Process/Analyze", "Sense"],
      answer_key: { correctOrder: ["Sense", "Share", "Process/Analyze", "Act"] },
      misconceptions: [
        {
          id: "act_first",
          detector: (resp: any) => resp?.order && resp.order[0] === "Act",
          feedback: {
            why: "Action comes after data is sensed and analyzed.",
            contrast: "Correct order is Sense → Share → Process → Act.",
            next_try: "Place Sense at the start.",
          },
        },
      ],
      hint_ladder: [
        "What must happen before action?",
        "We need data and analysis first.",
        "Sense then share then process then act.",
      ],
      exemplar_response: "Sense → Share → Process/Analyze → Act.",
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["reorder list"], reading_level: "≤8" },
    },
  ],
};

/*************************
 * Utility helpers       *
 *************************/
const now = () => Date.now();
const msToS = (ms: number) => Math.round(ms / 100) / 10; // one decimal

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function arraysEqual<T>(a: T[] | undefined, b: T[] | undefined): boolean {
  return Array.isArray(a) && Array.isArray(b) && a.length === b.length && a.every((x, i) => x === b[i]);
}

/*************************
 * Telemetry store       *
 *************************/
const TELEMETRY_KEY = "iot_minigames_telemetry_v1";

function recordEvent(evt: any) {
  try {
    const arr = JSON.parse(localStorage.getItem(TELEMETRY_KEY) || "[]");
    arr.push({ ...evt, ts: new Date().toISOString() });
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(arr));
  } catch {
    // noop
  }
  // eslint-disable-next-line no-console
  console.log("[telemetry]", evt);
}

function getTelemetry(): any[] {
  try {
    return JSON.parse(localStorage.getItem(TELEMETRY_KEY) || "[]");
  } catch {
    return [];
  }
}

/*************************
 * Engine (evaluate)     *
 *************************/

function evaluate(item: any, response: any): { correct: boolean; misconception_id?: string } {
  if (item.response_type === "decision+rationale") {
    const correct = response?.choice === item.answer_key.correct;
    if (!correct && Array.isArray(item.misconceptions)) {
      const mis = item.misconceptions.find((m: any) => {
        try {
          return typeof m.detector === "function" ? m.detector(response) : false;
        } catch {
          return false;
        }
      });
      return { correct, misconception_id: mis?.id };
    }
    return { correct };
  }

  if (item.response_type === "order") {
    const correct = arraysEqual(response?.order, item.answer_key.correctOrder);
    const mis = !correct && item.misconceptions?.find((m: any) => m.detector?.(response));
    return { correct, misconception_id: mis?.id };
  }

  if (item.response_type === "match") {
    const expected = item.answer_key.correct;
    const pairs = response?.pairs || {};
    const keys = Object.keys(expected || {});
    const correct = keys.every((k) => expected[k] === pairs[k]) && keys.length === Object.keys(pairs).length;
    const mis = !correct && item.misconceptions?.find((m: any) => m.detector?.(response));
    return { correct, misconception_id: mis?.id };
  }

  if (item.response_type === "triage") {
    const exp = item.answer_key.correct || {};
    const bins = response?.bins || {};
    const isCorr = (binName: string) => {
      const setA = new Set<string>((bins[binName] || []).slice().sort());
      const setB = new Set<string>((exp[binName] || []).slice().sort());
      if (setA.size !== setB.size) return false;
      for (const v of Array.from(setA)) if (!setB.has(v)) return false;
      return true;
    };
    const correct = isCorr("Vulnerability") && isCorr("Mitigation");
    const mis = !correct && item.misconceptions?.find((m: any) => m.detector?.(response));
    return { correct, misconception_id: mis?.id };
  }

  return { correct: false };
}

/*************************
 * Dev test cases        *
 *************************/

function runDevTests() {
  try {
    console.assert(arraysEqual([1, 2, 3], [1, 2, 3]), "arraysEqual should be true for identical arrays");
    console.assert(!arraysEqual([1, 2], [2, 1]), "arraysEqual should be false for different order");

    const seqItem = (CONTENT.items as any[]).find((it) => it.id === "SEQ-1");
    if (seqItem) {
      const good = evaluate(seqItem, { order: seqItem.answer_key.correctOrder });
      const bad = evaluate(seqItem, { order: [...seqItem.answer_key.correctOrder].reverse() });
      console.assert(good.correct === true, "evaluate should mark SEQ-1 correct order as correct");
      console.assert(bad.correct === false, "evaluate should mark SEQ-1 reversed order as incorrect");
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn("Dev tests encountered an error", e);
  }
}

if (typeof process !== "undefined" && (process as any).env && (process as any).env.NODE_ENV === "development") {
  runDevTests();
}

/*************************
 * Core Components       *
 *************************/

function Header({ mastery, locale = "en" }: { mastery: any; locale?: string }) {
  const t = STRINGS[locale as keyof typeof STRINGS];
  return (
    <header className="mx-auto w-full max-w-5xl px-4 py-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{t.app_title}</h1>
          <p className="text-sm text-gray-600">{t.app_sub}</p>
        </div>
        <div className="flex gap-6" aria-label={t.mastery_progress}>
          <div className="text-center">
            <div className="text-xs text-gray-500">{t.streak}</div>
            <div className="text-xl font-semibold">{mastery.streak}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">{t.avg_time}</div>
            <div className="text-xl font-semibold">
              {mastery.avgTimeS}
              <span className="text-xs">{t.seconds}</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">{t.hints_used}</div>
            <div className="text-xl font-semibold">{mastery.hints}</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function OutcomeList({ locale = "en" }: { locale?: string }) {
  const t = STRINGS[locale as keyof typeof STRINGS];
  return (
    <section className="mx-auto w-full max-w-5xl px-4">
      <h2 className="mb-2 text-lg font-semibold">{t.outcomes_header}</h2>
      <ul className="grid gap-2 md:grid-cols-2">
        {CONTENT.metadata.outcomes.map((o: any) => (
          <li key={o.id} className="rounded-xl border p-3 text-sm leading-snug">
            <span className="mr-2 rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">{o.id}</span>
            {o.text}
          </li>
        ))}
      </ul>
    </section>
  );
}

function TelemetryPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const data = getTelemetry();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 bg-black/50" role="dialog" aria-modal="true">
      <div className="absolute inset-x-0 bottom-0 mx-auto max-w-5xl rounded-t-2xl bg-white p-4 shadow-xl">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Telemetry</h3>
          <button
            className="rounded-full p-2 hover:bg-gray-100 focus:outline-none focus:ring"
            onClick={onClose}
            aria-label="Close telemetry"
          >
            <X size={18} />
          </button>
        </div>
        <div className="max-h-72 overflow-auto rounded border bg-gray-50 p-3 text-xs">
          <pre className="whitespace-pre-wrap break-words">{JSON.stringify(data, null, 2)}</pre>
        </div>
      </div>
    </div>
  );
}

/***********************
 * Item renderers       *
 ***********************/

function DecisionLab({ item, onSubmit, onHint, hintUsed, locale = "en" }: { item: any; onSubmit: (r: any) => void; onHint: () => void; hintUsed: boolean; locale?: string }) {
  const t = STRINGS[locale as keyof typeof STRINGS];
  const [choice, setChoice] = useState<string | null>(null);
  const [rationale, setRationale] = useState("");

  return (
    <div className="space-y-4" aria-live="polite">
      <p className="text-base leading-relaxed">{item.stimulus.text}</p>
      <div className="grid gap-2 md:grid-cols-2" role="radiogroup" aria-label="decision choices">
        {item.options.map((opt: string) => (
          <label
            key={opt}
            className={`flex cursor-pointer items-center gap-2 rounded-xl border p-3 ${
              choice === opt ? "border-indigo-500 ring-1 ring-indigo-500" : "hover:bg-gray-50"
            }`}
          >
            <input
              type="radio"
              className="h-4 w-4"
              name={`choice-${item.id}`}
              value={opt}
              checked={choice === opt}
              onChange={() => setChoice(opt)}
              aria-label={opt}
            />
            <span className="text-sm font-medium">{opt}</span>
          </label>
        ))}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium" htmlFor={`rat-${item.id}`}>
          {t.rationale_prompt}
        </label>
        <textarea
          id={`rat-${item.id}`}
          className="w-full rounded-xl border p-2 text-sm focus:outline-none focus:ring"
          rows={2}
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          aria-label="rationale"
        />
      </div>

      <div className="flex gap-2">
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring"
          onClick={() => onSubmit({ choice, rationale })}
          aria-label={t.submit}
        >
          <Check size={16} /> {t.submit}
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring"
          onClick={onHint}
          aria-label={t.show_hint}
        >
          <HelpCircle size={16} /> {hintUsed ? t.use_hint : t.show_hint}
        </button>
      </div>
    </div>
  );
}

function Triage({ item, onSubmit, onHint, hintUsed, locale = "en" }: { item: any; onSubmit: (r: any) => void; onHint: () => void; hintUsed: boolean; locale?: string }) {
  const t = STRINGS[locale as keyof typeof STRINGS];
  const [unplaced, setUnplaced] = useState<string[]>(item.cards);
  const [bins, setBins] = useState<Record<string, string[]>>({ [t.bin_vulnerability]: [], [t.bin_mitigation]: [] });

  const place = (card: string, bin: string) => {
    setUnplaced((u) => u.filter((c) => c !== card));
    setBins((b) => ({ ...b, [bin]: [...b[bin], card] }));
  };

  const remove = (card: string, bin: string) => {
    setBins((b) => ({ ...b, [bin]: b[bin].filter((c) => c !== card) }));
    setUnplaced((u) => [...u, card]);
  };

  const reset = () => {
    setUnplaced(item.cards);
    setBins({ [t.bin_vulnerability]: [], [t.bin_mitigation]: [] });
  };

  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed">{item.stimulus.text}</p>

      <div className="grid gap-4 md:grid-cols-3" aria-label="triage area">
        <div>
          <h4 className="mb-2 text-sm font-semibold">Unplaced</h4>
          <div className="space-y-2">
            {unplaced.map((c) => (
              <button
                key={c}
                onClick={() => place(c, t.bin_vulnerability)}
                className="flex w-full items-center justify-between rounded-xl border bg-white p-2 text-left text-sm hover:bg-gray-50 focus:outline-none focus:ring"
                aria-label={`Place ${c} in Vulnerability`}
              >
                <span>{c}</span>
                <span className="rounded bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700">{t.bin_vulnerability}</span>
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">{t.bin_vulnerability}</h4>
          <div className="space-y-2">
            {bins[t.bin_vulnerability].map((c) => (
              <div key={c} className="flex items-center justify-between rounded-xl border p-2 text-sm">
                <span>{c}</span>
                <button
                  className="rounded p-1 text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring"
                  aria-label={`Move ${c} to Mitigation`}
                  onClick={() => place(c, t.bin_mitigation)}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="mb-2 text-sm font-semibold">{t.bin_mitigation}</h4>
          <div className="space-y-2">
            {bins[t.bin_mitigation].map((c) => (
              <div key={c} className="flex items-center justify-between rounded-xl border p-2 text-sm">
                <span>{c}</span>
                <button
                  className="rounded p-1 text-gray-500 hover:bg-gray-50 focus:outline-none focus:ring"
                  aria-label={`Remove ${c}`}
                  onClick={() => remove(c, t.bin_mitigation)}
                >
                  <Undo2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring"
          onClick={() => onSubmit({ bins })}
        >
          <Check size={16} /> Submit
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring"
          onClick={onHint}
        >
          <HelpCircle size={16} /> {STRINGS[locale as keyof typeof STRINGS].use_hint}
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring"
          onClick={reset}
        >
          <TimerReset size={16} /> {STRINGS[locale as keyof typeof STRINGS].reset}
        </button>
      </div>
    </div>
  );
}

function Sequencer({ item, onSubmit, onHint, hintUsed, locale = "en" }: { item: any; onSubmit: (r: any) => void; onHint: () => void; hintUsed: boolean; locale?: string }) {
  const [order, setOrder] = useState<string[]>(shuffle(item.steps));

  const move = (idx: number, dir: number) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= order.length) return;
    const a = order.slice();
    [a[idx], a[ni]] = [a[ni], a[idx]];
    setOrder(a);
  };

  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed">{item.stimulus.text}</p>
      <ul className="space-y-2" aria-label="reorder list">
        {order.map((s, i) => (
          <li key={s} className="flex items-center justify-between rounded-xl border p-2 text-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-6 w-6 items-center justify-center rounded bg-gray-100 font-semibold">{i + 1}</span>
              <span>{s}</span>
            </div>
            <div className="flex gap-1">
              <button
                className="rounded border px-2 py-1 focus:outline-none focus:ring"
                onClick={() => move(i, -1)}
                aria-label={`Move ${s} up`}
              >
                ↑
              </button>
              <button
                className="rounded border px-2 py-1 focus:outline-none focus:ring"
                onClick={() => move(i, 1)}
                aria-label={`Move ${s} down`}
              >
                ↓
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <button
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring"
          onClick={() => onSubmit({ order })}
        >
          <Check size={16} /> {STRINGS[locale as keyof typeof STRINGS].submit}
        </button>
        <button
          className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring"
          onClick={onHint}
        >
          <HelpCircle size={16} /> {hintUsed ? STRINGS[locale as keyof typeof STRINGS].use_hint : STRINGS[locale as keyof typeof STRINGS].show_hint}
        </button>
      </div>
    </div>
  );
}

function MatchPairs({ item, onSubmit, onHint, hintUsed, locale = "en" }: { item: any; onSubmit: (r: any) => void; onHint: () => void; hintUsed: boolean; locale?: string }) {
  const [pairs, setPairs] = useState<Record<string, string>>({});

  const unpairedLeft = item.pairs_left.filter((l: string) => !(l in pairs));
  const unpairedRight = item.pairs_right.filter((r: string) => !Object.values(pairs).includes(r));

  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [selRight, setSelRight] = useState<string | null>(null);

  const addPair = () => {
    if (!selLeft || !selRight) return;
    setPairs((p) => ({ ...p, [selLeft]: selRight }));
    setSelLeft(null);
    setSelRight(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-base leading-relaxed">{item.stimulus.text}</p>

      <div className="grid gap-4 md:grid-cols-2">
        <div aria-label={(STRINGS[locale as keyof typeof STRINGS] as any).aria_left || "left list"}>
          <h4 className="mb-2 text-sm font-semibold">Terms</h4>
          <div className="space-y-2">
            {unpairedLeft.map((l: string) => (
              <button
                key={l}
                onClick={() => setSelLeft(l)}
                className={`w-full rounded-xl border p-2 text-left text-sm focus:outline-none focus:ring ${
                  selLeft === l ? "border-indigo-500 ring-1 ring-indigo-500" : "hover:bg-gray-50"
                }`}
                aria-label={`Select ${l}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div aria-label={(STRINGS[locale as keyof typeof STRINGS] as any).aria_right || "right list"}>
          <h4 className="mb-2 text-sm font-semibold">Roles</h4>
          <div className="space-y-2">
            {unpairedRight.map((r: string) => (
              <button
                key={r}
                onClick={() => setSelRight(r)}
                className={`w-full rounded-xl border p-2 text-left text-sm focus:outline-none focus:ring ${
                  selRight === r ? "border-indigo-500 ring-1 ring-indigo-500" : "hover:bg-gray-50"
                }`}
                aria-label={`Select ${r}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          className="rounded-xl border px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring"
          onClick={addPair}
          aria-label="Add pair"
        >
          <ListChecks size={16} /> Pair selected
        </button>
        <button
          className="rounded-xl border px-3 py-2 hover:bg-gray-50 focus:outline-none focus:ring"
          onClick={onHint}
          aria-label={STRINGS[locale as keyof typeof STRINGS].show_hint}
        >
          <HelpCircle size={16} /> {hintUsed ? STRINGS[locale as keyof typeof STRINGS].use_hint : STRINGS[locale as keyof typeof STRINGS].show_hint}
        </button>
      </div>

      <div>
        <h4 className="mb-2 text-sm font-semibold">Your pairs</h4>
        <ul className="grid gap-2 md:grid-cols-2">
          {Object.entries(pairs).map(([l, r]) => (
            <li key={l} className="rounded-xl border p-2 text-sm">
              <span className="font-semibold">{l}</span>
              <span className="mx-2">→</span>
              <span>{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring"
        onClick={() => onSubmit({ pairs })}
      >
        <Check size={16} /> {STRINGS[locale as keyof typeof STRINGS].submit}
      </but