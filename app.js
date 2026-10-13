/* ==========================================================================
   Бриф на ведение соцсетей — логика.
   Вся «настраиваемая» часть вынесена в начало файла:
   SITE (ссылки), LIMITS (лимиты файлов), STAGES (вопросы), SUMMARY (сводка).
   Ниже идёт код, его править при смене вопросов не нужно.
   ========================================================================== */

/* ---------- Ссылки: ЗАМЕНИТЕ на свои (пустая строка = ссылка не задана) ---------- */
const SITE = {
  telegram: "https://t.me/growth_house", // ваш личный Telegram
  photoIntro: "assets/photo-intro.png",   // строгий портрет на первом экране
  photoDone: "assets/photo-final.webp",   // живое фото на финальном экране
  replyDays: 2,                       // TODO: через сколько рабочих дней отвечаете
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
    title: "Задача",
    lead: "С чего начнём: чего вы хотите добиться. Не «подписчиков», а то, что изменится в деньгах и работе.",
    questions: [
      { id: "q01", key: "goal", required: true, star: true,
        label: "Что должно измениться в бизнесе за 3–6 месяцев?",
        hint: "Например: больше записей, выше средний чек, меньше пустых окон в календаре. Если цифр нет, опишите словами.", rows: 4 },
      { id: "q02", key: "action", required: true, star: true,
        label: "Какое действие должны совершать люди из соцсетей: писать, записываться, звонить, покупать, приходить?",
        hint: "Выберите одно главное. Остальное добавим потом, когда главное заработает.", rows: 3 },
      { id: "q03", key: "why",
        label: "Почему вы решили заняться этим именно сейчас?",
        hint: "Любой повод подходит: спад, новый продукт, надоело делать самой или самому.", rows: 3 },
      { id: "q04", key: "metrics",
        label: "Как вы поймёте, что получилось? Какие цифры у вас есть сегодня (обращения, записи, продажи в месяц)?",
        hint: "Приблизительно — нормально. «Не считаю» тоже ответ.", rows: 3 }
    ]
  },
  {
    title: "Бизнес и продукт",
    lead: "Коротко о том, чем вы занимаетесь и что продаёте.",
    questions: [
      { id: "q05", key: "about", label: "Чем вы занимаетесь, в двух-трёх предложениях?", rows: 3 },
      { id: "q06", key: "sells", label: "Что именно продаёте и что покупают чаще всего?", rows: 3 },
      { id: "q07", key: "sellMore", label: "Что хотели бы продавать больше?", rows: 3 },
      { id: "q08", key: "scope", label: "Что в вашем продукте входит, а что нет? Есть ли ограничения?",
        hint: "Например: что включено в цену, чего вы не делаете, на что не берётесь.", rows: 3 },
      { id: "q09", key: "place", label: "Где вы работаете: город, радиус, онлайн?", rows: 2 },
      { id: "q10", key: "language", required: true, star: true,
        label: "На каком языке общаются ваши клиенты: русский, немецкий, смешанно?",
        hint: "От этого зависит язык контента и рекламы. Если по-разному, напишите в каких пропорциях.", rows: 2 }
    ]
  },
  {
    title: "Клиент",
    lead: "Кто эти люди и почему выбирают вас или уходят к другим.",
    questions: [
      { id: "q11", key: "audience", label: "Кто обычно у вас покупает?", rows: 3 },
      { id: "q12", key: "trigger", label: "В какой ситуации человек начинает искать такую услугу или товар?",
        hint: "Что именно случается в его жизни прямо перед тем, как он вас находит.", rows: 3 },
      { id: "q13", key: "criteria", label: "Что для него важно при выборе?", rows: 3 },
      { id: "q14", key: "refusals", label: "Из-за чего чаще всего отказываются?", rows: 3 },
      { id: "q15", key: "antiClient", label: "Кого вы не хотели бы видеть клиентом?", rows: 3 }
    ]
  },
  {
    title: "Путь клиента",
    important: true,
    lead: "От первого сообщения до покупки. Здесь чаще всего и прячутся потерянные деньги.",
    questions: [
      { id: "q16", key: "sources", label: "Откуда клиенты приходят сейчас?", rows: 3 },
      { id: "q17", key: "firstReply", label: "Кто первым отвечает человеку и как быстро?", rows: 3 },
      { id: "q18", key: "afterMsg", label: "Что происходит сразу после сообщения или заявки?", rows: 3 },
      { id: "q19", key: "lost", type: "checks", required: true, star: true,
        label: "Где, по вашим ощущениям, чаще всего теряются люди?",
        hint: "Можно отметить несколько вариантов. Если не уверены, выберите «не знаю», это тоже ответ.",
        options: ["молчат после первого ответа", "узнают цену и уходят", "записываются, но не приходят", "обращаются «не те» люди", "не знаю"] },
      { id: "q20", key: "funnel", label: "Сколько обращений в месяц и сколько из них доходит до покупки?",
        hint: "Если не считаете, так и напишите.", rows: 3 }
    ]
  },
  {
    title: "Соцсети сейчас",
    lead: "Что уже было и что из этого сработало. Честно, без оценок.",
    questions: [
      { id: "q21", key: "tried", label: "Что уже пробовали (контент, реклама, подрядчики) и что сработало или нет?", rows: 4 },
      { id: "q22", key: "specialist", label: "Если работали со специалистом: что вам обещали и что получилось?", rows: 3 },
      { id: "q23", key: "ads", label: "Запускали ли рекламу? Какой был бюджет и результат?", rows: 3 },
      { id: "q24", key: "numbers", label: "Какие цифры известны (охваты, подписчики, обращения из соцсетей)?",
        hint: "Можно скриншотом позже, на этапе «Материалы». Здесь достаточно примерно.", rows: 3 }
    ]
  },
  {
    title: "Доказательства и ограничения",
    lead: "Чем можно подтвердить качество и что показывать нельзя. От этого зависит, какой контент мы вообще можем делать.",
    questions: [
      { id: "q25", key: "proof", required: true, star: true,
        label: "Чем можно доказать качество? Что реально есть: отзывы, кейсы, фото «до и после», цифры, сертификаты.",
        hint: "Перечислите, что есть на самом деле. Если пока почти ничего, так и напишите, придумаем, как это собрать.", rows: 4 },
      { id: "q26", key: "limits", required: true, star: true,
        label: "Чего нет или что нельзя показывать? (Договорённости с клиентами, правила отрасли.)",
        hint: "Например: нельзя показывать лица клиентов, нельзя обещать результат, нет фото рабочего места.", rows: 4 },
      { id: "q27", key: "face", label: "Кто готов быть в кадре?", rows: 2 },
      { id: "q28", key: "time", label: "Сколько времени в неделю вы готовы уделять съёмкам и согласованию?", rows: 2 }
    ]
  },
  {
    title: "Материалы и доступы",
    lead: "Всё, что у вас уже есть. Присылать нужно только то, что есть: пустое место не страшно.",
    questions: [
      { id: "q29", key: "materials", label: "Сайт, прайс, презентации, фото, видео, логотип и фирменный стиль, если есть.", rows: 3 },
      { id: "q30", key: "likes", label: "Аккаунты, которые вам нравятся, и те, которые не нравятся.",
        hint: "Можно ссылками. Главное — коротко приписать, что именно нравится или раздражает.", rows: 3 },
      { id: "q31", key: "competitors", label: "Ваши главные конкуренты.", rows: 3 },
      { id: "q32", key: "access", label: "Есть ли доступ к рекламному кабинету Meta и к данным о записях и обращениях?",
        hint: "Всё сразу не нужно, достаточно «есть» или «нет».", rows: 2 },
      { id: "q33", key: "links", type: "links", label: "Ссылки",
        hint: "Каждая ссылка с новой строки.", rows: 3 },
      { id: "q34", key: "files", type: "files", label: "Файлы",
        hint: "Логотип, прайс, фото, презентации: всё, что поможет понять ваш бизнес." }
    ]
  },
  {
    title: "Рамки сотрудничества",
    lead: "Договоримся о границах заранее, чтобы потом не было неприятных сюрпризов.",
    questions: [
      { id: "q35", key: "package", label: "Подтвердите, что входит в выбранный вариант сотрудничества, и есть ли что-то, что вы ожидали, но не услышали на консультации.", rows: 4 },
      { id: "q36", key: "adBudget", label: "Ориентир по бюджету на рекламу отдельно, если она планируется.",
        hint: "Бюджет на рекламу — это деньги, которые уходят платформе, не мне. Примерная сумма в месяц подойдёт.", rows: 2 },
      { id: "q37", key: "start", label: "Когда хотите начать?", rows: 2 },
      { id: "q38", key: "approver", label: "Кто согласует материалы с вашей стороны и как быстро?", rows: 2 },
      { id: "q39", key: "worries", label: "Что вас беспокоит в работе с подрядчиком?", rows: 3 }
    ]
  },
  {
    title: "Связь",
    lead: "Последний шаг: как с вами связаться. После него бриф уйдёт ко мне.",
    questions: [
      { id: "q40", key: "name", type: "short", required: true, autocomplete: "name",
        label: "Как к вам обращаться?" },
      { id: "q41", key: "phone", type: "tel", autocomplete: "tel",
        label: "Телефон" },
      { id: "q42", key: "instagram", type: "short",
        label: "Instagram-аккаунт: подтвердите, что это тот, с которым мы работаем, или укажите другой.",
        hint: "Доступы обсудим отдельно, не через форму. Пароли сюда писать не нужно.", },
      { id: "q43", key: "email", type: "email", required: true, autocomplete: "email",
        label: "Email" },
      { id: "q44", key: "extra", label: "Что-то ещё, о чём я не спросила?", rows: 3 },
      { id: "q45", key: "agree", type: "consent", required: true, noDraft: true,
        label: "Даю согласие на обработку персональных данных в соответствии с {privacy}." },
      { id: "q46", key: "news", type: "consent", noDraft: true,
        label: "Хочу получать рассылки от 1225 Digital Design на указанный email." }
    ]
  }
];

