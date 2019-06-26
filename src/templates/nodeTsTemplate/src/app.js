"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require("http");
var server = http.createServer((req, res) => {
    console.log(req);
});
server.listen(3000);
//# sourceMappingURL=app.js.map