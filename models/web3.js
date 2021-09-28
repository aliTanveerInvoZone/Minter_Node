const { create } = require("ipfs-http-client");
const { format } = require("prettier");
const Web3 = require("web3");
var HDWalletProvider = require("truffle-hdwallet-provider");

const HTTP_PROVIDER = "https://rinkeby.infura.io/v3/686ea6bb429446ba99f90a53100434f5";
const PRIVATE_KEYS = ["e8862a89dcd4a0dba199679f06f76bdb02b9f80c0241a7efde545034d54b12c9"];

const hDWalletProvider = new HDWalletProvider(PRIVATE_KEYS, HTTP_PROVIDER);

const web3 = new Web3(hDWalletProvider);
const ContractABI = require("../src/abis/UniqueAsset.json");

let Contract = undefined;

(async function initContract() {
  let networkID = await web3.eth.net.getId();
  let contractData = ContractABI.networks[networkID];
  if (contractData) {
    let contractABI = ContractABI.abi;
    Contract = new web3.eth.Contract(contractABI, contractData.address);
  }
})();

module.exports.getAccounts = async function () {
  try {
    return await web3.eth.getAccounts();
  } catch (e) {
    return "Problem with web3";
  }
};

module.exports.getAccountBalance = async function (accountAddress) {
  try {
    let balance = await web3.eth.getBalance(accountAddress);
    return web3.utils.fromWei(balance, "ether");
  } catch (e) {
    return "Problem with web3";
  }
};

module.exports.mintNFT = async function (uploadHash, accountAddress, callback) {
  if (Contract) {
    await Contract.methods
      .mint(uploadHash)
      .send({
        from: accountAddress,
        gasPrice: web3.utils.toHex(web3.utils.toWei("8", "gwei")),
        gasLimit: web3.utils.toHex(30000000),
        gas: 5000000,
      })
      .then((res) => {
        console.log("res Mint NFT's", res);

        if (res.status) {
          callback(createResponseObject(true, { transactionHash: res.transactionHash, uploadHash }, "Minted Success "));
        }
      })
      .catch((e) => {
        callback(createResponseObject(false, "", e));
      });
  } else {
    callback(createResponseObject(false, "", "Contract is not Deployed"));
  }
};

module.exports.getNFTs = async function (accountAddress) {
  try {
    let totalBalance = await Contract.methods.balanceOf(accountAddress).call();
    let NFTsArray = [];
    for (let i = 0; i <= totalBalance - 1; i++) {
      let nft = await Contract.methods.hashes(i).call();
      NFTsArray.push(nft);
    }

    return createResponseObject(true, NFTsArray, "Success");
  } catch (e) {
    return createResponseObject(false, "", e);
  }
};

function createResponseObject(success, data, message) {
  return { success, data, message };
}
