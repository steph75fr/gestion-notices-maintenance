# Cahier des charges — version de travail

## Objectif
Application web adaptée aux smartphones et ordinateurs, permettant de scanner un QR pour consulter les notices PDF personnalisées des matériels d'une entreprise.

## Organisation
Un site, plusieurs bâtiments (environ six), plusieurs étages et bureaux numérotés. Chaque catégorie comporte des modèles (marque, référence), auxquels sont associées les notices. Un équipement physique est une instance de modèle, avec un identifiant stable et éventuellement une localisation : site, bâtiment, étage, bureau.

## Administration V1
- Créer, modifier, rechercher bâtiments, étages, bureaux, catégories, modèles et équipements.
- Importer les données manuellement ou par lots CSV/Excel après validation et gestion des doublons.
- Importer les PDF réalisés à l'extérieur, publier une version, conserver les versions précédentes et pouvoir les restaurer.
- Enregistrer date, heure, auteur et commentaire de chaque changement documentaire.
- Distinguer super-administrateur et gestionnaire des notices, avec comptes individuels et autorisations vérifiées sur le serveur.

## QR codes
Deux modes au choix :
1. QR unique par équipement : repère un exemplaire précis, lié à sa localisation, modifiable sans réimpression.
2. QR partagé par modèle : identique pour tous les exemplaires du modèle, sans information de localisation.

Les QR renvoient vers une page stable, jamais directement vers le fichier PDF. Exports d'étiquettes imprimables. Une étiquette peut aussi afficher une référence lisible et une localisation, utile pour éviter les échanges accidentels de télécommandes entre bureaux.

## Accès public
Depuis un téléphone personnel via Internet, sans authentification. Consultation et téléchargement des PDF publiés. Ne pas exposer d'informations sensibles sur les bâtiments ou bureaux.

## Architecture pressentie
Cloudflare Workers, D1, R2 et GitHub. Restreindre l'administration par authentification forte, avec éventuellement des restrictions réseau. Utiliser une URL Cloudflare temporaire uniquement pour la phase de test ; décider d'une URL durable avant impression définitive.

## V2 prévue, non développée en V1
- Signalement d'incidents par équipement, sans connexion : nature de la panne, commentaire, jusqu'à trois photos et nom/e-mail professionnel facultatifs.
- Ticket avec localisation au moment du signalement, dates, statuts (nouveau, en cours, résolu, clôturé), journal d'interventions.
- Troisième rôle gestionnaire de maintenance.
- Tableau de bord de tickets et notifications e-mail activables séparément par gestionnaire, avec numéro du ticket, équipement, bâtiment, étage, bureau et liens protégés vers le détail.
- Statistiques de consultations et maintenance.

## Points à valider
Schéma exact des imports Excel, format des étiquettes, procédures de sécurité et de sauvegarde, gestion des accès et confidentialité des emplacements, domaine définitif et quotas/coûts Cloudflare.
