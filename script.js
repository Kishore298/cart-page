// Fetch cart data from the API
async function fetchCartData() {
  try {
    const response = await fetch(
      "https://cdn.shopify.com/s/files/1/0883/2188/4479/files/apiCartData.json?v=1728384889"
    );
    const data = await response.json();
    displayCartItems(data);
  } catch (error) {
    console.error("Error fetching cart data:", error);
  }
}

// Function to display cart items
function displayCartItems(data) {
  const cartItemsContainer = document.getElementById("cart-items");
  cartItemsContainer.innerHTML = "";

  let subtotal = 0;

  data.items.forEach((item) => {
    const itemSubtotal = item.price * item.quantity;
    subtotal += itemSubtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td style="display: flex; align-items: center; gap: 50px; justify-content: center;">
        <img src="${item.image}" alt="${item.title}" style="width: 100px; height: auto;">
        <span>${item.title}</span>
      </td>
      <td>₹${(item.price / 100).toFixed(2)}</td>
      <td>
        <input 
          type="number" 
          value="${item.quantity}" 
          style="width: 50px; height: auto;" 
          min="1" 
          data-id="${item.id}" 
          data-price="${item.price}" 
          onchange="updateQuantity(this)">
      </td>
      <td id="subtotal-${item.id}">₹${(itemSubtotal / 100).toFixed(2)}</td>
      <td><i class="fas fa-trash" onclick="removeItem(${item.id})"></i></td>
    `;
    cartItemsContainer.appendChild(row);
  });

  updateTotals(subtotal);
}

// Function to update quantity and recalculate
function updateQuantity(inputElement) {
  const itemId = inputElement.getAttribute("data-id");
  const price = parseFloat(inputElement.getAttribute("data-price"));
  const quantity = parseInt(inputElement.value, 10);

  if (quantity < 1) {
    alert("Quantity cannot be less than 1.");
    inputElement.value = 1;
    return;
  }

  const newSubtotal = price * quantity;
  document.getElementById(`subtotal-${itemId}`).innerText = `₹${(newSubtotal / 100).toFixed(2)}`;

  // Recalculate totals
  recalculateTotals();
}

// Function to recalculate totals
function recalculateTotals() {
  const cartItemsContainer = document.getElementById("cart-items");
  const rows = cartItemsContainer.querySelectorAll("tr");
  let subtotal = 0;

  rows.forEach((row) => {
    const quantityInput = row.querySelector('input[type="number"]');
    const price = parseFloat(quantityInput.getAttribute("data-price"));
    const quantity = parseInt(quantityInput.value, 10);

    subtotal += price * quantity;
  });

  updateTotals(subtotal);
}

// Function to update total and subtotal in the UI
function updateTotals(subtotal) {
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  subtotalElement.innerText = `₹${(subtotal / 100).toFixed(2)}`;
  totalElement.innerText = `₹${(subtotal / 100).toFixed(2)}`;
}

let itemToRemove = null;

function removeItem(itemId) {
  // Store the itemId for confirmation
  itemToRemove = itemId;

  // Display the confirmation modal
  const modal = document.getElementById("confirmation-modal");
  modal.style.display = "flex";

  // Handle confirmation
  document.getElementById("confirm-remove").onclick = () => {
    // Proceed with removal
    const row = document.querySelector(`input[data-id="${itemToRemove}"]`).closest("tr");
    row.remove();

    // Recalculate totals
    recalculateTotals();

    // Hide modal
    modal.style.display = "none";
    itemToRemove = null; // Reset itemToRemove
  };

  // Handle cancellation
  document.getElementById("cancel-remove").onclick = () => {
    // Simply hide modal
    modal.style.display = "none";
    itemToRemove = null;
  };
}

// Initialize the cart page
fetchCartData();

