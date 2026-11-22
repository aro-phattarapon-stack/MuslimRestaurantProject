# Data Sources and Permissions

## Current Application Data

Restaurant records used by the active frontend are bundled in
`src/services/restaurants.js`. The repository is not a live service:
`npm run dev` and `npm run build` use this prepared file.

The optional pipeline under `data_pipeline/` includes source collection,
cleaning, merge, enrichment, SQLite, and export scripts. It references:

| Source or asset | Repository location | Usage | Permission status |
|---|---|---|---|
| Google Maps-derived data | `data_pipeline/cleaning/Data/google/` | Raw restaurant records and cleaning | Source provenance and permitted use must be confirmed |
| OpenStreetMap / Overpass | `getData.py`, `overpass_clean.py` | Location and place enrichment | Applicable ODbL attribution and database terms must be reviewed |
| Wongnai | `cleaning/Data/wongnai/`, enrichment scripts | Restaurant records and web enrichment | Source terms and scraping/enrichment permission must be confirmed |
| Research CSV | `cleaning/Data/Untitled spreadsheet - Sheet1.csv`, `research_clean.py` | Research data cleaning | Original owner, consent, license, and redistribution terms are not documented |
| Prepared restaurant records | `src/services/restaurants.js` | Frontend display and filtering | Permission and provenance must be traced to source records |
| Logo and image assets | `src/assets/` | Application branding | Asset ownership and reuse license must be confirmed |

The pipeline output is not automatically copied into the frontend. Running
`python data_pipeline/run_pipeline.py` writes through pipeline scripts and may
also make live network requests. It does not establish permission for the
collected or redistributed data.

## Provenance and Permissions

Before publication or external reuse, assign an owner and record for every
source and bundled asset:

- Original provider and record URL or export identifier
- Collection date and collection method
- Applicable terms, license, and attribution requirements
- Lawful permission or other basis for use and redistribution
- Personal, sensitive, or copyrighted fields
- Allowed purpose and redistribution boundary
- Review date and approver

No source entry should be described as public-domain or licensed solely because
a file or URL is present in the repository.

## User Data

The current prototype stores browser-local data, not server-side account data:

- `halal-accounts`: display name, normalized email, and plaintext password
- `halal-session`: active account display name and email
- `halal-favorites-<email>`: saved restaurant IDs
- `halal-language`: Thai or English preference

This data is isolated by browser profile and origin. Clearing site data removes
it. Private browsing may prevent persistence. No analytics, backend database,
cookie session, server log, or consent-management record is implemented by the
frontend.

Before production use, separately document consent, purpose, retention,
deletion, export, access control, breach response, password handling,
cross-device synchronization, and any third-party data sharing. Do not collect
real passwords or sensitive personal information in the current prototype.
