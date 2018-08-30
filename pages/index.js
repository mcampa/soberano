import fetch from "isomorphic-unfetch";
import Head from "next/head";
import React, { Component } from "react";
import { initGA, logPageView } from "../utils/analytics";

import { Chart, Axis, Series, Tooltip, Cursor, Line } from "react-charts";
import timestamp from "time-stamp";

const getVesUsdFromServer = async (baseUrl = "") => {
  const response = await fetch(`${baseUrl}/api/ves-usd`);
  const { price, chartData = [] } = await response.json();
  return { price, chartData };
};

export default class Index extends Component {
  static getInitialProps = async ({ req }) => {
    const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
    const { price, chartData } = await getVesUsdFromServer(baseUrl);
    return { price, chartData };
  };

  componentDidMount() {
    initGA();
    logPageView();
    setInterval(async () => {
      const { price, chartData } = await getVesUsdFromServer();
      this.setState({ price, chartData });
    }, 1000 * 60 * 2);
  }

  state = {
    price: this.props.price,
    chartData: this.props.chartData,
    invert: false
  };

  _toggleUnits = () => {
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

  _renderStyles = () => {
    return (
      <>
        <style jsx>{`
          .page {
            color: white;
            font-family: helvetica;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            background: url(https://abrilexame.files.wordpress.com/2018/08/venezuela3.jpg)
              no-repeat center center fixed;
            background-size: cover;
          }
          .price {
            font-size: 70px;
            font-size: 10vw;
            z-index: 1;
          }
          .unit {
            font-size: 20px;
            font-size: 3vw;
            cursor: pointer;
          }
          .chart {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.4);
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
      </>
    );
  };

  render() {
    const { price, chartData, invert } = this.state;
    if (price === undefined) {
      return <div>😫</div>;
    }

    const data = [
      {
        label: this._getUnit(),
        datums: chartData.map(([timestamp, value]) => ({
          x: new Date(timestamp),
          y: invert ? 1 / value : value
        }))
      }
    ];

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
        {this._renderStyles()}
        <div className="chart">
          <Chart className="chart" data={data}>
            <Axis primary type="time" />
            <Axis type="linear" showGrid={false} />
            <Series type={Line} />
          </Chart>
        </div>
        <p className="price">
          {this._getReadablePrice()}
          <span className="unit" onClick={this._toggleUnits}>
            {this._getUnit()}
          </span>
        </p>
      </div>
    );
  }
}
