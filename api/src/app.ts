import express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", (req: express.Request, res: express.Response) => {
    return res.json({fred: "fredn"})
})


// app is listening
const port = process.env.API_PORT ?? 3030;
app.listen(port, () => {
    console.log(`we are live on port ${port} -cheeroos`);
});
