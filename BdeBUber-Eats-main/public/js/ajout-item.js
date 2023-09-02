function validerFormulaire () {
    let itemName = document.getElementById("item_name").value;
    let itemDescription = document.getElementById("description_item").value;
    let itemPrice = document.getElementById("prix_item").value;
    let itemQuantity = document.getElementById("quantite_item").value;

    // Vérifier que les champs ne sont pas vides
    if (itemName == "" || itemDescription == "" || itemPrice === "" || itemQuantity == "") {
        alert("Tous les champs doivent être remplis");
        return false;
    }

    // Vérifier que le prix et la quantité sont des nombres positifs
    if (isNaN(parseFloat(itemPrice)) || isNaN(parseFloat(itemQuantity))) {
        alert("Valeur numérique requise.");
        return false;
    }

    // Vérifier que le prix et la quantité sont des valeurs numériques et positives
    if (parseFloat(itemPrice) <= 0 || parseFloat(itemQuantity) <= 0) {
        alert("Valeur positive requise.");
        return false;
    }

    // Vérifier que le prix et la quantité ne contiennent que des chiffres et un point décimal
    if (!/^\d+(\.\d+)?$/.test(itemPrice) || !/^\d+$/.test(itemQuantity)) {
        alert("Veuillez saisir uniquement des nombres entiers positifs pour la quantité et un nombre réel positif pour le prix.");
        return false;
    }

    // Si toutes les validations passent, retourner true pour permettre l'envoi de la requête POST
    return true;
}