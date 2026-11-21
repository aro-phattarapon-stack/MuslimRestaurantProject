# User Journey — Search and View a Halal Restaurant

**Actor:** Muslim User
**Status:** implemented frontend journey

1. **Open Home** — The user sees the Halal Chiang Rai header, local
   recommendation prompt, area shortcuts, and featured restaurants.
2. **Choose a starting point** — The user either selects an area shortcut or
   opens Search from the bottom navigation. No GPS permission is requested.
3. **Search** — The user types a restaurant, menu item, or area. Results update
   from the bundled dataset without opening a separate filter panel.
4. **Inspect a restaurant** — The user taps a result card to open the detail
   sheet with description, location, opening hours, menu, prices, and verified
   status when available.
5. **Choose an action** — The user saves the restaurant after signing in or
   opens the location in Google Maps.

## Alternative Paths

- If no restaurants match, the app shows an empty state and a reset action that
  clears the active search and recommendation state.
- If the user taps favorite while signed out, the sign-in modal opens.
- The user can switch Thai/English from the header or Account page.
- The user can open Favorites, Account, or About from the bottom navigation.

## Future Journey Extensions

GPS, map results, prayer facilities, certificate proof, owner workflows,
community reports, and trip planning are not part of the current executable
journey.
