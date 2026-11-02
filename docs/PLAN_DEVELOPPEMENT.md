# Plan de développement

## Étape 1 — Socle
Créer application web responsive, navigation publique et administration. Configurer développement local, validation des données, tests et futur déploiement Cloudflare.

## Étape 2 — Données
Modèle relationnel D1 : sites, bâtiments, étages, bureaux ; catégories, modèles, équipements ; notices et versions ; utilisateurs/rôles ; journal des actions. Prévoir la localisation facultative et les deux modes de QR.

## Étape 3 — Notices
Stockage privé des PDF dans R2, import contrôlé par administrateur/gestionnaire, publication et retour à une version antérieure. Lecture depuis la page publique du modèle ou équipement.

## Étape 4 — Inventaire
Gestion manuelle des emplacements et équipements, imports CSV/Excel avec aperçu, contrôles et signalement des doublons.

## Étape 5 — QR et étiquettes
Liens permanents par modèle ou équipement, génération des QR, planches imprimables et identifiants lisibles sur les étiquettes.

## Étape 6 — Qualité et mise en test
Vérifier les rôles, la sécurité des PDF, les sauvegardes, la confidentialité des données, l'accessibilité mobile et la stabilité des URLs. Déploiement provisoire sur Cloudflare, après configuration du compte.

## Plus tard — V2
Tickets de maintenance, photos, notifications e-mail, troisième rôle et tableaux de bord.
