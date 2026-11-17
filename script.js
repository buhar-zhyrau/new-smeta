"use strict";

const translations = {
  ru: {
    language: "Язык", eyebrow: "ПРОСТОЙ РАСЧЁТ", appTitle: "Смета за 5 минут",
    hint: "Добавьте позиции и цены — итог посчитается автоматически.", details: "Реквизиты",
    sender: "От кого", recipient: "Для кого", number: "Номер сметы", date: "Дата",
    senderPlaceholder: "Ваше имя или компания", recipientPlaceholder: "Имя или компания клиента", numberPlaceholder: "Например, 001",
    positions: "Позиции", keyboardHint: "Enter в последней строке — новая позиция",
    tableCaption: "Позиции сметы с автоматическим расчётом суммы", name: "Наименование", quantity: "Количество", unit: "Единица",
    priceLabel: "Цена,", sum: "Сумма", remove: "Удаление", removeItem: "Удалить позицию",
    add: "+ Добавить позицию", discountLabel: "Скидка, %", vatLabel: "НДС, %", currency: "Валюта",
    discount: "Скидка", discounted: "Сумма со скидкой", vat: "НДС", total: "Итого к оплате",
    comment: "Комментарий", commentPlaceholder: "Сроки, условия оплаты", signature: "Подпись",
    pdf: "Сохранить PDF", copy: "Скопировать для WhatsApp", newEstimate: "Новая смета",
    manualCopy: "Скопируйте текст вручную", estimateText: "Текст сметы", itemPlaceholder: "Товар или услуга",
    pieces: "шт", hour: "час", service: "услуга", unnamed: "Без названия", copied: "Скопировано ✓",
    confirmNew: "Создать новую смету? Текущий черновик будет очищен.",
    storageError: "Не удалось сохранить черновик в браузере. Скопируйте смету перед закрытием страницы.",
    documentTitle: "Смета № {number} от {date}"
  },
  kk: {
    language: "Тіл", eyebrow: "ОҢАЙ ЕСЕПТЕУ", appTitle: "5 минутта смета",
    hint: "Позициялар мен бағаларды қосыңыз — жалпы сома автоматты түрде есептеледі.", details: "Деректемелер",
    sender: "Кімнен", recipient: "Кімге", number: "Смета нөмірі", date: "Күні",
    senderPlaceholder: "Атыңыз немесе компанияңыз", recipientPlaceholder: "Клиенттің аты немесе компаниясы", numberPlaceholder: "Мысалы, 001",
    positions: "Позициялар", keyboardHint: "Соңғы жолда Enter бассаңыз, жаңа позиция қосылады",
    tableCaption: "Сомасы автоматты түрде есептелетін смета позициялары", name: "Атауы", quantity: "Саны", unit: "Өлшем бірлігі",
    priceLabel: "Бағасы,", sum: "Сома", remove: "Жою", removeItem: "Позицияны жою",
    add: "+ Позиция қосу", discountLabel: "Жеңілдік, %", vatLabel: "ҚҚС, %", currency: "Валюта",
    discount: "Жеңілдік", discounted: "Жеңілдіктен кейінгі сома", vat: "ҚҚС", total: "Төлеуге барлығы",
    comment: "Түсініктеме", commentPlaceholder: "Мерзімдер, төлем шарттары", signature: "Қолы",
    pdf: "PDF сақтау", copy: "WhatsApp үшін көшіру", newEstimate: "Жаңа смета",
    manualCopy: "Мәтінді қолмен көшіріңіз", estimateText: "Смета мәтіні", itemPlaceholder: "Тауар немесе қызмет",
    pieces: "дана", hour: "сағат", service: "қызмет", unnamed: "Атаусыз", copied: "Көшірілді ✓",
    confirmNew: "Жаңа смета жасау керек пе? Ағымдағы жоба тазартылады.",
    storageError: "Жобаны браузерде сақтау мүмкін болмады. Бетті жаппас бұрын сметаны көшіріңіз.",
    documentTitle: "{date} күнгі № {number} смета"
  },
  en: {
    language: "Language", eyebrow: "SIMPLE CALCULATIONS", appTitle: "Estimate in 5 minutes",
    hint: "Add items and prices — the total is calculated automatically.", details: "Details",
    sender: "From", recipient: "To", number: "Estimate number", date: "Date",
    senderPlaceholder: "Your name or company", recipientPlaceholder: "Client name or company", numberPlaceholder: "For example, 001",
    positions: "Items", keyboardHint: "Press Enter in the last row to add an item",
    tableCaption: "Estimate items with automatically calculated amounts", name: "Description", quantity: "Quantity", unit: "Unit",
    priceLabel: "Price,", sum: "Subtotal", remove: "Remove", removeItem: "Remove item",
    add: "+ Add item", discountLabel: "Discount, %", vatLabel: "VAT, %", currency: "Currency",
    discount: "Discount", discounted: "Subtotal after discount", vat: "VAT", total: "Total due",
    comment: "Comment", commentPlaceholder: "Timeframe, payment terms", signature: "Signature",
    pdf: "Save PDF", copy: "Copy for WhatsApp", newEstimate: "New estimate",
    manualCopy: "Copy the text manually", estimateText: "Estimate text", itemPlaceholder: "Product or service",
    pieces: "pcs", hour: "hr", service: "service", unnamed: "Untitled", copied: "Copied ✓",
    confirmNew: "Create a new estimate? The current draft will be cleared.",
    storageError: "Could not save the draft in this browser. Copy the estimate before closing the page.",
    documentTitle: "Estimate No. {number} dated {date}"
  }
};
const languageKey = "smeta-language-v1";
let language = "ru";
try {
  const savedLanguage = localStorage.getItem(languageKey);
  if (Object.hasOwn(translations, savedLanguage)) language = savedLanguage;
} catch { /* The estimate still works when browser storage is unavailable. */ }

