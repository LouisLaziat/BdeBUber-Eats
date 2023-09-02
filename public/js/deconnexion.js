function disconnect() {
  fetch("/disconnect", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  }).then(async (res) => {
    let text = await res.text();
    const discObject = JSON.parse(text);
    if (discObject.disconnected) {
      localStorage.removeItem("user");
      localStorage.removeItem("cart");
      window.location.href = "/connexion";
      localStorage.clear();
    } else {
      console.log("Erreur de déconnexion");
    }
  });
}