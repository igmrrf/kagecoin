const Migrations = artifacts.require('Migrations');
const DaiTokenMock = artifacts.require('DaiTokenMock');

module.exports = async function (deployer) {
  await deployer.deploy(Migrations);
  await deployer.deploy(DaiTokenMock);
  const tokenMock = await DaiTokenMock.deployed();
  // Mint 1,000 Dai Tokens for the deployer
  await tokenMock.mint(
    '0xca81Ff305f2Ce11C97A6879642AD86a8bA476D5E',
    '1000000000000000000000'
  );
};
