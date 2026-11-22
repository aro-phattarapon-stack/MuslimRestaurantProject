# User Guide

## Start and Navigate

1. Open the app and use the bottom navigation to move between Home, Search,
   Favorites, and Account.
2. On Home, choose an area card or use "View all" to show the bundled restaurant
   list.
3. Use the screen header to switch between Thai and English.

## Search and Filters

1. Open Search and enter a restaurant name, menu item, district, or area.
2. The results update as you type.
3. Use Reset filters to clear the search, zone, cuisine, and budget selections.
4. On Home, enter an area, budget, or craving in the recommendation prompt.
   The current prototype parses the prompt locally and opens matching Search
   results; it does not send the prompt to an external AI service.

If no restaurant matches the prompt or filters, the app relaxes the restrictions
or shows a no-results message with options to adjust or clear the filters.

## Restaurant Details

Select a restaurant card to open its details. The dialog may show:

- Cuisine, price level, and address or district
- Verified status
- Description and opening hours
- Menu items and available prices
- A save button and a Google Maps directions button

Restaurant information is bundled with the prototype. Confirm the halal status
and opening information directly with the restaurant before visiting.

## Favorites and Account

The prototype requires a browser-local account to save favorites.

1. Select the heart on a restaurant card or in its details, or open Favorites
   to start sign-in.
2. Choose Create account and enter a display name, email, and password of at
   least six characters.
3. Sign in later using the same email and password in the same browser profile.
4. Open Account to view the saved count or sign out.

Account and favorite data are stored in `localStorage` in the current browser.
They are not synchronized across devices or browser profiles, and clearing site
data removes them. This is a prototype account system, not a secure or
production authentication service.

Do not use real passwords or sensitive personal information in the prototype.

## Directions

Select Directions in a restaurant detail dialog to open the restaurant in
Google Maps. Google Maps is a separate site and may require a network connection.

## Keyboard and Screen Reader Use

- Use Tab and Shift+Tab to move between controls.
- Use Enter or Space to activate buttons.
- Close a restaurant or account dialog with its close control or by selecting
  outside it.
- The language control and account button identify their current purpose
  through accessible labels.
