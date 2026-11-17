"use strict";

const items = document.querySelector("#items");
const template = document.querySelector("#item-template");
const addButton = document.querySelector("#add-item");
const grandTotal = document.querySelector("#grand-total");
let nextItemId = 1;

const moneyFormatter = new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 2 });

function formatMoney(value) {
  return moneyFormatter.format(Number.isFinite(value) ? value : 0).replace(/[\u00a0\u202f]/g, " ") + " ₸";
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
    // Round each line to hundredths before adding it to the displayed total.
    const rounded = Math.round(product * 100) / 100;
    const amount = Number.isFinite(rounded) ? rounded : 0;
    row.querySelector('[data-field="total"]').textContent = formatMoney(amount);
    total += amount;
  }
  grandTotal.textContent = formatMoney(total);
}

function addItem(focus = true) {
  const row = template.content.firstElementChild.cloneNode(true);
  const itemId = nextItemId++;
  for (const field of row.querySelectorAll("input, select")) {
    field.id = `item-${itemId}-${field.dataset.field}`;
    row.querySelector(`[data-label="${field.dataset.field}"]`).htmlFor = field.id;
  }
  row.querySelector(".remove-button").setAttribute("aria-label", `Удалить позицию ${itemId}`);
  items.append(row);
  recalculate();
  if (focus) row.querySelector('[data-field="name"]').focus();
}

items.addEventListener("input", recalculate);
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

const today = new Date();
document.querySelector("#estimate-date").value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
addItem(false);
