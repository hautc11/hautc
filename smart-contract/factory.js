import web3 from "./web3";
import CampaignFactory from "./build/CampaignFactory.json";

const instance = new web3.eth.Contract(
  JSON.parse(CampaignFactory.interface),
  "0xfd6d40cc25f44c366E4CD94b0740D422D8118bbf"
);

export default instance;
