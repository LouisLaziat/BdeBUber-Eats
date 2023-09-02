document.querySelectorAll("a.nav-link").forEach(function (link, index) {
  link.addEventListener("click", function (event) {
    event.preventDefault();
    if (index === 0) {
      fetch("/connexion").then(function () {
        window.location.assign("http://localhost:3000/connexion");
      });
    }
  });
});
