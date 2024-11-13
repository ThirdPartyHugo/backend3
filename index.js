// run `node index.js` in the terminal
app.get('/', (req, res) => {
  res.send('Welcome to the Home Page!');
});

console.log(`Hello Node.js v${process.versions.node}!`);
