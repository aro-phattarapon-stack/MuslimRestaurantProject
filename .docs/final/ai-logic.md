# AI and Recommendation Logic

## Current Behavior

The current recommendation flow is local and deterministic. The Home prompt is
parsed by `parseRecommendationPrompt()` in `src/utils/recommend.js`, then
`recommendRestaurants()` filters and ranks the bundled restaurant data. A short
prompt matching a restaurant name is handled in `src/App.jsx`. No external AI
service is called by this flow.

## Limitations

- Results depend on the bundled dataset and the parser's supported terms.
- The behavior is not a generative AI response and should not be described as
  an external AI integration.
- TODO: Verify and document known limitations using current code and test
  evidence.

## Future Changes

TODO: If an external AI service is proposed, document its purpose, provider,
data sent, permissions, privacy review, safeguards, fallback behavior, and
approval before implementation.
