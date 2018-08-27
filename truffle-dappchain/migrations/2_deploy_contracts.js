const { writeFileSync, readFileSync } = require('fs')

const GameTokenDappChain = artifacts.require('GameTokenDappChain')

module.exports = (deployer, network, accounts) => {
  const gatewayAddress = readFileSync('../gateway_dappchain_address', 'utf-8')

  deployer.deploy(GameTokenDappChain, gatewayAddress).then(async () => {
    const GameTokenDappChainInstance = await GameTokenDappChain.deployed()
    console.log(`GameTokenDappChain deployed at address: ${GameTokenDappChainInstance.address}`)
    writeFileSync('../game_token_dappchain_address', GameTokenDappChainInstance.address)
  })
}
