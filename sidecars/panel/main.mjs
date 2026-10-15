// Backend for Context Lens UI Extension
// Antigravity Native Auxiliary Pane Extension for Conversation Context & Token Usage

import {
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  readdirSync,
  statSync,
  openSync,
  readSync,
  closeSync
} from 'node:fs';
import { homedir, platform, release } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { Response, SidecarApp } from 'sidecar_sdk';

const HERE = dirname(fileURLToPath(import.meta.url));
const APP_DATA_DIR = join(homedir(), '.gemini', 'antigravity');
const BRAIN_DIR = join(APP_DATA_DIR, 'brain');
const DATA_DIR = process.env.ANTIGRAVITY_EXECUTABLE_DATA_DIR || join(HERE, '.data');
const CONFIG_FILE = join(DATA_DIR, 'config.json');
const STARTED_AT = Date.now();

const app = new SidecarApp();

// ---------------------------------------------------------------------------
// Static Files
// ---------------------------------------------------------------------------

const readLocal = (name) => readFileSync(join(HERE, name), 'utf8');

app.page('/', () => readLocal('index.html'));
app.page('/app.js', () => readLocal('app.js'));
app.api('/styles.css', () => new Response(readLocal('styles.css'), { contentType: 'text/css' }), 'GET');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function loadConfig() {
  if (!existsSync(CONFIG_FILE)) {
    return { contextLimit: 1048576, autoRefresh: true, refreshIntervalSec: 3 };
  }
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, 'utf8'));
  } catch (err) {
    return { contextLimit: 1048576, autoRefresh: true, refreshIntervalSec: 3 };
  }
}

function saveConfig(cfg) {
  mkdirSync(DATA_DIR, { recursive: true });
  const current = loadConfig();
  const updated = { ...current, ...cfg };
  writeFileSync(CONFIG_FILE, JSON.stringify(updated, null, 2), 'utf8');
  return updated;
}

function getRecentConversations(limit = 12) {
  if (!existsSync(BRAIN_DIR)) return [];
  try {
    const entries = readdirSync(BRAIN_DIR, { withFileTypes: true });
    const convs = [];
    for (const ent of entries) {
      if (!ent.isDirectory() || ent.name.startsWith('.')) continue;
      const id = ent.name;
      const transcriptPath = join(BRAIN_DIR, id, '.system_generated', 'logs', 'transcript.jsonl');
      if (existsSync(transcriptPath)) {
        try {
          const st = statSync(transcriptPath);
          convs.push({ id, mtime: st.mtimeMs, size: st.size });
        } catch (e) {}
      }
    }
    convs.sort((a, b) => b.mtime - a.mtime);
    return convs.slice(0, limit).map((c) => ({
      id: c.id,
      mtime: c.mtime,
      title: getConversationTitle(c.id),
    }));
  } catch (err) {
    console.error('Error listing conversations:', err);
    return [];
  }
}

function getConversationTitle(convId) {
  // 1. Try sqlite db if available
  try {
    const dbPath = join(APP_DATA_DIR, 'conversation_summaries.db');
    if (existsSync(dbPath)) {
      const escapedId = convId.replace(/"/g, '""');
      const out = execFileSync(
        'sqlite3',
        [dbPath, `SELECT title FROM conversation_summaries WHERE conversation_id = "${escapedId}" LIMIT 1;`],
        { encoding: 'utf8', timeout: 800 }
      ).trim();
      if (out) return out;
    }
  } catch (e) {}

  // 2. Fallback: extract from first user input in transcript.jsonl
  try {
    const p = join(BRAIN_DIR, convId, '.system_generated', 'logs', 'transcript.jsonl');
    if (existsSync(p)) {
      const fd = openSync(p, 'r');
      const buf = Buffer.alloc(4096);
      const bytesRead = readSync(fd, buf, 0, 4096, 0);
      closeSync(fd);
      if (bytesRead > 0) {
        const text = buf.toString('utf8', 0, bytesRead);
        const lines = text.split('\n');
        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const obj = JSON.parse(line);
            if (obj.type === 'USER_INPUT' && obj.content) {
              const cleaned = obj.content
                .replace(/<[^>]+>/g, '')
                .trim()
                .replace(/\s+/g, ' ');
              if (cleaned) {
                return cleaned.slice(0, 45) + (cleaned.length > 45 ? '…' : '');
              }
            }
          } catch (pe) {}
        }
      }
    }
  } catch (e) {}

  return `会话 ${convId.slice(0, 8)}`;
}

