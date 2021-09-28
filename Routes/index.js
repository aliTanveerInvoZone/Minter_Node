const express = require("express");
const router = express.Router();
const Web3Model = require("../Controllers/web3");

router.get("/getAccounts", (req, res) => {
  Web3Model.getAccounts(req, res);
});
router.get("/getAccountBalance/:accountAddress", (req, res) => {
  Web3Model.getAccountBalance(req, res);
});
router.post("/mintNFT", (req, res) => {
  Web3Model.mintNFT(req, res);
});
router.get("/getNFTs/:accountAddress", (req, res) => {
  Web3Model.getNFTs(req, res);
});

module.exports = router;
