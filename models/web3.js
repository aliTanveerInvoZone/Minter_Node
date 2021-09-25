const Web3 = require("web3");

const web3 = new Web3("ws://localhost:7545");

module.exports.getAccounts = async function () {
  return await web3.eth.getAccounts();
};

module.exports.getAccountBalance = async function (accountAddress) {
  return await web3.eth.getBalance(accountAddress);
};