/* Сводка — первое сообщение в Telegram. [ключ ответа, подпись, макс. длина] */
const SUMMARY = [
  ["name", "Имя"], ["phone", "Телефон"], ["email", "Email"], ["instagram", "Instagram"],
  ["goal", "Задача", 450], ["action", "Целевое действие", 300], ["language", "Язык клиентов", 200],
  ["lost", "Где теряются люди"], ["start", "Старт", 200], ["adBudget", "Бюджет на рекламу", 200]
];

/* ==========================================================================
   Дальше — код
   ========================================================================== */
(function () {
  "use strict";

  const LS_KEY = "brief1225:draft:v1";
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
  const state = { step: 0, files: [], mode: null, fileFails: 0, busy: false, restored: false };

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
    const sum = ["<b>Новый бриф на ведение соцсетей</b>"];
    SUMMARY.forEach(([key, label, max]) => {
      const t = clip(answerText(key).replace(/\s+/g, " "), max);
      if (t) sum.push(`<b>${esc(label)}:</b> ${esc(t)}`);
    });
    if (getValue(Q_BY_KEY.news)) sum.push("<b>Рассылка:</b> согласие дано");
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
    const lines = ["БРИФ НА ВЕДЕНИЕ СОЦСЕТЕЙ", "1225 Digital Design",
      `Заполнен: ${d.toLocaleDateString("ru-RU")}, ${d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })}`];
    const sumLines = [];
    SUMMARY.slice(0, 4).forEach(([k, label]) => { const t = answerText(k); if (t) sumLines.push(`${label}: ${t}`); });
    if (sumLines.length) lines.push("", ...sumLines);
    lines.push("Согласие на обработку персональных данных: да");
    if (getValue(Q_BY_KEY.news)) lines.push("Согласие на рассылку: да");
    blocks.forEach((st) => {
      lines.push("", "", `${st.num} · ${st.title.toUpperCase()}`, "—".repeat(28));
      st.blocks.forEach((b) => lines.push("", b.label, b.text));
    });
    return lines.join("\n") + "\n";
  }

  function downloadAnswers() {
    const text = buildPlainText(collectBlocks());
    const name = answerText("name").toLowerCase().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "") || "client";
    const file = `brief-${name}-${new Date().toISOString().slice(0, 10)}.txt`;
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
        await post(JSON.stringify({ messages: buildMessages(blocks), from: answerText("name") }),
          { "Content-Type": "text/plain;charset=utf-8" }, 25000);
        mode = "sent";
        state.fileFails = await sendFiles(answerText("name"));
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
      ? ["Я внимательно прочитаю все ответы, а не пролистаю.",
         `В течение ${d} ${plural(d, "рабочего дня", "рабочих дней", "рабочих дней")} напишу вам: уточню то, что осталось неясным.`,
         "Договоримся о коротком созвоне и о том, с чего начинаем."]
      : ["Откройте скачанный файл (он называется brief-…txt) или скопируйте текст ниже.",
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
    window.addEventListener("popstate", (e) => go((e.state && e.state.s) || 0, { noPush: true, save: false }));
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
    const hashStep = parseInt(location.hash.slice(1), 10);
    if (hashStep >= 1 && hashStep <= N) first = hashStep;
    try { history.replaceState({ s: first }, "", first === 0 ? location.pathname + location.search : "#" + first); } catch (e) { /* ничего */ }
    go(first, { noPush: true, noFocus: true, save: false });
    growAll();
  }

  init();
})();
