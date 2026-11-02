# Gestion Notices & Équipements

Application web responsive de consultation de notices PDF par QR code, adaptée à un parc de matériels répartis entre plusieurs bâtiments, étages et bureaux.

## V1
- Catalogue de catégories et modèles (télécommandes de climatisation, vidéoprojecteurs, informatique, etc.).
- Structure du site : bâtiments → étages → bureaux.
- Inventaire des équipements physiques avec localisation facultative.
- Notices PDF personnalisées importées, avec versions, dates et auteur.
- Consultation sur téléphone ou ordinateur par QR code sans compte pour les salariés.
- Génération et export de QR codes en étiquettes imprimables.
- Deux modes de QR : **par équipement** (localisation associée) ou **par modèle** (sans localisation).
- Administration avec comptes individuels, super-administrateur et gestionnaires des notices.
- Saisie progressive et import CSV/Excel de l'inventaire.

## V2 — ultérieure
Signalements de pannes, photos, tickets de maintenance, rôle maintenance, statistiques et notifications e-mail configurables.

## Principes
- Le QR pointe vers une URL stable de l'application, et non directement vers un PDF.
- Plusieurs équipements peuvent partager la même notice de modèle.
- Mettre à jour une notice ou déplacer un équipement ne modifie pas son QR.
- Les QR définitifs doivent utiliser une adresse pérenne ; les URL Cloudflare temporaires sont réservées aux tests.

## Technique
Cloudflare Workers (web/API), D1 (base de données), R2 (PDF), GitHub (code). Aucun déploiement Cloudflare réalisé pour l'instant. Sécurité, sauvegardes et conformité à valider avant production.

Voir [le cahier des charges](docs/CAHIER_DES_CHARGES.md) et [le plan de développement](docs/PLAN_DEVELOPPEMENT.md).
