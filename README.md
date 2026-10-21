# SST, Construction Gauthier

Module Santé et sécurité de la plateforme Opérations. **Prototype** : il sert de
référence de comportement avant la reconstruction dans Somtech.

> **Données fictives seulement.** Projets, employés, sous-traitants, constats et
> événements sont inventés. Le site est publié sur GitHub Pages, donc **public**.
> N'y mettez jamais un vrai événement SST : ce sont des renseignements personnels
> et de santé. Voir [DEPLOIEMENT.md](DEPLOIEMENT.md).

## Le principe : ACC capte, la plateforme gère

Le contremaître remplit ses formulaires dans ACC, comme aujourd'hui. Le module
les lit, en tire les constats et les actions, fait les rappels, tient les
registres et calcule les indicateurs. Rien n'est ressaisi.

## Ce que l'outil fait

- **Tableau de bord** : écarts ouverts, retards, inspections faites vs prévues,
  taux de fréquence (heures Maestro), culture de déclaration, formations à renouveler.
- **Écarts SST** : écarts d'inspection, presque-accidents, observations positives.
  Chaque constat porte une action, un responsable, une échéance selon la gravité.
- **Fiche d'un constat** : mesure immédiate, recherche de cause (5 pourquoi ou 6M),
  compilation des coûts, abonnés, preuve de correction, fermeture validée par
  quelqu'un d'autre que le responsable, vérification de l'efficacité à 30 jours.
- **Demandes** : améliorations du terrain, actions correctives, modifications de formulaires.
- **Audits** : programme, portée, référentiel, résultat, conclusion, constats liés.
- **Registre SST** : événements (déclaration, témoins, signatures, enquête, CNESST),
  pauses sécurité, fiches de données de sécurité. Accès restreint et journalisé.
- **Synchro ACC** : démonstration de la lecture des formulaires et de la création
  automatique des constats.
- **Équipements** : inspections et étalonnages (détecteurs de gaz, harnais, extincteurs).
- **Compétences** : matrice, preuves, sessions de formation, conflit avec l'affectation.
- **Sous-traitants** : documents exigés, note calculée, évaluation de fin de lot.
- **Gabarits ACC** : correspondance entre les champs des formulaires et les constats.

Le sélecteur « Vue de » en haut change d'utilisateur, pour voir les règles de
rôle (fermeture, accès au registre). L'interrupteur **Notes pour Somtech** affiche
les tables visées et les règles côté serveur, écran par écran.

## Sources de données : un champ, une source

| Donnée | Source maîtresse |
|---|---|
| Formulaires terrain, photos, FDS | ACC |
| Employés, cartes de compétence | Ma Place RH |
| Projets | Ops (Somtech) |
| Heures travaillées | Maestro |
| Constats, actions, registres | Ce module |

## Lien avec le module Qualité

SST et Qualité sont deux modules distincts dans la plateforme. Recommandation :
un moteur commun en arrière (constats, actions, rappels, abonnés, portail
sous-traitants), pour ne pas le développer deux fois.

## Contraintes du prototype

| Contrainte | Pourquoi |
|---|---|
| **Un seul fichier** `index.html` | Se copie, s'ouvre, se courriel sans installation |
| **Aucun appel réseau** | Les données ne quittent jamais le poste |
| **Aucun stockage navigateur** | L'outil ne laisse rien derrière lui |
| **Aucune bibliothèque externe** | Rien à mettre à jour, rien qui casse à distance |

Seule exception : la police Inter chargée depuis Google Fonts (charte Somtech).

## Fichiers

```
index.html            l'outil
GUIDE-TEST.md         pour l'équipe SST
DEPLOIEMENT.md        publication et hébergement privé
outils/verifier.mjs   vérification des invariants
```

## Vérifier avant de pousser

```
node outils/verifier.mjs
```
