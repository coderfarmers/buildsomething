const app = require('express')()
  , {EXPRESS_PORT} = require('./config');

require('./middleware')(app);
require('./routes')(app);

app.listen(EXPRESS_PORT, () => console.log(`backend already listen on port: ${EXPRESS_PORT}`));