function t(key) {
  return translations[language][key];
}

function translateElements(root) {
  for (const element of root.querySelectorAll("[data-i18n]")) element.textContent = t(element.dataset.i18n);
  for (const element of root.querySelectorAll("[data-i18n-placeholder]")) element.placeholder = t(element.dataset.i18nPlaceholder);
}

function unitText(value) {
  return t({ "шт": "pieces", "час": "hour", "услуга": "service" }[value]);
}

function documentHeading() {
  const number = document.querySelector("#estimate-number").value.trim() || "—";
  const date = document.querySelector("#estimate-date").value;
  const formattedDate = date ? date.split("-").reverse().join(".") : "—";
  return t("documentTitle").replace(/\{number\}|\{date\}/g, token => token === "{number}" ? number : formattedDate);
}

function applyLanguage() {
  document.documentElement.lang = language;
  document.title = t("appTitle");
  document.querySelector("#language").value = language;
  translateElements(document);
  for (const row of items.querySelectorAll(".item-row")) {
    row.querySelector(".remove-button").setAttribute("aria-label", `${t("removeItem")} ${row.dataset.itemId}`);
  }
  if (copyStatus.textContent) copyStatus.textContent = t("copied");
  if (!document.querySelector("#storage-status").hidden) document.querySelector("#storage-status").textContent = t("storageError");
  if (!manualCopy.hidden) copyText.value = estimateText();
}

const items = document.querySelector("#items");
const template = document.querySelector("#item-template");
const addButton = document.querySelector("#add-item");
const grandTotal = document.querySelector("#grand-total");
const discountInput = document.querySelector("#discount-percent");
const vatInput = document.querySelector("#vat-percent");
const currencySelect = document.querySelector("#currency");
const draftKey = "smeta-draft-v1";
const fieldIds = ["sender", "recipient", "estimate-number", "estimate-date", "discount-percent", "vat-percent", "currency", "comment"];
const itemFields = ["name", "quantity", "unit", "price"];
const copyStatus = document.querySelector("#copy-status");
const manualCopy = document.querySelector("#manual-copy");
const copyText = document.querySelector("#copy-text");
let restoringDraft = true;
let copyTimer;
let nextItemId = 1;

const moneyFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 });

function formatMoney(value) {
  return moneyFormatter.format(roundAmount(value)).replace(/[\u00a0\u202f]/g, " ") + " " + currencySelect.value;
}

function roundAmount(value) {
  return Number.isFinite(value) ? Math.round(value) || 0 : 0;
}

function updateSummary(outputId, rowId, amount) {
  document.querySelector(outputId).textContent = formatMoney(amount);
  if (rowId) document.querySelector(rowId).hidden = amount === 0;
}

