# Halal Chiang Rai

A mobile-first web application for discovering and verifying halal restaurants
in Chiang Rai, Thailand. It also provides information about prayer facilities,
mosques, and details that help users plan their visits with confidence.

> This project is under development. Always verify halal status with the
> restaurant or relevant authority before dining.

## Key Features

- Search restaurants by name, dish, cuisine, area, and budget
- Discover restaurants in zones such as Mae Fah Luang University, Chiang Rai City Center, and Mae Sai
- View restaurant details, menus, prices, opening hours, contact information, and amenities
- Distinguish between `Halal Certified` and `Muslim-Friendly` venues with data provenance
- Save favorite restaurants for signed-in users
- Support Thai and English languages
- Google/OTP authentication (requires the backend and PostgreSQL)
- Record access logs for auditing and operational monitoring

## Technology

- **Frontend:** React, Vite, CSS
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Authentication:** Google OAuth and email OTP
- **Security:** Helmet, hashed session tokens, and PostgreSQL access logs

## Requirements

- Node.js 20 or later
- npm
- PostgreSQL 14 or later (only required for the backend and authentication)

## Install and Run the Frontend

```bash
git clone <repository-url>
cd MuslimRestaurantProject
npm install
npm run dev
```

Open the URL shown by Vite in the terminal, usually `http://localhost:5173`.

Useful commands:

```bash
npm run build       # Create a production build
npm run preview     # Preview the production build
npm run server      # Start the backend on port 3001
```

## Configure the Backend

Create a `.env` file in the project root with the following variables:

```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/halal_chiang_rai
GOOGLE_CLIENT_ID=your-google-client-id
SESSION_SECRET=use-a-secret-at-least-32-characters-long
SMTP_USER=your-gmail-address
SMTP_APP_PASSWORD=your-gmail-app-password
```

Create the database tables before starting the server:

```bash
psql "$DATABASE_URL" -f server/schema.sql
npm run server
```

Do not commit `.env` files or secrets to the repository.

## Project Structure

```text
src/
├── components/                 # Shared UI components
├── features/restaurants/       # Restaurant lists and details
├── pages/                      # Home, Search, Favorites, and Account pages
├── App.jsx                     # Main frontend state and routing
└── index.css                   # Global styles
server/
├── index.js                    # Express API and authentication
└── schema.sql                  # PostgreSQL schema
data_pipeline/                  # Restaurant data cleaning and merge scripts
.docs/                          # Requirements, design, and prototype documents
```

## Main User Journey

1. Open the app and select an area or allow location access.
2. Search or filter restaurants by name, area, cuisine, and budget.
3. Open a restaurant profile to view its menu, amenities, and halal status.
4. Review the data source before making a decision.
5. Save the restaurant as a favorite or navigate to the location.

## Documentation

- [Requirements specification](.docs/01-requirements/spec.md)
- [Product backlog](.docs/01-requirements/backlog.md)
- [Feature list](.docs/02-design/feature-list.md)
- [Design system](.docs/02-design/design-system.md)
- [Database schema](server/schema.sql)

## Primary User Roles

- **Muslim User** — Searches, verifies, and saves restaurants or facilities
- **Restaurant Owner** — Manages restaurant information and halal documents
- **System Admin** — Reviews data, verification documents, and user reports

# Data Pipeline

A data collection and processing pipeline for halal restaurant information.
It collects data from multiple sources, cleans and merges the records,
enriches missing coordinates, and exports the results as JSON.

## File Structure

```text
HalalRestaurant/
├── run_pipeline.py                 # Entry point that runs all steps in order
├── getData.py                      # Fetches restaurant data from OpenStreetMap
├── cleaning/                       # Data cleaning scripts
│   ├── google_map_clean.py         # Cleans Google Maps data
│   ├── overpass_clean.py           # Cleans OpenStreetMap data
│   ├── research_clean.py           # Cleans research data
│   ├── wongnai_clean.py            # Cleans Wongnai data
│   ├── db_utils.py                 # Database utility functions
│   └── Data/                       # Source data files, such as CSV files
│       ├── google/                 # Google Maps data
│       ├── wongnai/                # Wongnai data
│       └── Untitled spreadsheet - Sheet1.csv
├── merge_halal_data.py             # Merges cleaned data
├── enrich_coordinates.py           # Adds coordinates to records that need them
├── export_to_json.py               # Exports database data as JSON
├── halal.db                        # SQLite database
├── halal_restaurants.json          # Exported restaurant data
├── chiangrai_restaurants.json      # Data fetched from OpenStreetMap
├── results/                        # Output files
├── test.py                         # Test script
└── README.md                       # Project documentation
```

## Usage

### Requirements

- Python 3 (the project does not currently specify a minimum version)
- Internet access for retrieving OpenStreetMap data and geocoding coordinates

Install the required libraries:

```bash
python -m pip install pandas requests numpy geopy
pip install -r data_pipeline/requirements.txt
```

### Run the Pipeline

Open a terminal in the project directory and run:

```bash
python run_pipeline.py
```

`run_pipeline.py` runs the following steps in order:

1. Fetch data with `getData.py`
2. Clean data from Google Maps, OpenStreetMap, research sources, and Wongnai
3. Merge data with `merge_halal_data.py`
4. Enrich coordinates with `enrich_coordinates.py`
5. Export the data as `halal_restaurants.json` with `export_to_json.py`

### Output

- `halal.db` — SQLite database containing source and merged data
- `chiangrai_restaurants.json` — Raw OpenStreetMap data fetched by `getData.py`
- `halal_restaurants.json` — Restaurant data exported from the database to the project root
- `results/` — Directory for existing result files; the current export step writes JSON to the project root

If a pipeline step fails, the pipeline stops immediately. Missing script files
are reported and skipped.

To run an individual step, use `python data_pipeline/<filename>.py`. For example:

```bash
python data_pipeline/export_to_json.py
```
