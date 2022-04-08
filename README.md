# Crypto Market

- Refresh market every 1 minute (max 50 calls/min)

## Getting started

1. Type `npm install` in the terminal to install the project's dependencies.
2. Type `npm start` in the terminal to start the project.
3. Open http://localhost:3000 in the browser. Each changes in `.js` and `.css` files will be reflected in the browser without the need to refresh the page.

## User stories

### 01

_As a user, I can vizualize the list of cryptocurrecies so I can keep track of their market data._

#### Acceptance criteria

- The 100 cryptocurrencies with the highest market cap should be listed.
- The cryptocurrencies should be listed in descending order of market cap.
- For each cryptocurrency, the following information should be displayed:

  - Logo
  - Name
  - Symbol
  - Price

### 02

_As a user, I want the cryptocurrecies market data to update frequently so I can keep track of their market data in realtime._

#### Acceptance criteria

- Each 1 minute, cryptocurrecies market data should update.
