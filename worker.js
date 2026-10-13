/**
 * Cloudflare Worker: принимает бриф с сайта и пересылает его в Telegram.
 * Сайту этот файл не нужен — его кладут в Cloudflare (см. README.md).
 *
 * Переменные окружения Worker'а (Settings → Variables and Secrets):
 *   BOT_TOKEN       — токен бота от @BotFather            (Secret)
 *   CHAT_ID         — id чата, куда слать ответы           (Secret или Text)
 *   ALLOWED_ORIGIN  — адрес сайта, например https://имя.github.io  (Text, рекомендуется)
 *   THREAD_ID       — id темы в группе с темами            (необязательно)
 *
 * Запросы с сайта:
 *   1) JSON (text/plain): { messages: ["<b>html</b>", ...], from: "Имя" }
 *      → каждое сообщение уходит отдельно, по порядку
 *   2) multipart/form-data: file=<файл>, from=Имя
 *      → файл уходит документом
 */

const TG_MAX = 4096;          // лимит Telegram на одно сообщение
const MAX_MESSAGES = 40;      // защита от мусора
const MAX_FILE = 18 * 1024 * 1024;

export default {
  async fetch(request, env) {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return json({ ok: false, error: "method" }, 405, cors);

    // Если задан ALLOWED_ORIGIN — принимаем запросы только с вашего сайта
    const origin = request.headers.get("Origin");
    if (env.ALLOWED_ORIGIN && origin !== env.ALLOWED_ORIGIN) return json({ ok: false, error: "origin" }, 403, cors);
    if (!env.BOT_TOKEN || !env.CHAT_ID) return json({ ok: false, error: "not configured" }, 500, cors);

    try {
      const type = request.headers.get("Content-Type") || "";
      if (type.includes("multipart/form-data")) return await handleFile(request, env, cors);
      return await handleMessages(request, env, cors);
    } catch (e) {
      return json({ ok: false, error: String(e && e.message || e) }, 502, cors);
    }
  }
};

async function handleMessages(request, env, cors) {
  const body = await request.json();
  const messages = Array.isArray(body.messages) ? body.messages : [];
  if (!messages.length || messages.length > MAX_MESSAGES) return json({ ok: false, error: "bad payload" }, 400, cors);

  let sent = 0;
  for (const raw of messages) {
    // Страховка: если пришло что-то длиннее лимита — режем по абзацам
    for (const part of split(String(raw), TG_MAX - 100)) {
      await tg(env, "sendMessage", {
        chat_id: env.CHAT_ID,
        text: part,
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...(env.THREAD_ID ? { message_thread_id: Number(env.THREAD_ID) } : {})
      });
      sent++;
    }
  }
  return json({ ok: true, sent }, 200, cors);
}

async function handleFile(request, env, cors) {
  const form = await request.formData();
  const file = form.get("file");
  if (!file || typeof file === "string") return json({ ok: false, error: "no file" }, 400, cors);
  if (file.size > MAX_FILE) return json({ ok: false, error: "file too big" }, 413, cors);

  const fd = new FormData();
  fd.append("chat_id", env.CHAT_ID);
  if (env.THREAD_ID) fd.append("message_thread_id", env.THREAD_ID);
  fd.append("document", file, file.name);
  const from = String(form.get("from") || "").slice(0, 80);
  fd.append("caption", from ? `Файл к брифу: ${from}` : "Файл к брифу");
  await tg(env, "sendDocument", fd);
  return json({ ok: true }, 200, cors);
}

/** Вызов Bot API; при 429 один раз ждём и повторяем */
async function tg(env, method, payload, retried = false) {
  const isForm = payload instanceof FormData;
  const res = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/${method}`, {
    method: "POST",
    headers: isForm ? undefined : { "Content-Type": "application/json" },
    body: isForm ? payload : JSON.stringify(payload)
  });
  const data = await res.json().catch(() => ({}));
  if (res.ok && data.ok) return data;
  if (res.status === 429 && !retried) {
    await new Promise((r) => setTimeout(r, ((data.parameters && data.parameters.retry_after) || 2) * 1000));
    return tg(env, method, isForm ? payload : payload, true);
  }
  throw new Error(`Telegram ${res.status}: ${data.description || "error"}`);
}

/** Режем длинный текст по абзацам, затем по строкам и словам */
function split(text, max) {
  const out = [];
  let rest = text.trim();
  while (rest.length > max) {
    let cut = -1;
    for (const sep of ["\n\n", "\n", ". ", " "]) {
      const i = rest.lastIndexOf(sep, max - sep.length);
      if (i > max * 0.35) { cut = i + sep.length; break; }
    }
    if (cut < 0) cut = max;
    out.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) out.push(rest);
  return out;
}

function corsHeaders(request, env) {
  return {
    "Access-Control-Allow-Origin": env.ALLOWED_ORIGIN || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin"
  };
}

function json(obj, status, headers) {
  return new Response(JSON.stringify(obj), { status, headers: { ...headers, "Content-Type": "application/json" } });
}
