const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

// delete build folder
const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath);

// read Campaign solidity code
const campaignPath = path.resolve(__dirname, "contracts", "Campaign.sol");
const source = fs.readFileSync(campaignPath, "utf8");
const output = solc.compile(source, 1).contracts;

// create buildfolder
fs.ensureDirSync(buildPath);

// iterate over content of compiled solidity code
// and store the contents in build folder
for (let contract in output) {
  fs.outputJSONSync(
    path.resolve(buildPath, contract.slice(1) + ".json"),
    output[contract]
  );
}
