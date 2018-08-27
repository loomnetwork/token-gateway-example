import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Main from './components/main'
import Home from './components/home'
import EthTokens from './components/eth_tokens'
import DAppChainTokens from './components/dappchain_tokens'
import GatewayTokens from './components/gateway_tokens'
import EthAccountManager from './eth_managers/eth_account_manager'
import EthTokenManager from './eth_managers/eth_token_manager'
import EthGatewayManager from './eth_managers/eth_gateway_manager'
import DAppChainAccountManager from './dc_managers/dc_account_manager'
import DAppChainTokenManager from './dc_managers/dc_token_manager'
import DAppChainGatewayManager from './dc_managers/dc_gateway_manager'
;(async () => {
  console.log('Loading ...')
  const t = setTimeout(
    () =>
      console.log(
        '\n\n----> If this takes too long to start, please try to reset MetaMask cache :)'
      ),
    10000
  )

  const ethTokenManager = await EthTokenManager.createAsync()
  const ethAccountManager = await EthAccountManager.createAsync()
  const dcAccountManager = await DAppChainAccountManager.createAsync()
  const dcTokenManager = await DAppChainTokenManager.createAsync()
  const ethGatewayManager = await EthGatewayManager.createAsync()
  const dcGatewayManager = await DAppChainGatewayManager.createAsync()

  clearTimeout(t)

  const BuildMain = () => (
    <Main
      ethAccountManager={ethAccountManager}
      ethTokenManager={ethTokenManager}
      dcAccountManager={dcAccountManager}
      dcTokenManager={dcTokenManager}
    />
  )

  const BuildHome = () => (
    <Home
      ethAccountManager={ethAccountManager}
      ethTokenManager={ethTokenManager}
      dcAccountManager={dcAccountManager}
      dcTokenManager={dcTokenManager}
    />
  )

  const BuildEthTokens = () => (
    <EthTokens
      ethAccountManager={ethAccountManager}
      ethTokenManager={ethTokenManager}
      dcAccountManager={dcAccountManager}
      dcTokenManager={dcTokenManager}
    />
  )

  const BuildGatewayTokens = () => (
    <GatewayTokens
      ethAccountManager={ethAccountManager}
      ethGatewayManager={ethGatewayManager}
      ethTokenManager={ethTokenManager}
      dcAccountManager={dcAccountManager}
      dcTokenManager={dcTokenManager}
      dcGatewayManager={dcGatewayManager}
    />
  )

  const BuildDAppChainTokens = () => (
    <DAppChainTokens
      ethAccountManager={ethAccountManager}
      ethTokenManager={ethTokenManager}
      ethGatewayManager={ethGatewayManager}
      dcAccountManager={dcAccountManager}
      dcTokenManager={dcTokenManager}
      dcGatewayManager={dcGatewayManager}
    />
  )

  ReactDOM.render(
    <Router>
      <div>
        <header>
          <BuildMain />
        </header>

        <main role="main" style={{ marginTop: 100 }}>
          <div className="container">
            <Route exact path="/" component={BuildHome} />
            <Route path="/eth_tokens" component={BuildEthTokens} />
            <Route path="/gateway_tokens" component={BuildGatewayTokens} />
            <Route path="/dappchain_tokens" component={BuildDAppChainTokens} />
          </div>
        </main>
      </div>
    </Router>,
    document.getElementById('root')
  )
})()
