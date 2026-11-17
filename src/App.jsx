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

  // AI recommendation state is used by the Home page.
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessage, setAiMessage] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [extraPreferences, setExtraPreferences] = useState({});

  // <-- 2. ส่ง extraPreferences เข้าไปกรองร้านด้วย
  const filteredRestaurants = useMemo(
    () =>
      recommendRestaurants(restaurants, {
        query,
        zone,
        cuisine,
        maxBudget: budget,
        ...extraPreferences,
      }),
    [query, zone, cuisine, budget, extraPreferences]
  );

  const featuredRestaurants = useMemo(
    () => recommendRestaurants(restaurants, { zone: "ALL", maxBudget: 2000 }),
    []
  );
  const favoriteRestaurants = useMemo(
    () => restaurants.filter((restaurant) => favorites.includes(restaurant.id)),
    [favorites]
  );

  const t = (key) => translate(language, key);
  const localize = (value) => translateValue(language, value);

  // <-- 3. ล้างค่า aiPrompt และ extraPreferences เมื่อกด Reset
  function resetFilters() {
    setQuery("");
    setZone(DEFAULT_FILTERS.zone);
    setCuisine(DEFAULT_FILTERS.cuisine);
    setBudget(DEFAULT_FILTERS.budget);
    setExtraPreferences({});
    setAiPrompt("");
    setAiMessage("");
  }

  function toggleFavorite(id) {
    if (!account) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }
    const nextFavorites = favorites.includes(id)
      ? favorites.filter((item) => item !== id)
      : [...favorites, id];
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

  // Apply AI recommendations from the Home page.
  async function handleAiRecommend(input) {
    const prompt = (input ?? aiPrompt).trim();
    setAiPrompt(prompt);

    if (!prompt) {
      setAiMessage(t("aiPromptHint"));
      return;
    }

    // ตรวจสอบเฉพาะกรณีที่พิมพ์ "ชื่อร้านตรงๆ" และเป็นคำสั้นๆ
    const isShortQuery = prompt.split(/\s+/).length <= 3 && prompt.length <= 25;
    if (isShortQuery) {
      const normalizedPrompt = prompt.toLowerCase();
      const nameMatched = restaurants.filter((r) =>
        [r.name, r.nameTh, r.nameEn].filter(Boolean).some((n) => n.toLowerCase().includes(normalizedPrompt))
      );

      if (nameMatched.length > 0) {
        setQuery(prompt);
        setZone("ALL");
        setCuisine("ทั้งหมด");
        setBudget(2000);
        setExtraPreferences({});
        setAiMessage("");
        setActiveTab("search");
        return;
      }
    }

    const preferences = parseRecommendationPrompt(prompt);
    applyRecommendation(preferences);
    setAiLoading(false);
    setAiMessage("");
  }

  // <-- 5. อัปเดต applyRecommendation ให้รองรับ openNow, halalOnly, requiredAmenities
  function applyRecommendation(preferences) {
    const candidatePreferences = {
      query: preferences.keyword || "",
      zone: zones.some((z) => z.value === preferences.zone) ? preferences.zone : DEFAULT_FILTERS.zone,
      cuisine: cuisineTypes.includes(preferences.cuisine) ? preferences.cuisine : DEFAULT_FILTERS.cuisine,
      maxBudget: Math.min(2000, Math.max(50, Number(preferences.maxBudget) || DEFAULT_FILTERS.budget)),
      openNow: Boolean(preferences.openNow),
      halalOnly: Boolean(preferences.halalOnly),
      requiredAmenities: preferences.requiredAmenities || [],
    };

    const fallbackChain = [
      candidatePreferences,
      { ...candidatePreferences, openNow: false, requiredAmenities: [] },
      { ...candidatePreferences, query: "", openNow: false, requiredAmenities: [] },
      { ...candidatePreferences, query: "", maxBudget: 2000, openNow: false, requiredAmenities: [] },
      { ...candidatePreferences, query: "", zone: DEFAULT_FILTERS.zone, maxBudget: 2000, openNow: false, requiredAmenities: [] },
      { query: "", zone: DEFAULT_FILTERS.zone, cuisine: DEFAULT_FILTERS.cuisine, maxBudget: 2000 },
    ];

    const appliedPreferences =
      fallbackChain.find((candidate) => recommendRestaurants(restaurants, candidate).length > 0) ||
      candidatePreferences;

    setQuery(appliedPreferences.query);
    setZone(appliedPreferences.zone);
    setCuisine(appliedPreferences.cuisine);
    setBudget(appliedPreferences.maxBudget);
    setExtraPreferences({
      openNow: appliedPreferences.openNow,
      halalOnly: appliedPreferences.halalOnly,
      requiredAmenities: appliedPreferences.requiredAmenities,
    });
    setActiveTab("search");

    return {
      ...appliedPreferences,
      relaxed: appliedPreferences !== candidatePreferences,
    };
  }

  function renderRestaurantList(list) {
    return (
      <RestaurantList
        restaurants={list}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
        onSelect={setSelectedRestaurant}
        onReset={resetFilters}
        t={t}
        localize={localize}
      />
    );
  }

  // Keep the AI props together for the Home page.
  const sharedAiProps = {
    aiPrompt,
    onAiPromptChange: setAiPrompt,
    onAiRecommend: handleAiRecommend,
    aiMessage,
    aiLoading,
    onClearAi: resetFilters,
  };

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
          <HomePage
            t={t}
            query={query}
            onQueryChange={setQuery}
            onSearch={() => setActiveTab("search")}
            {...sharedAiProps} // <-- ส่ง AI Props ซิงค์หน้า Home
            zones={zones}
            selectedZone={zone}
            onZoneSelect={(nextZone) => {
              setZone(nextZone);
              setAiMessage("");
              setActiveTab("search");
            }}
            onShowAll={() => {
              resetFilters();
              setActiveTab("search");
            }}
          >
            {renderRestaurantList(featuredRestaurants)}
          </HomePage>
        )}

        {activeTab === "search" && (
          <SearchPage
            t={t}
            query={query}
            onQueryChange={setQuery}
            onSearch={() => {}} // ช่อง SearchBar ปกติใช้กรองชื่อร้านแบบ Real-time ผ่าน query
            resultCount={filteredRestaurants.length}
          >
            {renderRestaurantList(filteredRestaurants)}
          </SearchPage>
        )}

        {activeTab === "favorites" && (
          <FavoritesPage
            restaurants={favoriteRestaurants}
            favorites={favorites}
            loggedIn={Boolean(account)}
            onRequestLogin={openAccount}
            onToggleFavorite={toggleFavorite}
            onSelect={setSelectedRestaurant}
            onReset={resetFilters}
            t={t}
            localize={localize}
          />
        )}

        {activeTab === "about" && <AboutPage t={t} />}
        {activeTab === "account" && account && (
          <AccountPage
            account={account}
            favoritesCount={favoriteRestaurants.length}
            language={language}
            onLanguageChange={changeLanguage}
            onSignOut={signOut}
            t={t}
          />
        )}
      </main>

      <footer className="app-footer">
        <p>{t("footerTagline")}</p>
        <p>{t("footerDisclaimer")}</p>
      </footer>

      <BottomNav
        active={activeTab}
        onChange={(nextTab) => (nextTab === "account" ? openAccount() : setActiveTab(nextTab))}
        t={t}
      />

      {selectedRestaurant && (
        <RestaurantDetail
          t={t}
          localize={localize}
          restaurant={selectedRestaurant}
          isFavorite={favorites.includes(selectedRestaurant.id)}
          onToggleFavorite={toggleFavorite}
          onClose={() => setSelectedRestaurant(null)}
        />
      )}

      {authOpen && (
        <AuthModal
          mode={authMode}
          onClose={() => setAuthOpen(false)}
          onAuthenticated={handleAuthenticated}
          t={t}
        />
      )}
    </div>
  );
}