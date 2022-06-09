const HDWalletProvider = require("@truffle/hdwallet-provider");
const Web3 = require("web3");

const compiledFactory = require("./build/CampaignFactory.json");
const fs = require("fs-extra");

const provider = new HDWalletProvider(
  "tennis cross exact piece dentist later fit salmon tree bar rib merit",
  "https://rinkeby.infura.io/v3/d10c1d8208ba4806877b7723f8016977"
);
const web3 = new Web3(provider);

function write(contract) {
  fs.writeFileSync(
    "../contractData.js",
    `export const abi = ${compiledFactory.interface}\nexport const FactoryContractAddress = "${contract}"`
  );
  console.log("written");
}

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account", accounts[0]);

  const result = await new web3.eth.Contract(
    JSON.parse(compiledFactory.interface)
  )
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "1000000", from: accounts[0] });
  console.log("Contract deployed to", result.options.address);
  write(result.options.address);
  provider.engine.stop();
};
deploy();
