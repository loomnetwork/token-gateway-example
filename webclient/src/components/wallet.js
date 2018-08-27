import React from 'react'

export default class Wallet extends React.Component {
  render() {
    return (
      <div className="card" style={{ width: 286, height: 300, float: 'left', margin: 4 }}>
        <div className="card-body">
          <p className="card-text">{this.props.balance}</p>
          <button
            disabled={this.props.disabled}
            type="button"
            className="btn btn-primary"
            onClick={() => this.props.handleOnClick()}>
            {this.props.action}
          </button>
        </div>
      </div>
    )
  }
}
