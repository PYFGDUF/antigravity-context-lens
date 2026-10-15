// Frontend Logic for Context Lens UI Extension
// Integrates with Antigravity Sidecar SDK & window.sidecar
// Full Multi-language (i18n) Support: zh-CN & en

const sidecar = window.sidecar;
const $ = (id) => document.getElementById(id);

// ---------------------------------------------------------------------------
// Internationalization (i18n) Dictionary
// ---------------------------------------------------------------------------

const TRANSLATIONS = {
  zh: {
    brandTitle: '上下文透视',
    live: '监控中',
    paused: '已暂停',
    reading: '正在读取会话…',
    switchConv: '切换',
    windowLimit: '窗口上限:',
    currentUsage: '当前上下文用量 (Current Prompt Context)',
    healthGood: '健康 (充足)',
    healthModerate: '适中 (正常)',
    healthHeavy: '偏高 (建议整理)',
    tokens: 'Tokens',
    remainingFormat: '可用: {rem} Tokens ({pct}% 剩余)',
    lastSync: '最近同步: {time}',
    compTitle: '上下文构成三元拆解 (Composition)',
    cacheHit: '缓存命中 (Cache)',
    cacheHitRatio: '{pct}% 命中率',
    inputTokens: '增量输入 (Input)',
    inputTokensDesc: '未命中新增部分',
    outputTokens: '上轮输出 (Output)',
    outputTokensDesc: '模型生成消耗',
    timelineTitle: '交互上下文膨胀趋势 (Timeline Growth)',
    turns: '{n} 交互',
    noTimeline: '暂无交互序列，开始对话后自动绘制走势',
    cumTitle: '会话累计处理指标 (Cumulative Metrics)',
    totalPrompt: '累计 Prompt 总吞吐',
    cacheFactor: '缓存加速放大倍率',
    factorUnit: '{x}x 放大',
    totalOutput: '累计模型回复生成',
    avgCache: '平均缓存命中率',
    thinkingChars: '模型深度思考字符',
    interactions: '交互总轮次 (Turns)',
    turnsFormat: '{n} 轮交互 ({steps} 步骤)',
    toolsTitle: '工具上下文调用分布 (Tools Distribution)',
    times: '{n} 次',
    compactBtn: '建议压缩上下文 (/compact)',
    copyReportBtn: '复制诊断报告',
    compactToastSent: '已向当前会话发送 /compact 压缩指令',
    compactToastManual: '提示：请在当前会话对话框中输入 /compact 执行压缩',
    copiedToast: '已成功复制诊断报告 Markdown',
    copyFailedToast: '复制失败，请检查剪贴板权限',
    switchSuccessToast: '已切换至目标会话',
    modalTitle: '切换查看会话',
    modalLoading: '正在加载会话列表…',
    modalEmpty: '暂无历史会话',
    modalLoadFailed: '加载失败: {err}',
    reportTitle: '### 📊 Antigravity 会话上下文报告 ({title})',
    reportPromptContext: '- **当前上下文窗口占用**: {used} Tokens / {limit} Tokens ({pct}%)',
    reportCache: '- **缓存命中 (Prompt Cache)**: {cache} Tokens ({pct}%)',
    reportInput: '- **新增输入 (New Input)**: {input} Tokens',
    reportOutput: '- **生成输出 (Output)**: {output} Tokens',
    reportCumulative: '- **累计吞吐量**: {total} Tokens (缓存放大 {factor}x)',
    reportCumOutput: '- **累计模型回复**: {output} Tokens',
    reportTurns: '- **交互轮次**: {turns} 轮 ({steps} 步骤)',
    reportTime: '- **时间**: {time}',
    langSwitchNotice: '已切换语言为中文',
  },
  en: {
    brandTitle: 'Context Lens',
    live: 'Live',
    paused: 'Paused',
    reading: 'Reading conversation…',
    switchConv: 'Switch',
    windowLimit: 'Limit:',
    currentUsage: 'Current Prompt Context',
    healthGood: 'Healthy (Plenty)',
    healthModerate: 'Moderate (Normal)',
    healthHeavy: 'Heavy (Compact advised)',
    tokens: 'Tokens',
    remainingFormat: 'Available: {rem} Tokens ({pct}% left)',
    lastSync: 'Last synced: {time}',
    compTitle: 'Context Composition Breakdown',
    cacheHit: 'Cache Read (Prompt Cache)',
    cacheHitRatio: '{pct}% Hit Ratio',
    inputTokens: 'New Input (Uncached)',
    inputTokensDesc: 'Incremental context added',
    outputTokens: 'Last Output (Generated)',
    outputTokensDesc: 'Model generation cost',
    timelineTitle: 'Context Growth Timeline',
    turns: '{n} Turns',
    noTimeline: 'No interactions yet. Start chatting to trace context growth.',
    cumTitle: 'Cumulative Session Metrics',
    totalPrompt: 'Cumulative Prompt Tokens',
    cacheFactor: 'Cache Acceleration Factor',
    factorUnit: '{x}x Boost',
    totalOutput: 'Cumulative Output Tokens',
    avgCache: 'Avg. Cache Hit Ratio',
    thinkingChars: 'Model Thinking Characters',
    interactions: 'Total Interactions',
    turnsFormat: '{n} Turns ({steps} Steps)',
    toolsTitle: 'Tool Context Distribution',
    times: '{n} calls',
    compactBtn: 'Advise Compact (/compact)',
    copyReportBtn: 'Copy Diagnostics',
    compactToastSent: 'Sent /compact instruction to conversation',
    compactToastManual: 'Tip: Please type /compact in chat to compact context',
    copiedToast: 'Diagnostic report copied to clipboard (Markdown)',
    copyFailedToast: 'Copy failed, please check clipboard permissions',
    switchSuccessToast: 'Switched to target conversation',
    modalTitle: 'Switch Conversation',
    modalLoading: 'Loading conversations…',
    modalEmpty: 'No conversations found',
    modalLoadFailed: 'Failed to load: {err}',
    reportTitle: '### 📊 Antigravity Context Diagnostic Report ({title})',
    reportPromptContext: '- **Current Context Usage**: {used} Tokens / {limit} Tokens ({pct}%)',
    reportCache: '- **Prompt Cache Read**: {cache} Tokens ({pct}%)',
    reportInput: '- **New Input Tokens**: {input} Tokens',
    reportOutput: '- **Generated Output Tokens**: {output} Tokens',
    reportCumulative: '- **Cumulative Prompt Throughput**: {total} Tokens (Cache Boost {factor}x)',
    reportCumOutput: '- **Cumulative Model Output**: {output} Tokens',
    reportTurns: '- **Interaction Count**: {turns} turns ({steps} steps)',
    reportTime: '- **Timestamp**: {time}',
    langSwitchNotice: 'Language switched to English',
  },
};

