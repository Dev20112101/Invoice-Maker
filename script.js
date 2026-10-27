// State Management: Single Source of Truth
let items = [
  { id: 1, name: "UI/UX Design System", qty: 1, price: 450.00 },
  { id: 2, name: "Frontend Implementation", qty: 10, price: 60.00 }
];

const TAX_RATE = 0.18; // 18% Tax

// DOM Elements
const invoiceItemsContainer = document.getElementById("invoice-items");
const addItemBtn = document.getElementById("add-item-btn");
const printBtn = document.getElementById("print-btn");

const itemNameInput = document.getElementById("item-name");
const itemQtyInput = document.getElementById("item-qty");
const itemPriceInput = document.getElementById("item-price");
const invDateInput = document.getElementById("inv-date");

const subtotalVal = document.getElementById("subtotal-val");
const taxVal = document.getElementById("tax-val");
const grandTotalVal = document.getElementById("grand-total-val");

// Initialize Application
function init() {
  // Set default current date
  const today = new Date().toISOString().split("T")[0];
  invDateInput.value = today;

  render();

  // Event Listeners
  addItemBtn.addEventListener("click", handleAddItem);
  
  // Event Delegation on Table Body for Delete Actions
  invoiceItemsContainer.addEventListener("click", handleDeleteItem);
  
  // Print Invoice Action
  printBtn.addEventListener("click", () => window.print());
}

// Add Item Handler
function handleAddItem() {
  const name = itemNameInput.value.trim();
  const qty = parseInt(itemQtyInput.value, 10);
  const price = parseFloat(itemPriceInput.value);

  if (!name || isNaN(qty) || qty <= 0 || isNaN(price) || price < 0) {
    alert("Please enter a valid item description, quantity, and unit price.");
    return;
  }

  // Immutable/Unique item addition
  const newItem = {
    id: Date.now(),
    name,
    qty,
    price
  };

  items.push(newItem);
  
  // Clear input fields
  itemNameInput.value = "";
  itemQtyInput.value = "1";
  itemPriceInput.value = "";
  
  render();
}

// Delete Item Handler using Event Delegation
function handleDeleteItem(e) {
  if (e.target.classList.contains("btn-delete")) {
    const idToDelete = Number(e.target.dataset.id);
    // Filter array state
    items = items.filter(item => item.id !== idToDelete);
    render();
  }
}

// Format numbers as currency
function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

// Synchronize DOM with State
function render() {
  // Clear table rows
  invoiceItemsContainer.innerHTML = "";

  if (items.length === 0) {
    invoiceItemsContainer.innerHTML = `
      <tr>
        <td colspan="5" class="text-center" style="color: var(--text-secondary); padding: 20px;">
          No items added yet.
        </td>
      </tr>
    `;
  } else {
    // Populate dynamic rows
    items.forEach(item => {
      const lineTotal = item.qty * item.price;
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td class="text-left">${item.name}</td>
        <td class="text-center">${item.qty}</td>
        <td class="text-right">${formatCurrency(item.price)}</td>
        <td class="text-right">${formatCurrency(lineTotal)}</td>
        <td class="text-center no-print">
          <button class="btn-delete" data-id="${item.id}">Delete</button>
        </td>
      `;

      invoiceItemsContainer.appendChild(tr);
    });
  }

  // Calculate Subtotal using Array.prototype.reduce
  const subtotal = items.reduce((acc, item) => acc + (item.qty * item.price), 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;

  // Update UI totals
  subtotalVal.textContent = formatCurrency(subtotal);
  taxVal.textContent = formatCurrency(tax);
  grandTotalVal.textContent = formatCurrency(grandTotal);
}

// Bootstrap App
document.addEventListener("DOMContentLoaded", init);