function parseTranscript(convId) {
  const p = join(BRAIN_DIR, convId, '.system_generated', 'logs', 'transcript.jsonl');
  if (!existsSync(p)) {
    return null;
  }

  const content = readFileSync(p, 'utf8');
  const lines = content.split('\n');

  let latestContext = 0;
  let latestCache = 0;
  let latestInput = 0;
  let latestOutput = 0;
  let latestStepIndex = 0;
  let latestTimestamp = null;

  let totalInput = 0;
  let totalCache = 0;
  let totalOutput = 0;
  let totalThinkingChars = 0;

  const toolStats = {};
  const timeline = [];
  let userMessageCount = 0;
  let plannerCount = 0;
  let genericToolCount = 0;

  for (const line of lines) {
    if (!line.trim()) continue;
    try {
      const step = JSON.parse(line);
      const sType = step.type;

      if (sType === 'USER_INPUT') {
        userMessageCount++;
      } else if (sType === 'GENERIC') {
        genericToolCount++;
      } else if (sType === 'PLANNER_RESPONSE') {
        plannerCount++;
        const input = Number(step.input_tokens) || 0;
        const cache = Number(step.cache_read_tokens) || 0;
        const output = Number(step.output_tokens) || 0;
        const currentPromptTokens = input + cache;

        latestContext = currentPromptTokens;
        latestCache = cache;
        latestInput = input;
        latestOutput = output;
        latestStepIndex = step.step_index ?? plannerCount;
        latestTimestamp = step.created_at;

        totalInput += input;
        totalCache += cache;
        totalOutput += output;

        if (step.thinking) {
          totalThinkingChars += step.thinking.length;
        }

        const toolsCalled = [];
        if (Array.isArray(step.tool_calls)) {
          for (const tc of step.tool_calls) {
            const name = tc.name || 'unknown';
            toolsCalled.push(name);
            toolStats[name] = (toolStats[name] || 0) + 1;
          }
        }

        timeline.push({
          step: latestStepIndex,
          time: step.created_at,
          contextTokens: currentPromptTokens,
          inputTokens: input,
          cacheReadTokens: cache,
          outputTokens: output,
          tools: toolsCalled,
        });
      }
    } catch (e) {}
  }

  const totalPromptTokens = totalInput + totalCache;
  const totalTokensOverall = totalPromptTokens + totalOutput;
  const cacheHitRatio = latestContext > 0 ? (latestCache / latestContext) * 100 : 0;
  const avgCacheHitRatio = totalPromptTokens > 0 ? (totalCache / totalPromptTokens) * 100 : 0;
  const cacheSavingsFactor = totalInput > 0 ? (totalPromptTokens / totalInput) : 1;

  return {
    conversationId: convId,
    title: getConversationTitle(convId),
    stepCount: lines.length,
    userMessageCount,
    plannerCount,
    genericToolCount,
    latest: {
      contextTokens: latestContext,
      cacheReadTokens: latestCache,
      inputTokens: latestInput,
      outputTokens: latestOutput,
      cacheHitRatio: Math.round(cacheHitRatio * 10) / 10,
      stepIndex: latestStepIndex,
      timestamp: latestTimestamp,
    },
    cumulative: {
      totalInputTokens: totalInput,
      totalCacheReadTokens: totalCache,
      totalOutputTokens: totalOutput,
      totalPromptTokens,
      totalTokensOverall,
      totalThinkingChars,
      avgCacheHitRatio: Math.round(avgCacheHitRatio * 10) / 10,
      cacheSavingsFactor: Math.round(cacheSavingsFactor * 10) / 10,
    },
    tools: toolStats,
    timeline,
  };
}

// ---------------------------------------------------------------------------
// APIs
// ---------------------------------------------------------------------------

// GET /api/status
app.api(
  '/api/status',
  () => ({
    node: process.version,
    platform: `${platform()} ${release()}`,
    uptimeSeconds: Math.round((Date.now() - STARTED_AT) / 1000),
    startedAt: STARTED_AT,
  }),
  'GET'
);

// GET /api/config
app.api('/api/config', () => loadConfig(), 'GET');

// POST /api/config
app.api('/api/config', (data) => saveConfig(data), 'POST');

// GET /api/conversations
app.api(
  '/api/conversations',
  (data) => {
    const limit = Number(data.limit) || 12;
    return { conversations: getRecentConversations(limit) };
  },
  'GET'
);

// GET /api/context
app.api(
  '/api/context',
  (data) => {
    let convId = data.conversationId;
    if (!convId || convId === 'null' || convId === 'undefined') {
      const recents = getRecentConversations(1);
      if (recents.length > 0) {
        convId = recents[0].id;
      }
    }

    if (!convId) {
      return { error: '未找到活跃或最近的会话', conversationId: null };
    }

    const stats = parseTranscript(convId);
    if (!stats) {
      return {
        conversationId: convId,
        title: getConversationTitle(convId),
        empty: true,
        message: '该会话暂无交互记录或正在初始化中',
        latest: {
          contextTokens: 0,
          cacheReadTokens: 0,
          inputTokens: 0,
          outputTokens: 0,
          cacheHitRatio: 0,
          stepIndex: 0,
          timestamp: null,
        },
        cumulative: {
          totalInputTokens: 0,
          totalCacheReadTokens: 0,
          totalOutputTokens: 0,
          totalPromptTokens: 0,
          totalTokensOverall: 0,
          totalThinkingChars: 0,
          avgCacheHitRatio: 0,
          cacheSavingsFactor: 1,
        },
        tools: {},
        timeline: [],
      };
    }

    return stats;
  },
  'GET'
);

app.run();
