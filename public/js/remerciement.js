window.onload = updateNavbar;

function updateNavbar() {
  const userInfo = JSON.parse(localStorage.getItem("user"));
  const nameOnNavbar = document.getElementById("name_on_nav_bar");
  if (userInfo) {
    nameOnNavbar.innerHTML = `${userInfo.prename} ${userInfo.name}`;
  }
}

function envoyerEmail() {
  // const numero_de_commande = document.getElementById("numero_commande");
  const userInfo = localStorage.getItem("user");
  const cartInfo = localStorage.getItem("cart");
  const numero_de_commande =
    document.getElementById("numero_commande").innerText;

  const url = "/envoyer-email";

  const data = {
    infosUtilisateur: JSON.parse(userInfo),
    panier: JSON.parse(cartInfo),
    numeroDeCommande: numero_de_commande,
    // numeroDeCommande: numero_de_commande
  };

  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(async (res) => {
      let text = await res.text();
      alert(text);
      window.location.href = "/map";
    })
    .catch((error) => {
      console.error("Erreur lors de l'envoi de la requête :", error);
    });
}
