import "../styles/index.scss";

fetchData();

setInterval(fetchData, 60000);

const app = document.querySelector("#app");

const state = {
  currentCryptos: [],
  previousCryptos: [],
  favCryptoIds: JSON.parse(window.localStorage.getItem("favCryptoIds")) || [],
};

function fetchData() {
  fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur")
    .then(function (res) {
      res
        .json()
        .then(function (data) {
          state.previousCryptos = state.currentCryptos;
          state.currentCryptos = data;
          renderApp();
        })
        .catch(function (error) {});
    })
    .catch(function (error) {});
}

function renderApp() {
  app.innerHTML = null;
  renderFavCryptoList();
  renderCryptoList();
}

function renderFavCryptoList() {
  const favCryptoList = document.createElement("ul");
  favCryptoList.classList.add("fav__crypto__list");
  app.appendChild(favCryptoList);
  state.favCryptoIds.forEach(function (cryptoId) {
    const currentCrypto = state.currentCryptos.find((currentCrypto) => currentCrypto.id === cryptoId);
    const previousCrypto = state.previousCryptos.find((previousCrypto) => previousCrypto.id === cryptoId);
    favCryptoList.appendChild(createCrypto(currentCrypto, previousCrypto));
  });
}

function renderCryptoList() {
  const cryptoList = document.createElement("ul");
  cryptoList.classList.add("crypto__list");
  app.appendChild(cryptoList);
  state.currentCryptos.forEach(function (currentCrypto) {
    const isFavCrypto = state.favCryptoIds.some((cryptoId) => cryptoId === currentCrypto.id);
    if (isFavCrypto) return;
    const previousCrypto = state.previousCryptos.find((previousCrypto) => previousCrypto.id === currentCrypto.id);
    cryptoList.appendChild(createCrypto(currentCrypto, previousCrypto));
  });
}

function createCrypto(currentCrypto, previousCrypto) {
  const cryptoTag = document.createElement("li");

  cryptoTag.innerHTML = `
        <img src="${currentCrypto.image}">
        <h2>${currentCrypto.name}</h2>
        <span class="symbol">${currentCrypto.symbol.toUpperCase()}</span>
         `;

  const favCheckBox = document.createElement("input");
  favCheckBox.setAttribute("type", "checkbox");
  favCheckBox.classList.add("fav__checkbox");
  cryptoTag.prepend(favCheckBox);
  favCheckBox.addEventListener("change", function (e) {
    onCheckboxChange(e, currentCrypto);
  });
  const isFavCrypto = state.favCryptoIds.some((cryptoId) => cryptoId === currentCrypto.id);
  if (isFavCrypto) {
    favCheckBox.checked = true;
  }

  const formatedPrice = new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(
    currentCrypto.current_price
  );
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

function onCheckboxChange(e, currentCrypto) {
  if (e.target.checked) {
    state.favCryptoIds.push(currentCrypto.id);
    syncLocalStorage();
  } else {
    const favCryptoIdIndex = state.favCryptoIds.findIndex((cryptoId) => cryptoId === currentCrypto.id);
    state.favCryptoIds.splice(favCryptoIdIndex, 1);
    syncLocalStorage();
  }
  renderApp();
}

function syncLocalStorage() {
  window.localStorage.setItem("favCryptoIds", JSON.stringify(state.favCryptoIds));
}
