# 📖 Guide de Références : Création & Configuration de `technician_media`

Ce document récapitule l'historique de création, la structure, les règles d'intégrité et la configuration de l'agent de publication pour le dépôt **`technician_media`** au sein de l'architecture découplée à 3 dépôts (`verti`, `media`, `hori`).

---

## 🎯 1. Rôle de `technician_media` dans l'Architecture

Dans notre architecture décentralisée :
* **Type de dépôt :** Coffre-fort d'assets (Media Vault).
* **Mission :** Héberger les fichiers multimédias (images, audios, vidéos), fournir une source de vérité unique via un manifeste JSON (`media-manifest.json`), et garantir qu'aucun fichier référencé ne soit manquant lors de la publication.
* **Consommateur :** `technician_hori` lit le manifeste et télécharge/affiche les médias hébergés par `technician_media`.

---

## 🛠️ 2. Étape par Étape : Comment le Dépôt A Été Créé

### Étape 2.1 — Initialisation du Dépôt Git
1. Création du dépôt vide sur GitHub nommé `technician_media`.
2. Clonnage local dans un environnement Codespace :
   ```bash
   git clone [https://github.com/](https://github.com/)<utilisateur>/technician_media.git
   cd technician_media

   Étape 2.2 — Arborescence des Dossiers

Pour organiser proprement les ressources multimédias, l'arborescence suivante a été mise en place :

 technician_media/
├── audios/
│   └── episodes/         # Fichiers MP3, AAC pour le podcast
├── images/
│   ├── covers/           # Pochette d'album / couvertures d'épisodes (WebP/PNG)
│   └── slideshow/        # Cartes illustrées et visuels de la landing page
├── videos/               # Extraits vidéo ou bannières animées
├── media-manifest.json   # Source de vérité définissant la liste des ressources
└── media-manifest-publisher.agent.md  # Agent AI / Script de validation

📜 3. Le Manifeste Multimédia (media-manifest.json)

Le fichier media-manifest.json liste l'ensemble des médias officiellement disponibles pour l'application frontend.
Exemple de structure retenue :

{
  "version": "1.0.0",
  "lastUpdated": "2026-10-22T20:00:00Z",
  "episodes": [
    {
      "id": "ep1",
      "title": "Introduction au projet",
      "audioPath": "audios/episodes/ep1-intro.mp3",
      "coverPath": "images/covers/cover.webp",
      "duration": "12:34"
    }
  ]
}

🤖 4. L'Agent de Validation (media-manifest-publisher.agent.md)

Pour éviter que la landing page ne pointe vers des images ou des sons inexistants (liens cassés / 404), un agent de validation strict a été configuré dans le workspace de technician_media.
Règle d'or de l'agent :

    "Le manifeste ne peut être ni commité ni poussé sur la branche main tant que tous les fichiers physiques déclarés dans le JSON ne sont pas physiquement présents dans le dépôt."

Fonctionnement du contrôle :

    Lecture du JSON : L'agent extrait tous les chemins relatifs déclarés (audioPath, coverPath, etc.).

    Vérification d'existence : Pour chaque chemin, l'agent vérifie la présence du fichier sur le disque local (fs.existsSync ou test Bash).

    Verdict :

        ❌ Échec (Fichiers manquants) : Le push est bloqué. L'agent génère un rapport indiquant exactement quels fichiers manquent.

        ✅ Succès (Fichiers présents) : Le manifeste est validé, commité et poussé vers GitHub.

🧪 5. Cas d'Usage & Exemples de Test Pédagogiques

Ce scénario peut être reproduit avec les élèves pour leur faire pratiquer le contrôle d'intégrité :
Scénario de Test :

    Étape 1 (Provoquer l'erreur) : Ajouter une référence dans media-manifest.json vers un fichier non créé (ex: audios/episodes/ep2-demo.mp3).

    Étape 2 (Tentative de push) : Demander à l'agent de valider et de pousser.

    Résultat : L'agent refuse d'effectuer le commit et signale l'absence de ep2-demo.mp3.

    Étape 3 (Résolution) :

        Soit créer un fichier factice de 0 octet : touch audios/episodes/ep2-demo.mp3.

        Soit retirer la ligne du fichier JSON.

    Étape 4 (Validation) : Relancer la publication, qui réussit cette fois-ci.

🔧 6. Commandes Terminal Utiles pour la Gestion de Media
Synchroniser la documentation depuis Verti :

git remote add verti-source [https://github.com/dbpgrok/technician_verti.git](https://github.com/dbpgrok/technician_verti.git) 2>/dev/null || true
git fetch verti-source
git checkout verti-source/publish-media-assets -- README.md

Valider et Pousser manuellement les assets :

git add .
git commit -m "feat: publish updated media assets and manifest"
git push origin main

Stopper l'environnement Codespace de Media via CLI :

gh codespace stop -c $(gh codespace list --json name,repository -q '.[] | select(.repository | contains("technician_media")) | .name')