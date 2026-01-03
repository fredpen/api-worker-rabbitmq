import express = require("express");
import ProducerController from "./Controller/ProducerController";

const app = express();
app.use(express.json());
const port = process.env.API_PORT;
app.use(express.urlencoded({extended: true}));


app.get("/", (req: express.Request, res: express.Response) => {
    return res.json({message: `This is the API service on port ${port}`})
})


// test broadcase
app.get("/broadcast", async (req: express.Request, res: express.Response) => {
    const messageResponse = await ProducerController.handle()
    return res.json({message: `Broadcast is completed`,messageResponse})
})




app.listen(port, () => {
    console.log(`we are live on port ${port}`);
});
