# BdebUber Eats

BdebUber Eats est une application créé pour offrir un service de livraison alimentaire à des utilisateurs. À travers cette application, les utilisateurs peuvent, chercher, sélectionner et acheter les plats qu'ils désirent.

## Instructions d'utilisation

Pour utiliser l'application, un utilisateur, doit:

- Créer un compte avec ses informations
- Se connecter sur le site Web de BdebUber Eats
- Trouver un restaurant qui est à son goût
- Choisir les items qu'il trouve intéressants
- Placer la commande

## Installation

Pour commencer à utiliser l'application BdebUber Eats il vous faut:

- Git Bash (https://git-scm.com/downloads)
- La version la plus récente de NodeJS (https://nodejs.org/en/download)

Après avoir copié le dépôt Git sur ce répertoire:

```bash
git clone https://github.com/YoussefHamdouni/BdeBUber-Eats.git
```

Il va falloir ajouter un nouveau document .env dans le répertoire server

```bash
cd .\server\
```

Vous créer un document qui n'a aucun nom et seulement son type de fichier qui va être .env.

Ensuite, vous mettez ces informations dans le document

```bash
DB_URI = mongodb+srv://root:6tEFbBsor9EiwJce@cluster0.tb7vifx.mongodb.net/test

BDEBUBER_EATS_GMAIL_MAIL_ADDRESS = bdebubereats@gmail.com

BDEBUBER_EATS_GMAIL_APPLICATION_PASSWORD = zkffoziropkalyax

STRIPE_SECRET_KEY = sk_test_51MwUjwL7pEAyW4Q1FwAGjPmrVSk6rbfOOPxkgy5rXvJAlJFHv9eUDJrGmx91Am6p4Ih7LtlnOZH9s1sNOm3w7HVR007fDAWPl1

PAYPAL_CLIENT_ID = AfrDRYZTq6JDBUq9Pt-KX8LdceAmknZEPdc5UiIyU9iwsPivAf9yQinMhNDAz7tCvMXBwr6KQTy_hgkz
```

Finalement, il faut seulement installer les dépendances nécessaires et démarrer l'application.

```bash
cd .\server\
npm install
npm start
```

Vous pouvez maintenant accédez à la page indexe du site web via http://localhost:3000
