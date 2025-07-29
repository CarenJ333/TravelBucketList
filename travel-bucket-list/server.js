const jsonServer = require('json-server');
const cors = require('cors'); // ✅ Import cors

const server = jsonServer.create(); 
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

//  Use cors middleware
server.use(cors()); // Only this line is needed

server.use(middlewares);
server.use(router);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});
