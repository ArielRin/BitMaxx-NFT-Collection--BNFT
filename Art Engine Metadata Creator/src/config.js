const basePath = process.cwd();
const { MODE } = require(`${basePath}/constants/blend_mode.js`);
const { NETWORK } = require(`${basePath}/constants/network.js`);

const network = NETWORK.eth;

// General metadata for Ethereum
const namePrefix = "BitMaxx NFT Collection";
const description = "a limited edition series that pushes the boundaries of digital art and innovation. Each NFT in this exclusive collection is priced at 5000PWR, representing a fusion of cutting-edge technology and artistic expression. With a total supply restricted to just 200 minted on the groundbreaking Maxx Chain ";
const baseUri = "https://github.com/ArielRin/BitMaxx-NFT-Collection--BNFT/blob/master/Assets/Metadata/";

const solanaMetadata = {
  symbol: "BNFT",
  seller_fee_basis_points: 300, // Define how much % you want from secondary market sales 1000 = 10%
  external_url: "https://bitmaxx.com/",
  creators: [
    {
      address: "0xc690fE0d47803ed50E1EA7109a9750360117aa22", //Ger0 provided
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
