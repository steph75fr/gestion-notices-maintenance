# Démarrage du prototype

Prérequis : Node.js récent (version LTS recommandée).

```bash
npm install
npm run dev
```

Ouvrir l'adresse locale affichée par Wrangler (généralement http://localhost:8787).

Pages disponibles :
- `/` : catalogue fictif.
- `/m/clim-a` : fiche modèle fictive.
- `/e/EQ-001` : fiche équipement fictive.
- `/admin` : aperçu **public, non sécurisé et en lecture seule**.

**Important :** cette étape n'implémente ni authentification, ni gestion des PDF, ni QR code, ni base D1 effective. Le fichier `db/schema.sql` est une première proposition de schéma, non appliquée à une base.

Ne pas utiliser de données de l'entreprise, ni déployer en production. Pour déployer sur Cloudflare, il faudra configurer le compte et les protections d'accès avant d'ajouter des fonctions d'administration réelles.
