const express = require("express");
const router = express.Router();
const Web3Model = require("../Controllers/web3");

router.get("/getAccounts", (req, res) => {
  Web3Model.getAccounts(req, res);
});
router.get("/getAccountBalance/:accountAddress", (req, res) => {
  Web3Model.getAccountBalance(req, res);
});

module.exports = router;