function parseNumber(value) {
  const normalized = value.trim().replace(/[ \u00a0\u202f]/g, "").replace(",", ".");
  if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)) return 0;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function recalculate() {
  let total = 0;
  for (const row of items.querySelectorAll(".item-row")) {
    const quantity = parseNumber(row.querySelector('[data-field="quantity"]').value);
    const price = parseNumber(row.querySelector('[data-field="price"]').value);
    const product = quantity * price;
    // Keep the displayed line amounts and the subtotal consistent in whole units.
    const amount = roundAmount(product);
    row.querySelector('[data-field="total"]').textContent = formatMoney(amount);
    total = roundAmount(total + amount);
  }
  const discount = roundAmount(total * (parseNumber(discountInput.value) / 100));
  const discounted = roundAmount(total - discount);
  const vat = roundAmount(discounted * (parseNumber(vatInput.value) / 100));
  updateSummary("#subtotal", null, total);
  updateSummary("#discount-amount", "#discount-row", discount);
  updateSummary("#discounted-subtotal", "#discounted-row", discounted);
  updateSummary("#vat-amount", "#vat-row", vat);
  grandTotal.textContent = formatMoney(discounted + vat);
  for (const label of document.querySelectorAll("[data-currency]")) {
    label.textContent = currencySelect.value;
  }
  saveDraft();
}

function addItem(focus = true, values = {}) {
  const row = template.content.firstElementChild.cloneNode(true);
  const itemId = nextItemId++;
  row.dataset.itemId = itemId;
  translateElements(row);
  for (const field of row.querySelectorAll("input, select")) {
    field.id = `item-${itemId}-${field.dataset.field}`;
    row.querySelector(`[data-label="${field.dataset.field}"]`).htmlFor = field.id;
    if (typeof values[field.dataset.field] === "string") field.value = values[field.dataset.field];
  }
  row.querySelector(".remove-button").setAttribute("aria-label", `${t("removeItem")} ${itemId}`);
  items.append(row);
  recalculate();
  if (focus) row.querySelector('[data-field="name"]').focus();
}

items.addEventListener("input", recalculate);
items.addEventListener("change", recalculate);
items.addEventListener("click", (event) => {
  const button = event.target.closest(".remove-button");
  if (!button) return;
  const row = button.closest(".item-row");
  const nextRow = row.nextElementSibling || row.previousElementSibling;
  row.remove();
  recalculate();
  if (nextRow) nextRow.querySelector('[data-field="name"]').focus();
  else addButton.focus();
});

items.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.isComposing || event.ctrlKey || event.altKey || event.metaKey || event.shiftKey) return;
  // Keep the native Enter behaviour for select controls and delete buttons.
  if (event.target.tagName !== "INPUT") return;
  if (event.target.closest(".item-row") !== items.lastElementChild) return;
  event.preventDefault();
  addItem();
});

addButton.addEventListener("click", () => addItem());
discountInput.addEventListener("input", recalculate);
vatInput.addEventListener("input", recalculate);
currencySelect.addEventListener("change", recalculate);

function todayDate() {
  const today = new Date();
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
}

function saveDraft() {
  if (restoringDraft) return;
  const fields = Object.fromEntries(fieldIds.map(id => [id, document.getElementById(id).value]));
  const positions = Array.from(items.querySelectorAll(".item-row"), row =>
    Object.fromEntries(itemFields.map(field => [field, row.querySelector(`[data-field="${field}"]`).value]))
  );
  const status = document.querySelector("#storage-status");
  try {
    localStorage.setItem(draftKey, JSON.stringify({ version: 1, fields, items: positions }));
    status.hidden = true;
  } catch {
    status.textContent = t("storageError");
    status.hidden = false;
  }
}

function restoreDraft() {
  try {
    const saved = localStorage.getItem(draftKey);
    if (saved === null) return false;
    const draft = JSON.parse(saved);
    if (!draft || draft.version !== 1 || !draft.fields || !Array.isArray(draft.items)) return false;
    // Drafts saved before the comment field was added remain compatible.
    if (!fieldIds.every(id => typeof draft.fields[id] === "string" || (id === "comment" && draft.fields[id] === undefined))) return false;
    if (!draft.items.every(row => row && itemFields.every(field => typeof row[field] === "string") && ["шт", "час", "услуга"].includes(row.unit))) return false;
    if (!["₸", "₽", "$", "€"].includes(draft.fields.currency)) return false;
    for (const id of fieldIds) document.getElementById(id).value = draft.fields[id] ?? "";
    for (const row of draft.items) addItem(false, row);
    return true;
  } catch {
    return false;
  }
}

