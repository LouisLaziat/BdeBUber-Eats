import { UserConnected} from "./misc";
import { Order } from "./misc";

import nodemailer from "nodemailer";
import { SentMessageInfo } from 'nodemailer';
import logger from "./winstonconfig";

// Variables liées au calcul du prix
const tauxTPS: number = 0.05;
const tauxTVQ: number = 0.09975;

let totalAvantTaxes: number;
let taxesTPS: number;
let taxesTVQ: number;
let totalApresTaxes: number;
// FIN

// Variables liées au contenu du mail
let objetDuMail;

// Variable liée à la réponse de l'envoie
let reponse:string;



export function envoyerLeCourriel(infosUtilisateur: UserConnected, panier: Order, numeroCommande:string) {
    let contenuCourriel: string = preparerLeContenuDuCourriel(infosUtilisateur, numeroCommande, panier);
    return envoieDuCourriel(infosUtilisateur.email, contenuCourriel);

}

function preparerLeContenuDuCourriel(infosUtilisateur: UserConnected, numeroCommande:string, panier: Order) {
    objetDuMail = "Confirmation de commande chez BDEBUBER EATS";
    const debutParagraphe = "<p>";
    let corpsCouriel = `Bonjour <span style="color:#A52A2A;">${infosUtilisateur.prename} ${infosUtilisateur.name},</span><br>`;
    corpsCouriel += `Votre numéro de commande est le : <span style="color:#A52A2A;">${numeroCommande}</span><br>`;
    corpsCouriel += `Voici les détails de votre facture :<br>`;
    corpsCouriel += `----------<br>`;
    corpsCouriel += champDesItems(panier);
    corpsCouriel += `Total avant taxes : ${totalAvantTaxes.toFixed(2)}$.<br>`;
    corpsCouriel += `TPS PAYÉ : ${taxesTPS.toFixed(2)}$.<br>`;
    corpsCouriel += `TVQ PAYÉ : ${taxesTVQ.toFixed(2)}$.<br>`;
    corpsCouriel += `Total après taxes : ${totalApresTaxes.toFixed(2)}$.<br>`;
    corpsCouriel += `----------<br>`;
    corpsCouriel += `Merci d'avoir commandé chez <strong>BDEBUBER</strong> <span style="color:green;">EATS</span>.<br>`;
    corpsCouriel += `Votre commande est en cours de livraison.<br>`;
    corpsCouriel += `À bientôt,<br>`;
    corpsCouriel += `<strong>BDEBUBER</strong> <span style="color:green;">EATS</span>`;
    const finParagraphe = "</p>";

    let contenuCourriel = debutParagraphe + corpsCouriel + finParagraphe;
    
    return contenuCourriel;
}

function champDesItems(panier: Order) {
    let contenuDuChamp:string = "Item(s) : ";
    totalAvantTaxes = 0;

    panier.forEach((menuItem) => {
        contenuDuChamp += `${menuItem.name} : x${menuItem.quantity}, `;
        totalAvantTaxes += (menuItem.price * menuItem.quantity);
    });
    
    contenuDuChamp += "<br>";

    if(contenuDuChamp.endsWith(",<br>")){
        contenuDuChamp = contenuDuChamp.slice(0, -5) + ".<br>";
    }

    // Calculer taxes et prix total avant taxes
    // TPS
    taxesTPS = totalAvantTaxes * tauxTPS;
    // TVQ
    taxesTVQ = totalAvantTaxes * tauxTVQ;
    // Total après taxes
    totalApresTaxes = totalAvantTaxes + taxesTPS + taxesTVQ;
    
    return contenuDuChamp;
}

function envoieDuCourriel(adresseCourrielDuCLient: string, contenuCourriel: string) {
    
    // paramètres d'authentification pour le service de messagerie
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.BDEBUBER_EATS_GMAIL_MAIL_ADDRESS,
      pass: process.env.BDEBUBER_EATS_GMAIL_APPLICATION_PASSWORD
    }
  });

  // mise en place du contenu de l'email
  const mailOptions = {
    from: process.env.BDEBUBER_EATS_GMAIL_MAIL_ADDRESS,
    to: adresseCourrielDuCLient,
    subject: 'Confirmation de commande chez BDEBUBER EATS',
    html: contenuCourriel,
    // html: '<h1>Bonjour monsieur</h1> <p style="color:green;">Merci d\'davoir passé une commande.</p>',
}

  // envoie de l'email
  transporter.sendMail(mailOptions, (error: any, info: SentMessageInfo) => {
    if (error) {
        logger.info(error);
        reponse = 'Une erreur est survenue lors de l\'envoie de l\'email.';
    } else {
      logger.info('Email envoyé: ' + info.response);
      reponse = 'Le reçu vous est envoyé avec succès dans votre boîte de réception.';
    }
  })
  
  return reponse;
}