// ============================================================
// Cloudflare Worker - فقط کرون تریگر
// هیچ endpoint عمومی نداره. فقط configs.txt رو توی گیت‌هاب آپدیت می‌کنه.
// ============================================================

const CS_VALUE = 'TLS_AES_256_GCM_SHA384%3ATLS_CHACHA20_POLY1305_SHA256%3ATLS_AES_128_GCM_SHA256%3ATLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384%3ATLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384%3ATLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256%3ATLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256%3ATLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305_SHA256%3ATLS_ECDHE_RSA_WITH_CHACHA20_POLY1305_SHA256%3ATLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA%3ATLS_ECDHE_RSA_WITH_AES_256_CBC_SHA%3ATLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256%3ATLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256';

const FM_VALUE = '%7B%22tcp%22%3A%5B%7B%22type%22%3A%22fragment%22%2C%22settings%22%3A%7B%22packets%22%3A%22tlshello%22%2C%22lengths%22%3A%5B%22100-250%22%5D%2C%22delays%22%3A%5B%220%22%5D%2C%22maxSplit%22%3A%22200%22%7D%7D%2C%7B%22type%22%3A%22fragment%22%2C%22settings%22%3A%7B%22packets%22%3A%221-3%22%2C%22lengths%22%3A%5B%22200-400%22%5D%2C%22delays%22%3A%5B%220%22%5D%2C%22maxSplit%22%3A%22350%22%7D%7D%5D%2C%22udp%22%3A%5B%7B%22type%22%3A%22noise%22%2C%22settings%22%3A%7B%22reset%22%3A%2230%22%2C%22noise%22%3A%5B%7B%22rand%22%3A%22300-500%22%2C%22delay%22%3A%220%22%7D%2C%7B%22rand%22%3A%22300-500%22%2C%22delay%22%3A%220%22%7D%5D%7D%7D%5D%7D';

const FP_VALUE = 'unsafe';
const NAME_PREFIX = 'github.com/NodeOOF - ';

// ============ IPv4 → IPv6 ============
function isIPv4(str) {
  if (typeof str !== 'string') return false;
  const parts = str.split('.');
  if (parts.length !== 4) return false;
  return parts.every(p => /^\d{1,3}$/.test(p) && +p >= 0 && +p <= 255);
}

function ipv4ToIPv6(ipv4) {
  const parts = ipv4.split('.').map(Number);
  const hex = parts.map(p => p.toString(16).padStart(2, '0')).join('');
  return `2606:4700::${hex.slice(0, 4)}:${hex.slice(4)}`;
}

// ============ تبدیل یک خط ============
function convertLine(trimmed, index) {
  const isVless = trimmed.startsWith('vless://');
  const isTrojan = trimmed.startsWith('trojan://');
  const isSS = trimmed.startsWith('ss://');
  if (!isVless && !isTrojan && !isSS) return trimmed;

  let base, queryAndHash = '';
  const firstQMark = trimmed.indexOf('?');
  if (firstQMark === -1) {
    base = trimmed;
  } else {
    base = trimmed.substring(0, firstQMark);
    queryAndHash = trimmed.substring(firstQMark + 1);
  }

  base = base.replace(/@(\[[^\]]+\]|[^:@/?#]+)(:\d+)?/, (match, host, port) => {
    if (host.startsWith('[')) return match;
    if (isIPv4(host)) return '@[' + ipv4ToIPv6(host) + ']' + (port || '');
    return match;
  });

  let query = '', hash = '';
  const hashIndex = queryAndHash.indexOf('#');
  if (hashIndex === -1) {
    query = queryAndHash;
  } else {
    query = queryAndHash.substring(0, hashIndex);
    hash = queryAndHash.substring(hashIndex);
  }

  if (query) {
    query = query.replace(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g, (ip) =>
      isIPv4(ip) ? ipv4ToIPv6(ip) : ip
    );
  }

  const params = new Map();
  if (query) {
    for (const pair of query.split('&')) {
      const eq = pair.indexOf('=');
      if (eq === -1) {
        if (pair) params.set(pair, '');
      } else {
        const k = pair.substring(0, eq);
        const v = pair.substring(eq + 1);
        if (k) params.set(k, v);
      }
    }
  }

  if (isVless || isTrojan) {
    params.set('cs', CS_VALUE);
    params.set('fm', FM_VALUE);
    params.set('fp', FP_VALUE);
  } else if (isSS) {
    params.set('fm', FM_VALUE);
    params.delete('cs');
    params.delete('fp');
  }

  const newQuery = [...params].map(([k, v]) => k + '=' + v).join('&');
  const newName = NAME_PREFIX + index;
  return base + '?' + newQuery + '#' + newName;
}

function convertText(text) {
  const lines = text.split('\n');
  const results = [];
  let validIndex = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed === '') { results.push(''); continue; }
    if (!trimmed.startsWith('vless://') && !trimmed.startsWith('trojan://') && !trimmed.startsWith('ss://')) {
      results.push(line); continue;
    }
    validIndex++;
    try {
      results.push(convertLine(trimmed, validIndex));
    } catch (e) {
      results.push(line);
    }
  }
  return { lines: results, count: validIndex };
}

// ============ GitHub API ============
async function getFileSha(env) {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.GITHUB_PATH}?ref=${env.GITHUB_BRANCH}`;
  const res = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'User-Agent': 'cf-worker-config-converter',
      'Accept': 'application/vnd.github+json',
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET failed: ${res.status} ${await res.text()}`);
  return (await res.json()).sha;
}

async function pushFile(env, content, sha) {
  const url = `https://api.github.com/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${env.GITHUB_PATH}`;
  const bytes = new TextEncoder().encode(content);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  const base64 = btoa(binary);

  const body = {
    message: `🔄 auto-update configs — ${new Date().toISOString()}`,
    content: base64,
    branch: env.GITHUB_BRANCH,
    committer: {
      name: 'cloudflare-worker-bot',
      email: 'bot@users.noreply.github.com',
    },
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'User-Agent': 'cf-worker-config-converter',
      'Accept': 'application/vnd.github+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`GitHub PUT failed: ${res.status} ${await res.text()}`);
  return await res.json();
}

// ============ منطق اصلی ============
async function runConversion(env) {
  console.log('[1/4] Fetching source...');
  const srcRes = await fetch(env.SOURCE_URL, {
    headers: { 'User-Agent': 'cf-worker-config-converter' },
    cf: { cacheTtl: 0 },
  });
  if (!srcRes.ok) throw new Error(`Source fetch failed: ${srcRes.status}`);
  const raw = await srcRes.text();
  console.log(`[2/4] Source size: ${raw.length} bytes`);

  const { lines, count } = convertText(raw);
  const output = lines.join('\n');
  console.log(`[3/4] Converted: ${count} configs`);

  const sha = await getFileSha(env);
  const result = await pushFile(env, output, sha);
  console.log(`[4/4] Pushed. Commit: ${result.commit?.sha}`);

  return { count, commit: result.commit?.sha };
}

// ============ Entry (فقط scheduled، بدون fetch) ============
export default {
  async scheduled(event, env, ctx) {
    ctx.waitUntil(
      runConversion(env)
        .then(r => console.log(`✅ Done: ${r.count} configs, commit ${r.commit}`))
        .catch(err => console.error('❌ Scheduled failed:', err))
    );
  },
};
