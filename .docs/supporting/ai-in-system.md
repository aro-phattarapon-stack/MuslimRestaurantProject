# AI in the System

## Current System

The recommendation prompt currently uses a local rule-based parser and ranking
logic in `src/utils/recommend.js`. It does not send prompts to an external AI
provider. The separate `src/components/AiAssistantBox/` component is present in
the source tree; TODO: confirm whether it is used or document it as inactive
after checking application references.

## Data and User Impact

TODO: Document the inputs processed by the current parser and verify any
privacy, accessibility, or user-impact statements against implementation.

## Future AI Integrations

TODO: Record provider, data flows, permissions, risk review, safeguards,
fallback, and approval before any external integration is implemented.
