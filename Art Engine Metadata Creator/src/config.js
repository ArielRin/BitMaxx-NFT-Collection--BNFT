const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "SafuMaxx Reward NFT";
const description = "SafuMaxx Reward NFT. 200 in total, with 1 legendary NFT up for grabs. Visit safumaxx.com for all the up to date knowledge of SafuMaxx.";
const baseUri = "ipfs://QmcCPpWTL4FxwqXPJLPqRxBiucUd4ZtEtN2tJN7F4mZT98";

const solanaMetadata = {
  symbol: "SMR5",
  seller_fee_basis_points: 500, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://safumaxx.com/",
  creators: [
    {
      address: "0x93e792125649733D08050f04fBb395B5F6EA9945", //Ger0 provided
      share: 100,
    },
  ],
};
//modify to have clear layers to 200 creating metadata and rarities as requested
const layerConfigurations = [
  {
    growEditionSizeTo: 200,
    layersOrder: [
      { name: "Background" },
      { name: "Image" },
      { name: "Edition" },
    ],
  },
];

const shuffleLayerConfigurations = false;

const debugLogs = false;

const format = {
  width: 512,
  height: 512,
  smoothing: false,
};

const gif = {
  export: false,
  repeat: 0,
  quality: 100,
  delay: 500,
};

const text = {
  only: false,
  color: "#ffffff",
  size: 20,
  xGap: 40,
  yGap: 40,
  align: "left",
  baseline: "top",
  weight: "regular",
  family: "Courier",
  spacer: " => ",
};

const pixelFormat = {
  ratio: 2 / 128,
};

const background = {
  generate: true,
  brightness: "80%",
  static: false,
  default: "#000000",
};

const extraMetadata = {};

const rarityDelimiter = "#";

const uniqueDnaTorrance = 10000;

const preview = {
  thumbPerRow: 5,
  thumbWidth: 50,
  imageRatio: format.height / format.width,
  imageName: "preview.png",
};

const preview_gif = {
  numberOfImages: 5,
  order: "ASC", // ASC, DESC, MIXED
  repeat: 0,
  quality: 100,
  delay: 500,
  imageName: "preview.gif",
};

module.exports = {
  format,
  baseUri,
  description,
  background,
  uniqueDnaTorrance,
  layerConfigurations,
  rarityDelimiter,
  preview,
  shuffleLayerConfigurations,
  debugLogs,
  extraMetadata,
  pixelFormat,
  text,
  namePrefix,
  network,
  solanaMetadata,
  gif,
  preview_gif,
};
