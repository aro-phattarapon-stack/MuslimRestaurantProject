# Diagrams — Current Frontend Prototype

These diagrams describe the code that exists today. Backend, map, and
compliance services are shown as future boundaries rather than implemented
components.

## D1 — Current User Context

```mermaid
flowchart LR
    USER["Muslim User"]
    APP["Halal Chiang Rai<br/>React/Vite frontend"]
    DATA[("Bundled restaurant dataset")]
    LS[("Browser localStorage")]
    MAP["Google Maps URL"]

    USER -->|search, view, save| APP
    APP -->|read| DATA
    APP -->|account, session, language, favorites| LS
    APP -->|open directions| MAP
```

## D2 — Current UI Flow

```mermaid
flowchart TD
    HOME["Home"]
    SEARCH["Search"]
    DETAIL["Restaurant detail sheet"]
    FAV["Favorites"]
    ACCOUNT["Account"]
    AUTH["Local auth modal"]

    HOME -->|area shortcut / view all| SEARCH
    HOME -->|tap card| DETAIL
    SEARCH -->|tap card| DETAIL
    DETAIL -->|save| AUTH
    DETAIL -->|directions| MAP["Google Maps"]
    FAV -->|signed out| AUTH
    FAV -->|signed in| DETAIL
    ACCOUNT -->|sign out| HOME
    AUTH -->|success| ACCOUNT
```

## D3 — Current Component Architecture

```mermaid
flowchart TD
    APP["App.jsx<br/>state + tab switching"]
    HOME["HomePage"]
    SEARCH["SearchPage"]
    LIST["RestaurantList"]
    CARD["RestaurantCard"]
    DETAIL["RestaurantDetail"]
    FAV["FavoritesPage"]
    ACCOUNT["AccountPage"]
    AUTH["AuthModal"]
    RECOMMEND["recommend.js"]
    DATA["restaurants.js"]
    I18N["i18n.js"]

    APP --> HOME
    APP --> SEARCH
    APP --> FAV
    APP --> ACCOUNT
    APP --> AUTH
    APP --> DETAIL
    HOME --> LIST
    SEARCH --> LIST
    FAV --> LIST
    LIST --> CARD
    APP --> RECOMMEND
    RECOMMEND --> DATA
    APP --> I18N
```

## D4 — Search Activity

```mermaid
flowchart TD
    START((Start)) --> INPUT["Enter search query"]
    INPUT --> MATCH["recommendRestaurants()"]
    MATCH --> RESULTS{"Any matching restaurants?"}
    RESULTS -->|Yes| CARDS["Show ranked cards"]
    RESULTS -->|No| EMPTY["Show empty state"]
    CARDS --> DETAIL["Open detail sheet"]
    DETAIL --> ACTION{"Save or directions?"}
    ACTION -->|Save| LOGIN{"Signed in?"}
    LOGIN -->|No| AUTH["Open local auth modal"]
    LOGIN -->|Yes| STORE["Store favorite in localStorage"]
    ACTION -->|Directions| MAP["Open Google Maps"]
    EMPTY --> CLEAR["Clear search"]
    CLEAR --> MATCH
```
