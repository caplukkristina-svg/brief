/* ==========================================================================
   Бриф на диагностику Instagram — логика.
   Вся «настраиваемая» часть вынесена в начало файла:
   SITE (ссылки), LIMITS (лимиты файлов), STAGES (вопросы), SUMMARY (сводка).
   Ниже идёт код, его править при смене вопросов не нужно.
   ========================================================================== */

/* ---------- Ссылки: ЗАМЕНИТЕ на свои (пустая строка = ссылка не задана) ---------- */
const SITE = {
  telegram: "https://t.me/growth_house", // ваш личный Telegram
  photoIntro: "assets/photo-intro.png",   // строгий портрет на первом экране
  photoDone: "assets/photo-final.webp",   // живое фото на финальном экране
  replyDays: 1,                       // через сколько рабочих дней отвечаете
  legal: [                            // документы: открываются окном внутри формы, тексты лежат в legal.js
    { label: "Политика конфиденциальности (Datenschutzerklärung)", inline: "Политикой конфиденциальности (Datenschutzerklärung)", id: "privacy" },
    { label: "Impressum", id: "impressum" }
  ]
};

/* ---------- Лимиты файлов ---------- */
const LIMITS = { files: 10, mb: 18 };

/* ---------- Вопросы ----------
   Поля вопроса:
   id        — уникальный id (для разметки)
   key       — ключ ответа (черновик, Telegram, файл)
   label     — текст вопроса
   hint      — пояснение под вопросом человеческим языком (можно опустить)
   required  — обязательный (true/false)
   star      — показывать плашку «важно»
   type      — long (по умолчанию) | short | email | tel | checks | links | files | consent
   options   — варианты для type: "checks"
   rows      — минимальная высота поля в строках
   noDraft   — не сохранять в черновик (согласия даются заново)
*/
const STAGES = [
  {
    title: "Знакомство",
    lead: "Кто вы и что сейчас не получается. С этого и начнём разбор.",
    questions: [
      { id: "q01", key: "name", type: "short", required: true, autocomplete: "name",
        label: "Как к вам обращаться?" },
      { id: "q02", key: "instagram", type: "short", required: true,
        label: "Ваш Instagram-аккаунт",
        hint: "Ник или ссылка. Пароли и доступы не нужны." },
      { id: "q03", key: "site", type: "short",
        label: "Сайт, если есть" },
      { id: "q04", key: "problem", type: "checks", required: true, star: true,
        label: "Что сейчас не получается? В чём главная проблема?",
        hint: "Можно отметить несколько вариантов.",
        options: ["мало заявок", "пишут, но не покупают", "узнают цену и пропадают", "есть подписчики, но нет клиентов", "не понимаю, что выкладывать", "другое"] },
      { id: "q05", key: "problemText",
        label: "Опишите своими словами, если хочется",
        hint: "Что именно происходит и с какого момента. Пара предложений — уже очень много.", rows: 3 }
    ]
  },
  {
    title: "Бизнес",
    lead: "Коротко о том, что вы продаёте и как сейчас идут дела.",
    questions: [
      { id: "q06", key: "about", required: true,
        label: "Как называется ваш бизнес?", rows: 2 },
      { id: "q07", key: "services", required: true, star: true,
        label: "Какие услуги или товары у вас есть и сколько они стоят?",
        hint: "Можно не переписывать: прикрепите скриншот прайса на этапе «Материалы» и напишите здесь «в скриншоте».", rows: 4 },
      { id: "q08", key: "check",
        label: "Какой у вас средний чек и возвращаются ли клиенты повторно?",
        hint: "Примерно — нормально. Например: «около 60 €, половина приходит снова».", rows: 2 },
      { id: "q09", key: "load",
        label: "Сколько клиентов у вас сейчас и сколько ещё вы хотите?",
        hint: "В неделю или в месяц, как вам удобнее считать.", rows: 2 },
      { id: "q10", key: "diff",
        label: "Чем вы, по-вашему, отличаетесь от других в своей нише?",
        hint: "Не нужно красиво. Что говорят клиенты, почему выбирают именно вас.", rows: 3 }
    ]
  },
  {
    title: "Клиенты и продвижение",
    important: true,
    lead: "Кто к вам приходит и что уже пробовали. Здесь чаще всего прячутся потерянные клиенты.",
    questions: [
      { id: "q11", key: "audience", required: true, star: true,
        label: "Кто ваш клиент: кто приходит сейчас и кого хотелось бы больше?",
        hint: "Возраст, ситуация, чего хочет. Если клиенты разные, опишите самых частых.", rows: 4 },
      { id: "q12", key: "sources",
        label: "Откуда сейчас приходят клиенты?",
        hint: "Instagram, сарафанное радио, Google, сайт, реклама, повторные клиенты. Можно в процентах на глаз.", rows: 3 },
      { id: "q13", key: "tried",
        label: "Что уже пробовали в продвижении и что сработало или нет?",
        hint: "Контент, реклама, специалисты, розыгрыши. Честно, без оценок: «ничего не пробовала» тоже ответ.", rows: 4 }
    ]
  },
  {
    title: "Материалы",
    lead: "Конкуренты, переписки и файлы. Присылайте только то, что есть: пустое место не страшно.",
    questions: [
      { id: "q14", key: "competitors",
        label: "2–3 конкурента: ссылки на их аккаунты или сайты",
        hint: "Если не знаете, кого указать, оставьте пустым: я посмотрю сама.", rows: 3 },
      { id: "q15", key: "chats", type: "checks",
        label: "Переписки с клиентами: как удобнее их показать?",
        hint: "Переписки показывают, где клиенты замолкают. Имена и номера на скриншотах можно закрыть.",
        options: ["прикреплю скриншоты ниже", "покажу на созвоне", "пока не хочу показывать"] },
      { id: "q16", key: "files", type: "files", label: "Файлы",
        hint: "Скриншот прайса, переписки, всё, что поможет понять ваш бизнес." }
    ]
  },
  {
    title: "Цель и созвон",
    lead: "Последний шаг: к чему идём и когда созвонимся. После него бриф уйдёт ко мне.",
    questions: [
      { id: "q17", key: "goal", required: true, star: true,
        label: "Чего хотите добиться в ближайшие 3–6 месяцев?",
        hint: "Например: больше записей, полный график, выше средний чек. Если цифр нет, опишите словами.", rows: 3 },
      { id: "q18", key: "slots", required: true,
        label: "Удобные дни и время для видеосозвона",
        hint: "Например: «будни после 18:00» или «вторник и четверг утром». Созвон длится около часа.", rows: 2 },
      { id: "q19", key: "platform", type: "checks", required: true,
        label: "Где удобнее созвониться?",
        hint: "На созвоне я показываю разбор с экрана, поэтому только Zoom или Teams.",
        options: ["Zoom", "Microsoft Teams", "без разницы"] },
      { id: "q20", key: "phone", type: "tel", required: true, autocomplete: "tel",
        label: "Телефон или WhatsApp для связи",
        hint: "Сюда напишу, чтобы подтвердить время созвона." },
      { id: "q21", key: "extra", label: "Что ещё хотите мне сказать?", rows: 3 },
      { id: "q22", key: "agree", type: "consent", required: true, noDraft: true,
        label: "Даю согласие на обработку персональных данных в соответствии с {privacy}." }
    ]
  }
];

