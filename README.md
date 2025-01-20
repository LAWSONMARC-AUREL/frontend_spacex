# SpaceX Frontend Project

## Objectifs
Ce projet a pour but de réaliser une application frontend utilisant VueJS et Typescript, qui présente les prochains lancements et les derniers lancements de SpaceX. L'application récupère les données de l'API SpaceX, les affiche, et permet une interaction avec un système de filtrage et de modales pour chaque lancement.

### Technologies utilisées :
- **VueJS 3** avec Composition API
- **Typescript**
- **API SpaceX v5** ( v5 pour les lancements et le reste en v4)
- **Tailwind CSS** pour la mise en page
- **GSAP (GreenSock Animation Platform)** pour les animations
- **Youtube Embed** pour afficher la vidéo d'une mission
- **Fetch API** pour récupérer les données

---

## Fonctionnalités principales :

### 1. **Prochain lancement :**
- Affichage du prochain lancement prévu avec son nom, la date, et un décompte en secondes mis à jour en temps réel.
- La date du lancement est récupérée depuis l'API SpaceX.

### 2. **Filtrage des lancements :**
- Un sélecteur permettant de filtrer les lancements par :
    - **Tous les lancements**
    - **Lancements réussis**
    - **Lancements échoués**
- Le filtrage est effectué **côté client** après récupération des données.

### 3. **Derniers lancements :**
- Liste des 10 derniers lancements en fonction du choix effectué dans le filtre. Les données sont récupérées et affichées dynamiquement à partir de l'API SpaceX.

### 4. **Modal avec détails du lancement :**
- Lorsqu'on clique sur un lancement dans la liste, une modale s'ouvre avec les détails suivants :
    - Nom du lancement
    - Date au format Jour/Mois/Année
    - Détails de la mission (en anglais)
    - Image de la mission
    - Lien vers un article de présentation
    - Switch/checkbox pour afficher la vidéo YouTube de la mission
    - Nom du lieu de lancement
    - Noms des chargements envoyés (payloads)
    - Noms des clients ayant envoyé un chargement

---

## Remarques :  
### Données non récentes à jours  
Concernant le compte à rebours en temps réel, j'ai d'abord utilisé la requête pour obtenir le prochain lancement avec next et upcoming, mais en effectuant une requête personnalisée, je me suis retrouvée avec un lancement datant de 2022, ce qui expliquait le temps négatif affiché dans le décompte.
### Filtrage des données :
Lors du développement de l'application, une question s'est posée concernant la manière de filtrer les lancements. Plus précisément, j'ai eu l'option entre deux solutions :

1. **Faire une requête différente pour chaque filtre** :
    - Dans cette approche, chaque fois qu'un utilisateur choisit un filtre, une nouvelle requête est envoyée à l'API pour récupérer les lancements correspondants (par exemple, une requête pour obtenir uniquement les "lancements réussis").
    - Cela aurait permis de filtrer directement côté serveur, mais cette solution présente plusieurs inconvénients :
        - **Latence accrue** : Chaque changement de filtre aurait nécessité une nouvelle requête, augmentant la latence de l'application.
        - **Surcharge du serveur** : Chaque filtre aurait entraîné une demande supplémentaire à l'API, augmentant la charge sur le serveur SpaceX.
        - **Complexité** : L'API SpaceX ne propose pas de mécanisme direct pour filtrer par statut de lancement ("réussi" ou "échoué"). Cela aurait impliqué des requêtes plus complexes, ou même des recherches en utilisant d'autres critères moins adaptés.

2. **Filtrer côté client après récupération des données** :
    - Cette méthode consiste à effectuer une seule requête pour récupérer **tous les lancements**, puis à filtrer localement ces données selon le filtre choisi par l'utilisateur (par exemple, "lancements réussis" ou "lancements échoués").
    - J'ai choisi cette méthode pour plusieurs raisons :
        - **Meilleures performances** : Une fois les données récupérées, il est très rapide de les filtrer côté client. Il n'est plus nécessaire d'attendre une nouvelle requête API à chaque changement de filtre, ce qui rend l'application plus fluide.
        - **Réduction des appels API** : Une seule requête est effectuée pour charger tous les lancements, ce qui réduit la charge sur l'API et la latence de l'application.
        - **Flexibilité** : Le filtrage côté client est plus flexible. Si l'API ne permet pas de filtrer par statut, il suffit d'utiliser les outils JavaScript comme `filter()` pour gérer cette logique directement dans le code.

Ainsi, j'ai opté pour la deuxième solution, car elle permet une meilleure expérience utilisateur, tout en étant plus simple à mettre en œuvre et moins gourmande en ressources.

---

## Difficultés rencontrées :

### 1. **Gestion des animations :**
J'ai eu des difficultés pour réaliser les animations, en particulier pour le lancement de la fusée. J'ai finalement opté pour l'utilisation de **GSAP** (GreenSock Animation Platform). GSAP est une bibliothèque JavaScript permettant de créer des animations fluides et performantes. J'ai choisi GSAP plutôt que les animations CSS traditionnelles, car elle offre plus de flexibilité, de performances, et permet des animations complexes comme le mouvement fluide et la gestion de la durée et des délais de manière plus précise.

### 2. **Problème avec la vidéo YouTube :**
Lorsque je changeais de modale, la vidéo YouTube ne s'affichait pas correctement. Cela était dû à la façon dont la vidéo était conditionnée par un `v-if` qui ne se réinitialisait pas correctement lorsque la modale était fermée et rouverte. Pour résoudre ce problème, j'ai ajouté une logique de contrôle pour forcer le rendu de la vidéo chaque fois que la modale est ouverte.

### 3. **Gestion de la taille des images :**
Un autre défi rencontré concerne la gestion de la taille des images d'illustration des missions. Certaines images étaient trop grandes, ce qui perturbait la mise en page. J'ai d'abord tenté de redimensionner les images directement avec CSS, mais cela n'a pas toujours été suffisant car certaines images ne s'ajustaient pas correctement à l'espace disponible dans la modale.

En dernier recours, j'ai utilisé la propriété `overflow` avec un conteneur qui permet de gérer les images débordantes. 

---

## Installation et Démarrage :

### 1. **Cloner le projet :**
Clonez ce repository sur votre machine locale :

Installez les dépendences
   ```bash
   npm install
```

Lancez le serveur
```bash
npm run dev
```
