import express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get("/", (req: express.Request, res: express.Response) => {
    return res.json({message: `This is the Worker service on port ${port}`})
})


// app is listening
const port = process.env.WORKER_PORT;
app.listen(port, () => {
    console.log(`we are live on port ${port}`);
});
