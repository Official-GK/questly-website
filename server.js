import pkg from 'https-localhost';
const { createServer } = pkg;

const server = createServer();

async function start() {
  await server.listen(3000);
  console.log('Server running at https://localhost:3000');
}

start();
