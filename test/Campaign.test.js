const Web3 = require("web3");
const assert = require("assert");
const ganache = require("ganache-cli");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/CampaignFactory.json");
const compiledCampaign = require("../ethereum/build/Campaign.json");

let accounts;
let factory;
let campaign;
let campaignAddress;
const minimumContribution = "100";

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  //   create new contract => .deploy({ data : {{bytecode}} })
  factory = await new web3.eth.Contract(JSON.parse(compiledFactory.interface))
    .deploy({ data: compiledFactory.bytecode })
    .send({ from: accounts[0], gas: "1000000" });

  await factory.methods
    .createCampaign(minimumContribution)
    .send({ from: accounts[0], gas: "1000000" });

  [campaignAddress] = await factory.methods.getDeployedCampaigns().call();

  //   getting contract from address then second arg
  campaign = await new web3.eth.Contract(
    JSON.parse(compiledCampaign.interface),
    campaignAddress
  );
});
describe("Campaigns ", () => {
  it("deploys a factory and contract", () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it("marks a caller the manager of Campaign", async () => {
    // console.log(campaign.methods.manager);
    manager = await campaign.methods.manager().call();
    assert.equal(manager, accounts[0]);
  });

  it("allows people to contribute and mark them as approvers", async () => {
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: String(web3.utils.toWei("5", "ether")),
    });
    const approved = await campaign.methods
      .approvers(String(accounts[1]))
      .call();
    assert(approved);
  });

  it("requires minimum contribution", async () => {
    try {
      await campaign.methods.contribute().send({
        from: accounts[1],
        value: String(web3.utils.toWei("50", "gwei")),
      });
      assert(false);
    } catch (err) {
      assert(true);
    }
  });

  // function createRequest(
  //     string description,
  //     uint256 value,
  //     address recipient
  // )

  it("allows manager to make payment request", async function () {
    await campaign.methods
      .createRequest("buy 10 macbook pros", "20", accounts[2])
      .send({
        from: accounts[0],
        gas: 3000000,
      });
    const request = await campaign.methods.requests(0).call();
    assert(request.recipient == accounts[2]);
  });

  it("finalize and approve request", async function () {
    // createRequest
    // console.log("createRequest!!!");
    await campaign.methods
      .createRequest(
        "buy 10 macbook pros",
        String(web3.utils.toWei("20", "ether")),
        accounts[2]
      )
      .send({
        from: accounts[0],
        gas: 3000000,
      });
    // console.log("createRequest...");

    // contribute
    // console.log("contribiting!!!");
    await campaign.methods.contribute().send({
      from: accounts[1],
      value: String(web3.utils.toWei("5", "ether")),
      gas: 1000000,
    });
    await campaign.methods.contribute().send({
      from: accounts[4],
      value: String(web3.utils.toWei("15", "ether")),
      gas: 1000000,
    });
    await campaign.methods.contribute().send({
      from: accounts[3],
      value: String(web3.utils.toWei("28", "ether")),
      gas: 1000000,
    });
    // console.log("contribited...");

    // approve Request
    // console.log("approve Request!!!");

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
    });
    await campaign.methods.approveRequest(0).send({
      from: accounts[4],
    });
    await campaign.methods.approveRequest(0).send({
      from: accounts[3],
    });
    // console.log("approve Request...");

    // finalize
    // console.log("finalize!!!");

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
    });

    // console.log("finalized...");

    const balance = await web3.eth.getBalance(accounts[2]);
    // console.log("balance: " + balance);

    assert(balance == web3.utils.toWei("120", "ether"));
  });
});
