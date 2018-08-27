import fetch from "isomorphic-unfetch";
import Head from "next/head";
import React, { Component } from "react";

const getDolarFromServer = async (baseUrl = "") => {
  const response = await fetch(`${baseUrl}/api/dolar`);
  const { dolar } = await response.json();
  return dolar;
};

export default class Index extends Component {
  static getInitialProps = async ({ req }) => {
    const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
    return { dolar: await getDolarFromServer(baseUrl) };
  };

  componentDidMount() {
    setInterval(async () => {
      this.setState({ dolar: await getDolarFromServer() });
    }, 1000 * 60);
  }

  state = {
    dolar: this.props.dolar,
    showEmojis: true
  };

  toggleUnits = () => {
    this.setState({ showEmojis: !this.state.showEmojis });
  };

  render() {
    const { dolar, showEmojis } = this.state;
    return (
      <div className="page">
        <Head>
          <title>{dolar} BsS/USD</title>
          <meta
            name="viewport"
            content="initial-scale=1.0, width=device-width"
          />
        </Head>
        <p className="dolar">
          {dolar}{" "}
          <span className="unit" onClick={this.toggleUnits}>
            {showEmojis ? "🇻🇪⃕🇺🇸" : "BsS/USD"}
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
          .dolar {
            font-size: 70px;
            font-size: 10vw;
          }
          .unit {
            font-size: 40px;
            font-size: 6vw;
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
