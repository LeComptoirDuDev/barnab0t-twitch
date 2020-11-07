# Barnab0t

> Compagnon de la messagerie Twitch, permet de collecter les questions et les afficher dans le live

## Commandes npm

```
//Installation des dépendances
yarn install

//Lancement des tests
yarn run test

//Build du typescript > js
yarn run build

//Lancement en mode dev avec refresh auto
yarn run dev

//Lancement (build + lancement)
yarn run start
```

## Principe

4 technologies différentes sont utilisées ici :
- tmi.js permettant d'intéragir avec la messagerie de twitch
- Socket.IO pour la mise à jour en temps réel des pages
- express pour servir les fichiers
- ejs pour le formatage des pages servies par express


## Structure

```
📁data //Stockage des questions

📁dist //Reçoit le contenu du build côté serveur

📁public //Contient le contenu statique servi par express
  📄app.js //Logique de la page des questions
  📄index.html //Page des questions

📁src
  📁config //Seul dossier de config à toucher !
    📄bot_actions.json //Paramétrage des actions déclenchables depuis l'interface
    📄config.json //Voir plus bas

📁test //Contient les tests jest

📁views //Contient les pages dynamiques
  📄overlay_question.ejs //Page d'overlay présente dans obs
```

## Configuration

La configuration s'effectue dans le dossier `src/config`, le contenu de ce dossier est ensuite copié dans le répertoire `dist/config` lors du build.

La configuration ressemble à :
```json
{
  "server": {
    "address": "localhost",
    "port": numeroDuPort
  },
  "botTwitch": {
    "botname": "Barnab0t",
    "oauth": "%SECRET%",
    "channels": ["sylvaintech"],
    "endWords": ["Bip.", "Bip!", "Bip", "DONE.", ";", "ACK"],
    "debug": true
  }
}
```