// Language state
function detectDefaultLang() {
  const saved = localStorage.getItem('context_lens_lang');
  if (saved && (saved === 'zh' || saved === 'en')) return saved;
  const sysLang = navigator.language || navigator.userLanguage || 'en';
  return sysLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
}

let currentLang = detectDefaultLang();

function t(key, params = {}) {
  const dict = TRANSLATIONS[currentLang] || TRANSLATIONS.zh;
  let text = dict[key] || TRANSLATIONS.zh[key] || key;
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
  }
  return text;
}

function updateStaticTexts() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    el.textContent = t(key);
  });
  // Update toggle button text
  const langBtn = $('toggle-lang-btn');
  if (langBtn) {
    langBtn.textContent = currentLang === 'zh' ? 'EN' : '中';
    langBtn.title = currentLang === 'zh' ? '切换为 English' : '切换为简体中文';
  }
}

// ---------------------------------------------------------------------------
// App State
// ---------------------------------------------------------------------------

let activeConvId = sidecar?.conversationId || null;
let currentLimit = 1048576; // Default 1M
let autoRefresh = true;
let refreshTimer = null;
let latestStats = null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function callApi(path, { method = 'GET', body } = {}) {
  if (sidecar?.fetch) {
    const res = await sidecar.fetch(path, {
      method,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
    return data;
  }
  const res = await fetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `${res.status} ${res.statusText}`);
  return data;
}

let toastTimeout;
function showToast(msg) {
  const el = $('toast');
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    el.hidden = true;
  }, 3200);
}

