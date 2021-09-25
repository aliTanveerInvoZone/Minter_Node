const UniqueAssets = artifacts.require("UniqueAsset");

module.exports = function (deployer) {
  deployer.deploy(UniqueAssets);
};
