const firstNameInput = document.querySelector('#firstName');
const lastNameInput = document.querySelector('#lastName');
const emailInput = document.querySelector('#email');
const addressInput = document.querySelector('#address');
const countrySelect = document.querySelector('#country');
const stateSelect = document.querySelector('#state');
const zipInput = document.querySelector('#zip');
const userData = localStorage.getItem('user');
const cartData = localStorage.getItem('cart');
const commande = { cart: cartData, user: userData };
const boutonPayer = document.getElementById("buttonPayer");
const ccName = document.querySelector("#ccName");
const ccNumber = document.querySelector("#ccNumber");
const ccExpiration = document.querySelector("#ccExpiration");
const ccCvvInput = document.querySelector("#ccCVV");
const nombreProduitAffichage = document.querySelector("#cart-size");
let subTotalAffichage = document.getElementById("sub-total");
let nombreProduit = 0;

let prixTotal = 0;


const products = [];
let subTotal = 0;

if (cartData !== null) { //On vérifie que le panier n'est pas vide
  const cartObj = JSON.parse(cartData);
  //Panier
  for (let i = 0; i < cartObj.length; i++) {
    const product = {
      name: cartObj[i].name,
      description: cartObj[i].quantity,
      price: cartObj[i].price,
    };
    nombreProduit += product.description;
    subTotal += product.price * product.description;
    products.push(product);
  }
  nombreProduitAffichage.textContent = nombreProduit;

  const productList = document.getElementById("product-list");

  for (let i = 0; i < products.length; i++) { //Pour construire la facture
    const product = products[i];

    const li = document.createElement("li");
    li.classList.add(
      "list-group-item",
      "d-flex",
      "justify-content-between",
      "lh-sm"
    );

    const div = document.createElement("div");
    const h6 = document.createElement("h6");
    h6.classList.add("my-0");
    h6.textContent = product.name; //On va afficher le nom de chaque item dans le panier
    const small = document.createElement("small");
    small.classList.add("text-muted");
    small.textContent = product.description + " fois";
    div.appendChild(h6);
    div.appendChild(small);

    const span = document.createElement("span");
    span.classList.add("text-muted");

    product.price = product.price * parseInt(product.description); //On calcule le prix, description étant la quantité donc price*description = prix 
    span.textContent = `${product.price}$`;

    li.appendChild(div);
    li.appendChild(span);

    productList.appendChild(li);
  }

  const subtotal = products.reduce(
    (total, product) => total + product.price,
    0
  );
  const tvq = subtotal * 0.09975; // 9.975% TVQ tax rate
  const tps = subtotal * 0.05; // 5% TPS tax rate
  const totalPrice = subtotal + tvq + tps;

  //Sous total
  const liSubtotal = document.createElement("li");
  liSubtotal.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "lh-sm"
  );
  const spanSubtotal = document.createElement("h6");
  spanSubtotal.textContent = "Sous-total (CAD)";
  const spanSubtotalValue = document.createElement("span");
  spanSubtotalValue.textContent = subtotal.toFixed(2) + "$";
  liSubtotal.appendChild(spanSubtotal);
  liSubtotal.appendChild(spanSubtotalValue);

  //TVQ
  const liTVQ = document.createElement("li");
  liTVQ.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "lh-sm"
  );
  const spanTVQ = document.createElement("h6");
  spanTVQ.textContent = "TVQ (9.975%)";
  const spanTVQValue = document.createElement("span");
  spanTVQValue.textContent = tvq.toFixed(2) + "$";
  liTVQ.appendChild(spanTVQ);
  liTVQ.appendChild(spanTVQValue);

  //TPS
  const liTPS = document.createElement("li");
  liTPS.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "lh-sm"
  );
  const spanTPS = document.createElement("h6");
  spanTPS.textContent = "TPS (5%)";
  const spanTPSValue = document.createElement("span");
  spanTPSValue.textContent = tps.toFixed(2) + "$";
  liTPS.appendChild(spanTPS);
  liTPS.appendChild(spanTPSValue);

  //Prix Final
  const liTotal = document.createElement("li");
  liTotal.classList.add(
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "lh-sm"
  );
  const spanTotal = document.createElement("strong");
  spanTotal.textContent = "Total (CAD)";
  const strongTotal = document.createElement("strong");
  strongTotal.textContent = totalPrice.toFixed(2) + "$";
  liTotal.appendChild(spanTotal);
  liTotal.appendChild(strongTotal);
  const hr = document.createElement("hr");
  prixTotal = totalPrice.toFixed(2);

  productList.appendChild(liSubtotal);
  productList.appendChild(liTVQ);
  productList.appendChild(liTPS);
  productList.appendChild(liTotal);
}

if (userData) {
  const userObj = JSON.parse(userData);
  const prenom = userObj.prename;
  const nom = userObj.name;
  const email = userObj.email;
  const address = userObj.address;
  const country = userObj.country;


  //Pour remplier les cases où on connaît déjà les informations
  if (prenom) {
    firstNameInput.value = prenom; //Par exemple on remplit la case prénom pour l'utilisateur parce qu'on connait le prénom de la personne connecté
  }

  if (nom) {
    lastNameInput.value = nom;
  }

  if (email) {
    emailInput.value = email;
  }

  if (address) {
    addressInput.value = address;
  }

  if (country) {
    countrySelect.value = country;
  }
}