function formatTokens(num) {
  if (num === null || num === undefined) return '0';
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
  return num.toLocaleString();
}

function formatFullNum(num) {
  return (num || 0).toLocaleString();
}

function formatTime(isoStr) {
  if (!isoStr) return '–';
  try {
    const d = new Date(isoStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch (e) {
    return isoStr;
  }
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function renderStats(stats) {
  latestStats = stats;
  if (!stats) return;

  // Session Meta
  $('current-conv-title').textContent = stats.title || t('reading');
  $('current-conv-title').title = stats.title || '';

  const latest = stats.latest || {};
  const currentTokens = latest.contextTokens || 0;
  const usageRatio = currentLimit > 0 ? (currentTokens / currentLimit) * 100 : 0;
  const pctStr = usageRatio.toFixed(1) + '%';

  // Primary Gauge
  $('current-tokens').textContent = formatFullNum(currentTokens);
  $('usage-pct').textContent = pctStr;

  const usageBar = $('usage-bar');
  const clampedWidth = Math.min(Math.max(usageRatio, 0), 100);
  usageBar.style.width = clampedWidth + '%';

  // Health assessment
  const healthTag = $('health-tag');
  usageBar.className = 'progress-bar';
  if (usageRatio < 35) {
    usageBar.classList.add('healthy');
    healthTag.textContent = t('healthGood');
    healthTag.style.color = 'var(--color-green)';
  } else if (usageRatio < 70) {
    usageBar.classList.add('moderate');
    healthTag.textContent = t('healthModerate');
    healthTag.style.color = 'var(--color-amber)';
  } else {
    usageBar.classList.add('heavy');
    healthTag.textContent = t('healthHeavy');
    healthTag.style.color = 'var(--color-red)';
  }

  const remaining = Math.max(0, currentLimit - currentTokens);
  $('remaining-tokens').textContent = t('remainingFormat', {
    rem: formatTokens(remaining),
    pct: (100 - usageRatio).toFixed(1),
  });
  $('latest-step-time').textContent = t('lastSync', { time: formatTime(latest.timestamp) });

  // Composition Grid
  $('comp-cache').textContent = formatFullNum(latest.cacheReadTokens);
  $('comp-cache-ratio').textContent = t('cacheHitRatio', { pct: (latest.cacheHitRatio || 0).toFixed(1) });

  $('comp-input').textContent = formatFullNum(latest.inputTokens);
  $('comp-output').textContent = formatFullNum(latest.outputTokens);

  // Cumulative Metrics
  const cum = stats.cumulative || {};
  $('stat-total-prompt').textContent = formatTokens(cum.totalPromptTokens) + ' ' + t('tokens');
  $('stat-cache-factor').textContent = t('factorUnit', { x: (cum.cacheSavingsFactor || 1).toFixed(1) });
  $('stat-total-output').textContent = formatTokens(cum.totalOutputTokens) + ' ' + t('tokens');
  $('stat-avg-cache').textContent = (cum.avgCacheHitRatio || 0).toFixed(1) + '%';
  $('stat-thinking-chars').textContent = formatFullNum(cum.totalThinkingChars);
  $('stat-turns').textContent = t('turnsFormat', {
    n: stats.plannerCount || 0,
    steps: stats.stepCount || 0,
  });

  $('turn-badge').textContent = t('turns', { n: stats.plannerCount || 0 });

  // Timeline SVG Chart
  renderTimelineChart(stats.timeline || []);

  // Tool Breakdown
  renderTools(stats.tools || {});
}

// ---------------------------------------------------------------------------
// SVG Timeline Chart
// ---------------------------------------------------------------------------

function renderTimelineChart(timeline) {
  const svg = $('timeline-svg');
  const tooltip = $('chart-tooltip');

  if (!timeline || timeline.length === 0) {
    svg.innerHTML = `
      <text x="250" y="60" text-anchor="middle" fill="var(--text-muted)" font-size="12">
        ${t('noTimeline')}
      </text>
    `;
    return;
  }

  const W = 500;
  const H = 110;
  const padL = 36;
  const padR = 16;
  const padT = 16;
  const padB = 22;

  const maxVal = Math.max(...timeline.map((d) => d.contextTokens), 1000);
  const minVal = 0;
  const len = timeline.length;

  const getX = (i) => {
    if (len === 1) return (padL + W - padR) / 2;
    return padL + (i / (len - 1)) * (W - padL - padR);
  };

  const getY = (val) => {
    const ratio = (val - minVal) / (maxVal - minVal);
    return H - padB - ratio * (H - padT - padB);
  };

  let gridSvg = `
    <line x1="${padL}" y1="${H - padB}" x2="${W - padR}" y2="${H - padB}" stroke="var(--border-color)" stroke-width="1"/>
    <line x1="${padL}" y1="${padT}" x2="${W - padR}" y2="${padT}" stroke="var(--border-color)" stroke-width="1" stroke-dasharray="3 3"/>
    <text x="${padL - 4}" y="${padT + 4}" text-anchor="end" fill="var(--text-muted)" font-size="9" font-family="var(--font-mono)">${formatTokens(maxVal)}</text>
    <text x="${padL - 4}" y="${H - padB}" text-anchor="end" fill="var(--text-muted)" font-size="9" font-family="var(--font-mono)">0</text>
  `;

  let lineD = '';
  let areaD = '';

  timeline.forEach((pt, i) => {
    const x = getX(i);
    const y = getY(pt.contextTokens);
    if (i === 0) {
      lineD += `M ${x} ${y}`;
      areaD += `M ${x} ${H - padB} L ${x} ${y}`;
    } else {
      lineD += ` L ${x} ${y}`;
      areaD += ` L ${x} ${y}`;
    }
  });

  const lastX = getX(len - 1);
  areaD += ` L ${lastX} ${H - padB} Z`;

  let pointsSvg = '';
  timeline.forEach((pt, i) => {
    const x = getX(i);
    const y = getY(pt.contextTokens);
    pointsSvg += `
      <circle cx="${x}" cy="${y}" r="3" fill="var(--accent-color)" stroke="var(--card-bg)" stroke-width="1.5" class="chart-point" data-idx="${i}"/>
    `;
  });

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--accent-color)" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="var(--accent-color)" stop-opacity="0.0"/>
      </linearGradient>
    </defs>
    ${gridSvg}
    <path d="${areaD}" fill="url(#areaGrad)"/>
    <path d="${lineD}" fill="none" stroke="var(--accent-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    ${pointsSvg}
  `;

  const points = svg.querySelectorAll('.chart-point');
  points.forEach((ptEl) => {
    ptEl.addEventListener('mouseenter', () => {
      const idx = Number(ptEl.getAttribute('data-idx'));
      const d = timeline[idx];
      if (!d) return;

      const cachePct = d.contextTokens > 0 ? ((d.cacheReadTokens / d.contextTokens) * 100).toFixed(0) : 0;
      const toolInfo = d.tools && d.tools.length > 0 ? ` [${d.tools.join(', ')}]` : '';

      tooltip.innerHTML = `
        <strong>#${d.step}</strong>: ${formatFullNum(d.contextTokens)} tk (${cachePct}% cache)${toolInfo}
      `;
      tooltip.classList.add('visible');
    });

    ptEl.addEventListener('mouseleave', () => {
      tooltip.classList.remove('visible');
    });
  });
}

// ---------------------------------------------------------------------------
// Tool Breakdown List
// ---------------------------------------------------------------------------

function renderTools(tools) {
  const container = $('tool-list');
  const card = $('tool-card');

  const entries = Object.entries(tools).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    card.hidden = true;
    return;
  }
  card.hidden = false;

  const maxCount = entries[0][1] || 1;
  let html = '';

  for (const [name, count] of entries) {
    const ratio = Math.min((count / maxCount) * 100, 100);
    html += `
      <div class="tool-row">
        <div class="tool-name-col" title="${name}">
          <span style="font-family: var(--font-mono); font-size: 11px;">⚙</span>
          <span>${name}</span>
        </div>
        <div class="tool-bar-track">
          <div class="tool-bar-fill" style="width: ${ratio}%;"></div>
        </div>
        <div class="tool-count">${t('times', { n: count })}</div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// ---------------------------------------------------------------------------
// Fetch Data
// ---------------------------------------------------------------------------

async function fetchData(quiet = false) {
  const refreshBtn = $('refresh-btn');
  if (!quiet) refreshBtn.classList.add('spinning');

  try {
    if (sidecar?.conversationId && sidecar.conversationId !== activeConvId) {
      activeConvId = sidecar.conversationId;
    }

    const query = activeConvId ? `?conversationId=${encodeURIComponent(activeConvId)}` : '';
    const stats = await callApi(`/api/context${query}`);

    if (stats.error) {
      $('current-conv-title').textContent = stats.error;
    } else {
      if (!activeConvId && stats.conversationId) {
        activeConvId = stats.conversationId;
      }
      renderStats(stats);
    }
  } catch (err) {
    console.error('Fetch context failed:', err);
    if (!quiet) showToast(err.message);
  } finally {
    if (!quiet) {
      setTimeout(() => refreshBtn.classList.remove('spinning'), 300);
    }
  }
}

// ---------------------------------------------------------------------------
// Actions
// ---------------------------------------------------------------------------

async function askToCompact() {
  if (!activeConvId) {
    showToast(currentLang === 'zh' ? '未处于活跃会话中' : 'Not in an active conversation');
    return;
  }

  if (sidecar?.agent?.sendMessage) {
    try {
      await sidecar.agent.sendMessage('/compact', activeConvId);
      showToast(t('compactToastSent'));
      fetchData();
    } catch (err) {
      showToast(err.message);
    }
  } else {
    showToast(t('compactToastManual'));
  }
}

function copyReport() {
  if (!latestStats) {
    showToast(currentLang === 'zh' ? '暂无数据可复制' : 'No data to copy');
    return;
  }

  const s = latestStats;
  const l = s.latest || {};
  const c = s.cumulative || {};

  const md = [
    t('reportTitle', { title: s.title || s.conversationId }),
    t('reportPromptContext', {
      used: formatFullNum(l.contextTokens),
      limit: formatFullNum(currentLimit),
      pct: ((l.contextTokens / currentLimit) * 100).toFixed(1),
    }),
    t('reportCache', {
      cache: formatFullNum(l.cacheReadTokens),
      pct: (l.cacheHitRatio || 0).toFixed(1),
    }),
    t('reportInput', { input: formatFullNum(l.inputTokens) }),
    t('reportOutput', { output: formatFullNum(l.outputTokens) }),
    t('reportCumulative', {
      total: formatFullNum(c.totalPromptTokens),
      factor: c.cacheSavingsFactor || 1,
    }),
    t('reportCumOutput', { output: formatFullNum(c.totalOutputTokens) }),
    t('reportTurns', { turns: s.plannerCount || 0, steps: s.stepCount || 0 }),
    t('reportTime', { time: new Date().toLocaleString() }),
  ].join('\n');

  navigator.clipboard
    .writeText(md)
    .then(() => showToast(t('copiedToast')))
    .catch(() => showToast(t('copyFailedToast')));
}

// ---------------------------------------------------------------------------
// Language Switcher
// ---------------------------------------------------------------------------

function toggleLanguage() {
  currentLang = currentLang === 'zh' ? 'en' : 'zh';
  localStorage.setItem('context_lens_lang', currentLang);
  updateStaticTexts();
  if (latestStats) {
    renderStats(latestStats);
  }
  showToast(t('langSwitchNotice'));
}

// ---------------------------------------------------------------------------
// Conversation Switcher Modal
// ---------------------------------------------------------------------------

async function openConvModal() {
  const modal = $('conv-modal');
  const listEl = $('modal-conv-list');
  listEl.innerHTML = `<div style="padding:16px;text-align:center;color:var(--text-muted)">${t('modalLoading')}</div>`;
  modal.hidden = false;

  try {
    const data = await callApi('/api/conversations?limit=15');
    const convs = data.conversations || [];
    if (convs.length === 0) {
      listEl.innerHTML = `<div style="padding:16px;text-align:center;color:var(--text-muted)">${t('modalEmpty')}</div>`;
      return;
    }

    listEl.innerHTML = convs
      .map(
        (c) => `
      <div class="modal-item ${c.id === activeConvId ? 'active' : ''}" data-id="${c.id}">
        <div class="modal-item-title">${c.title || 'Conv ' + c.id.slice(0, 8)}</div>
        <div class="modal-item-time">${formatTime(c.mtime)} · ID: ${c.id.slice(0, 8)}</div>
      </div>
    `
      )
      .join('');

    listEl.querySelectorAll('.modal-item').forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-id');
        activeConvId = id;
        modal.hidden = true;
        fetchData();
        showToast(t('switchSuccessToast'));
      });
    });
  } catch (err) {
    listEl.innerHTML = `<div style="padding:16px;color:var(--color-red)">${t('modalLoadFailed', { err: err.message })}</div>`;
  }
}

