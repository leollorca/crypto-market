import "../styles/index.scss";

fetchData();

setInterval(fetchData, 60000);

const state = {
  currentCryptos: [],
  previousCryptos: [],
};

function fetchData() {
  fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur")
    .then(function (res) {
      res
        .json()
        .then(function (data) {
          state.previousCryptos = state.currentCryptos;
          state.currentCryptos = data;
          renderCryptoList();
        })
        .catch(function (error) {});
    })
    .catch(function (error) {});
}

function renderCryptoList() {
  const app = document.querySelector("#app");
  const cryptoList = document.createElement("ul");
  app.innerHTML = null;
  cryptoList.classList.add("crypto__list");
  app.appendChild(cryptoList);
  state.currentCryptos.forEach(function (currentCrypto) {
    const previousCrypto = state.previousCryptos.find((previousCrypto) => previousCrypto.id === currentCrypto.id);
    cryptoList.appendChild(createCrypto(currentCrypto, previousCrypto));
  });
}

function createCrypto(currentCrypto, previousCrypto) {
  const cryptoTag = document.createElement("li");
  const formatedPrice = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    currentCrypto.current_price
  );

  cryptoTag.innerHTML = `
        <span class="rank">${currentCrypto.market_cap_rank}</span>
        <img src="${currentCrypto.image}">
        <h2>${currentCrypto.name}</h2>
        <span class="symbol">${currentCrypto.symbol.toUpperCase()}</span>
         `;
  const price = document.createElement("div");
  price.classList.add("price");
  const arrow = document.createElement("span");
  const priceTag = document.createElement("span");
  priceTag.classList.add("price__tag");
  priceTag.innerHTML = formatedPrice;
  price.appendChild(arrow);
  price.appendChild(priceTag);
  cryptoTag.appendChild(price);

  if (!previousCrypto) {
    return cryptoTag;
  }

  const currentPrice = currentCrypto.current_price;
  const previousPrice = previousCrypto.current_price;

  if (currentPrice > previousPrice) {
    arrow.innerHTML = "↑";
    arrow.classList.add("green__arrow");
    priceTag.classList.add("green__price__tag");
  }

  if (currentPrice < previousPrice) {
    arrow.innerHTML = "↓";
    arrow.classList.add("red__arrow");
    priceTag.classList.add("red__price__tag");
  }

  const removeComparisonIndicator = setTimeout(function () {
    arrow.innerHTML = "";
    priceTag.classList.remove("green__price__tag", "red__price__tag");
  }, 5000);

  return cryptoTag;
}
