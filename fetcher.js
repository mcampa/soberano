const fetch = require("isomorphic-unfetch");
let dolar = null;

async function getVesPerDollar() {
  const vesPromise = getBitcoinPrice("ves");
  const usdPromise = getBitcoinPrice("usd");
  const [vesPrice, usdPrice] = await Promise.all([vesPromise, usdPromise]);

  return (vesPrice / usdPrice).toFixed(2);
}

async function getBitcoinPrice(currency) {
  const res = await fetch(
    `https://localbitcoins.com/buy-bitcoins-online/${currency}/.json`
  );
  const data = await res.json();
  const prices = data.data.ad_list.map(({ data }) => Number(data.temp_price));
  const avg = prices.reduce((avg, price) => price + avg, 0) / prices.length;

  return avg;
}

async function startFetcher() {
  dolar = await getVesPerDollar();
  setTimeout(async () => startFetcher(), 1000 * 60 * 5); // 5 min
}

startFetcher();

module.exports = () => dolar;
