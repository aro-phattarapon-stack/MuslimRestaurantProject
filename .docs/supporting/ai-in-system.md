# AI in the System

## Current System

The active recommendation interface is `src/components/AiRecommendForm/`,
rendered on Home by `src/pages/Home/HomePage.jsx`. It sends prompt text to
`src/App.jsx`, which calls the local functions in `src/utils/recommend.js`.

The implementation is rule-based:

- Short prompts matching a bundled restaurant name open the Search tab directly.
- Longer prompts are parsed for zone, budget, and cuisine keywords.
- `recommendRestaurants()` filters bundled records by zone, cuisine, minimum
  price, and searchable text, then ranks matches by name, zone, cuisine, and
  verified status.
- If exact preferences return no records, the app relaxes restrictions in a
  fallback chain and ultimately may show all bundled restaurants.

The current prompt handler does not call Gemini, OpenAI, or another external AI
provider. Opening hours shown in detail and search results are generated locally
from a deterministic rule in `recommend.js`; they are not live opening-status
data. `openNow` filtering is never satisfied because the recommendation mapper
does not check a live time for the restaurant.

`src/components/AiAssistantBox/AiAssistantBox.jsx` is present in the source tree
but is not imported by `src/App.jsx` or an active page component. It is inactive
and does not create an external AI integration. UI copy that refers to Gemini
or fallback behavior in `src/utils/i18n.js` is descriptive-only because no
provider SDK or network request exists.

## Data and User Impact

The local parser processes:

- Free-text prompt input, up to 500 characters in the active form
- Restaurant names and bundled restaurant fields
- Zone, cuisine, budget, and halal-related keywords
- Search text entered separately on the Search page

Prompt text is not transmitted to an external service and is not persisted in
browser storage. Results depend only on bundled data and deterministic matching
rules. A matching result or verification badge must not be presented as proof of
halal certification; the app still instructs users to confirm status directly
with the restaurant.

The feature should be labeled as a local recommendation parser to avoid
misleading users about an LLM or real-time availability. Accessibility controls
include an accessible prompt label and live status text for loading or messages.
The prompt is not the basis for any medical, legal, or financial decision.

## Future AI Integrations

Before adding an external model, the team must document and approve:

- Provider, model, deployment region, and contract
- Prompt and response data flows
- Inputs, retention, logging, deletion, and cross-border transfer
- API key storage and access control
- Terms and permitted data use
- Prompt-injection and abuse threats
- Hallucination and misinformation safeguards
- Accuracy testing with representative Thai and English prompts
- Human verification, especially for halal status and opening hours
- Accessibility behavior and user consent
- Timeout, provider-outage, and local fallback behavior
- Monitoring, incident response, and rollback

`.env.example` contains placeholder cloud-model configuration, but it is not
runtime configuration and must not be enabled until this review is complete.
