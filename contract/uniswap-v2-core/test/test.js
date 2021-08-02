require('chai')
    .use(require('chai-as-promised'))
    .should()

const {assert} = require('chai')

const Factory = artifacts.require('./UniswapV2Factory.sol')
const Token_1 = artifacts.require('./test/ERC20.sol')
const Token_2 = artifacts.require('./test/ERC20.sol')

contract('Factory Contract', (accounts) => {
    let factory, tk_1, tk_2
    let res
    before(async() => {
        factory = await Factory.deployed()
        tk_1 = await Token_1.deployed()
        tk_2 = await Token_2.deployed()
    })
    it('Create Pair', async() => {
        await factory.createPair(tk_1.address, tk_2.address)
    })
})