function nextEstimateNumber(value) {
  const match = value.trim().match(/^(.*?)(\d+)$/);
  if (!match) return "1";
  return match[1] + (BigInt(match[2]) + 1n).toString().padStart(match[2].length, "0");
}

document.querySelector("#new-estimate").addEventListener("click", () => {
  if (!window.confirm(t("confirmNew"))) return;
  const number = nextEstimateNumber(document.querySelector("#estimate-number").value);
  restoringDraft = true;
  for (const id of fieldIds) document.getElementById(id).value = "";
  discountInput.value = "0";
  vatInput.value = "0";
  currencySelect.value = "₸";
  document.querySelector("#estimate-number").value = number;
  document.querySelector("#estimate-date").value = todayDate();
  items.replaceChildren();
  nextItemId = 1;
  addItem(false);
  restoringDraft = false;
  recalculate();
  clearTimeout(copyTimer);
  copyStatus.textContent = "";
  manualCopy.hidden = true;
  copyText.value = "";
  document.querySelector("#sender").focus();
});

function estimateText() {
  const lines = [documentHeading()];
  for (const id of ["sender", "recipient"]) {
    const value = document.getElementById(id).value.trim();
    if (value) lines.push(`${t(id)}: ${value}`);
  }
  lines.push("");
  for (const row of items.querySelectorAll(".item-row")) {
    const read = field => row.querySelector(`[data-field="${field}"]`).value;
    if (![read("name"), read("quantity"), read("price")].some(value => value.trim())) continue;
    const quantity = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 20 }).format(parseNumber(read("quantity"))).replace(/[\u00a0\u202f]/g, " ");
    lines.push(`• ${read("name").trim() || t("unnamed")} — ${quantity} ${unitText(read("unit"))} × ${formatMoney(parseNumber(read("price")))} = ${row.querySelector('[data-field="total"]').textContent}`);
  }
  lines.push("", `${t("sum")}: ${document.querySelector("#subtotal").textContent}`);
  if (!document.querySelector("#discount-row").hidden) {
    lines.push(`${t("discount")} (${discountInput.value.trim()} %): ${document.querySelector("#discount-amount").textContent}`);
    lines.push(`${t("discounted")}: ${document.querySelector("#discounted-subtotal").textContent}`);
  }
  if (!document.querySelector("#vat-row").hidden) lines.push(`${t("vat")} (${vatInput.value.trim()} %): ${document.querySelector("#vat-amount").textContent}`);
  lines.push(`${t("total")}: ${grandTotal.textContent}`);
  return lines.join("\n");
}

document.querySelector("#copy-estimate").addEventListener("click", async () => {
  recalculate();
  const text = estimateText();
  clearTimeout(copyTimer);
  copyStatus.textContent = "";
  manualCopy.hidden = true;
  try {
    await navigator.clipboard.writeText(text);
    copyStatus.textContent = t("copied");
    copyTimer = setTimeout(() => { copyStatus.textContent = ""; }, 2000);
  } catch {
    copyText.value = text;
    manualCopy.hidden = false;
    copyText.focus();
    copyText.select();
  }
});

function preparePrint() {
  recalculate();
  document.querySelector("#print-title").textContent = documentHeading();
  for (const output of document.querySelectorAll("[data-print-for]")) {
    output.textContent = document.getElementById(output.dataset.printFor).value;
  }
  // Text copies wrap naturally on paper, including long names and comments.
  for (const row of items.querySelectorAll(".item-row")) {
    for (const field of itemFields) {
      const value = row.querySelector(`[data-field="${field}"]`).value;
      row.querySelector(`[data-print-field="${field}"]`).textContent = field === "unit" ? unitText(value) : value;
    }
  }
}

document.querySelector("#save-pdf").addEventListener("click", () => {
  preparePrint();
  window.print();
});
window.addEventListener("beforeprint", preparePrint);

document.querySelector("#language").addEventListener("change", (event) => {
  const selected = event.target.value;
  if (!Object.hasOwn(translations, selected)) return;
  language = selected;
  applyLanguage();
  try { localStorage.setItem(languageKey, language); } catch { /* Keep the selection for this session. */ }
});

for (const id of ["sender", "recipient", "estimate-number", "estimate-date", "comment"]) {
  document.getElementById(id).addEventListener("input", saveDraft);
  document.getElementById(id).addEventListener("change", saveDraft);
}

document.querySelector("#estimate-date").value = todayDate();
if (!restoreDraft()) addItem(false);
restoringDraft = false;
recalculate();
applyLanguage();
