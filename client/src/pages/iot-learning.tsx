import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/config";
import {
  Check,
  X,
  HelpCircle,
  TimerIcon,
  RefreshCw,
  ChevronRight,
  ListChecks,
  Undo2,
  Trophy,
  Clock,
  Flame,
  Download,
  GripVertical,
  AlertTriangle,
  Shield,
  Package,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Languages } from "lucide-react";

/**
 * IoT Interactive Learning Engine
 * 
 * Complete implementation with:
 * - Game mechanics: DecisionLab, Triage, Sequencer, MatchPairs
 * - Feedback system with misconception-specific messaging
 * - Mastery tracking (streak, avg time, hints)
 * - Sequential-then-adaptive progression
 * - Telemetry recording
 * - Accessible, beautiful UI following design guidelines
 */

/*************************
 * Types & Interfaces    *
 *************************/
interface Item {
  objective_id: string;
  id: string;
  difficulty: string;
  mechanic: string;
  stimulus: {
    text: string;
    media: null | string;
  };
  parameters: Record<string, any>;
  response_type: string;
  options?: string[];
  pairs_left?: string[];
  pairs_right?: string[];
  cards?: string[];
  bins?: string[];
  steps?: string[];
  answer_key: any;
  misconceptions?: Array<{
    id: string;
    detector: (resp: any) => boolean;
    feedback: {
      why: string;
      contrast: string;
      next_try: string;
    };
  }>;
  hint_ladder: string[];
  exemplar_response: string;
  scoring: any;
  mastery_criterion: any;
  telemetry_fields: string[];
  accessibility: any;
}

interface FeedbackState {
  correct: boolean;
  misconception_id?: string;
  latency_ms: number;
  hints_used: number;
}

interface HistoryEntry {
  item_id: string;
  correct: boolean;
  latency_ms: number;
  hints_used: number;
  misconception_id?: string;
  retries?: number;
}

/*************************
 * Content pack builder  *
 *************************/
