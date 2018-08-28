import fetch from "isomorphic-unfetch";
import Head from "next/head";
import React, { Component } from "react";
import { initGA, logPageView } from "../utils/analytics";

const getVesUsdFromServer = async (baseUrl = "") => {
  const response = await fetch(`${baseUrl}/api/ves-usd`);
  const { price } = await response.json();
  return price;
};

export default class Index extends Component {
  static getInitialProps = async ({ req }) => {
    const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
    return { price: await getVesUsdFromServer(baseUrl) };
  };

  componentDidMount() {
    initGA();
    logPageView();
    setInterval(async () => {
      this.setState({ price: await getVesUsdFromServer() });
    }, 1000 * 60);
  }

  state = {
    price: this.props.price,
    invert: false
  };

  toggleUnits = () => {
    this.setState({ invert: !this.state.invert });
  };

  _getReadablePrice = () => {
    const { price, invert } = this.state;
    return invert ? (1 / price).toFixed(6) : price.toFixed(2);
  };

  _getUnit = () => {
    const { invert } = this.state;
    return invert ? "USD/BsS" : "BsS/USD";
  };

  render() {
    const { price } = this.state;
    if (price === undefined) {
      return <div>Error</div>;
    }

    return (
      <div className="page">
        <Head>
          <title>
            {this._getReadablePrice()}
            {this._getUnit()}
          </title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <p className="price">
          {this._getReadablePrice()}
          <span className="unit" onClick={this.toggleUnits}>
            {this._getUnit()}
          </span>
        </p>
        <style jsx>{`
          .page {
            color: white;
            font-family: helvetica;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
          }
          .price {
            font-size: 70px;
            font-size: 10vw;
          }
          .unit {
            font-size: 20px;
            font-size: 3vw;
            cursor: pointer;
          }
        `}</style>
        <style global jsx>{`
          html,
          body,
          #__next {
            background: black;
            margin: 0;
            height: 100%;
          }
        `}</style>
      </div>
    );
  }
}
