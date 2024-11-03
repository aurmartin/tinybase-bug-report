import { createMergeableStore } from "tinybase"
import { createLocalPersister } from "tinybase/persisters/persister-browser"
import { createWsSynchronizer } from "tinybase/synchronizers/synchronizer-ws-client"
import {
  useCreateMergeableStore,
  useCreatePersister,
  useCreateSynchronizer,
  useRowIds,
  Provider,
  useStore,
} from "tinybase/ui-react"
import { v4 as uuidv4 } from "uuid"

function App() {
  const store = useCreateMergeableStore(() => createMergeableStore())
  useCreatePersister(store, (store) => createLocalPersister(store, "my-store"))
  useCreateSynchronizer(store, async (store) => {
    const synchronizer = await createWsSynchronizer(
      store,
      new WebSocket("ws://localhost:1234")
    )
    console.log("STARTING SYNC")
    await synchronizer.startSync()
    console.log("DONE SYNCING")
    return synchronizer
  })

  return (
    <Provider store={store}>
      <Page />
    </Provider>
  )
}

const Page = () => {
  const store = useStore()

  const populateStore = () => {
    const longString = "a".repeat(1000)
    for (let i = 0; i < 1000; i++) {
      store.setRow("table", uuidv4(), { name: `Name ${i}`, longString })
    }
  }

  const rowIds = useRowIds("table")

  return (
    <>
      <p>Table has {rowIds.length} rows.</p>
      <button onClick={populateStore}>Populate Store</button>
    </>
  )
}

export default App
