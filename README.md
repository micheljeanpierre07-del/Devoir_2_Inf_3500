# Atlas Mondial Interactif 🌍

**LOG3500 – Conception et programmation de sites Web I**  
Devoir 2 – Option 1 | Été 2026

---

## Description

Application web qui permet à l'utilisateur de rechercher un pays et d'afficher sa carte d'identité complète (drapeau, capitale, population, région, monnaie, langues) en interrogeant l'API REST Countries v3.1.

---

## Structure du projet

```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── app.js
└── README.md
```

---

## Technologies utilisées

- HTML5 sémantique
- CSS3 (Flexbox, Grid, Media Queries)
- JavaScript ES6+ (async/await, fetch, try/catch)
- API : [REST Countries v3.1](https://restcountries.com)

---

## Fonctionnalités

- Recherche d'un pays par nom
- Affichage du drapeau SVG officiel avec attribut `alt` accessible
- Affichage : nom, capitale, population formatée, région, monnaie, langues
- Indicateur de chargement (spinner animé)
- Gestion des erreurs (pays non trouvé, connexion impossible)
- Validation du champ avec messages d'erreur accessibles (aria-invalid, aria-describedby)
- Design responsive (mobile, tablette, ordinateur)
- Protection XSS : utilisation de `textContent` uniquement

---

## Utilisation

1. Ouvrir `index.html` dans un navigateur
2. Entrer le nom d'un pays en anglais (ex : `Haiti`, `France`, `Japan`)
3. Cliquer sur **Rechercher**