firstNameInput.addEventListener("input", (event) => {
  const input = event.target;
  let inputValue = input.value;

  if (
    !isNaN(inputValue.slice(inputValue.length - 1)) &&
    !inputValue.endsWith(" ")
  ) {
    //Pour empêcher d'avoir des chiffres dans le nom mais on permet les espaces
    input.value = inputValue.slice(0, inputValue.length - 1);
  }
});

lastNameInput.addEventListener("input", (event) => {
  const input = event.target;
  let inputValue = input.value;

  if (
    !isNaN(inputValue.slice(inputValue.length - 1)) &&
    !inputValue.endsWith(" ")
  ) {
    //Pour empêcher d'avoir des chiffres dans le nom mais on permet les espaces
    input.value = inputValue.slice(0, inputValue.length - 1);
  }
});

if (ccName !== null) {
  ccName.addEventListener("input", (event) => {
    const input = event.target;
    let inputValue = input.value;

    if (
      !isNaN(inputValue.slice(inputValue.length - 1)) &&
      !inputValue.endsWith(" ")
    ) {
      //Pour empêcher d'avoir des chiffres dans le nom mais on permet les espaces
      input.value = inputValue.slice(0, inputValue.length - 1);
    }
  });

  ccNumber.addEventListener("input", (event) => {
    const input = event.target;
    let inputValue = input.value;

    if (isNaN(inputValue.slice(inputValue.length - 1))) {
      //Pour ne valider que les chiffres
      input.value = inputValue.slice(0, inputValue.length - 1);
    } else {
      if (inputValue.length % 5 === 1 && !inputValue.endsWith(" ")) {
        //Pour mettre un espace à chaque 4 caractères
        let dernierCaractere = inputValue.slice(inputValue.length - 1);
        inputValue =
          inputValue.slice(0, inputValue.length - 1) + " " + dernierCaractere;
        input.value = inputValue;
      }

      if (inputValue.length > 20) {
        input.value = inputValue.slice(0, 20);
      }
    }
  });

  ccExpiration.addEventListener("input", (event) => {
    const input = event.target;
    let inputValue = input.value;

    if (isNaN(inputValue.slice(inputValue.length - 1))) {
      //Pour ne valider que les chiffres
      input.value = inputValue.slice(0, inputValue.length - 1);
    } else {
      if (inputValue.length === 3 && !inputValue.endsWith("/")) {
        //Pour ajouter un / automatiquement entre les mois et l'année dans le format mm/aa
        let dernierCaractere = inputValue.slice(inputValue.length - 1);
        inputValue = inputValue.slice(0, -1) + "/" + dernierCaractere;
        input.value = inputValue;
      } else if (inputValue.length > 5) {
        input.value = inputValue.slice(0, 5);
      }
    }
  });

  ccCvvInput.addEventListener("input", (event) => {
    const input = event.target;
    let inputValue = input.value;

    if (isNaN(inputValue.slice(inputValue.length - 1))) {
      //Pour ne valider que les chiffres
      input.value = inputValue.slice(0, inputValue.length - 1);
    }

    if (inputValue.length > 3) {
      //Bloquer la longueur à 3
      input.value = inputValue.slice(0, 3);
    }
  });
}
zipInput.addEventListener("input", (event) => {
  const input = event.target;
  let inputValue = input.value;

  if (inputValue.length % 4 === 1 && !inputValue.endsWith(" ")) { //Pour mettre un espace à chaque 4 caractères
    let dernierCaractere = inputValue.slice(inputValue.length - 1);
    inputValue = inputValue.slice(0, inputValue.length - 1) + " " + dernierCaractere;
    input.value = inputValue;
  }

  if (inputValue.length > 8) {
    input.value = inputValue.slice(0, 8)
  }

})

zipInput.addEventListener("input", (event) => {
  const input = event.target;
  let inputValue = input.value;

  if (inputValue.length % 4 === 1 && !inputValue.endsWith(" ")) { //Pour mettre un espace à chaque 4 caractères
    let dernierCaractere = inputValue.slice(inputValue.length - 1);
    inputValue = inputValue.slice(0, inputValue.length - 1) + " " + dernierCaractere;
    input.value = inputValue;
  }

  if (inputValue.length > 8) {
    input.value = inputValue.slice(0, 8)
  }

})

const validateForm = () => { //Vérifer que toutes les cases sont remplies
  const isFormValid = firstNameInput.value !== '' &&
    lastNameInput.value !== '' &&
    emailInput.value !== '' &&
    addressInput.value !== '' &&
    countrySelect.value !== '' &&
    stateSelect.value !== '' &&
    zipInput.value !== '';

  if (!isFormValid) {
    alert('Veuillez remplir toutes les cases');
  }

  return isFormValid;
};

paypal.Buttons({ //Fonction pour faire fonctionner le bouton paypal
  createOrder: function (data, actions) {
    const isFormValid = validateForm();

    if (isFormValid) {
      return actions.order.create({
        purchase_units: [{
          amount: {
            value: prixTotal,
          }
        }]
      });
    }

    return false;
  },
  onApprove: function (data, actions) {

    return actions.order.capture().then(function (details) { //On envoie les informations nécessaires au server
      fetch("/payer", { method: "POST", redirect: "follow", headers: { "Content-Type": "application/json" }, body: JSON.stringify(commande) }).then(res => {
        if (res.redirected) {
          window.location.href = res.url;
        }
        else {
          console.log(`Response ${res}`)
        }
      })
    });
  }
}).render('#paypal');