// Helper function to load translated content
function getTranslatedContent() {
  const t = i18n.t.bind(i18n);
  
  return {
    metadata: {
      version: "1.2",
      locale: i18n.language || "en",
      outcomes: [
        { id: "OBJ-1", text: t("content:outcomes.OBJ-1") },
        { id: "OBJ-2", text: t("content:outcomes.OBJ-2") },
        { id: "OBJ-3", text: t("content:outcomes.OBJ-3") },
        { id: "OBJ-4", text: t("content:outcomes.OBJ-4") },
        { id: "OBJ-5", text: t("content:outcomes.OBJ-5") },
      ],
      mastery: { streak: 3, max_avg_time_ms: 30000, max_hints: 1 },
    },
  items: [
    {
      objective_id: "OBJ-1",
      id: "IOT-1",
      difficulty: "easy",
      mechanic: "DecisionLab",
      stimulus: {
        text: t("content:items.IOT-1.stimulus"),
        media: null,
      },
      parameters: {},
      response_type: "decision+rationale",
      options: t("content:items.IOT-1.options", { returnObjects: true }) as string[],
      answer_key: {
        correct: t("content:items.IOT-1.answer_correct"),
        rules: t("content:items.IOT-1.answer_rules", { returnObjects: true }) as string[],
      },
      misconceptions: [
        {
          id: "any_connected_is_iot",
          detector: (resp: any) => resp?.choice === "Yes",
          feedback: {
            why: t("content:items.IOT-1.misconceptions.any_connected_is_iot.why"),
            contrast: t("content:items.IOT-1.misconceptions.any_connected_is_iot.contrast"),
            next_try: t("content:items.IOT-1.misconceptions.any_connected_is_iot.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.IOT-1.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.IOT-1.exemplar"),
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
        text: t("content:items.IOT-2.stimulus"),
        media: null,
      },
      parameters: {},
      response_type: "decision+rationale",
      options: t("content:items.IOT-2.options", { returnObjects: true }) as string[],
      answer_key: {
        correct: t("content:items.IOT-2.answer_correct"),
        rules: t("content:items.IOT-2.answer_rules", { returnObjects: true }) as string[],
      },
      misconceptions: [
        {
          id: "rfid_not_iot",
          detector: (resp: any) => resp?.choice === "No",
          feedback: {
            why: t("content:items.IOT-2.misconceptions.rfid_not_iot.why"),
            contrast: t("content:items.IOT-2.misconceptions.rfid_not_iot.contrast"),
            next_try: t("content:items.IOT-2.misconceptions.rfid_not_iot.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.IOT-2.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.IOT-2.exemplar"),
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
        text: t("content:items.IOT-3.stimulus"),
        media: null,
      },
      parameters: {},
      response_type: "decision+rationale",
      options: t("content:items.IOT-3.options", { returnObjects: true }) as string[],
      answer_key: {
        correct: t("content:items.IOT-3.answer_correct"),
        rules: t("content:items.IOT-3.answer_rules", { returnObjects: true }) as string[],
      },
      misconceptions: [
        {
          id: "needs_internet",
          detector: (resp: any) => resp?.choice === "No",
          feedback: {
            why: t("content:items.IOT-3.misconceptions.needs_internet.why"),
            contrast: t("content:items.IOT-3.misconceptions.needs_internet.contrast"),
            next_try: t("content:items.IOT-3.misconceptions.needs_internet.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.IOT-3.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.IOT-3.exemplar"),
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
      stimulus: { text: t("content:items.IOT-4.stimulus"), media: null },
      parameters: {},
      response_type: "decision+rationale",
      options: t("content:items.IOT-4.options", { returnObjects: true }) as string[],
      answer_key: { correct: t("content:items.IOT-4.answer_correct"), rules: t("content:items.IOT-4.answer_rules", { returnObjects: true }) as string[] },
      misconceptions: [
        {
          id: "internet_equals_iot",
          detector: (resp: any) => resp?.choice === "Yes",
          feedback: {
            why: t("content:items.IOT-4.misconceptions.internet_equals_iot.why"),
            contrast: t("content:items.IOT-4.misconceptions.internet_equals_iot.contrast"),
            next_try: t("content:items.IOT-4.misconceptions.internet_equals_iot.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.IOT-4.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.IOT-4.exemplar"),
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["decision buttons"], reading_level: "≤8" },
    },
    {
      objective_id: "OBJ-2",
      id: "NET-1",
      difficulty: "medium",
      mechanic: "DecisionLab",
      stimulus: {
        text: t("content:items.NET-1.stimulus"),
        media: null,
      },
      parameters: {},
      response_type: "decision+rationale",
      options: t("content:items.NET-1.options", { returnObjects: true }) as string[],
      answer_key: { correct: t("content:items.NET-1.answer_correct"), rules: t("content:items.NET-1.answer_rules", { returnObjects: true }) as string[] },
      misconceptions: [
        {
          id: "must_use_internet",
          detector: (resp: any) => {
            const opts = t("content:items.NET-1.options", { returnObjects: true }) as string[];
            return resp?.choice === opts[1] || resp?.choice === opts[2];
          },
          feedback: {
            why: t("content:items.NET-1.misconceptions.must_use_internet.why"),
            contrast: t("content:items.NET-1.misconceptions.must_use_internet.contrast"),
            next_try: t("content:items.NET-1.misconceptions.must_use_internet.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.NET-1.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.NET-1.exemplar"),
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
      stimulus: { text: t("content:items.NET-2.stimulus"), media: null },
      parameters: {},
      response_type: "decision+rationale",
      options: t("content:items.NET-2.options", { returnObjects: true }) as string[],
      answer_key: { correct: t("content:items.NET-2.answer_correct"), rules: t("content:items.NET-2.answer_rules", { returnObjects: true }) as string[] },
      misconceptions: [
        {
          id: "rfid_misunderstood",
          detector: (resp: any) => resp?.choice !== t("content:items.NET-2.answer_correct"),
          feedback: {
            why: t("content:items.NET-2.misconceptions.rfid_misunderstood.why"),
            contrast: t("content:items.NET-2.misconceptions.rfid_misunderstood.contrast"),
            next_try: t("content:items.NET-2.misconceptions.rfid_misunderstood.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.NET-2.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.NET-2.exemplar"),
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
      stimulus: { text: t("content:items.NET-3.stimulus"), media: null },
      parameters: {},
      response_type: "decision+rationale",
      options: t("content:items.NET-3.options", { returnObjects: true }) as string[],
      answer_key: { correct: t("content:items.NET-3.answer_correct"), rules: t("content:items.NET-3.answer_rules", { returnObjects: true }) as string[] },
      misconceptions: [
        {
          id: "wifi_everywhere",
          detector: (resp: any) => {
            const opts = t("content:items.NET-3.options", { returnObjects: true }) as string[];
            return resp?.choice === opts[1];
          },
          feedback: {
            why: t("content:items.NET-3.misconceptions.wifi_everywhere.why"),
            contrast: t("content:items.NET-3.misconceptions.wifi_everywhere.contrast"),
            next_try: t("content:items.NET-3.misconceptions.wifi_everywhere.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.NET-3.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.NET-3.exemplar"),
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["decision buttons"], reading_level: "≤8" },
    },
    {
      objective_id: "OBJ-3",
      id: "MATCH-1",
      difficulty: "medium",
      mechanic: "Match",
      stimulus: {
        text: t("content:items.MATCH-1.stimulus"),
        media: null,
      },
      parameters: {},
      response_type: "match",
      pairs_left: t("content:items.MATCH-1.pairs_left", { returnObjects: true }) as string[],
      pairs_right: t("content:items.MATCH-1.pairs_right", { returnObjects: true }) as string[],
      answer_key: {
        correct: t("content:items.MATCH-1.answer_correct", { returnObjects: true }) as Record<string, string>,
      },
      misconceptions: [
        {
          id: "twin_as_3d_only",
          detector: (resp: any) => {
            const correctAns = t("content:items.MATCH-1.answer_correct", { returnObjects: true }) as Record<string, string>;
            const pairs_left = t("content:items.MATCH-1.pairs_left", { returnObjects: true }) as string[];
            return resp?.pairs && resp.pairs[pairs_left[2]] === Object.values(correctAns)[0];
          },
          feedback: {
            why: t("content:items.MATCH-1.misconceptions.twin_as_3d_only.why"),
            contrast: t("content:items.MATCH-1.misconceptions.twin_as_3d_only.contrast"),
            next_try: t("content:items.MATCH-1.misconceptions.twin_as_3d_only.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.MATCH-1.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.MATCH-1.exemplar"),
      scoring: { base: 1, time_ms_cap: 60000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["left list", "right list", "pair buttons"], reading_level: "≤8" },
    },
    {
      objective_id: "OBJ-4",
      id: "TRIAGE-1",
      difficulty: "medium",
      mechanic: "Triage",
      stimulus: {
        text: t("content:items.TRIAGE-1.stimulus"),
        media: null,
      },
      parameters: {},
      response_type: "triage",
      cards: t("content:items.TRIAGE-1.cards", { returnObjects: true }) as string[],
      bins: [
        { id: "vulnerability", label: t("ui:bin_vulnerability") },
        { id: "mitigation", label: t("ui:bin_mitigation") },
      ],
      answer_key: {
        correct: t("content:items.TRIAGE-1.answer_correct", { returnObjects: true }) as Record<string, string[]>,
      },
      misconceptions: [
        {
          id: "segmentation_confused",
          detector: (resp: any) => {
            const cards = t("content:items.TRIAGE-1.cards", { returnObjects: true }) as string[];
            return Array.isArray(resp?.bins?.vulnerability) && resp.bins.vulnerability.includes(cards[2]);
          },
          feedback: {
            why: t("content:items.TRIAGE-1.misconceptions.segmentation_confused.why"),
            contrast: t("content:items.TRIAGE-1.misconceptions.segmentation_confused.contrast"),
            next_try: t("content:items.TRIAGE-1.misconceptions.segmentation_confused.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.TRIAGE-1.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.TRIAGE-1.exemplar"),
      scoring: { base: 1, time_ms_cap: 60000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["cards", "bins"], reading_level: "≤8" },
    },
    {
      objective_id: "OBJ-5",
      id: "SEQ-1",
      difficulty: "easy",
      mechanic: "Sequencer",
      stimulus: { text: t("content:items.SEQ-1.stimulus"), media: null },
      parameters: {},
      response_type: "order",
      steps: t("content:items.SEQ-1.steps", { returnObjects: true }) as string[],
      answer_key: { correctOrder: t("content:items.SEQ-1.answer_correct_order", { returnObjects: true }) as string[] },
      misconceptions: [
        {
          id: "act_first",
          detector: (resp: any) => {
            const steps = t("content:items.SEQ-1.steps", { returnObjects: true }) as string[];
            return resp?.order && resp.order[0] === steps[0];
          },
          feedback: {
            why: t("content:items.SEQ-1.misconceptions.act_first.why"),
            contrast: t("content:items.SEQ-1.misconceptions.act_first.contrast"),
            next_try: t("content:items.SEQ-1.misconceptions.act_first.next_try"),
          },
        },
      ],
      hint_ladder: t("content:items.SEQ-1.hints", { returnObjects: true }) as string[],
      exemplar_response: t("content:items.SEQ-1.exemplar"),
      scoring: { base: 1, time_ms_cap: 45000, hint_penalty: 0.25, retry_policy: "until_correct" },
      mastery_criterion: { streak: 3, max_avg_time_ms: 30000 },
      telemetry_fields: ["latency_ms", "hints_used", "misconception_id", "retries"],
      accessibility: { alt_text: null, aria_labels: ["reorder list"], reading_level: "≤8" },
    },
  ] as Item[],
  };
}

// Create CONTENT constant using translated content
const CONTENT = getTranslatedContent();

/*************************
 * Utility helpers       *
 *************************/
const now = () => Date.now();
const msToS = (ms: number) => Math.round(ms / 100) / 10;

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
 * Telemetry & Session Storage *
 *************************/
const TELEMETRY_KEY = "iot_minigames_telemetry_v1";
const SESSION_KEY = "iot_minigames_session_v1";

function sanitizeForJSON(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'function') return undefined;
  if (typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeForJSON(item)).filter(item => item !== undefined);
  }
  
  const cleaned: Record<string, any> = {};
  for (const key in obj) {
    const value = obj[key];
    if (typeof value !== 'function') {
      const sanitized = sanitizeForJSON(value);
      if (sanitized !== undefined) {
        cleaned[key] = sanitized;
      }
    }
  }
  return cleaned;
}

function recordEvent(evt: any) {
  try {
    const sanitized = sanitizeForJSON({ ...evt, ts: new Date().toISOString() });
    const arr = JSON.parse(localStorage.getItem(TELEMETRY_KEY) || "[]");
    arr.push(sanitized);
    localStorage.setItem(TELEMETRY_KEY, JSON.stringify(arr));
    console.log("[telemetry]", sanitized);
  } catch (err) {
    console.warn("[telemetry] Failed to record event:", err);
  }
}

function getTelemetry(): any[] {
  try {
    return JSON.parse(localStorage.getItem(TELEMETRY_KEY) || "[]");
  } catch {
    return [];
  }
}

function downloadTelemetryCSV() {
  const data = getTelemetry();
  if (data.length === 0) return;
  
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) => headers.map((h) => JSON.stringify(row[h] || "")).join(",")),
  ].join("\n");
  
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `iot-telemetry-${new Date().toISOString()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/*************************
 * Session persistence   *
 *************************/
function saveSession(state: any) {
  try {
    const sanitized = sanitizeForJSON(state);
    // Add schema version to track format changes
    const versioned = {
      ...sanitized,
      schemaVersion: 2, // Current version with lowercase bin IDs
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(versioned));
  } catch (err) {
    console.warn("[session] Failed to save:", err);
  }
}

/**
 * Normalize bin keys from old uppercase format to new lowercase IDs
 * Also ensures retries field defaults to 0 instead of undefined
 */
function normalizeBinKeys(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(normalizeBinKeys);
  }
  
  const result: any = {};
  for (const key in obj) {
    let newKey = key;
    let value = obj[key];
    
    // Normalize known uppercase bin keys to lowercase IDs
    if (key === 'Vulnerability') {
      newKey = 'vulnerability';
    } else if (key === 'Mitigation') {
      newKey = 'mitigation';
    }
    
    // Ensure retries field defaults to 0 instead of undefined
    if (key === 'retries' && (value === undefined || value === null)) {
      value = 0;
    }
    
    // Recursively normalize nested objects
    if (typeof value === 'object' && value !== null) {
      value = normalizeBinKeys(value);
    }
    
    result[newKey] = value;
  }
  
  return result;
}

/**
 * Migrate session data from old schema (uppercase bin keys) to new schema (lowercase bin IDs)
 * This handles sessions saved before the bin ID refactor.
 */
function migrateSessionData(data: any): any {
  if (!data) return data;
  
  // Add schema version for future migrations
  const version = data.schemaVersion || 1;
  
  // Schema version 1: uppercase bin keys (old)
  // Schema version 2: lowercase bin IDs (new)
  if (version >= 2) {
    return data; // Already migrated
  }
  
  console.log("[session] Migrating from schema v1 to v2: normalizing bin keys");
  
  // Deep clone and normalize bin keys throughout the session data
  const normalized = normalizeBinKeys(data);
  
  // Mark as migrated
  return {
    ...normalized,
    schemaVersion: 2,
  };
}

function loadSession(): any | null {
  try {
    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    // Apply migration to handle old uppercase bin keys
    const migrated = migrateSessionData(parsed);
    return migrated;
  } catch (err) {
    console.warn("[session] Failed to load:", err);
    return null;
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (err) {
    console.warn("[session] Failed to clear:", err);
  }
}

/*************************
 * Engine (evaluate)     *
 *************************/
function evaluate(item: Item, response: any): { correct: boolean; misconception_id?: string } {
  if (item.response_type === "decision+rationale") {
    const correct = response?.choice === item.answer_key.correct;
    if (!correct && Array.isArray(item.misconceptions)) {
      const mis = item.misconceptions.find((m) => {
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
    const mis = !correct && item.misconceptions?.find((m) => m.detector?.(response));
    return { correct, misconception_id: mis && typeof mis === 'object' ? mis.id : undefined };
  }

  if (item.response_type === "match") {
    const expected = item.answer_key.correct;
    const pairs = response?.pairs || {};
    const keys = Object.keys(expected || {});
    const correct = keys.every((k) => expected[k] === pairs[k]) && keys.length === Object.keys(pairs).length;
    const mis = !correct && item.misconceptions?.find((m) => m.detector?.(response));
    return { correct, misconception_id: mis && typeof mis === 'object' ? mis.id : undefined };
  }

  if (item.response_type === "triage") {
    const exp = item.answer_key.correct || {};
    const bins = response?.bins || {};
    const isCorr = (binId: string) => {
      const setA = new Set<string>((bins[binId] || []).slice().sort());
      const setB = new Set<string>((exp[binId] || []).slice().sort());
      if (setA.size !== setB.size) return false;
      for (const v of Array.from(setA)) if (!setB.has(v)) return false;
      return true;
    };
    const correct = isCorr("vulnerability") && isCorr("mitigation");
    const mis = !correct && item.misconceptions?.find((m) => m.detector?.(response));
    return { correct, misconception_id: mis && typeof mis === 'object' ? mis.id : undefined };
  }

  return { correct: false };
}

/*************************
 * Component: CompletionScreen *
 *************************/
function CompletionScreen({
  mastery,
  history,
  onRestart,
  onDownloadTelemetry,
}: {
  mastery: any;
  history: HistoryEntry[];
  onRestart: () => void;
  onDownloadTelemetry: () => void;
}) {
  const { t } = useTranslation('ui');
  const totalTime = history.reduce((sum, h) => sum + h.latency_ms, 0);
  const totalTimeSeconds = Math.round(totalTime / 1000);
  const totalItems = history.length;
  const correctFirst = history.filter(h => h.correct).length;
  const accuracy = Math.round((correctFirst / totalItems) * 100);
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl shadow-2xl">
        <CardContent className="p-8 md:p-12 space-y-8">
          {/* Trophy Icon */}
          <div className="flex justify-center">
            <div className="rounded-full bg-primary/10 p-6">
              <Trophy className="h-16 w-16 md:h-20 md:w-20 text-primary" />
            </div>
          </div>
          
          {/* Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold">{t('mastery_unlocked')}</h1>
            <p className="text-lg text-muted-foreground">
              {t('completion_message')}
            </p>
          </div>
          
          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <div className="text-3xl font-bold text-primary">{mastery.streak}</div>
              <div className="text-sm text-muted-foreground mt-1">Current Streak</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <div className="text-3xl font-bold text-primary">{mastery.avgTimeS}s</div>
              <div className="text-sm text-muted-foreground mt-1">Avg Response</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <div className="text-3xl font-bold text-primary">{accuracy}%</div>
              <div className="text-sm text-muted-foreground mt-1">First-Try Accuracy</div>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/30">
              <div className="text-3xl font-bold text-primary">{totalItems}</div>
              <div className="text-sm text-muted-foreground mt-1">Items Completed</div>
            </div>
          </div>
          
          {/* Additional Stats */}
          <div className="space-y-3 p-4 rounded-xl border bg-card">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Time</span>
              <span className="text-sm text-muted-foreground">{Math.floor(totalTimeSeconds / 60)}m {totalTimeSeconds % 60}s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Hints Used</span>
              <span className="text-sm text-muted-foreground">{mastery.hints}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mastery Criteria Met</span>
              <Badge className="bg-green-600 hover:bg-green-600">
                <Check className="h-3 w-3 mr-1" />
                All Criteria
              </Badge>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              size="lg"
              className="flex-1"
              onClick={onRestart}
              data-testid="button-restart-session"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Start New Session
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onClick={onDownloadTelemetry}
              data-testid="button-download-completion"
            >
              <Download className="h-5 w-5 mr-2" />
              {t('download_csv')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/*************************
 * Component: LanguageSwitcher *
 *************************/
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  // Only show language switcher if multiple languages are configured
  const supportedLngs = i18n.options.supportedLngs;
  const availableLanguages = Array.isArray(supportedLngs) 
    ? supportedLngs.filter((lng: string) => lng !== 'cimode') 
    : [];
  
  if (availableLanguages.length <= 1) {
    return null; // Hide switcher when only one language is available
  }
  
  const languageNames: Record<string, string> = {
    en: "English",
    fi: "Suomi",
    ru: "Русский"
  };
  
  const handleLanguageChange = (newLang: string) => {
    i18n.changeLanguage(newLang);
  };
  
  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[140px]" data-testid="language-switcher">
        <Languages className="h-4 w-4 mr-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {availableLanguages.map((lng: string) => (
          <SelectItem key={lng} value={lng} data-testid={`language-option-${lng}`}>
            {languageNames[lng] || lng}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/*************************
 * Component: Header     *
 *************************/
function Header({ 
  mastery, 
  currentIndex, 
  totalItems,
  onTelemetryToggle 
}: { 
  mastery: any; 
  currentIndex: number;
  totalItems: number;
  onTelemetryToggle: () => void;
}) {
  const { t } = useTranslation('ui');
  
  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{t('app_title')}</h1>
            <div className="flex items-center gap-3 mt-1">
              <p className="text-sm text-muted-foreground">{t('app_sub')}</p>
              <Badge variant="outline" className="text-xs" data-testid="progress-indicator">
                {currentIndex + 1} of {totalItems}
              </Badge>
            </div>
          </div>
          
          <div className="flex items-center gap-3" aria-label={t('mastery_progress')}>
            <div className="flex items-center gap-2 text-sm" data-testid="mastery-streak">
              <Flame className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">{t('streak')}</div>
                <div className="font-semibold">{mastery.streak}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" data-testid="mastery-avg-time">
              <Clock className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">{t('avg_time')}</div>
                <div className="font-semibold">
                  {mastery.avgTimeS}
                  <span className="text-xs ml-0.5">{t('seconds')}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm" data-testid="mastery-hints">
              <HelpCircle className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs text-muted-foreground">{t('hints_used')}</div>
                <div className="font-semibold">{mastery.hints}</div>
              </div>
            </div>
            <LanguageSwitcher />
            <Button
              variant="outline"
              size="sm"
              onClick={onTelemetryToggle}
              data-testid="button-telemetry-toggle"
            >
              <ListChecks className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

/*************************
 * Component: OutcomeList*
 *************************/
function OutcomeList({ outcomes }: { outcomes: Array<{ id: string; text: string }> }) {
  const { t } = useTranslation('ui');
  
  return (
    <section className="space-y-6">
      <h2 className="text-xl font-semibold">{t('outcomes_header')}</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {outcomes.map((outcome) => (
          <Card key={outcome.id} className="p-4" data-testid={`outcome-${outcome.id}`}>
            <div className="flex items-start gap-3">
              <Badge variant="secondary" className="mt-0.5 shrink-0">{outcome.id}</Badge>
              <p className="text-sm leading-relaxed">{outcome.text}</p>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}

/*************************
 * Component: TelemetryPanel *
 *************************/
function TelemetryPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const data = getTelemetry();
  const { t } = useTranslation('ui');
  
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="fixed inset-x-4 top-1/2 -translate-y-1/2 mx-auto max-w-4xl">
        <Card className="max-h-[80vh] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <h3 className="text-lg font-semibold">Telemetry</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={downloadTelemetryCSV}
                data-testid="button-download-csv"
              >
                <Download className="h-4 w-4 mr-2" />
                {t('download_csv')}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                data-testid="button-close-telemetry"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="max-h-[60vh] overflow-auto">
            <div className="rounded border bg-muted/30 p-4">
              <pre className="text-xs whitespace-pre-wrap break-words">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

/*************************
 * Game Mechanics        *
 *************************/
function DecisionLab({
  item,
  onSubmit,
  onHint,
  hintUsed,
}: {
  item: Item;
  onSubmit: (r: any) => void;
  onHint: () => void;
  hintUsed: boolean;
}) {
  const [choice, setChoice] = useState<string | null>(null);
  const [rationale, setRationale] = useState("");
  const { t } = useTranslation('ui');

  return (
    <div className="space-y-6" aria-live="polite">
      <p className="text-base leading-relaxed">{item.stimulus.text}</p>
      
      <div className="grid gap-3 md:grid-cols-2" role="radiogroup" aria-label="decision choices">
        {item.options?.map((opt) => (
          <label
            key={opt}
            className={`flex items-center gap-3 rounded-xl border-2 p-4 cursor-pointer transition-all hover-elevate ${
              choice === opt
                ? "border-primary bg-primary/5"
                : "border-border hover:border-muted-foreground/30"
            }`}
            data-testid={`option-${opt}`}
          >
            <input
              type="radio"
              className="h-4 w-4 text-primary focus:ring-2 focus:ring-primary"
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
        <label className="mb-2 block text-sm font-medium" htmlFor={`rat-${item.id}`}>
          {t('rationale_prompt')}
        </label>
        <textarea
          id={`rat-${item.id}`}
          className="w-full rounded-xl border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          rows={2}
          value={rationale}
          onChange={(e) => setRationale(e.target.value)}
          placeholder={t('placeholder_rationale')}
          aria-label="rationale"
          data-testid="input-rationale"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => onSubmit({ choice, rationale })}
          disabled={!choice}
          data-testid="button-submit"
        >
          <Check className="h-4 w-4 mr-2" />
          {t('submit')}
        </Button>
        <Button variant="outline" onClick={onHint} data-testid="button-hint">
          <HelpCircle className="h-4 w-4 mr-2" />
          {hintUsed ? t('use_hint') : t('show_hint')}
        </Button>
      </div>
    </div>
  );
}

function Triage({
  item,
  onSubmit,
  onHint,
  hintUsed,
}: {
  item: Item;
  onSubmit: (r: any) => void;
  onHint: () => void;
  hintUsed: boolean;
}) {
  const { t } = useTranslation('ui');
  // Extract bin definitions with stable IDs
  const binDefs = item.bins || [];
  const vulnBin = binDefs.find((b: any) => b.id === "vulnerability");
  const mitigBin = binDefs.find((b: any) => b.id === "mitigation");
  
  const [unplaced, setUnplaced] = useState<string[]>(item.cards || []);
  const [bins, setBins] = useState<Record<string, string[]>>({
    vulnerability: [],
    mitigation: [],
  });
  const [draggedCard, setDraggedCard] = useState<string | null>(null);
  const [draggedFrom, setDraggedFrom] = useState<string | null>(null);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  
  // Submission and feedback state
  const [submitted, setSubmitted] = useState(false);
  const [cardFeedback, setCardFeedback] = useState<Map<string, {isCorrect: boolean; why: string}>>(new Map());
  const [allCorrect, setAllCorrect] = useState(false);
  const [attempts, setAttempts] = useState(0);

  // Move card from source to destination
  const moveCard = (card: string, fromLocation: string, toLocation: string) => {
    // Allow moves even after submission unless all cards are correct
    if (submitted && allCorrect) return; // Only disable if all correct
    if (fromLocation === toLocation) return;

    // Remove from source
    if (fromLocation === "unplaced") {
      setUnplaced((u) => u.filter((c) => c !== card));
    } else {
      setBins((b) => ({ ...b, [fromLocation]: b[fromLocation].filter((c) => c !== card) }));
    }

    // Add to destination
    if (toLocation === "unplaced") {
      setUnplaced((u) => [...u, card]);
    } else {
      setBins((b) => ({ ...b, [toLocation]: [...b[toLocation], card] }));
    }
  };

  const reset = () => {
    setUnplaced(item.cards || []);
    setBins({ vulnerability: [], mitigation: [] });
    setSubmitted(false);
    setCardFeedback(new Map());
  };
  
  // Handle submission with inline feedback
  const handleSubmit = () => {
    if (!isComplete) return;
    
    // Compute per-card feedback from content explanations
    const feedback = new Map<string, {isCorrect: boolean; why: string}>();
    const explanations = item.answer_key.explanations || {};
    let correctCount = 0;
    
    (item.cards || []).forEach((card: string) => {
      const explanation = explanations[card];
      if (!explanation) return;
      
      const correctBin = explanation.correct_bin;
      const chosenBin = bins.vulnerability.includes(card) ? 'vulnerability' : 'mitigation';
      const isCorrect = correctBin === chosenBin;
      
      if (isCorrect) correctCount++;
      
      feedback.set(card, {
        isCorrect,
        why: isCorrect ? '' : explanation.why
      });
    });
    
    const allCardsCorrect = correctCount === (item.cards || []).length;
    
    setCardFeedback(feedback);
    setSubmitted(true);
    setAllCorrect(allCardsCorrect);
    setAttempts(a => a + 1);
    
    // Only call parent onSubmit when all cards are correct
    if (allCardsCorrect) {
      onSubmit({ bins, attempts_before_correct: attempts + 1 });
    }
  };
  
  const handleRetry = () => {
    setSubmitted(false);
    setCardFeedback(new Map());
    setAllCorrect(false);
    // Don't reset attempts - keep counting across retries
  };

  // Drag handlers
  const handleDragStart = (card: string, from: string) => {
    // Allow dragging unless all cards are correct
    if (submitted && allCorrect) return; 
    setDraggedCard(card);
    setDraggedFrom(from);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
    setDraggedFrom(null);
    setDropTarget(null);
  };

  const handleDragOver = (e: React.DragEvent, target: string) => {
    e.preventDefault();
    setDropTarget(target);
  };

  const handleDragLeave = () => {
    setDropTarget(null);
  };

  const handleDrop = (e: React.DragEvent, target: string) => {
    e.preventDefault();
    if (draggedCard && draggedFrom) {
      moveCard(draggedCard, draggedFrom, target);
    }
    handleDragEnd();
  };

  const totalCards = item.cards?.length || 0;
  const placedCount = bins.vulnerability.length + bins.mitigation.length;
  const isComplete = placedCount === totalCards;
  
  // Helper to check if card is incorrect
  const getCardFeedback = (card: string) => cardFeedback.get(card);
  const isCardIncorrect = (card: string) => submitted && cardFeedback.get(card) && !cardFeedback.get(card)?.isCorrect;
  const isCardCorrect = (card: string) => submitted && cardFeedback.get(card) && cardFeedback.get(card)?.isCorrect;
  
  // Helper to get card border and background classes
  const getCardClasses = (card: string, baseClasses: string) => {
    if (!submitted) return baseClasses;
    
    const feedback = getCardFeedback(card);
    if (!feedback) return baseClasses;
    
    if (feedback.isCorrect) {
      return `${baseClasses} border-blue-500 dark:border-blue-400 bg-blue-500/10 dark:bg-blue-400/10`;
    } else {
      return `${baseClasses} border-amber-500 dark:border-amber-400 bg-amber-500/10 dark:bg-amber-400/10`;
    }
  };
  
  // Reset state when item changes
  useEffect(() => {
    setUnplaced(item.cards || []);
    setBins({ vulnerability: [], mitigation: [] });
    setSubmitted(false);
    setCardFeedback(new Map());
    setAllCorrect(false);
    setAttempts(0);
  }, [item.id]);
  
  // Announce zone changes for screen readers
  const [announcement, setAnnouncement] = useState("");
  
  useEffect(() => {
    // Always announce, including when cards return to unplaced (placedCount === 0)
    setAnnouncement(
      `${placedCount} of ${totalCards} cards placed. ${bins.vulnerability.length} vulnerabilities, ${bins.mitigation.length} mitigations.`
    );
  }, [bins.vulnerability.length, bins.mitigation.length, placedCount, totalCards]);
  
  // Helper to wrap card with tooltip if incorrect
  const renderCardWithFeedback = (cardContent: JSX.Element, card: string, key: string) => {
    const feedback = getCardFeedback(card);
    const incorrect = isCardIncorrect(card);
    
    if (!incorrect || !feedback) {
      return <div key={key}>{cardContent}</div>;
    }
    
    return (
      <Tooltip key={key}>
        <TooltipTrigger asChild>
          {cardContent}
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm leading-relaxed" data-testid={`tooltip-${card.substring(0, 20)}`}>
          <p className="font-semibold mb-1">Why this is incorrect:</p>
          <p>{feedback.why}</p>
        </TooltipContent>
      </Tooltip>
    );
  };

  return (
    <TooltipProvider>
    <div className="space-y-6">
      {/* Introduction */}
      <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6 space-y-4">
        <h3 className="text-lg font-semibold text-primary">Vulnerabilities vs. Mitigations</h3>
        <div className="space-y-3 text-sm leading-relaxed">
          <p>
            IoT systems are networks of connected devices and sensors that collect and share data. 
            In this game, decide whether each statement is:
          </p>
          <ul className="space-y-2 ml-4">
            <li className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
              <div>
                <strong className="text-destructive">A vulnerability</strong> – a weak spot that makes problems or attacks more likely
              </div>
            </li>
            <li className="flex items-start gap-2">
              <Shield className="h-4 w-4 text-green-600 dark:text-green-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-green-600 dark:text-green-500">A mitigation</strong> – a step that helps reduce those risks and make the system safer
              </div>
            </li>
          </ul>
          <p className="text-muted-foreground italic">
            Think back to the readings and ask: "Does this make the system weaker, or safer?" Then pick your answer.
          </p>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <p className="text-base leading-relaxed">{item.stimulus.text}</p>
        <Badge variant="outline" className="text-xs">
          {placedCount} / {totalCards} placed
        </Badge>
      </div>

      {/* Mobile: Vertical Stack, Desktop: 3 Columns */}
      <div className="grid gap-4 md:grid-cols-3" aria-label="triage area">
        
        {/* Unplaced Cards */}
        <div 
          className={`rounded-xl border-2 border-dashed p-4 transition-all min-h-[200px] ${
            dropTarget === "unplaced" 
              ? "border-primary bg-primary/5 shadow-lg" 
              : "border-muted-foreground/30 bg-muted/20"
          }`}
          onDragOver={(e) => handleDragOver(e, "unplaced")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "unplaced")}
          data-testid="zone-unplaced"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold">{t('unplaced')}</h4>
            <Badge variant="secondary" className="text-xs">{unplaced.length}</Badge>
          </div>
          
          <div className="space-y-2">
            {unplaced.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                {t('triage_unplaced_empty')}
              </div>
            ) : (
              unplaced.map((c) => (
                <div
                  key={c}
                  draggable
                  onDragStart={() => handleDragStart(c, "unplaced")}
                  onDragEnd={handleDragEnd}
                  className={`group rounded-xl border-2 bg-card p-3 cursor-move transition-all hover:shadow-md ${
                    draggedCard === c ? "opacity-50 scale-95" : "hover:border-primary"
                  }`}
                  data-testid={`card-${c}`}
                  aria-label={`Card: ${c}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-sm flex-1">{c}</span>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => moveCard(c, "unplaced", "vulnerability")}
                      className="h-8 w-8 bg-destructive/5 border-destructive/30 hover:bg-destructive/10 text-destructive"
                      aria-label="Mark as vulnerability"
                      data-testid={`place-vulnerability-${c}`}
                    >
                      <AlertTriangle className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => moveCard(c, "unplaced", "mitigation")}
                      className="h-8 w-8 bg-green-600/5 border-green-600/30 hover:bg-green-600/10 text-green-600 dark:text-green-500"
                      aria-label="Mark as mitigation"
                      data-testid={`place-mitigation-${c}`}
                    >
                      <Shield className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vulnerability Bin */}
        <div
          className={`rounded-xl border-2 p-4 transition-all min-h-[200px] ${
            dropTarget === "vulnerability"
              ? "border-destructive bg-destructive/10 shadow-lg"
              : "border-destructive/30 bg-destructive/5"
          }`}
          onDragOver={(e) => handleDragOver(e, "vulnerability")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "vulnerability")}
          data-testid="zone-vulnerability"
        >
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <h4 className="text-sm font-semibold text-destructive">
                  {t('bin_vulnerability')}
                </h4>
              </div>
              <Badge variant="destructive" className="text-xs">{bins.vulnerability.length}</Badge>
            </div>
            <p className="text-xs text-muted-foreground ml-6">Makes the system weaker</p>
          </div>

          <div className="space-y-2">
            {bins.vulnerability.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                {t('triage_vulnerability_drop')}
              </div>
            ) : (
              bins.vulnerability.map((c) => renderCardWithFeedback(
                <div
                  draggable={!submitted || !allCorrect}
                  onDragStart={() => handleDragStart(c, "vulnerability")}
                  onDragEnd={handleDragEnd}
                  className={getCardClasses(
                    c,
                    `group rounded-xl border-2 p-3 transition-all bg-card ${
                      draggedCard === c ? "opacity-50 scale-95" : ""
                    } ${
                      (!submitted || !allCorrect) ? "cursor-move hover:shadow-md hover:border-destructive" : ""
                    }`
                  )}
                  data-testid={`vulnerability-${c}`}
                  aria-label={`Vulnerability: ${c}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-sm flex-1">{c}</span>
                  </div>
                  {(!submitted || !allCorrect) && (
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveCard(c, "vulnerability", "mitigation")}
                        className="h-8 w-8 text-green-600 dark:text-green-500"
                        aria-label="Move to mitigation"
                        data-testid={`move-to-mitigation-${c}`}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveCard(c, "vulnerability", "unplaced")}
                        className="h-8 w-8"
                        aria-label="Remove card"
                        data-testid={`remove-${c}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>,
                c,
                c
              ))
            )}
          </div>
        </div>

        {/* Mitigation Bin */}
        <div
          className={`rounded-xl border-2 p-4 transition-all min-h-[200px] ${
            dropTarget === "mitigation"
              ? "border-green-600 bg-green-600/10 shadow-lg"
              : "border-green-600/30 bg-green-600/5"
          }`}
          onDragOver={(e) => handleDragOver(e, "mitigation")}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, "mitigation")}
          data-testid="zone-mitigation"
        >
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-green-600 dark:text-green-500" />
                <h4 className="text-sm font-semibold text-green-600 dark:text-green-500">
                  {t('bin_mitigation')}
                </h4>
              </div>
              <Badge className="text-xs bg-green-600 hover:bg-green-600">{bins.mitigation.length}</Badge>
            </div>
            <p className="text-xs text-muted-foreground ml-6">Makes the system safer</p>
          </div>

          <div className="space-y-2">
            {bins.mitigation.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                <Shield className="h-8 w-8 mx-auto mb-2 opacity-30" />
                {t('triage_mitigation_drop')}
              </div>
            ) : (
              bins.mitigation.map((c) => renderCardWithFeedback(
                <div
                  draggable={!submitted || !allCorrect}
                  onDragStart={() => handleDragStart(c, "mitigation")}
                  onDragEnd={handleDragEnd}
                  className={getCardClasses(
                    c,
                    `group rounded-xl border-2 p-3 transition-all bg-card ${
                      draggedCard === c ? "opacity-50 scale-95" : ""
                    } ${
                      (!submitted || !allCorrect) ? "cursor-move hover:shadow-md hover:border-green-600" : ""
                    }`
                  )}
                  data-testid={`mitigation-${c}`}
                  aria-label={`Mitigation: ${c}`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="text-sm flex-1">{c}</span>
                  </div>
                  {(!submitted || !allCorrect) && (
                    <div className="flex gap-2 justify-center">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveCard(c, "mitigation", "vulnerability")}
                        className="h-8 w-8 text-destructive"
                        aria-label="Move to vulnerability"
                        data-testid={`move-to-vulnerability-${c}`}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => moveCard(c, "mitigation", "unplaced")}
                        className="h-8 w-8"
                        aria-label="Remove card"
                        data-testid={`remove-from-mitigation-${c}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>,
                c,
                c
              ))
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="flex items-start gap-2 p-3 rounded-xl bg-muted/30 text-sm text-muted-foreground">
        <HelpCircle className="h-4 w-4 shrink-0 mt-0.5" />
        <p>
          {t('triage_instructions')}
          {!isComplete && ` ${totalCards - placedCount} ${t(totalCards - placedCount === 1 ? 'card_one' : 'card_other')} remaining.`}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 flex-wrap" role="group" aria-label="actions">
        {!submitted ? (
          <Button 
            onClick={handleSubmit} 
            disabled={!isComplete}
            data-testid="button-submit"
            className="min-w-[120px]"
          >
            <Check className="h-4 w-4 mr-2" />
            Check Answer
          </Button>
        ) : allCorrect ? (
          <Button 
            onClick={() => onSubmit({ bins, attempts_before_correct: attempts })} 
            data-testid="button-continue"
            className="min-w-[120px]"
          >
            <ChevronRight className="h-4 w-4 mr-2" />
            {t('continue')}
          </Button>
        ) : (
          <Button 
            variant="outline"
            onClick={handleRetry} 
            data-testid="button-try-again"
            className="min-w-[120px]"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('try_again')}
          </Button>
        )}
        <Button variant="outline" onClick={onHint} data-testid="button-hint">
          <HelpCircle className="h-4 w-4 mr-2" />
          {hintUsed ? t('use_hint') : t('show_hint')}
        </Button>
        <Button variant="outline" onClick={reset} data-testid="button-reset">
          <RefreshCw className="h-4 w-4 mr-2" />
          {t('reset')}
        </Button>
      </div>

      {/* Screen reader live region */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        {announcement}
      </div>
    </div>
    </TooltipProvider>
  );
}

function Sequencer({
  item,
  onSubmit,
  onHint,
  hintUsed,
}: {
  item: Item;
  onSubmit: (r: any) => void;
  onHint: () => void;
  hintUsed: boolean;
}) {
  const [order, setOrder] = useState<string[]>(shuffle(item.steps || []));
  const { t } = useTranslation('ui');

  const move = (idx: number, dir: number) => {
    const ni = idx + dir;
    if (ni < 0 || ni >= order.length) return;
    const a = order.slice();
    [a[idx], a[ni]] = [a[ni], a[idx]];
    setOrder(a);
  };

  return (
    <div className="space-y-6">
      <p className="text-base leading-relaxed">{item.stimulus.text}</p>
      
      <ul className="space-y-2" aria-label="reorder list">
        {order.map((s, i) => (
          <li
            key={s}
            className="flex items-center justify-between rounded-xl border bg-card p-4"
            data-testid={`step-${i}`}
          >
            <div className="flex items-center gap-4 flex-1">
              <Badge variant="secondary" className="h-8 w-8 rounded-lg flex items-center justify-center font-semibold">
                {i + 1}
              </Badge>
              <span className="text-sm">{s}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label={`Move ${s} up`}
                data-testid={`move-up-${i}`}
              >
                ↑
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => move(i, 1)}
                disabled={i === order.length - 1}
                aria-label={`Move ${s} down`}
                data-testid={`move-down-${i}`}
              >
                ↓
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex gap-3 flex-wrap">
        <Button onClick={() => onSubmit({ order })} data-testid="button-submit">
          <Check className="h-4 w-4 mr-2" />
          {t('submit')}
        </Button>
        <Button variant="outline" onClick={onHint} data-testid="button-hint">
          <HelpCircle className="h-4 w-4 mr-2" />
          {hintUsed ? t('use_hint') : t('show_hint')}
        </Button>
      </div>
    </div>
  );
}

function MatchPairs({
  item,
  onSubmit,
  onHint,
  hintUsed,
}: {
  item: Item;
  onSubmit: (r: any) => void;
  onHint: () => void;
  hintUsed: boolean;
}) {
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [selLeft, setSelLeft] = useState<string | null>(null);
  const [selRight, setSelRight] = useState<string | null>(null);
  const { t } = useTranslation('ui');

  const unpairedLeft = (item.pairs_left || []).filter((l) => !(l in pairs));
  const unpairedRight = (item.pairs_right || []).filter((r) => !Object.values(pairs).includes(r));

  const addPair = () => {
    if (!selLeft || !selRight) return;
    setPairs((p) => ({ ...p, [selLeft]: selRight }));
    setSelLeft(null);
    setSelRight(null);
  };

  return (
    <div className="space-y-6">
      <p className="text-base leading-relaxed">{item.stimulus.text}</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div aria-label="left list">
          <h4 className="mb-3 text-sm font-semibold">{t('terms')}</h4>
          <div className="space-y-2">
            {unpairedLeft.map((l) => (
              <button
                key={l}
                onClick={() => setSelLeft(l)}
                className={`w-full rounded-xl border-2 p-3 text-left text-sm transition-all hover-elevate ${
                  selLeft === l
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
                aria-label={`Select ${l}`}
                data-testid={`term-${l}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        
        <div aria-label="right list">
          <h4 className="mb-3 text-sm font-semibold">{t('roles')}</h4>
          <div className="space-y-2">
            {unpairedRight.map((r) => (
              <button
                key={r}
                onClick={() => setSelRight(r)}
                className={`w-full rounded-xl border-2 p-3 text-left text-sm transition-all hover-elevate ${
                  selRight === r
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
                aria-label={`Select ${r}`}
                data-testid={`role-${r}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {(selLeft || selRight) && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/30 border">
          <Badge variant="outline" className="shrink-0">Selected</Badge>
          <div className="flex items-center gap-2 flex-1 flex-wrap">
            {selLeft && <span className="text-sm font-medium">{selLeft}</span>}
            {selLeft && selRight && <span className="text-muted-foreground">→</span>}
            {selRight && <span className="text-sm">{selRight}</span>}
          </div>
          <Button
            size="sm"
            onClick={addPair}
            disabled={!selLeft || !selRight}
            data-testid="button-add-pair"
          >
            <Check className="h-4 w-4 mr-2" />
            {t('pair_selected')}
          </Button>
        </div>
      )}

      {Object.keys(pairs).length > 0 && (
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t('your_pairs')}</h4>
          <div className="grid gap-2 md:grid-cols-2">
            {Object.entries(pairs).map(([l, r]) => (
              <div
                key={l}
                className="flex items-center gap-2 rounded-xl border bg-card p-3 text-sm"
                data-testid={`pair-${l}`}
              >
                <Check className="h-4 w-4 text-green-600 shrink-0" />
                <span className="font-semibold">{l}</span>
                <span className="text-muted-foreground">→</span>
                <span className="flex-1">{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={() => onSubmit({ pairs })}
          disabled={Object.keys(pairs).length === 0}
          data-testid="button-submit"
        >
          <Check className="h-4 w-4 mr-2" />
          {t('submit')}
        </Button>
        <Button variant="outline" onClick={onHint} data-testid="button-hint">
          <HelpCircle className="h-4 w-4 mr-2" />
          {hintUsed ? t('use_hint') : t('show_hint')}
        </Button>
      </div>
    </div>
  );
}

/*************************
 * Component: Feedback   *
 *************************/
function Feedback({
  item,
  feedbackState,
  retries,
  onRetry,
  onNext,
}: {
  item: Item;
  feedbackState: FeedbackState;
  retries: number;
  onRetry: () => void;
  onNext: () => void;
}) {
  const { t } = useTranslation('ui');
  const misconception = item.misconceptions?.find((m) => m.id === feedbackState.misconception_id);

  return (
    <div className="space-y-6">
      {/* Status badge with aria-live for screen readers */}
      <div className="flex items-center gap-3 flex-wrap" aria-live="polite" aria-atomic="true">
        {feedbackState.correct ? (
          <Badge className="bg-green-600 hover:bg-green-600 text-white px-4 py-2">
            <Check className="h-4 w-4 mr-2" />
            {t('correct')}
          </Badge>
        ) : (
          <Badge variant="destructive" className="px-4 py-2">
            <X className="h-4 w-4 mr-2" />
            {t('incorrect')}
          </Badge>
        )}
        
        <div className="flex gap-3 text-xs text-muted-foreground">
          <span>{msToS(feedbackState.latency_ms)}s</span>
          {feedbackState.hints_used > 0 && <span>{feedbackState.hints_used} hints</span>}
          {retries > 0 && !feedbackState.correct && (
            <span className="font-medium">{retries} {retries === 1 ? 'retry' : 'retries'}</span>
          )}
        </div>
      </div>

      {/* Feedback content */}
      {feedbackState.correct ? (
        <div className="space-y-4">
          {item.answer_key.rules && item.answer_key.rules.length > 0 && (
            <div className="rounded-xl border bg-card p-6">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Badge variant="secondary">{t('rule_label')}</Badge>
              </h4>
              <p className="text-sm leading-relaxed">{item.answer_key.rules[0]}</p>
            </div>
          )}
          
          {item.exemplar_response && (
            <div className="rounded-xl border bg-muted/30 p-6">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Badge variant="outline">{t('model_answer')}</Badge>
              </h4>
              <p className="text-sm leading-relaxed italic">{item.exemplar_response}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {misconception ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                <h4 className="text-sm font-semibold mb-3 text-destructive">{t('why_label')}</h4>
                <p className="text-sm leading-relaxed mb-4">{misconception.feedback.why}</p>
                
                <h4 className="text-sm font-semibold mb-3 text-primary">{t('contrast_label')}</h4>
                <p className="text-sm leading-relaxed mb-4 bg-background rounded-lg p-3">
                  {misconception.feedback.contrast}
                </p>
                
                <h4 className="text-sm font-semibold mb-3">{t('next_try_label')}</h4>
                <p className="text-sm leading-relaxed font-medium">{misconception.feedback.next_try}</p>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border bg-card p-6">
              <p className="text-sm leading-relaxed">
                {item.hint_ladder[0] || "Try again and think through the problem step by step."}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap pt-4">
        {feedbackState.correct ? (
          <Button onClick={onNext} size="lg" data-testid="button-next">
            <ChevronRight className="h-4 w-4 mr-2" />
            {t('next_item')}
          </Button>
        ) : (
          <Button onClick={onRetry} size="lg" data-testid="button-retry">
            <RefreshCw className="h-4 w-4 mr-2" />
            {t('try_again')}
          </Button>
        )}
      </div>
    </div>
  );
}

/*************************
 * Main Orchestrator     *
 *************************/
export default function IoTLearningLab() {
  const { t, i18n } = useTranslation('ui');
  
  // Content that refreshes on language change
  const [content, setContent] = useState(() => getTranslatedContent());
  
  // Session state
  const [started, setStarted] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackState, setFeedbackState] = useState<FeedbackState | null>(null);
  
  // Item-level state
  const [hintIdx, setHintIdx] = useState(-1);
  const [startMs, setStartMs] = useState(now());
  const [currentItemMastered, setCurrentItemMastered] = useState(false);
  const [currentItemRetries, setCurrentItemRetries] = useState(0);
  
  // History & mastery
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [seenCounts, setSeenCounts] = useState<number[]>(content.items.map(() => 0));
  const [incorrectItems, setIncorrectItems] = useState<Set<number>>(new Set());
  
  // UI state
  const [teleOpen, setTeleOpen] = useState(false);
  
  // Current item
  const item = content.items[currentIndex];
  
  // Reload content when language changes
  useEffect(() => {
    const handleLanguageChange = () => {
      setContent(getTranslatedContent());
    };
    
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);
  
  // Load session on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved && saved.started && !saved.sessionCompleted) {
      // Restore session
      setStarted(saved.started);
      setCurrentIndex(saved.currentIndex || 0);
      setHistory(saved.history || []);
      setSeenCounts(saved.seenCounts || content.items.map(() => 0));
      setIncorrectItems(new Set(saved.incorrectItems || []));
      console.log("[session] Restored previous session");
    }
  }, [content.items]);
  
  // Save session whenever key state changes
  useEffect(() => {
    if (started && !sessionCompleted) {
      saveSession({
        started,
        currentIndex,
        history,
        seenCounts,
        incorrectItems: Array.from(incorrectItems),
        sessionCompleted: false,
      });
    }
  }, [started, currentIndex, history, seenCounts, incorrectItems, sessionCompleted]);
  
  // Compute mastery stats
  const mastery = useMemo(() => {
    if (history.length === 0) {
      return { streak: 0, avgTimeS: 0, hints: 0, masteryMet: false };
    }
    
    // Calculate current streak
    let streak = 0;
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].correct) streak++;
      else break;
    }
    
    // Calculate average time
    const totalTime = history.reduce((sum, h) => sum + h.latency_ms, 0);
    const avgTimeMs = totalTime / history.length;
    const avgTimeS = msToS(avgTimeMs);
    
    // Total hints used
    const hints = history.reduce((sum, h) => sum + h.hints_used, 0);
    
    // Check mastery criteria
    const { streak: reqStreak, max_avg_time_ms, max_hints } = content.metadata.mastery;
    const masteryMet = streak >= reqStreak && avgTimeMs <= max_avg_time_ms && hints <= max_hints;
    
    return { streak, avgTimeS, hints, masteryMet };
  }, [history]);
  
  // Sequential-then-adaptive progression
  const chooseNextIndex = (lastCorrect: boolean) => {
    const allSeen = seenCounts.every((c) => c > 0);
    
    if (!allSeen) {
      // Sequential phase: find next unseen item
      const nextIdx = seenCounts.findIndex((c) => c === 0);
      return nextIdx >= 0 ? nextIdx : 0;
    }
    
    // Get recent item IDs from history (last 3) to avoid immediate repetition
    const recentItemIds = history.slice(-3).map((h) => h.item_id);
    
    // Adaptive phase: prioritize incorrect items, avoiding recent ones
    if (incorrectItems.size > 0) {
      let incorrectArr = Array.from(incorrectItems);
      
      // Filter out recently shown items
      const candidatesFiltered = incorrectArr.filter(
        (idx) => !recentItemIds.includes(content.items[idx].id)
      );
      
      // If all incorrect items were shown recently, allow any incorrect item
      const candidates = candidatesFiltered.length > 0 ? candidatesFiltered : incorrectArr;
      
      // Pick least-seen incorrect item from candidates
      candidates.sort((a, b) => seenCounts[a] - seenCounts[b]);
      return candidates[0];
    }
    
    // All items correct at least once: find least-seen, avoiding recent ones
    const minCount = Math.min(...seenCounts);
    let candidates = seenCounts
      .map((c, i) => ({ i, c }))
      .filter((x) => x.c === minCount && !recentItemIds.includes(content.items[x.i].id))
      .map((x) => x.i);
    
    // If all least-seen items were shown recently, allow any least-seen item
    if (candidates.length === 0) {
      candidates = seenCounts
        .map((c, i) => ({ i, c }))
        .filter((x) => x.c === minCount)
        .map((x) => x.i);
    }
    
    return candidates[Math.floor(Math.random() * candidates.length)];
  };
  
  // Check if mastery is met and trigger completion
  useEffect(() => {
    // Only trigger completion if mastery is met AND all items have been seen at least once
    const allItemsSeen = seenCounts.every(count => count > 0);
    if (mastery.masteryMet && allItemsSeen && !sessionCompleted && history.length > 0) {
      // Give a small delay before showing completion screen
      const timer = setTimeout(() => {
        setSessionCompleted(true);
        recordEvent({
          type: "session_complete",
          final_streak: mastery.streak,
          final_avg_time: mastery.avgTimeS,
          final_hints: mastery.hints,
          total_items: history.length,
        });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [mastery.masteryMet, sessionCompleted, mastery.streak, mastery.avgTimeS, mastery.hints, history.length, seenCounts]);
  
  // Handlers
  const handleStart = () => {
    setStarted(true);
    setStartMs(now());
    recordEvent({ type: "session_start" });
  };
  
  const handleRestart = () => {
    // Reset all state to start fresh
    setSessionCompleted(false);
    setStarted(false);
    setCurrentIndex(0);
    setShowFeedback(false);
    setFeedbackState(null);
    setHintIdx(-1);
    setStartMs(now());
    setCurrentItemMastered(false);
    setCurrentItemRetries(0);
    setHistory([]);
    setSeenCounts(content.items.map(() => 0));
    setIncorrectItems(new Set());
    setTeleOpen(false);
    
    clearSession(); // Clear saved session
    recordEvent({ type: "session_restart" });
  };
  
  const handleHint = () => {
    const nextHintIdx = hintIdx + 1;
    setHintIdx(nextHintIdx);
    recordEvent({
      type: "hint_shown",
      item_id: item.id,
      hint_index: nextHintIdx,
      hint_text: item.hint_ladder[nextHintIdx],
    });
  };
  
  const handleSubmit = (response: any) => {
    if (!response || (response.choice === undefined && !response.order && !response.pairs && !response.bins)) {
      return; // Guard against empty submissions
    }
    
    const forceNext = response.forceNext || false;
    
    // Reset mastery state when starting new item (allows forceNext to persist mastery until next submission)
    if (!forceNext && currentItemRetries === 0) {
      setCurrentItemMastered(false);
    }
    
    const latency_ms = now() - startMs;
    const result = evaluate(item, response);
    const hints_used = hintIdx + 1;
    
    // Record telemetry with minimal, serializable data
    recordEvent({
      type: "attempt",
      item_id: item.id,
      objective_id: item.objective_id,
      mechanic: item.mechanic,
      correct: result.correct,
      latency_ms,
      hints_used,
      misconception_id: result.misconception_id,
      response_type: item.response_type,
      response,
    });
    
    // Update history
    const entry: HistoryEntry = {
      item_id: item.id,
      correct: result.correct,
      latency_ms,
      hints_used,
      misconception_id: result.misconception_id,
      retries: currentItemRetries,
    };
    setHistory((h) => [...h, entry]);
    
    // Increment retry counter if incorrect
    if (!result.correct) {
      setCurrentItemRetries((r) => r + 1);
    }
    
    // Update seen counts
    setSeenCounts((counts) => {
      const newCounts = [...counts];
      newCounts[currentIndex]++;
      return newCounts;
    });
    
    // Track incorrect items for adaptive phase
    if (!result.correct) {
      setIncorrectItems((set) => new Set(set).add(currentIndex));
    } else {
      // Mark current item as mastered (correct answer achieved)
      setCurrentItemMastered(true);
      setIncorrectItems((set) => {
        const newSet = new Set(set);
        newSet.delete(currentIndex);
        return newSet;
      });
    }
    
    // Special handling for Triage's forceNext (inline feedback bypass)
    if (forceNext) {
      // Mark as mastered to allow progression (already done above if correct)
      setCurrentItemMastered(true);
      // Advance to next item immediately, skipping feedback screen
      const nextIdx = chooseNextIndex(result.correct);
      setCurrentIndex(nextIdx);
      setShowFeedback(false);
      setFeedbackState(null);
      setHintIdx(-1);
      setStartMs(now());
      // Reset retry counter for NEW item
      setCurrentItemRetries(0);
      // Note: currentItemMastered will be reset on next submission
      return;
    }
    
    // Show feedback
    setFeedbackState({
      correct: result.correct,
      misconception_id: result.misconception_id,
      latency_ms,
      hints_used,
    });
    setShowFeedback(true);
  };
  
  const handleRetry = () => {
    setShowFeedback(false);
    setFeedbackState(null);
    setHintIdx(-1);
    setStartMs(now());
    // Note: currentItemMastered is NOT reset - it persists across retries
  };
  
  const handleNext = () => {
    // Enforce retry-until-correct: only allow progression if current item was mastered
    if (!currentItemMastered) {
      console.warn("[progression] Cannot advance: current item not mastered (retry-until-correct policy)");
      return;
    }
    
    const nextIdx = chooseNextIndex(feedbackState?.correct || false);
    setCurrentIndex(nextIdx);
    setShowFeedback(false);
    setFeedbackState(null);
    setHintIdx(-1);
    setStartMs(now());
    // Reset mastery and retry counters for new item
    setCurrentItemMastered(false);
    setCurrentItemRetries(0);
  };
  
  // Render game mechanic
  const renderGameMechanic = () => {
    const props = {
      item,
      onSubmit: handleSubmit,
      onHint: handleHint,
      hintUsed: hintIdx >= 0,
    };
    
    switch (item.mechanic) {
      case "DecisionLab":
        return <DecisionLab {...props} />;
      case "Triage":
        return <Triage {...props} />;
      case "Sequencer":
        return <Sequencer {...props} />;
      case "Match":
        return <MatchPairs {...props} />;
      default:
        return <div>Unknown mechanic: {item.mechanic}</div>;
    }
  };
  
  // Pre-start screen
  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="flex justify-end mb-4">
            <LanguageSwitcher />
          </div>
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">{t('app_title')}</h1>
            <p className="text-lg text-muted-foreground">{t('app_sub')}</p>
          </div>
          
          <OutcomeList outcomes={content.metadata.outcomes} />
          
          <div className="flex flex-col items-center gap-4 pt-12">
            <Button size="lg" className="px-12" onClick={handleStart} data-testid="button-start">
              <Check className="h-5 w-5 mr-2" />
              {t('start')}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTeleOpen(true)}
              data-testid="button-view-telemetry-prestart"
            >
              {t('view_log')}
            </Button>
          </div>
        </div>
        
        <TelemetryPanel open={teleOpen} onClose={() => setTeleOpen(false)} />
      </div>
    );
  }
  
  // Completion screen
  if (sessionCompleted) {
    return (
      <CompletionScreen
        mastery={mastery}
        history={history}
        onRestart={handleRestart}
        onDownloadTelemetry={downloadTelemetryCSV}
      />
    );
  }
  
  // Practice screen
  return (
    <div className="min-h-screen bg-background">
      <Header 
        mastery={mastery} 
        currentIndex={currentIndex}
        totalItems={content.items.length}
        onTelemetryToggle={() => setTeleOpen(!teleOpen)} 
      />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Mastery banner */}
        {mastery.masteryMet && (
          <div className="mb-8 rounded-xl border-2 border-primary bg-primary/5 p-6">
            <div className="flex items-center gap-4">
              <Trophy className="h-8 w-8 text-primary" />
              <div>
                <h3 className="text-lg font-semibold">{t('mastery_unlocked')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('mastery_banner_message')}
                </p>
              </div>
            </div>
          </div>
        )}
        
        {/* Main content card */}
        <Card className="shadow-lg">
          <CardHeader className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" data-testid="badge-objective">
                {item.objective_id}
              </Badge>
              <Badge variant="outline" data-testid="badge-mechanic">
                {item.mechanic}
              </Badge>
              <Badge
                variant={
                  item.difficulty === "easy"
                    ? "secondary"
                    : item.difficulty === "medium"
                    ? "default"
                    : "destructive"
                }
                data-testid="badge-difficulty"
              >
                {item.difficulty}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Game mechanic or feedback */}
            {showFeedback && feedbackState ? (
              <Feedback
                item={item}
                feedbackState={feedbackState}
                retries={currentItemRetries}
                onRetry={handleRetry}
                onNext={handleNext}
              />
            ) : (
              renderGameMechanic()
            )}
            
            {/* Hint panel */}
            {!showFeedback && hintIdx >= 0 && hintIdx < item.hint_ladder.length && (
              <div
                className="rounded-xl border-l-4 border-l-primary bg-primary/5 p-4"
                role="complementary"
                aria-label="hint"
                data-testid="hint-panel"
              >
                <div className="flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold mb-1">Hint</h4>
                    <p className="text-sm leading-relaxed">{item.hint_ladder[hintIdx]}</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      
      <TelemetryPanel open={teleOpen} onClose={() => setTeleOpen(false)} />
    </div>
  );
}
