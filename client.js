const grpc = require("grpc")
const protoLoader = require("@grpc/proto-loader")
const packageDef = protoLoader.loadSync("todo.proto", {})
const grpcObj = grpc.loadPackageDefinition(packageDef)
const todoPackage = grpcObj.todoPackage

const text = process.argv[2]
const client = new todoPackage.Todo("localhost:40000", grpc.credentials.createInsecure())

client.createTodo(
  {
    "id": -1,
    "text": text
  }, 
  (err, response) => {
    console.log("Received from server", JSON.stringify(response))
})

client.readTodos({}, (err, res) => {
  console.log("Received from server read", JSON.stringify(res))
  if (res.items) res.items.forEach(i => console.log(i.text))
})

const call = client.readTodosStream();
call.on("data", item => {
  console.log("received item from server", JSON.stringify(item))
})

call.on("end", e => console.log("server done!"))