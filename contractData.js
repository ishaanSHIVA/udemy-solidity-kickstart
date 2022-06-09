export const abi = [
  {
    constant: true,
    inputs: [{ name: "", type: "uint256" }],
    name: "deployedCampaigns",
    outputs: [{ name: "", type: "address" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "getDeployedCampaigns",
    outputs: [{ name: "", type: "address[]" }],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [{ name: "minimum", type: "uint256" }],
    name: "createCampaign",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
];
export const FactoryContractAddress =
  "0xE29Af0c391c9F4f317C62f70D1C8CbFC301A8175";
