let modalDisplayed = false;

function displayModal() {
  let modal = document.getElementById("passwordModal");
  if (!modalDisplayed) {
    modal.style.display = "grid";
    modalDisplayed = true;
  } else {
    modal.style.display = "none";
    modalDisplayed = false;
  }
}

function promptAdmin() {
  let password = document.getElementById("admin-password").value;

  const userInfo = JSON.parse(localStorage.getItem("user"));

  const reqBody = JSON.stringify({
    input: password,
    userPrename: userInfo.prename,
  });

  fetch("/fetchAdminData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: reqBody,
  }).then(async (res) => {
    if (res.status == 200) {
      document.cookie = "admin=true";
      loadAdmin();
    } else {
      alert(`Mot de passe invalide`);
    }
  });
}

function loadAdmin() {
  window.location.href = "/admin";
}

function loadInsertionRestaurant() {
  window.location.href = "/ajouterRestaurant";
}

function loadInsertionMenu() {
  window.location.href = "/ajouterMenu";
}

function loadInsertionItem() {
  window.location.href = "/ajouterItem";
}
