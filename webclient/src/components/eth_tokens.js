import React from 'react'
import Wallet from './wallet'

export default class EthTokens extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '0x',
      mapping: null,
      sending: false,
      balance: 0
    }
  }

  async componentWillMount() {
    await this.updateUI()
  }

  async updateUI() {
    const account = await this.props.ethAccountManager.getCurrentAccountAsync()
    const balance = await this.props.ethTokenManager.getBalanceOfUserAsync(account)
    const mapping = await this.props.dcAccountManager.getAddressMappingAsync(account)

    this.setState({ account, balance, mapping })
  }

  async sendToDAppChain(amount) {
    this.setState({ sending: true })

    try {
      await this.props.ethTokenManager.depositTokenOnGateway(this.state.account, amount)
      alert('The amount will be available on DappChain, check DAppChain ')
    } catch (err) {
      console.log('Transaction failed or denied by user')
    }

    this.setState({ sending: false })
    await this.updateUI()
  }

  render() {
    const wallet = (
      <Wallet
        balance={this.state.balance}
        action="Send to DAppChain"
        handleOnClick={() => this.sendToDAppChain(this.state.balance)}
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
        <h2>Ethereum Network Owned Tokens</h2>
        <div className="container">
          <div>{view}</div>
        </div>
      </div>
    )
  }
}
