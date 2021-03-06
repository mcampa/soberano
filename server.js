const next = require("next");
const express = require("express");
const getData = require("./fetcher");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const server = express();
const handle = app.getRequestHandler();

app.prepare().then(() => {
  server.get("/api/ves-usd", (req, res) => res.send(getData()));
  server.use((req, res) => {
    handle(req, res);
  });

  server.listen(3000, err => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
