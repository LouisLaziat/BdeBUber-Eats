function sendInscriptionRequest() {
  const inscriptionForm = new FormData();
  inscriptionForm.append("email", document.getElementById("email").value);
  inscriptionForm.append("password", document.getElementById("password").value);
  inscriptionForm.append(
    "confirmPassword",
    document.getElementById("confirm-password").value
  );
  inscriptionForm.append("name", document.getElementById("name").value);
  inscriptionForm.append("prename", document.getElementById("prename").value);
  inscriptionForm.append("address", document.getElementById("address").value);
  inscriptionForm.append("city", document.getElementById("city").value);
  inscriptionForm.append("phone", document.getElementById("phone").value);
  const errorTextBox = document.getElementById("errorTextBox");
  errorTextBox.innerText = "";
  fetch("/inscription-form", {
    method: "POST",
    body: JSON.stringify(Object.fromEntries(inscriptionForm.entries())),
    headers: { "Content-Type": "application/json" },
  }).then(async (res) => {
    let text = await res.text();
    const inscriptionObject = JSON.parse(text);
    if (inscriptionObject.granted) {
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      window.location.href = "/connexion";
    } else {
      errorTextBox.innerText = inscriptionObject.message;
    }
  });
}
