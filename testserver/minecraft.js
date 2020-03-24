// Require Node.js standard library function to spawn a child process
const spawn = require('child_process').spawn;
let minecraftServerProcess;

var isMinecraftRunning = false;
const MINECRAFT_STATUS = {
  RUNNING: 'RUNNING',
  NOT_RUNNING: 'NOT_RUNNING'
};

// Express.js app listening for HTTP requests

var express = require('express');
var app = express();
var port = 3000;

app.get('/', (req, res) => res.send('MinecraftExpressApp is up and running!'));

app.get('/status', (req, res) => {
  // talk to Minecraft to get status
  const status = getMinecraftStatus();
  res.send({ status: status });
});

app.post('/start', (req, res) => {
  if (!isMinecraftRunning) {
    startMinecraft();
    isMinecraftRunning = true;
  }
  res.send({ start: true });
});

app.delete('/shutdown', (req, res) => {
  if (isMinecraftRunning) {
    shutdownMinecraft();
    isMinecraftRunning = false;
  }
  res.send({ shutdown: true });
});

app.listen(port, () => console.log('Example app listening on port ${port}!'));

function startMinecraft() {
  // Create a child process for the Minecraft server using the same java process
  // invocation we used manually before
  minecraftServerProcess = spawn('java', [
    '-Xmx1024M',
    '-Xms1024M',
    '-jar',
    'server.jar',
    'nogui'
  ]);

  // Listen for events coming from the minecraft server process - in this case,
  // just log out messages coming from the server
  function log(data) {
    process.stdout.write(data.toString());
  }
  minecraftServerProcess.stdout.on('data', log);
  minecraftServerProcess.stderr.on('data', log);
}

function shutdownMinecraft() {
  minecraftServerProcess.kill();
}

function getMinecraftStatus() {
  if (isMinecraftRunning) {
    return MINECRAFT_STATUS.RUNNING;
  }
  return MINECRAFT_STATUS.NOT_RUNNING;
}
