const express = require("express");

const app = express();
const PORT = 3000;


app.get("/", (req, res) => {
    res.send("server!");
});


app.listen(PORT, () => {
    console.log(`Server : http://localhost:${PORT}`);
});