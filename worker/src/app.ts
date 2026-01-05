import express = require("express");
import ConsumerController from "./Controller/ConsumerController";

const app = express();
app.use(express.json());
const port = process.env.WORKER_PORT;
app.use(express.urlencoded({extended: true}));

app.get("/", (req: express.Request, res: express.Response) => {
    return res.json({message: `This is the Worker service on port ${port}`})
})

// start listening for messages
ConsumerController.handle().catch((err: Error) => {
    console.error(err);
})

app.listen(port, () => {
    console.log(`we are live on port ${port}`);
});
