const Web3Model = require("../models/web3");
const IPFSModel = require("../models/ipfs");
const { create } = require("domain");
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

Controller.mintNFT = function (req, res) {
  if (req.files.file && req.fields.accountAddress) {
    let file = req.files.file;
    let stream = require("fs").createReadStream(file.path);
    IPFSModel.uploadFile(stream).then((response) => {
      console.log("OPinata Upload response ===>", response);
      if (response.IpfsHash) {
        Web3Model.mintNFT(response.IpfsHash, req.fields.accountAddress, (response) => {
          console.log("response--->", response);
          if (response.success && res.statusCode === 200) {
            res.send(createResponseBody(res.statusCode, response.data, response.message));
          } else {
            res.status(500).send(createResponseBody(res.statusCode, null, response.message));
          }
        });
      } else {
        res.status(500).send(createResponseBody(res.statusCode, null, "Issue with IPFS upload"));
      }
    });
  } else {
    res.status(400).send(createResponseBody(res.statusCode, null, "parameters are missing"));
  }
};

Controller.getNFTs = function (req, res) {
  try {
    Web3Model.getNFTs(req.params.accountAddress).then((resp) => {
      console.log("resp", resp);
      if (res.statusCode === 200 && resp.success) {
        return res.send(createResponseBody(res.statusCode, resp, "Success"));
      } else {
        return res.status(500).json({ status: 500, message: resp.message });
      }
    });
  } catch (error) {
    return res.status(400).json({ status: 400, message: error.message });
  }
};

function createResponseBody(statusCode, body, message) {
  return { statusCode, body, message };
}

module.exports = Controller;
