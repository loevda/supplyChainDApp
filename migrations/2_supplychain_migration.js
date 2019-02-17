var Migrations = artifacts.require("./winebase/SupplyChain.sol");

module.exports = function(deployer) {
    deployer.deploy(Migrations);
};