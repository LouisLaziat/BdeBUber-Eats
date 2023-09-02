function executeConnection() {
  const email = document.getElementById("floatingInput").value;
  const pw = document.getElementById("floatingPassword").value;
  const errorTextBox = document.getElementById("Error");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email == "" || pw == "" || pw.length < 8) {
    errorTextBox.innerText =
      "Veuillez entrez tous les informations nécessaires à la connexion";
  } else if (!emailRegex.test(email)) {
    errorTextBox.innerText = "Veuillez entrer une adresse email valide.";
  } else {
    errorTextBox.innerText = "";
    fetch("/connexion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: pw,
      }),
    }).then(async (res) => {
      let text = await res.text();
      const connObject = JSON.parse(text);
      if (connObject.granted) {
        document.cookie = "auth=true";
        localStorage.setItem("user", JSON.stringify(connObject));
        window.location.href = "/map";
      } else {
        errorTextBox.innerText = "Error connecting to server";
      }
    });
  }
}
