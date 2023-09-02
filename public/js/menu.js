function addToCart(button) {
  const itemName = button.getAttribute("data-item-name");
  const itemPrice = parseFloat(button.getAttribute("data-item-price"));
  const itemId = button.getAttribute("data-item-id");
  const itemQuantity = parseInt(
    document.getElementById(`item-${itemId}-quantity`).value
  );
  const item = { name: itemName, price: itemPrice, quantity: itemQuantity };

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingItemIndex = cart.findIndex(
    (cartItem) => cartItem.name === itemName
  );
  if (existingItemIndex >= 0) {
    cart[existingItemIndex].quantity += itemQuantity;
  } else {
    cart.push(item);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  button.blur();
}

function changePrice(input) {
  const itemPrice = parseFloat(input.getAttribute("data-item-price"));
  const itemQuantity = parseInt(input.value);
  const itemId = input.getAttribute("data-item-id");
  const itemPriceSpan = document.querySelector(
    `.item-price[data-item-id="${itemId}"]`
  );
  const itemPriceTotal = itemPrice * itemQuantity;
  itemPriceSpan.textContent = itemPriceTotal.toFixed(2);
}

function proceedToCheckout() {
  //Check if the cart is empty
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Votre panier est vide. Veuillez ajouter des plats à votre panier.");
  } else window.location.href = "/paiement";
}
