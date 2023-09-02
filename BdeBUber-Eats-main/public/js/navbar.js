window.onload = updateNavbar;

function updateNavbar() {
  const userInfo = JSON.parse(localStorage.getItem("user")) || [];
  const nameOnNavbar = document.getElementById("nameOnNav");
  nameOnNavbar.innerHTML += ` ${userInfo.prename} ${userInfo.name}`;
}
function updateCartModal() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let cartItemsHTML = "";
  let cartTotal = 0;

  cart.forEach((item) => {
    cartTotal += item.price * item.quantity;
    cartItemsHTML += `
      <li class="list-group-item">
        <div class="d-flex justify-content-between align-items-center">
          <div>${item.name} x ${item.quantity} - $${(
      item.price * item.quantity
    ).toFixed(2)}</div>
          <div>
            <button class="btn btn-sm btn-outline-secondary decrease-quantity-btn" data-name="${
              item.name
            }">-</button>
            <button class="btn btn-sm btn-outline-secondary increase-quantity-btn" data-name="${
              item.name
            }">+</button>
            <button class="btn btn-sm btn-outline-danger delete-item-btn" data-name="${
              item.name
            }">Delete</button>
          </div>
        </div>
      </li>`;
  });

  document.getElementById("cart-item-list").innerHTML = cartItemsHTML;
  document.getElementById(
    "cart-total"
  ).textContent = `Total: $${cartTotal.toFixed(2)}`;

  // Add event listeners for quantity buttons and delete buttons
  document.querySelectorAll(".decrease-quantity-btn").forEach((button) => {
    button.addEventListener("click", () => {
      let itemName = button.dataset.name;
      let itemIndex = cart.findIndex((item) => item.name === itemName);
      if (itemIndex !== -1) {
        cart[itemIndex].quantity -= 1;
        if (cart[itemIndex].quantity <= 0) {
          cart.splice(itemIndex, 1);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartModal();
      }
    });
  });

  document.querySelectorAll(".increase-quantity-btn").forEach((button) => {
    button.addEventListener("click", () => {
      let itemName = button.dataset.name;
      let itemIndex = cart.findIndex((item) => item.name === itemName);
      if (itemIndex !== -1) {
        cart[itemIndex].quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartModal();
      }
    });
  });

  document.querySelectorAll(".delete-item-btn").forEach((button) => {
    button.addEventListener("click", () => {
      let itemName = button.dataset.name;
      let itemIndex = cart.findIndex((item) => item.name === itemName);
      if (itemIndex !== -1) {
        cart.splice(itemIndex, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartModal();
      }
    });
  });

  document.getElementById("clear-cart-btn").addEventListener("click", () => {
    localStorage.removeItem("cart");
    updateCartModal();
  });
}
