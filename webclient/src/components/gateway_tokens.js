import React from 'react'
import { CryptoUtils } from 'loom-js'
import Wallet from './wallet'

export default class GatewayTokens extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ethAccount: '0x',
      account: '0x',
      mapping: null,
      balance: 0,
      withdrawing: false
    }
  }

  async componentWillMount() {
    await this.updateUI()
  }

  async updateUI() {
    const ethAccount = await this.props.ethAccountManager.getCurrentAccountAsync()
    const mapping = await this.props.dcAccountManager.getAddressMappingAsync(ethAccount)
    const account = this.props.dcAccountManager.getCurrentAccount()
    const data = await this.props.dcGatewayManager.withdrawalReceiptAsync(account)

    let balance
    if (data) {
      balance = +data.value.toString(10)
    }

    this.setState({ account, mapping, balance })
  }

  async withdrawFromGateway(amount) {
    this.setState({ withdrawing: true })
    const data = await this.props.dcGatewayManager.withdrawalReceiptAsync(this.state.account)
    const tokenOwner = data.tokenOwner.local.toString()
    const signature = CryptoUtils.bytesToHexAddr(data.oracleSignature)

    try {
      await this.props.ethGatewayManager.withdrawTokenAsync(
        tokenOwner,
        amount,
        signature,
        this.props.ethTokenManager.getContractAddress()
      )

      alert('Token withdraw with success, check Owned Tokens')
    } catch (err) {
      console.error(err)
    }

    this.setState({ withdrawing: true })
    await this.updateUI()
  }

  render() {
    const wallet = (
      <Wallet
        balance={this.state.balance}
        action="Withdraw from gateway"
        handleOnClick={() => this.withdrawFromGateway(this.state.balance)}
        disabled={this.state.sending}
      />
    )

    const view = !this.state.mapping ? (
      <p>Please sign your user first</p>
    ) : this.state.balance > 0 ? (
      wallet
    ) : (
      <p>No balance deposited on Gateway yet</p>
    )

    return (
      <div>
        <h2>Ethereum Network Gateway Tokens</h2>
        <div className="container">
          <div>{view}</div>
        </div>
      </div>
    )
  }
}
