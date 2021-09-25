const Web3Model = require("../models/web3");
const Controller = {};

Controller.getAccounts = function (req, res) {
  try {
    Web3Model.getAccounts().then((resp) => {
      if (res.statusCode === 200) {
        return res.send(createResponseBody(res.statusCode, resp, "Success"));
      }
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

Controller.getAccountBalance = function (req, res) {
  if (req.params.accountAddress) {
    try {
      Web3Model.getAccountBalance(req.params.accountAddress).then((resp) => {
        if (res.statusCode === 200) {
          return res.send(createResponseBody(res.statusCode, resp, "Success"));
        }
      });
    } catch (error) {
      return res.status(400).json({ status: 400, message: error.message });
    }
  } else {
    res.status(400).send(createResponseBody(res.statusCode, null, "Account Address is required"));
  }
};

function createResponseBody(statusCode, body, message) {
  return { statusCode, body, message };
}

module.exports = Controller;
