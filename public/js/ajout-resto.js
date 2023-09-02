const boutonAjouter = document.getElementById("boutonAjouter");
const inputNom = document.getElementById("resto_name");
const inputAdresse = document.getElementById("resto_address");
const inputTel = document.getElementById("resto_phone_number");
const inputEmail = document.getElementById("resto_email");
const inputSiteWeb = document.getElementById("site_web");
const inputHeureO = document.getElementById("resto_opening_hours");
const inputHeureF = document.getElementById("resto_closing_hours");
const inputVille = document.getElementById("resto_city");

boutonAjouter.addEventListener("click", function () { //Pour laisser l'admin savoir si tout les cases sont remplies correctement
    if (
        inputNom.value !== "" &&
        inputAdresse.value !== "" &&
        inputTel.value !== "" &&
        inputEmail.value !== "" &&
        inputSiteWeb.value !== "" &&
        inputHeureO.value !== "" &&
        inputHeureF.value !== "" &&
        inputVille.value !== ""
    ) {
        alert("Le restaurant a été inséré dans la base de donnée")
    } else {
        alert("Au moins un champs est vide ou invalide");
    }
});