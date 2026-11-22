# Role Statement — Tech Lead

## What I Owned

As Tech Lead for the Halal Chiang Rai web app, I designed and automated our end-to-end Python and SQLite (`halal.db`) ETL pipeline under a zero-budget constraint. I ingested, cleaned, and merged data from four sources: Google Maps, Wongnai, Overpass, and local research. I fixed shifted CSV columns, duplicate-name join collisions, and filter mismatches by standardizing areas and cuisines to match our frontend dropdowns. I also built free Wongnai JSON-LD scraping and Nominatim geocoding scripts, exporting the final dataset to `restaurants.js`.

## Links to Evidence

* [Pipeline Orchestrator](./data_pipeline/run_pipeline.py)
* [Google Maps Cleaner](./data_pipeline/cleaning/google_map_clean.py)
* [Data Merger & Filter Mapper](./data_pipeline/merge_halal_data.py)
* [Wongnai JSON-LD Scraper](./data_pipeline/enrich_wongnai_free.py)
* [Coordinate Enricher](./data_pipeline/enrich_coordinates.py)
* [JS Exporter](./data_pipeline/export_to_json.py)
* [Final Dataset](./data_pipeline/results/restaurants.js)

## AI Disclosure

I used Gemini to draft regex parsers, debug pandas/SQLite errors, and structure the BeautifulSoup scraper. I reviewed, tested, and verified all scripts against our live UI and database, rejecting AI-guessed placeholders to protect real-world data accuracy.

## Reflection

Building this app with AI changed how I approached requirements, design, coding, testing, quality, and teamwork. **What got better** was coding and prototyping speed: AI generated regex parsers and our Wongnai JSON-LD scraper in minutes, letting me focus on pipeline architecture. **What got worse** was subtle integration and quality bugs from unverified AI assumptions. AI initially filled missing prices and hours with fake defaults and used mismatched keys (`area` vs. `zone`) and labels (`"อ.แม่สาย"` vs. `"แม่สาย"`), breaking our frontend filters. This showed me that testing, data integrity, security (keeping keys out of Git), and team alignment still rely on human discipline.

Today, I stand as a junior engineer evolving from a code writer into a system verifier. AI writes syntax faster, but it lacks local domain knowledge—like knowing Mae Fah Luang University is in Mueang Chiang Rai, not Mae Fa Luang District. My value lies in verifying real data and connecting requirements reliably across the stack.

Next year, I plan to master backend fundamentals, automated testing, and CI/CD so AI-assisted code is validated automatically. In five years, I aim to be a Senior Software or Data Engineer leading scalable systems, using AI for speed while owning architecture, quality, and security.