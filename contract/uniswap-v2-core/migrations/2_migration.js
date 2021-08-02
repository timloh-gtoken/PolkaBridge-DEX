const UniswapV2Factory = artifacts.require("UniswapV2Factory");
const Token_1 = artifacts.require("test/ERC20.sol")
const Token_2 = artifacts.require("test/ERC20.sol")
module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(UniswapV2Factory, accounts[0]);
  await deployer.deploy(Token_1, 100000)
  await deployer.deploy(Token_2, 100000)
  
  const tk_1 = await Token_1.deployed()
  console.log(tk_1.address)

  const tk_2 = await Token_2.deployed()
  console.log(tk_2.address)
};
