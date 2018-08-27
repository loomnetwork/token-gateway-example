import React from 'react'
import Wallet from './wallet'

export default class DAppChainTokens extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      account: '0x',
      ethAccount: '0x',
      allowing: false
    }
  }

  async componentWillMount() {
    this.props.dcGatewayManager.onTokenWithdrawal(async event => {
      alert(`Token ${event.value.toNumber()} ready for withdraw, check Ethereum Gateway`)
      await this.updateUI()
    })

    await this.updateUI()
  }

  async updateUI() {
    const ethAccount = await this.props.ethAccountManager.getCurrentAccountAsync()
    const account = this.props.dcAccountManager.getCurrentAccount()
    const balance = await this.props.dcTokenManager.getBalanceOfUserAsync(account)
    const mapping = await this.props.dcAccountManager.getAddressMappingAsync(ethAccount)

    this.setState({ account, ethAccount, mapping, balance })
  }

  async allowToWithdraw(amount) {
    this.setState({ allowing: true })
    await this.props.dcTokenManager.approveAsync(this.state.account, amount)

    try {
      await this.props.dcGatewayManager.withdrawTokenAsync(
        amount,
        this.props.dcTokenManager.getContractAddress()
      )

      alert('Processing allowance')
    } catch (err) {
      if (err.message.indexOf('pending') > -1) {
        alert('Pending withdraw exists, check Ethereum Gateway')
      } else {
        console.error(err)
      }
    }

    this.setState({ allowing: false })

    await this.updateUI()
  }

  render() {
    const wallet = (
      <Wallet
        balance={this.state.balance}
        action="Allow Withdraw"
        handleOnClick={() => this.allowToWithdraw(this.state.balance)}
        disabled={this.state.sending}
      />
    )

    const view = !this.state.mapping ? (
      <p>Please sign your user first</p>
    ) : this.state.balance > 0 ? (
      wallet
    ) : (
      <p>No balance deposited on DAppChain yet</p>
    )

    return (
      <div>
        <h2>DAppChain Available Token</h2>
        <div className="container">
          <div>{view}</div>
        </div>
      </div>
    )
  }
}
