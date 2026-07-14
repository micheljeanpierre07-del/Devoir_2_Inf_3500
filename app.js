/**
 * app.js — Atlas Mondial Interactif
 * LOG3500 Devoir 2 | Option 1 | Été 2026
 *
 * API : REST Countries v3.1
 * https://restcountries.com/v5/name/{nom_du_pays}
 */

"use strict";

/* ============================================================
   1. Éléments du DOM
   ============================================================ */
const searchForm    = document.getElementById("searchForm");
const countryInput  = document.getElementById("countryInput");
const inputError    = document.getElementById("inputError");
const loader        = document.getElementById("loader");
const countryCard   = document.getElementById("countryCard");
const apiError      = document.getElementById("apiError");
const apiErrorText  = document.getElementById("apiErrorText");
const backLink      = document.getElementById("backLink");

const flagImg         = document.getElementById("flagImg");
const countryNameEl   = document.getElementById("countryName");
const infoName        = document.getElementById("infoName");
const infoCapital     = document.getElementById("infoCapital");
const infoPopulation  = document.getElementById("infoPopulation");
const infoRegion      = document.getElementById("infoRegion");
const infoCurrency    = document.getElementById("infoCurrency");
const infoLanguages   = document.getElementById("infoLanguages");

/* ============================================================
   2. Utilitaires
   ============================================================ */

/**
 * Formate un nombre en séparant les milliers par des espaces.
 * Ex : 11402533 → "11 402 533"
 * @param {number} n
 * @returns {string}
 */
function formatPopulation(n) {
  return n.toLocaleString("fr-FR");
}

/**
 * Extrait le nom et le symbole de la première monnaie trouvée.
 * @param {Object} currencies  – objet currencies du JSON REST Countries
 * @returns {string}
 */
function extractCurrency(currencies) {
  if (!currencies) return "—";
  const keys = Object.keys(currencies);
  if (keys.length === 0) return "—";
  const first = currencies[keys[0]];
  const name   = first.name   || keys[0];
  const symbol = first.symbol ? ` (${first.symbol})` : "";
  return name + symbol;
}

/**
 * Extrait la liste des langues parlées.
 * @param {Object} languages  – objet languages du JSON REST Countries
 * @returns {string}
 */
function extractLanguages(languages) {
  if (!languages) return "—";
  const list = Object.values(languages);
  if (list.length === 0) return "—";
  return list.join(", ");
}

/* ============================================================
   3. Affichage / masquage des blocs UI
   ============================================================ */

function showLoader() {
  loader.hidden      = false;
  countryCard.hidden = true;
  apiError.hidden    = true;
}

function hideLoader() {
  loader.hidden = true;
}

function showCountryCard() {
  countryCard.hidden = false;
  apiError.hidden    = true;
}

function showApiError(message) {
  apiError.hidden    = false;
  countryCard.hidden = true;
  // textContent uniquement — protection contre les failles XSS
  apiErrorText.textContent = message;
}

/* ============================================================
   4. Validation du champ
   ============================================================ */

function showInputError(message) {
  countryInput.setAttribute("aria-invalid", "true");
  countryInput.setAttribute("aria-describedby", "inputError");
  inputError.textContent = message;
  inputError.hidden = false;
}

function clearInputError() {
  countryInput.removeAttribute("aria-invalid");
  countryInput.removeAttribute("aria-describedby");
  inputError.textContent = "";
  inputError.hidden = true;
}

// Réinitialisation automatique dès que l'utilisateur tape
countryInput.addEventListener("input", () => {
  if (countryInput.value.trim().length > 0) {
    clearInputError();
  }
});

/* ============================================================
   5. Appel API (async / await + try…catch)
   ============================================================ */

/**
 * Interroge l'API REST Countries et retourne le premier résultat.
 * @param {string} countryName
 * @returns {Promise<Object>}  — objet pays brut du JSON
 */
async function fetchCountry(countryName) {
  const url = "https://api.restcountries.com/countries/v5?q=Canada&api-key=rc_live_3bf7698918d843a097afe3404d5fcbc6&pretty=1}`;
  const response = await fetch(url);

  // Vérifie le statut HTTP (ex : 404 si pays inconnu)
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("not_found");
    }
    throw new Error("network");
  }

  const data = await response.json();

  // Tableau vide = aucun résultat
  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("not_found");
  }

  return data[0];
}

/* ============================================================
   6. Injection des données dans la carte (textContent uniquement)
   ============================================================ */

/**
 * Remplit la carte pays avec les données de l'API.
 * N'utilise jamais innerHTML pour éviter tout risque XSS.
 * @param {Object} country  — objet pays brut
 */
function renderCountryCard(country) {
  // Drapeau SVG + alt descriptif
  const flagSrc = country.flags?.svg || country.flags?.png || "";
  const flagAlt = country.flags?.alt || `Drapeau de ${country.name?.common || "ce pays"}`;
  flagImg.src = flagSrc;
  flagImg.alt = flagAlt;

  // Nom commun (affiché en titre)
  const commonName = country.name?.common || "—";
  countryNameEl.textContent = commonName;

  // Ligne Nom
  infoName.textContent = commonName;

  // Capitale
  const capital = Array.isArray(country.capital) && country.capital.length > 0
    ? country.capital[0]
    : "—";
  infoCapital.textContent = capital;

  // Population formatée
  const pop = typeof country.population === "number"
    ? formatPopulation(country.population)
    : "—";
  infoPopulation.textContent = pop;

  // Région géographique
  infoRegion.textContent = country.region || "—";

  // Monnaie officielle
  infoCurrency.textContent = extractCurrency(country.currencies);

  // Langues parlées
  infoLanguages.textContent = extractLanguages(country.languages);

  // Lien "Retour" — pointe vers la région du pays
  backLink.textContent = `← Retour vers ${country.region || "la liste"}`;

  showCountryCard();
}

/* ============================================================
   7. Gestionnaire du formulaire
   ============================================================ */

searchForm.addEventListener("submit", async (event) => {
  // Empêche le rechargement de la page
  event.preventDefault();

  const countryName = countryInput.value.trim();

  // Validation : champ vide
  if (countryName.length === 0) {
    showInputError("Veuillez entrer le nom d'un pays avant de rechercher.");
    countryInput.focus();
    return;
  }

  clearInputError();
  showLoader();

  try {
    const country = await fetchCountry(countryName);
    hideLoader();
    renderCountryCard(country);

  } catch (error) {
    hideLoader();

    if (error.message === "not_found") {
      showApiError(
        "Aucun résultat trouvé pour cette recherche. Veuillez vérifier l'orthographe."
      );
    } else {
      showApiError(
        "Connexion impossible. Veuillez vérifier votre accès à internet."
      );
    }
  }
});

/* ============================================================
   8. Bouton "Retour"
   ============================================================ */

backLink.addEventListener("click", (event) => {
  event.preventDefault();
  countryCard.hidden = true;
  apiError.hidden    = true;
  countryInput.value = "";
  countryInput.focus();
});
