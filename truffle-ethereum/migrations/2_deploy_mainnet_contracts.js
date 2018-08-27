const { writeFileSync } = require('fs')

const GameToken = artifacts.require('GameToken')
const Gateway = artifacts.require('Gateway')

module.exports = (deployer, network, accounts) => {
  const [_, user] = accounts
  const validator = accounts[9]
  deployer.deploy(Gateway, [validator], 3, 4).then(async () => {
    const gatewayInstance = await Gateway.deployed()

    console.log(`Gateway deployed at address: ${gatewayInstance.address}`)

    const GameTokenContract = await deployer.deploy(GameToken, gatewayInstance.address)
    const GameTokenInstance = await GameToken.deployed()

    console.log(`GameToken deployed at address: ${GameTokenInstance.address}`)
    console.log(`GameToken transaction at hash: ${GameTokenContract.transactionHash}`)

    await gatewayInstance.toggleToken(GameTokenInstance.address, { from: validator })
    await GameTokenInstance.transfer(user, 100)

    writeFileSync('../gateway_address', gatewayInstance.address)
    writeFileSync('../game_token_address', GameTokenInstance.address)
    writeFileSync('../game_token_tx_hash', GameTokenContract.transactionHash)
  })
}
