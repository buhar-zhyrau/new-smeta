"use strict";

const items = document.querySelector("#items");
const template = document.querySelector("#item-template");
const addButton = document.querySelector("#add-item");
const grandTotal = document.querySelector("#grand-total");
const discountInput = document.querySelector("#discount-percent");
const vatInput = document.querySelector("#vat-percent");
const currencySelect = document.querySelector("#currency");
const draftKey = "smeta-draft-v1";
const fieldIds = ["sender", "recipient", "estimate-number", "estimate-date", "discount-percent", "vat-percent", "currency"];
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
  for (const field of row.querySelectorAll("input, select")) {
    field.id = `item-${itemId}-${field.dataset.field}`;
    row.querySelector(`[data-label="${field.dataset.field}"]`).htmlFor = field.id;
    if (typeof values[field.dataset.field] === "string") field.value = values[field.dataset.field];
  }
  row.querySelector(".remove-button").setAttribute("aria-label", `Удалить позицию ${itemId}`);
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
    status.textContent = "Не удалось сохранить черновик в браузере. Скопируйте смету перед закрытием страницы.";
    status.hidden = false;
  }
}

function restoreDraft() {
  try {
    const saved = localStorage.getItem(draftKey);
    if (saved === null) return false;
    const draft = JSON.parse(saved);
    if (!draft || draft.version !== 1 || !draft.fields || !Array.isArray(draft.items)) return false;
    if (!fieldIds.every(id => typeof draft.fields[id] === "string")) return false;
    if (!draft.items.every(row => row && itemFields.every(field => typeof row[field] === "string") && ["шт", "час", "услуга"].includes(row.unit))) return false;
    if (!["₸", "₽", "$", "€"].includes(draft.fields.currency)) return false;
    for (const id of fieldIds) document.getElementById(id).value = draft.fields[id];
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
  if (!window.confirm("Создать новую смету? Текущий черновик будет очищен.")) return;
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
  const number = document.querySelector("#estimate-number").value.trim();
  const date = document.querySelector("#estimate-date").value;
  const formattedDate = date ? date.split("-").reverse().join(".") : "—";
  const lines = [`Смета № ${number || "—"} от ${formattedDate}`];
  for (const [id, label] of [["sender", "От кого"], ["recipient", "Для кого"]]) {
    const value = document.getElementById(id).value.trim();
    if (value) lines.push(`${label}: ${value}`);
  }
  lines.push("");
  for (const row of items.querySelectorAll(".item-row")) {
    const read = field => row.querySelector(`[data-field="${field}"]`).value;
    if (![read("name"), read("quantity"), read("price")].some(value => value.trim())) continue;
    const quantity = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 20 }).format(parseNumber(read("quantity"))).replace(/[\u00a0\u202f]/g, " ");
    lines.push(`• ${read("name").trim() || "Без названия"} — ${quantity} ${read("unit")} × ${formatMoney(parseNumber(read("price")))} = ${row.querySelector('[data-field="total"]').textContent}`);
  }
  lines.push("", `Сумма: ${document.querySelector("#subtotal").textContent}`);
  if (!document.querySelector("#discount-row").hidden) {
    lines.push(`Скидка (${discountInput.value.trim()} %): ${document.querySelector("#discount-amount").textContent}`);
    lines.push(`Сумма со скидкой: ${document.querySelector("#discounted-subtotal").textContent}`);
  }
  if (!document.querySelector("#vat-row").hidden) lines.push(`НДС (${vatInput.value.trim()} %): ${document.querySelector("#vat-amount").textContent}`);
  lines.push(`Итого к оплате: ${grandTotal.textContent}`);
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
    copyStatus.textContent = "Скопировано ✓";
    copyTimer = setTimeout(() => { copyStatus.textContent = ""; }, 2000);
  } catch {
    copyText.value = text;
    manualCopy.hidden = false;
    copyText.focus();
    copyText.select();
  }
});

for (const id of ["sender", "recipient", "estimate-number", "estimate-date"]) {
  document.getElementById(id).addEventListener("input", saveDraft);
  document.getElementById(id).addEventListener("change", saveDraft);
}

document.querySelector("#estimate-date").value = todayDate();
if (!restoreDraft()) addItem(false);
restoringDraft = false;
recalculate();
