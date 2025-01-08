import app from "./app.js"
import http from "http"
import {initializeSocket} from "./socket.js"

const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

server.listen(port,()=>{
    console.log(`server is listening on ${port}`);
})




