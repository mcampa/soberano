import fetch from "isomorphic-unfetch";

const cache = {};
const Index = props => (
  <div className="page">
    <p className="dolar">{props.dolar} BsS/USD</p>
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
        font-size: 10rem;
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

Index.getInitialProps = async ({ req }) => {
  const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
  const response = await fetch(baseUrl + "/api/dolar");
  const { dolar } = await response.json();
  return { dolar };
};

export default Index;