/* Сводка — первое сообщение в Telegram. [ключ ответа, подпись, макс. длина] */
const SUMMARY = [
  ["name", "Имя"], ["phone", "Телефон / WhatsApp"], ["instagram", "Instagram"],
  ["problem", "Главная проблема"], ["about", "Бизнес", 300],
  ["slots", "Удобное время", 200], ["platform", "Площадка"]
];

/* ==========================================================================
   Дальше — код
   ========================================================================== */
(function () {
  "use strict";

  const LS_KEY = "brief1225:diagnostika:v1";
  const N = STAGES.length;
  const MB = 1024 * 1024;
  const TG_LIMIT = 3900; // лимит Telegram — 4096, оставляем запас на разметку
  const cfg = window.BRIEF_CONFIG || {};

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const pad2 = (n) => String(n).padStart(2, "0");
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const escAttr = (s) => esc(s).replace(/"/g, "&quot;");
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Плоский список вопросов с номером этапа
  const ALL_Q = STAGES.flatMap((s, i) => s.questions.map((q) => Object.assign({ stage: i + 1 }, q)));
  const Q_BY_KEY = Object.fromEntries(ALL_Q.map((q) => [q.key, q]));

  // step: 0 — интро, 1..N — этапы, N+1 — финал
  // seen — экраны, на которых клиент уже был в этой сессии (после перезагрузки страницы ответов нет, и в середину формы не пускаем)
  const state = { step: 0, files: [], mode: null, fileFails: 0, busy: false, restored: false, seen: new Set([0]) };

  /* ---------------- Ссылки на документы ---------------- */
  // Документ открывается окном поверх формы: клиент не уходит на основной сайт и не теряет ответы
  let legalOpener = null;
  function openLegal(id, opener) {
    const doc = typeof LEGAL !== "undefined" && LEGAL[id];
    const dlg = $("#legalDlg");
    if (!doc || !dlg) return;
    legalOpener = opener || null;
    $("#legalTitle").textContent = doc.title;
    $("#legalBody").innerHTML = doc.html;
    $("#legalBody").scrollTop = 0;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    document.body.classList.add("is-modal");
  }
  function closeLegal() {
    const dlg = $("#legalDlg");
    if (dlg.close) dlg.close(); else dlg.removeAttribute("open");
  }
  function legalLink(item, extra) {
    const a = document.createElement("a");
    a.textContent = item.label;
    a.href = "#" + item.id; // запасной вариант без скрипта окна
    a.setAttribute("role", "button");
    a.addEventListener("click", (e) => { e.preventDefault(); openLegal(item.id, a); });
    if (extra) a.className = extra;
    return a;
  }
  const privacyItem = SITE.legal.find((l) => l.id === "privacy") || SITE.legal[0];

  /* ---------------- Отрисовка этапов ---------------- */
  function renderQuestion(q) {
    const err = `<p class="q__err" id="e-${q.key}" role="alert" hidden></p>`;
    const chip = q.star ? `<span class="chip"><i aria-hidden="true">★</i> важно</span>` : "";
    const hint = q.hint ? `<p class="q__hint" id="h-${q.key}">${esc(q.hint)}</p>` : "";
    const desc = (q.hint ? `h-${q.key} ` : "") + `e-${q.key}`;
    const rows = q.rows || 3;

    if (q.type === "checks") {
      return `<fieldset class="q" id="q-${q.key}" data-key="${q.key}" aria-describedby="${desc}">
        ${chip}<legend class="q__label">${esc(q.label)}</legend>${hint}
        <div class="opts">${q.options.map((o, i) => `
          <label class="opt"><input type="checkbox" name="${q.key}" value="${escAttr(o)}" id="f-${q.key}-${i}">
          <span class="opt__box" aria-hidden="true"></span><span>${esc(o)}</span></label>`).join("")}
        </div>${err}</fieldset>`;
    }
    if (q.type === "consent") {
      const html = esc(q.label).replace("{privacy}", `<span data-slot="privacy"></span>`);
      return `<div class="q q--consent" id="q-${q.key}" data-key="${q.key}">
        <label class="opt"><input type="checkbox" name="${q.key}" id="f-${q.key}" aria-describedby="e-${q.key}">
        <span class="opt__box" aria-hidden="true"></span><span>${html}</span></label>${err}</div>`;
    }
    if (q.type === "files") {
      return `<div class="q" id="q-${q.key}" data-key="${q.key}">
        <span class="q__label">${esc(q.label)}</span>${hint}
        <label class="drop" id="drop">
          <input type="file" id="f-${q.key}" class="sr" multiple>
          <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true"><path d="M12 16V4M7 9l5-5 5 5M5 20h14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <b>Перетащите файлы сюда</b>
          <span>или нажмите, чтобы выбрать<br>до ${LIMITS.files} файлов, каждый до ${LIMITS.mb} МБ</span>
        </label>
        <p class="q__err q__err--soft" id="e-${q.key}" role="alert" hidden></p>
        <ul class="files" id="fileList" aria-label="Загруженные файлы"></ul></div>`;
    }
    let field;
    const common = `id="f-${q.key}" name="${q.key}" aria-describedby="${desc}"` +
      (q.placeholder ? ` placeholder="${escAttr(q.placeholder)}"` : "") +
      (q.autocomplete ? ` autocomplete="${q.autocomplete}"` : "") +
      (q.required ? " required" : "");
    if (q.type === "short" || q.type === "email" || q.type === "tel") {
      const t = q.type === "short" ? "text" : q.type;
      field = `<input type="${t}" ${common}${q.type === "email" ? ' inputmode="email" autocapitalize="off"' : ""}>`;
    } else {
      field = `<textarea ${common} rows="${rows}" data-grow></textarea>`;
    }
    return `<div class="q" id="q-${q.key}" data-key="${q.key}">
      ${chip}<label class="q__label" for="f-${q.key}">${esc(q.label)}</label>${hint}${field}${err}</div>`;
  }

  function renderStages() {
    $("#stages").innerHTML = STAGES.map((s, i) => `
      <section class="stage" id="stage-${i + 1}" data-step="${i + 1}" hidden aria-labelledby="st-${i + 1}">
        <header class="stage__aside">
          <p class="stage__num" aria-hidden="true">${pad2(i + 1)}</p>
          <h2 id="st-${i + 1}" tabindex="-1">${esc(s.title)}</h2>
          ${s.important ? `<span class="chip"><i aria-hidden="true">★</i> важный этап</span>` : ""}
          <p class="stage__lead">${esc(s.lead)}</p>
        </header>
        <div class="stage__body">${s.questions.map(renderQuestion).join("")}</div>
      </section>`).join("");

    // слот со ссылкой на политику внутри чекбокса согласия
    $$('[data-slot="privacy"]').forEach((slot) => {
      const a = legalLink(privacyItem);
      a.textContent = privacyItem.inline || privacyItem.label;
      slot.replaceWith(a);
    });

    $("#dots").innerHTML = STAGES.map((s, i) =>
      `<button type="button" class="dot" data-go="${i + 1}" aria-label="Этап ${i + 1}: ${escAttr(s.title)}" title="${pad2(i + 1)} · ${escAttr(s.title)}"></button>`).join("");
  }

  /* ---------------- Чтение значений ---------------- */
  const qEl = (q) => document.getElementById("q-" + q.key);
  const fEl = (q) => document.getElementById("f-" + q.key);

  function getValue(q) {
    if (q.type === "checks") return $$("input:checked", qEl(q)).map((i) => i.value);
    if (q.type === "consent") return fEl(q).checked;
    if (q.type === "files") return state.files;
    return fEl(q).value.trim();
  }
  function isFilled(q) {
    const v = getValue(q);
    return Array.isArray(v) ? v.length > 0 : typeof v === "boolean" ? v : v !== "";
  }

  /* ---------------- Автовысота полей (без внутренней прокрутки) ---------------- */
  function grow(el) {
    if (!el || !el.offsetParent) return; // скрытое поле измерить нельзя
    el.style.height = "auto";
    el.style.height = el.scrollHeight + (el.offsetHeight - el.clientHeight) + "px";
  }
  const growAll = (root = document) => $$("textarea[data-grow]", root).forEach(grow);

  /* ---------------- Валидация ---------------- */
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(q, msg) {
    const box = qEl(q), err = $("#e-" + q.key);
    box.classList.toggle("is-error", !!msg);
    err.hidden = !msg;
    err.textContent = msg || "";
    const f = fEl(q);
    if (f && f.setAttribute) msg ? f.setAttribute("aria-invalid", "true") : f.removeAttribute("aria-invalid");
  }

  // Возвращает первый вопрос с ошибкой на этапе или null
  function validateStage(step) {
    let first = null;
    STAGES[step - 1].questions.forEach((raw) => {
      const q = Q_BY_KEY[raw.key];
      let msg = null;
      if (q.required && !isFilled(q)) {
        msg = q.type === "consent" ? "Без согласия отправить бриф нельзя."
          : q.type === "checks" ? "Отметьте хотя бы один вариант."
          : "Ответьте, пожалуйста, пусть даже «не знаю».";
      } else if (q.type === "email" && getValue(q) && !EMAIL_RE.test(getValue(q))) {
        msg = "Проверьте адрес: похоже, в нём опечатка.";
      }
      setError(q, msg);
      if (msg && !first) first = q;
    });
    return first;
  }

  function scrollToQuestion(q) {
    const box = qEl(q);
    box.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
    const target = fEl(q) || $("input", box);
    if (target) setTimeout(() => target.focus({ preventScroll: true }), reduceMotion ? 0 : 350);
  }

  /* ---------------- Навигация между экранами ---------------- */
  const screens = () => [$("#screen-intro"), ...$$(".stage"), $("#screen-done")];

  function go(step, opts = {}) {
    if (step === N + 1 && !state.mode) step = N;
    step = Math.max(0, Math.min(N + 1, step));
    state.step = step;
    state.seen.add(step);

    screens().forEach((el, i) => { el.hidden = i !== step; });
    const cur = screens()[step];
    if (!reduceMotion) { cur.classList.remove("is-enter"); void cur.offsetWidth; cur.classList.add("is-enter"); }

    const inStage = step >= 1 && step <= N;
    $("#bar").hidden = !inStage;
    $("#foot").hidden = step < N; // подвал: только последний этап и финал
    document.body.classList.toggle("has-bar", inStage);
    $("#counter").hidden = !inStage;
    // Номер этапа и его название в липкой шапке: на телефоне шапка этапа уезжает при прокрутке, а так контекст остаётся
    if (inStage) $("#counter").innerHTML = `<span class="counter__n">${pad2(step)} / ${pad2(N)}</span><span class="counter__t">${esc(STAGES[step - 1].title)}</span>`;
    $("#progressFill").style.transform = `scaleX(${step > N ? 1 : step / N})`;

    $$(".dot").forEach((d, i) => {
      d.classList.toggle("is-current", i + 1 === step);
      d.setAttribute("aria-current", i + 1 === step ? "step" : "false");
    });
    updateDots();
    $("#backBtn").setAttribute("aria-label", step === 1 ? "Назад к началу" : "Назад");
    $("#nextLabel").textContent = step === N ? "Отправить ответы" : "Далее";

    if (!opts.noPush) {
      try { history.pushState({ s: step }, "", step === 0 ? location.pathname + location.search : "#" + step); } catch (e) { /* file:// и т.п. */ }
    }
    window.scrollTo({ top: 0, behavior: "auto" });
    requestAnimationFrame(() => {
      growAll(cur);
      const h = $("h2, h1", cur);
      if (h && !opts.noFocus) h.focus({ preventScroll: true });
    });
    if (opts.save !== false) saveDraft();
  }

  function updateDots() {
    $$(".dot").forEach((d, i) => {
      const filled = STAGES[i].questions.some((q) => isFilled(Q_BY_KEY[q.key]) && q.type !== "consent");
      d.classList.toggle("is-filled", filled);
    });
  }

  /* ---------------- Файлы ---------------- */
  const fmtSize = (n) => n >= MB ? (n / MB).toFixed(1).replace(".", ",") + " МБ" : Math.max(1, Math.round(n / 1024)) + " КБ";
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  let fileMsgTimer;

  function fileNotice(msgs) {
    const el = $("#e-files");
    clearTimeout(fileMsgTimer);
    el.hidden = !msgs.length;
    el.innerHTML = msgs.map(esc).join("<br>");
    if (msgs.length) fileMsgTimer = setTimeout(() => { el.hidden = true; }, 8000);
  }

  function addFiles(list) {
    const msgs = [];
    Array.from(list).forEach((f) => {
      if (state.files.length >= LIMITS.files) {
        const m = `Можно загрузить не больше ${LIMITS.files} файлов.`;
        if (!msgs.includes(m)) msgs.push(m);
        return;
      }
      if (f.size > LIMITS.mb * MB) { msgs.push(`«${f.name}» весит ${fmtSize(f.size)}, а лимит — ${LIMITS.mb} МБ. Пришлите его мне в Telegram или ссылкой.`); return; }
      if (state.files.some((x) => x.file.name === f.name && x.file.size === f.size)) return;
      state.files.push({ id: uid(), file: f });
    });
    fileNotice(msgs);
    renderFiles();
    saveDraft();
  }

  function renderFiles() {
    $("#fileList").innerHTML = state.files.map((x) => `
      <li><span class="files__name">${esc(x.file.name)}</span><span class="files__size">${fmtSize(x.file.size)}</span>
      <button type="button" class="files__del" data-del="${x.id}" aria-label="Удалить файл ${escAttr(x.file.name)}">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button></li>`).join("");
    updateDots();
  }

  /* Файлы храним в IndexedDB: в localStorage они не помещаются */
  const idb = {
    open() {
      return new Promise((res, rej) => {
        const r = indexedDB.open("brief1225", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("files", { keyPath: "id" });
        r.onsuccess = () => res(r.result);
        r.onerror = () => rej(r.error);
      });
    },
    async saveAll(items) {
      const db = await this.open();
      await new Promise((res, rej) => {
        const tx = db.transaction("files", "readwrite"), st = tx.objectStore("files");
        st.clear();
        items.forEach((x) => st.put({ id: x.id, name: x.file.name, type: x.file.type, blob: x.file }));
        tx.oncomplete = res; tx.onerror = () => rej(tx.error);
      });
      db.close();
    },
    async loadAll() {
      const db = await this.open();
      const rows = await new Promise((res, rej) => {
        const r = db.transaction("files").objectStore("files").getAll();
        r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error);
      });
      db.close();
      return rows.map((r) => ({ id: r.id, file: new File([r.blob], r.name, { type: r.type }) }));
    }
  };

  /* ---------------- Черновик ---------------- */
  let saveTimer, saveLabelTimer;
  function setSaveState(kind) {
    const el = $("#saveState");
    clearTimeout(saveLabelTimer);
    el.dataset.kind = kind;
    el.textContent = kind === "saved" ? "Черновик сохранён" : kind === "error" ? "Не удалось сохранить" : kind === "saving" ? "Сохраняю…" : "";
    if (kind === "saved") saveLabelTimer = setTimeout(() => { el.textContent = ""; el.dataset.kind = ""; }, 3000);
  }

  function collectAnswers() {
    const a = {};
    ALL_Q.forEach((q) => {
      if (q.noDraft || q.type === "files") return;
      const v = getValue(q);
      if (Array.isArray(v) ? v.length : v) a[q.key] = v;
    });
    return a;
  }

  // Черновик отключён: ответы и файлы клиента не сохраняются в браузере
  // (форма всегда открывается пустой, личные данные не остаются на чужом устройстве).
  function saveDraft() { setSaveState(""); }
  const scheduleSave = () => { clearTimeout(saveTimer); setSaveState("saving"); saveTimer = setTimeout(saveDraft, 500); };

  function clearDraft() {
    try { localStorage.removeItem(LS_KEY); } catch (e) { /* ничего */ }
    idb.saveAll([]).catch(() => {});
  }

  // Возвращает сохранённый шаг или null, если черновика нет
  // Ничего не возвращаем. Заодно стираем черновики, которые остались от прежних версий формы.
  async function restoreDraft() {
    clearDraft();
    return null;
  }

  /* ---------------- Уведомления ---------------- */
  let toastTimer;
  function toast(text, action, ms = 6000) {
    const t = $("#toast"), b = $("#toastAction");
    $("#toastText").textContent = text;
    b.hidden = !action;
    if (action) { b.textContent = action.label; b.onclick = () => { hideToast(); action.fn(); }; }
    t.hidden = false;
    requestAnimationFrame(() => t.classList.add("is-on"));
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, ms);
  }
  function hideToast() {
    const t = $("#toast");
    t.classList.remove("is-on");
    setTimeout(() => { if (!t.classList.contains("is-on")) t.hidden = true; }, 350);
  }

  /* ---------------- Сбор ответов для отправки ---------------- */
  // Возвращает [{num, title, blocks: [{label, text}]}] — только заполненные вопросы
  function collectBlocks() {
    return STAGES.map((s, i) => {
      const blocks = [];
      s.questions.forEach((raw) => {
        const q = Q_BY_KEY[raw.key];
        if (q.type === "consent") return;
        const v = getValue(q);
        if (q.type === "files") return; // файлы уходят отдельными документами, в текст не пишем
        const text = Array.isArray(v) ? v.join(", ") : v;
        if (text) blocks.push({ label: q.label, text });
      });
      return { num: pad2(i + 1), title: s.title, blocks };
    }).filter((s) => s.blocks.length);
  }

  const answerText = (key) => { const v = getValue(Q_BY_KEY[key]); return Array.isArray(v) ? v.join(", ") : v; };
  const clip = (t, n) => (n && t.length > n ? t.slice(0, n).replace(/\s+\S*$/, "") + "…" : t);

  /* Режем текст по границам: абзац → строка → предложение → слово */
  function splitText(text, max) {
    const out = [];
    let rest = text.trim();
    while (rest.length > max) {
      let cut = -1;
      for (const sep of ["\n\n", "\n", ". ", "! ", "? ", "; ", ", ", " "]) {
        const i = rest.lastIndexOf(sep, max - sep.length);
        if (i > max * 0.35) { cut = i + sep.length; break; }
      }
      if (cut < 0) { // нет пробелов — режем жёстко, но не посреди &amp;
        cut = max;
        const amp = rest.lastIndexOf("&", cut);
        if (amp > cut - 8 && rest.indexOf(";", amp) >= cut) cut = amp;
      }
      out.push(rest.slice(0, cut).trim());
      rest = rest.slice(cut).trim();
    }
    if (rest) out.push(rest);
    return out;
  }

  /* Сообщения для Telegram (HTML): сводка + по сообщению на этап */
  function buildMessages(blocks) {
    const messages = [];
    const sum = ["<b>🔎 Новый бриф на ДИАГНОСТИКУ</b>"];
    SUMMARY.forEach(([key, label, max]) => {
      const t = clip(answerText(key).replace(/\s+/g, " "), max);
      if (t) sum.push(`<b>${esc(label)}:</b> ${esc(t)}`);
    });
    if (Q_BY_KEY.news && getValue(Q_BY_KEY.news)) sum.push("<b>Рассылка:</b> согласие дано");
    sum.push("<i>Согласие на обработку данных: да</i>");
    messages.push(sum.join("\n"));

    blocks.forEach((st) => {
      const head = `<b>${st.num} · ${esc(st.title)}</b>`;
      let cur = head;
      st.blocks.forEach((b) => {
        const label = esc(b.label);
        const room = TG_LIMIT - label.length - 60;
        splitText(esc(b.text), Math.max(500, room)).forEach((piece, i) => {
          const chunk = `<b>${label}${i ? " (продолжение)" : ""}</b>\n${piece}`;
          if (cur.length + 2 + chunk.length > TG_LIMIT) {
            messages.push(cur);
            cur = `<b>${st.num} · ${esc(st.title)} (продолжение)</b>`;
          }
          cur += "\n\n" + chunk;
        });
      });
      messages.push(cur);
    });
    return messages;
  }

  /* Текстовая копия ответов для скачивания */
  function buildPlainText(blocks) {
    const d = new Date();
    const lines = ["БРИФ НА ДИАГНОСТИКУ INSTAGRAM", "1225 Digital Design",
      `Заполнен: ${d.toLocaleDateString("ru-RU")}, ${d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`];
    const sumLines = [];
    SUMMARY.slice(0, 4).forEach(([k, label]) => { const t = answerText(k); if (t) sumLines.push(`${label}: ${t}`); });
    if (sumLines.length) lines.push("", ...sumLines);
    lines.push("Согласие на обработку персональных данных: да");
    if (Q_BY_KEY.news && getValue(Q_BY_KEY.news)) lines.push("Согласие на рассылку: да");
    blocks.forEach((st) => {
      lines.push("", "", `${st.num} · ${st.title.toUpperCase()}`, "—".repeat(28));
      st.blocks.forEach((b) => lines.push("", b.label, b.text));
    });
    return lines.join("\n") + "\n";
  }

  function answersFileName() {
    const name = answerText("name").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "client";
    return `diagnostika-${name}-${new Date().toISOString().slice(0, 10)}.txt`;
  }

  function downloadAnswers() {
    const text = buildPlainText(collectBlocks());
    const file = answersFileName();
    try {
      const url = URL.createObjectURL(new Blob(["﻿" + text], { type: "text/plain;charset=utf-8" }));
      const a = Object.assign(document.createElement("a"), { href: url, download: file });
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
    } catch (e) { /* остаётся текст для копирования на финальном экране */ }
    return text;
  }

  /* ---------------- Отправка ---------------- */
  async function post(body, headers, ms) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ms);
    try {
      const r = await fetch(cfg.endpoint, { method: "POST", body, headers, signal: ctl.signal });
      if (!r.ok) throw new Error("HTTP " + r.status);
      const j = await r.json().catch(() => ({ ok: true }));
      if (j.ok === false) throw new Error(j.error || "worker error");
      return j;
    } finally { clearTimeout(timer); }
  }

  // Полный текст ответов уходит в Telegram одним документом .txt (BOM нужен, чтобы кириллица открывалась без кракозябр)
  async function sendAnswersFile(blocks) {
    const fd = new FormData();
    fd.append("file", new Blob(["﻿" + buildPlainText(blocks)], { type: "text/plain;charset=utf-8" }), answersFileName());
    fd.append("from", answerText("name"));
    await post(fd, undefined, 60000);
  }

  async function sendFiles(from) {
    let fails = 0;
    for (const x of state.files) {
      try {
        const fd = new FormData();
        fd.append("file", x.file, x.file.name);
        fd.append("from", from);
        await post(fd, undefined, 120000);
      } catch (e) { fails++; }
    }
    return fails;
  }

  function setBusy(on) {
    state.busy = on;
    const b = $("#nextBtn");
    b.disabled = on;
    b.classList.toggle("is-busy", on);
    if (on) $("#nextLabel").textContent = "Отправляю…";
    else $("#nextLabel").textContent = state.step === N ? "Отправить ответы" : "Далее";
  }

  async function submit() {
    if (state.busy) return;
    // 1. Проверяем все этапы, идём на первый с ошибкой
    let bad = null;
    for (let s = 1; s <= N; s++) {
      const q = validateStage(s);
      if (q && !bad) bad = q;
    }
    if (bad) {
      if (bad.stage !== state.step) go(bad.stage, { noFocus: true, save: false });
      requestAnimationFrame(() => scrollToQuestion(bad));
      toast(`Не хватает ответов на этапе ${pad2(bad.stage)}. Я подсветила нужное поле.`);
      return;
    }
    if ($("#hp").value) { state.mode = "sent"; go(N + 1); return; } // бот: делаем вид, что всё ушло

    setBusy(true);
    const blocks = collectBlocks();
    state.fileFails = 0;
    let mode;
    if (!cfg.endpoint) {
      mode = "local";
    } else {
      try {
        const from = answerText("name"), json = { "Content-Type": "text/plain;charset=utf-8" };
        const msgs = buildMessages(blocks); // [0] — короткая сводка, дальше полный текст по этапам
        // 1. Короткое сообщение: кто это и как связаться (видно в уведомлении)
        await post(JSON.stringify({ messages: [msgs[0] + "\n\n<i>Полные ответы в файле ниже.</i>"], from }), json, 25000);
        // 2. Все ответы одним файлом .txt. Если файл не ушёл, шлём те же ответы сообщениями
        try { await sendAnswersFile(blocks); }
        catch (e) { await post(JSON.stringify({ messages: msgs.slice(1), from }), json, 25000); }
        mode = "sent";
        // 3. Файлы клиента (логотип, прайс, фото) уходят отдельными документами
        state.fileFails = await sendFiles(from);
      } catch (e) { mode = "failed"; }
    }
    // Если не ушло в Telegram — сразу отдаём файл, чтобы ответы не потерялись
    let plain = null;
    if (mode !== "sent") plain = downloadAnswers();
    state.mode = mode;
    if (mode === "sent") clearDraft(); else saveDraft();
    setBusy(false);
    showDone(plain);
  }

  /* ---------------- Финальный экран ---------------- */
  function showDone(plain) {
    const mode = state.mode;
    const sent = mode === "sent";
    $("#doneEyebrow").textContent = sent ? "Бриф получен" : "Бриф готов";
    $("#doneTitle").textContent = sent ? "Спасибо!" : "Почти готово!";
    $("#doneLead").textContent = sent
      ? "Я получила ваш бриф и скоро с вами свяжусь."
      : "Ответы собраны и сохранены в файл. Пришлите его мне в Telegram, и я начну.";
    const notice = $("#doneNotice");
    notice.hidden = sent && !state.fileFails;
    notice.textContent = mode === "failed"
      ? "Отправить автоматически не получилось, но ответы никуда не пропали: файл уже скачан, а на этой странице они остались: можно вернуться и отправить ещё раз."
      : mode === "local" ? "Автоматическая отправка пока не подключена, поэтому файл с ответами скачался на ваше устройство."
      : state.fileFails ? `Ответы дошли, но ${state.fileFails} файл(ов) не загрузились. Пришлите их мне в Telegram.` : "";
    $("#doneNextTitle").textContent = sent ? "Что будет дальше" : "Как отправить ответы";
    const d = SITE.replyDays;
    const steps = sent
      ? ["Я внимательно прочитаю ответы и изучу ваш профиль, сайт и конкурентов.",
         `В течение ${d} ${plural(d, "рабочего дня", "рабочих дней", "рабочих дней")} напишу вам в WhatsApp и подтвержу время созвона.`,
         "Через 3–5 дней проведём видеосозвон: покажу разбор и что делать дальше, а PDF с планом останется у вас."]
      : ["Откройте скачанный файл (он называется diagnostika-…txt) или скопируйте текст ниже.",
         "Отправьте его мне в Telegram вместе с файлами и ссылками, если они были.",
         `Я отвечу в течение ${d} ${plural(d, "рабочего дня", "рабочих дней", "рабочих дней")}.`];
    $("#doneSteps").innerHTML = steps.map((t) => `<li>${esc(t)}</li>`).join("");
    $("#rescue").hidden = sent;
    if (plain) $("#rescueText").value = plain;
    go(N + 1);
  }

  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    return m10 === 1 && m100 !== 11 ? one : m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14) ? few : many;
  }

  /* ---------------- События ---------------- */
  function bind() {
    $("#startBtn").addEventListener("click", () => go(Math.max(1, state.restored ? state.resume || 1 : 1)));
    $("#logoLink").addEventListener("click", (e) => { e.preventDefault(); go(0); });

    $("#nextBtn").addEventListener("click", () => {
      if (state.step === N) return submit();
      const bad = validateStage(state.step);
      if (bad) { scrollToQuestion(bad); return; }
      go(state.step + 1);
    });
    $("#backBtn").addEventListener("click", () => go(state.step - 1));
    $("#dots").addEventListener("click", (e) => {
      const b = e.target.closest("[data-go]");
      if (b) go(+b.dataset.go);
    });
    $("#editBtn").addEventListener("click", () => { state.mode = null; go(N); });

    // Окно с документом: закрытие кнопками, клавишей Esc и кликом по затемнению
    const legalDlg = $("#legalDlg");
    $("#legalClose").addEventListener("click", closeLegal);
    $("#legalOk").addEventListener("click", closeLegal);
    legalDlg.addEventListener("click", (e) => { if (e.target === legalDlg) closeLegal(); });
    legalDlg.addEventListener("close", () => {
      document.body.classList.remove("is-modal");
      if (legalOpener && document.contains(legalOpener)) legalOpener.focus();
      legalOpener = null;
    });
    $("#form").addEventListener("submit", (e) => e.preventDefault());

    // Ввод: автовысота, снятие ошибки, автосохранение
    $("#form").addEventListener("input", (e) => {
      const t = e.target;
      if (t.matches("textarea[data-grow]")) grow(t);
      const box = t.closest(".q");
      if (box && box.classList.contains("is-error")) setError(Q_BY_KEY[box.dataset.key], null);
      updateDots();
      scheduleSave();
    });
    $("#form").addEventListener("change", (e) => {
      if (e.target.type === "checkbox") {
        const box = e.target.closest(".q");
        if (box && box.classList.contains("is-error")) setError(Q_BY_KEY[box.dataset.key], null);
        updateDots(); scheduleSave();
      }
    });

    // Файлы: клик, drag-and-drop, удаление
    $("#f-files").addEventListener("change", (e) => { addFiles(e.target.files); e.target.value = ""; });
    const drop = $("#drop");
    ["dragenter", "dragover"].forEach((n) => drop.addEventListener(n, (e) => { e.preventDefault(); drop.classList.add("is-over"); }));
    ["dragleave", "drop"].forEach((n) => drop.addEventListener(n, (e) => { e.preventDefault(); drop.classList.remove("is-over"); }));
    drop.addEventListener("drop", (e) => addFiles(e.dataTransfer.files));
    // Файл, брошенный мимо зоны, не должен открыться в браузере и унести страницу
    ["dragover", "drop"].forEach((n) => window.addEventListener(n, (e) => { if (!e.target.closest || !e.target.closest("#drop")) e.preventDefault(); }));
    $("#fileList").addEventListener("click", (e) => {
      const b = e.target.closest("[data-del]");
      if (!b) return;
      state.files = state.files.filter((x) => x.id !== b.dataset.del);
      renderFiles(); saveDraft();
    });

    // Финал
    $("#dlBtn").addEventListener("click", () => { const t = downloadAnswers(); $("#rescueText").value = t; });
    $("#copyBtn").addEventListener("click", async () => {
      const text = buildPlainText(collectBlocks());
      $("#rescueText").value = text;
      try { await navigator.clipboard.writeText(text); toast("Ответы скопированы. Вставьте их в сообщение мне в Telegram."); }
      catch (e) { $("#rescue details").open = true; $("#rescueText").select(); toast("Выделила текст, скопируйте его вручную."); }
    });

    // Кнопки браузера «назад/вперёд»
    window.addEventListener("popstate", (e) => {
      const s = (e.state && e.state.s) || 0;
      go(state.seen.has(s) ? s : 0, { noPush: true, save: false });
    });
    window.addEventListener("resize", () => growAll());
    window.addEventListener("beforeunload", () => { if (state.mode !== "sent") saveDraft(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => growAll());
  }

  /* ---------------- Старт ---------------- */
  async function init() {
    renderStages();

    // ссылки подвала и кнопки связи
    $("#footLinks").innerHTML = "";
    SITE.legal.forEach((l) => { const li = document.createElement("li"); li.appendChild(legalLink(l)); $("#footLinks").appendChild(li); });
    $("#tgBtn").href = SITE.telegram || "#";
    $("#year").textContent = new Date().getFullYear();

    // фото: строгое на интро, живое на финале; если файла нет, интро-блок прячется, финал показывает знак
    const introImg = $("#introPhotoImg");
    introImg.addEventListener("error", () => { $("#introFigure").hidden = true; });
    introImg.src = SITE.photoIntro;
    const doneImg = $("#donePhotoImg");
    doneImg.addEventListener("error", () => $("#donePhoto").classList.add("is-empty"));
    doneImg.src = SITE.photoDone;

    bind();

    const resume = await restoreDraft();
    let first = 0;
    if (resume !== null) {
      state.restored = true;
      state.resume = resume || 1;
      $("#startLabel").textContent = "Продолжить";
      first = resume;
      renderFiles();
      toast("Черновик восстановлен", {
        label: "Начать заново",
        fn: () => { if (confirm("Стереть все ответы и начать заново?")) { clearDraft(); location.href = location.pathname; } }
      }, 9000);
    }
    // Адрес вида #2 из старой сессии игнорируем: ответов уже нет, форма всегда начинается с интро
    try { history.replaceState({ s: first }, "", first === 0 ? location.pathname + location.search : "#" + first); } catch (e) { /* ничего */ }
    go(first, { noPush: true, noFocus: true, save: false });
    growAll();
  }

  init();
})();
