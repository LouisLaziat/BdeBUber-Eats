let modalButtons;
let modalLoaded;
let itemAdvisor = document.createElement("h3");
let advised = false;
let OptionsSelected = false;

function fetchRestaurantOptions() {
  const RestaurantNameElemId = document.getElementById("MenuRestaurant");

  fetch("/getMenuOptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: null,
  }).then(async (res) => {
    const data = await res.json();
    RestaurantNameElemId.remove(0);
    data.forEach((element) => {
      let option = document.createElement("option");
      option.text = element;
      RestaurantNameElemId.add(option);
    });
  });
}

function popupForum() {
  if (!modalLoaded) {
    modalLoaded = true;

    const modal = document.getElementById("modal");
    const content = document.getElementById("modal-content");

    if (!OptionsSelected) {
      modalButtons = new Array();
      fetch("/fetchAllItems", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: null,
      })
        .then((data) => data.json())
        .then((data) => {
          modal.style.display = "block";

          data.forEach((item) => {
            const itemContainer = document.createElement("div");
            const Button = document.createElement("input");

            Button.type = "checkbox";

            modalButtons.push(Button);

            let label = document.createElement("label");
            label.style.fontSize = "22px";

            Button.name = label.innerHTML;
            label.innerHTML = item.item_name; // Set the item name as the label text

            Button.value = item;

            itemContainer.className = "item-container";

            itemContainer.appendChild(Button);
            itemContainer.appendChild(label);

            content.appendChild(itemContainer);
          });
        });
      OptionsSelected = true; //prevents reloading from the database unecessarily
    } else {
      modal.style.display = "block";
    }
  }
}

function CloseModal() {
  const modal = document.getElementById("modal");
  modal.style.display = "none";
  event.preventDefault();
  modalLoaded = false;
  let itemCount = 0;
  modalButtons.forEach((element) => {
    if (element.checked) {
      itemCount++;
    }
  });

  itemAdvisor.innerHTML = itemCount + " éléments ont été sélectionnées";

  if (!advised) {
    document.body.appendChild(itemAdvisor);
  }
}

function CreateMenu() {
  let CheckBoxItems = {};
  for (let i = 0; i < modalButtons.length; i++) {
    if (modalButtons[i].checked) {
      console.log(modalButtons[i].nextElementSibling.textContent);
      CheckBoxItems[i] = modalButtons[i].nextElementSibling.textContent;
    }
  }
  let formBody = {};

  //menu name desc items restaurant
  formBody["menuName"] = document.getElementById("MenuName").value;
  formBody["menuDesc"] = document.getElementById("MenuDescription").value;
  formBody["menuRestaurant"] = document.getElementById("MenuRestaurant").value;
  formBody["radioItems"] = CheckBoxItems;
  fetch("/addMenuDB", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formBody),
  });
  alert("Menu créé avec succès");
  window.location.href = "/admin";
}
