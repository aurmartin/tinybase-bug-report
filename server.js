import {WebSocketServer} from "ws";
import { createWsServer } from "tinybase/synchronizers/synchronizer-ws-server";
import { createMergeableStore } from "tinybase";
import { createFilePersister } from "tinybase/persisters/persister-file";

const persist = () => {
  const store = createMergeableStore()
  const persister = createFilePersister(store, "store.json")
  return persister
}

const wss = new WebSocketServer({ port: 1234 })

wss.on("connection", (ws) => {
  console.log("Connection")
  ws.on("error", console.error)
  ws.on("close", () => console.log("Closed"))
})

wss.on("error", console.error)

createWsServer(wss, persist)