// ---------------------------------------------------------------------------
// Setup & Lifecycle
// ---------------------------------------------------------------------------

function setupEventListeners() {
  $('toggle-lang-btn').addEventListener('click', toggleLanguage);
  $('refresh-btn').addEventListener('click', () => fetchData(false));
  $('compact-btn').addEventListener('click', askToCompact);
  $('copy-report-btn').addEventListener('click', copyReport);
  $('switch-conv-btn').addEventListener('click', openConvModal);
  $('close-modal-btn').addEventListener('click', () => {
    $('conv-modal').hidden = true;
  });

  const limitSelect = $('limit-select');
  limitSelect.value = String(currentLimit);
  limitSelect.addEventListener('change', (e) => {
    currentLimit = Number(e.target.value) || 1048576;
    if (latestStats) renderStats(latestStats);
  });

  const toggleBtn = $('toggle-autorefresh-btn');
  const liveIndicator = $('live-indicator');
  toggleBtn.addEventListener('click', () => {
    autoRefresh = !autoRefresh;
    if (autoRefresh) {
      liveIndicator.className = 'badge-live';
      liveIndicator.textContent = t('live');
      toggleBtn.style.color = 'var(--color-green)';
      showToast(currentLang === 'zh' ? '已开启自动实时同步' : 'Live polling resumed');
    } else {
      liveIndicator.className = 'badge-live';
      liveIndicator.style.background = 'var(--sub-bg)';
      liveIndicator.style.color = 'var(--text-muted)';
      liveIndicator.textContent = t('paused');
      toggleBtn.style.color = 'var(--text-muted)';
      showToast(currentLang === 'zh' ? '已暂停自动同步' : 'Live polling paused');
    }
  });

  if (sidecar?.onWorkspaceChange) {
    sidecar.onWorkspaceChange(() => {
      fetchData(true);
    });
  }
}

function startPolling() {
  if (refreshTimer) clearInterval(refreshTimer);
  refreshTimer = setInterval(() => {
    if (autoRefresh) {
      fetchData(true);
    }
  }, 3000);
}

function init() {
  updateStaticTexts();
  setupEventListeners();
  fetchData(false);
  startPolling();
}

// Run
init();
