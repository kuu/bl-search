import fs from 'fs';
import url from 'url';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import OoyalaApi from 'ooyala-api';

const app = express();
const port = process.env.PORT || 3030;
const BASE_DIR = path.join(__dirname, '../../');
const DOCS_DIR = path.join(BASE_DIR, 'dist/');

app.use(express.static(BASE_DIR + 'dist'));

app.get('/api/searchByLabel', (req, res) => {
  const label = decodeURIComponent(req.query.label);
  const api = new OoyalaApi(config.api.key, config.api.secret);
  console.log('REQUEST: /api/searchByLabel', label);

  // Get the info associated with the video URL
  api.get('/v2/assets', {where: `labels+INCLUDES+${label}`})
  .then((data) => {
    return data.json();
  }).then((obj) => {
    // Do filter
    res.status(200).json(obj);
  }).catch((err) => {
    console.error(err);
    res.sendStatus(404);
  });
});

// Start server
if (require.main === module) {
  console.log('Server listening on port %s', port);
  app.listen(port);
}

export default app;
