const http = require("http");
const fs = require("fs");
const qs = require("querystring");
const mysql = require("mysql2");
const { createConnection } = require("net");

const http1 = fs.readFileSync("./index.html");
const http2 = fs.readFileSync("./index2.html");
let datas = "";

const connecttion = mysql.createConnection({
  host: "database-zoe.cy88i0qmxp5y.us-east-1.rds.amazonaws.com",
  user: "admin_zoe",
  password: "Zoezoe`12",
  port: 3306,
  database: "test",
});

connecttion.connect();

const server = http
  .createServer((req, res) => {
    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.write(http1);
      res.end();
    } else if (req.method === "POST" && req.url.startsWith("/gogo")) {
      req.on("data", (data) => {
        datas += data;
      });
      req.on("end", () => {
        console.log(datas);

        const id = datas.split("=")[1].split("&")[0];
        const pass = datas.split("=")[2];

        connecttion.query(
          `insert into tester(id, pass) values ('${id}','${pass}')`,
          (err, result) => {
            if (err) throw err;
          }
        );

        res.writeHead(200, { "Content-Type": "text/html" });

        const page =
          http2 +
          `<script>
      document.body.children[0].innerText='Hello ${id}!'</script>`;

        res.write(page);
        res.end();
      });
    }
  })
  .listen(3030);
