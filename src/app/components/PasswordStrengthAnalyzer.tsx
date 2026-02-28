"use client";

import { useMemo, useState } from "react";

type StrengthLevel = "Very weak" | "Weak" | "Fair" | "Good" | "Strong";

type PasswordCheck = {
  label: string;
  passed: boolean;
};

type PasswordAnalysis = {
  score: number;
  level: StrengthLevel;
  feedback: string[];
  entropyBits: number;
  crackTime: string;
  checks: PasswordCheck[];
};

const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:'\",.<>?/`~";
const COMMON_PASSWORDS = [
  "password",
  "qwerty",
  "letmein",
  "admin",
  "welcome",
  "iloveyou",
  "123456",
  "12345678",
  "123456789",
];
const COMMON_SEQUENCES = [
  "abcdefghijklmnopqrstuvwxyz",
  "0123456789",
  "qwertyuiop",
  "asdfghjkl",
  "zxcvbnm",
];

const LEVEL_STYLES: Record<
  StrengthLevel,
  { labelColor: string; barColor: string; ringColor: string }
> = {
  "Very weak": {
    labelColor: "text-red-700",
    barColor: "bg-red-500",
    ringColor: "ring-red-200",
  },
  Weak: {
    labelColor: "text-orange-700",
    barColor: "bg-orange-500",
    ringColor: "ring-orange-200",
  },
  Fair: {
    labelColor: "text-amber-700",
    barColor: "bg-amber-500",
    ringColor: "ring-amber-200",
  },
  Good: {
    labelColor: "text-sky-700",
    barColor: "bg-sky-500",
    ringColor: "ring-sky-200",
  },
  Strong: {
    labelColor: "text-emerald-700",
    barColor: "bg-emerald-500",
    ringColor: "ring-emerald-200",
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function includesSequence(password: string): boolean {
  const normalized = password.toLowerCase();

  for (const sequence of COMMON_SEQUENCES) {
    const reversed = sequence.split("").reverse().join("");
    for (let index = 0; index <= normalized.length - 3; index += 1) {
      const part = normalized.slice(index, index + 3);
      if (sequence.includes(part) || reversed.includes(part)) {
        return true;
      }
    }
  }

  return false;
}

function estimateEntropyBits(password: string): number {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/\d/.test(password)) pool += 10;
  if (new RegExp(`[${SYMBOLS.replace(/[\\\]\-]/g, "\\$&")}]`).test(password))
    pool += SYMBOLS.length;
  if (pool === 0) return 0;
  return Math.round(password.length * Math.log2(pool));
}

function estimateCrackTime(entropyBits: number): string {
  const guessesPerSecond = 10_000_000_000;
  const seconds = 2 ** entropyBits / guessesPerSecond;

  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 31_536_000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 3_153_600_000) return `${Math.round(seconds / 31_536_000)} years`;
  return "Centuries";
}

function analyzePassword(password: string): PasswordAnalysis {
  if (!password) {
    return {
      score: 0,
      level: "Very weak",
      feedback: ["Use 12+ characters with mixed character types."],
      entropyBits: 0,
      crackTime: "Instantly",
      checks: [
        { label: "At least 12 characters", passed: false },
        { label: "Upper and lowercase letters", passed: false },
        { label: "At least one number", passed: false },
        { label: "At least one symbol", passed: false },
        { label: "No common pattern", passed: false },
      ],
    };
  }

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  const isLongEnough = password.length >= 12;
  const lower = password.toLowerCase();
  const hasCommonPassword = COMMON_PASSWORDS.some((item) => lower.includes(item));
  const hasSequence = includesSequence(password);
  const hasRepeatedChars = /(.)\1{2,}/.test(password);

  let score = 0;

  score += Math.min(password.length * 3, 36);
  score += [hasLower, hasUpper, hasNumber, hasSymbol].filter(Boolean).length * 11;

  const uniqueRatio = new Set(password).size / password.length;
  score += Math.round(uniqueRatio * 16);

  if (password.length >= 16) score += 8;
  if ((password.match(/[^A-Za-z0-9]/g) ?? []).length >= 2) score += 6;

  if (hasCommonPassword) score -= 28;
  if (hasSequence) score -= 14;
  if (hasRepeatedChars) score -= 10;
  if (/^\d+$/.test(password)) score -= 12;
  if (/^[A-Za-z]+$/.test(password)) score -= 10;
  if (password.length < 8) score -= 20;

  score = clamp(score, 0, 100);

  let level: StrengthLevel = "Very weak";
  if (score >= 85) level = "Strong";
  else if (score >= 68) level = "Good";
  else if (score >= 48) level = "Fair";
  else if (score >= 30) level = "Weak";

  const feedback: string[] = [];
  if (password.length < 12) feedback.push("Increase length to at least 12 characters.");
  if (!(hasLower && hasUpper))
    feedback.push("Mix uppercase and lowercase letters.");
  if (!hasNumber) feedback.push("Add at least one number.");
  if (!hasSymbol) feedback.push("Add at least one special character.");
  if (hasCommonPassword)
    feedback.push("Avoid common words or password patterns.");
  if (hasSequence) feedback.push("Avoid keyboard or alphabetical sequences.");
  if (hasRepeatedChars)
    feedback.push("Avoid repeating the same character many times.");
  if (feedback.length === 0) feedback.push("Solid password. Store it in a password manager.");

  const entropyBits = estimateEntropyBits(password);

  return {
    score,
    level,
    feedback,
    entropyBits,
    crackTime: estimateCrackTime(entropyBits),
    checks: [
      { label: "At least 12 characters", passed: isLongEnough },
      { label: "Upper and lowercase letters", passed: hasLower && hasUpper },
      { label: "At least one number", passed: hasNumber },
      { label: "At least one symbol", passed: hasSymbol },
      { label: "No common pattern", passed: !hasCommonPassword && !hasSequence },
    ],
  };
}

