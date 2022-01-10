import fetch from "node-fetch";
export const getETHPrice = async () => {
  try {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=vnd&ids=ethereum"
    );
    const data = await response.json();
    const ethPrice = data[0].current_price;
    return parseFloat(parseFloat(ethPrice).toFixed(2));
  } catch (error) {
    console.log(error);
  }
};

export const getWEIPriceInVND = (usd, wei) => {
  return parseFloat(convertWeiToETH(wei) * usd).toLocaleString('it', {style : 'currency', currency : 'VND'});
};
export const getETHPriceInVND = (usd, eth) => {
  return parseFloat(eth * usd).toLocaleString('it', {style : 'currency', currency : 'VND'});
};

export const convertWeiToETH = (wei) => {
  return parseFloat(wei) / 1000000000000000000;
};
