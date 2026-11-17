import { useMemo, useState } from "react";
import { Globe2, MapPin, UserRound } from "lucide-react";
import logoImg from "../logo-transparent.png";

import { cuisineTypes, restaurants, zones } from "./features/restaurants/data/restaurants";
import { parseRecommendationPrompt, recommendRestaurants } from "./features/restaurants/utils/recommend";
import BottomNav from "./components/BottomNav/BottomNav";
import AboutPage from "./pages/About/AboutPage";
import FavoritesPage from "./pages/Favorites/FavoritesPage";
import HomePage from "./pages/Home/HomePage";
import RestaurantDetail from "./features/restaurants/components/RestaurantDetail/RestaurantDetail";
import RestaurantList from "./features/restaurants/components/RestaurantList/RestaurantList";
import SearchPage from "./pages/Search/SearchPage";
import AccountPage from "./pages/Account/AccountPage";
import AuthModal from "./components/AuthModal/AuthModal";
import { translate, translateValue } from "./i18n";

const DEFAULT_FILTERS = { zone: "ALL", cuisine: "ทั้งหมด", budget: 300 };

export default function App() {
  const [activeTab, setActiveTab] = useState("home");
  const [query, setQuery] = useState("");
  const [zone, setZone] = useState(DEFAULT_FILTERS.zone);
  const [cuisine, setCuisine] = useState(DEFAULT_FILTERS.cuisine);
  const [budget, setBudget] = useState(DEFAULT_FILTERS.budget);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [account, setAccount] = useState(() => {
    try { return JSON.parse(localStorage.getItem("halal-session")) || null; } catch { return null; }
  });
  const [favorites, setFavorites] = useState(() => {
    try {
      const session = JSON.parse(localStorage.getItem("halal-session"));
      return session ? JSON.parse(localStorage.getItem(`halal-favorites-${session.email}`) || "[]") : [];
    } catch { return []; }
  });
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [language, setLanguage] = useState(() => {
    const storedLanguage = localStorage.getItem("halal-language");
    return storedLanguage === "en" ? "en" : "th";
  });
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  const filteredRestaurants = useMemo(() => recommendRestaurants(restaurants, { query, zone, cuisine, maxBudget: budget }), [query, zone, cuisine, budget]);
  const featuredRestaurants = useMemo(() => recommendRestaurants(restaurants, { zone: "ALL", maxBudget: 2000 }), []);
  const favoriteRestaurants = useMemo(() => restaurants.filter((restaurant) => favorites.includes(restaurant.id)), [favorites]);
  const t = (key) => translate(language, key);
  const localize = (value) => translateValue(language, value);

  function resetFilters() {
    setQuery("");
    setZone(DEFAULT_FILTERS.zone);
    setCuisine(DEFAULT_FILTERS.cuisine);
    setBudget(DEFAULT_FILTERS.budget);
  }

  function toggleFavorite(id) {
    if (!account) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }
    const nextFavorites = favorites.includes(id) ? favorites.filter((item) => item !== id) : [...favorites, id];
    setFavorites(nextFavorites);
    localStorage.setItem(`halal-favorites-${account.email}`, JSON.stringify(nextFavorites));
  }

  function changeLanguage(nextLanguage) {
    setLanguage(nextLanguage);
    localStorage.setItem("halal-language", nextLanguage);
  }

  function openAccount() {
    if (account) setActiveTab("account");
    else { setAuthMode("login"); setAuthOpen(true); }
  }

  function handleAuthenticated(nextAccount) {
    setAccount(nextAccount);
    setFavorites(JSON.parse(localStorage.getItem(`halal-favorites-${nextAccount.email}`) || "[]"));
    setAuthOpen(false);
    setActiveTab("account");
  }

  function signOut() {
    localStorage.removeItem("halal-session");
    setAccount(null);
    setFavorites([]);
    setActiveTab("home");
  }

  function handleAiRecommend(input) {
    const prompt = input.trim();
    if (!prompt) {
      setAiMessage(t("aiPromptHint"));
      return;
    }

    const localPreferences = parseRecommendationPrompt(prompt);
    applyRecommendation(localPreferences);
    setAiMessage("");
  }

  function applyRecommendation(preferences) {
    setQuery("");
    setZone(preferences.zone || DEFAULT_FILTERS.zone);
    setCuisine(preferences.cuisine || DEFAULT_FILTERS.cuisine);
    setBudget(Math.min(2000, Math.max(50, preferences.maxBudget ?? DEFAULT_FILTERS.budget)));
    setActiveTab("search");
  }

  function renderRestaurantList(list) {
    return <RestaurantList restaurants={list} favorites={favorites} onToggleFavorite={toggleFavorite} onSelect={setSelectedRestaurant} onReset={resetFilters} t={t} localize={localize} />;
  }

  return (
    <div className="app-shell">
      <header className="top-header">
        <button
          className="brand"
          type="button"
          onClick={() => setActiveTab("home")}
          aria-label="Halal Chiang Rai"
        >
          <span className="brand-icon">
            <img src={logoImg} alt="Halal Chiang Rai" />
          </span>
          <span className="brand-copy">
            <strong>Halal Chiang Rai</strong>
            <small>Discover with confidence</small>
          </span>
        </button>

        <div className="header-actions">
          <button
            className="language-button"
            type="button"
            onClick={() => changeLanguage(language === "th" ? "en" : "th")}
            aria-label={`${t("language")}: ${language === "th" ? t("english") : t("thai")}`}
          >
            <Globe2 size={16} />
            <span>{language === "th" ? "EN" : "TH"}</span>
          </button>
          <button
            className={`account-button ${account ? "signed-in" : ""}`}
            type="button"
            onClick={openAccount}
            aria-label={account ? t("account") : t("signIn")}
          >
            <UserRound size={17} />
            {account ? <span>{account.name.split(" ")[0]}</span> : null}
          </button>
          <span className="location-pill">
            <MapPin size={15} /> {t("location")}
          </span>
        </div>
      </header>

      <main className="main-content">
        {activeTab === "home" && (
          <HomePage t={t} query={query} onQueryChange={setQuery} onSearch={() => setActiveTab("search")} onAiRecommend={handleAiRecommend} aiMessage={aiMessage} aiLoading={aiLoading} zones={zones} selectedZone={zone} onZoneSelect={(nextZone) => { setZone(nextZone); setActiveTab("search"); }} onShowAll={() => setActiveTab("search")}>
            {renderRestaurantList(featuredRestaurants)}
          </HomePage>
        )}

        {activeTab === "search" && (
          <SearchPage t={t} localize={localize} query={query} onQueryChange={setQuery} onSearch={() => {}} showFilters={showFilters} onToggleFilters={() => setShowFilters((current) => !current)} zone={zone} onZoneChange={setZone} zones={zones} cuisine={cuisine} onCuisineChange={setCuisine} cuisineTypes={cuisineTypes} budget={budget} onBudgetChange={setBudget} onReset={resetFilters} resultCount={filteredRestaurants.length}>
            {renderRestaurantList(filteredRestaurants)}
          </SearchPage>
        )}

        {activeTab === "favorites" && (
          <FavoritesPage restaurants={favoriteRestaurants} favorites={favorites} loggedIn={Boolean(account)} onRequestLogin={openAccount} onToggleFavorite={toggleFavorite} onSelect={setSelectedRestaurant} onReset={resetFilters} t={t} localize={localize} />
        )}

        {activeTab === "about" && <AboutPage t={t} />}
        {activeTab === "account" && account && <AccountPage account={account} favoritesCount={favoriteRestaurants.length} language={language} onLanguageChange={changeLanguage} onSignOut={signOut} t={t} />}
      </main>

      <footer className="app-footer"><p>{t("footerTagline")}</p><p>{t("footerDisclaimer")}</p></footer>
      <BottomNav active={activeTab} onChange={(nextTab) => nextTab === "account" ? openAccount() : setActiveTab(nextTab)} t={t} />
      {selectedRestaurant && <RestaurantDetail t={t} localize={localize} restaurant={selectedRestaurant} isFavorite={favorites.includes(selectedRestaurant.id)} onToggleFavorite={toggleFavorite} onClose={() => setSelectedRestaurant(null)} />}
      {authOpen && <AuthModal mode={authMode} onClose={() => setAuthOpen(false)} onAuthenticated={handleAuthenticated} t={t} />}
    </div>
  );
}