function secureRandomInt(max: number): number {
  if (max <= 0) return 0;
  if (typeof crypto !== "undefined" && crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    crypto.getRandomValues(buffer);
    return buffer[0] % max;
  }
  return Math.floor(Math.random() * max);
}

function generatePassword(length = 16): string {
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const all = `${lower}${upper}${numbers}${SYMBOLS}`;

  const chars = [
    lower[secureRandomInt(lower.length)],
    upper[secureRandomInt(upper.length)],
    numbers[secureRandomInt(numbers.length)],
    SYMBOLS[secureRandomInt(SYMBOLS.length)],
  ];

  while (chars.length < length) {
    chars.push(all[secureRandomInt(all.length)]);
  }

  for (let index = chars.length - 1; index > 0; index -= 1) {
    const swapIndex = secureRandomInt(index + 1);
    const temp = chars[index];
    chars[index] = chars[swapIndex];
    chars[swapIndex] = temp;
  }

  return chars.join("");
}

const PasswordStrengthAnalyzer = () => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const analysis = useMemo(() => analyzePassword(password), [password]);
  const style = LEVEL_STYLES[analysis.level];

  return (
    <section className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-md sm:p-8">
      <div className="space-y-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Password Strength Analyzer
          </h1>
          <p className="text-sm text-slate-600">
            Instant scoring, practical feedback, and a stronger password
            generator.
          </p>
        </header>

        <div className="space-y-3">
          <label
            htmlFor="password-input"
            className="text-sm font-medium text-slate-800"
          >
            Password
          </label>
          <div
            className={`flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 ring-2 ${style.ringColor} transition`}
          >
            <input
              id="password-input"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Type or generate a password"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
              maxLength={128}
              autoComplete="off"
              spellCheck={false}
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="rounded-md px-2 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPassword(generatePassword())}
              className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-700"
            >
              Generate strong password
            </button>
            <button
              type="button"
              onClick={() => setPassword("")}
              className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm font-semibold">
            <span className={style.labelColor}>{analysis.level}</span>
            <span className="text-slate-600">{analysis.score}/100</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className={`h-full rounded-full ${style.barColor} transition-all duration-300`}
              style={{ width: `${analysis.score}%` }}
            />
          </div>
          <p className="text-xs text-slate-600">
            Estimated brute-force resistance: {analysis.crackTime} ({analysis.entropyBits} bits)
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Security checklist
            </h2>
            <ul className="space-y-2 text-sm">
              {analysis.checks.map((check) => (
                <li key={check.label} className="flex items-start gap-2">
                  <span
                    className={`mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
                      check.passed
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-200 text-slate-600"
                    }`}
                    aria-hidden
                  >
                    {check.passed ? "Y" : "N"}
                  </span>
                  <span className="text-slate-700">{check.label}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4">
            <h2 className="mb-3 text-sm font-semibold text-slate-900">
              Improvement tips
            </h2>
            <ul className="space-y-2 text-sm text-slate-700">
              {analysis.feedback.map((tip) => (
                <li key={tip} className="leading-relaxed">
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PasswordStrengthAnalyzer;
