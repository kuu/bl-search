import fs from 'fs';
import url from 'url';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import config from 'config';
import OoyalaApi from 'ooyala-api';

const app = express();
const port = process.env.PORT || 8080;
const BASE_DIR = path.join(__dirname, '../../../');
const DOCS_DIR = path.join(BASE_DIR, 'dist/');
const api = new OoyalaApi(config.api.key, config.api.secret, {log: true});
const filter = ['embed_code', 'name', 'description', 'preview_image_url'];

app.use(express.static(BASE_DIR + 'dist'));

app.get('/api/searchByLabel', (req, res) => {
  const label = decodeURIComponent(req.query.label);
  console.log('REQUEST: /api/searchByLabel', label);

  // Get the info associated with the video URL
  api.get('/v2/assets', {where: `labels+INCLUDES+'${label}'`}, {pagination: true})
  .then((items) => {
    // Do filtering
    res.status(200).json(items.filter((item) => item['asset_type'] === 'video').map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        if (filter.indexOf(key) !== -1) {
          obj[key] = item[key];
        }
      });
      return obj;
    }));
  }).catch((err) => {
    console.error(err);
    res.sendStatus(404);
  });
});

app.get('/api/searchNameDesc', (req, res) => {
  const word = decodeURIComponent(req.query.word);
  console.log('REQUEST: /api/searchNameDesc', word);

  // Get the info associated with the video URL
  api.get('/v2/assets', {where: `name='${word}'+OR+description='${word}'`}, {pagination: true})
  .then((items) => {
    // Do filtering
    res.status(200).json(items.filter((item) => item['asset_type'] === 'video').map((item) => {
      const obj = {};
      Object.keys(item).forEach((key) => {
        if (filter.indexOf(key) !== -1) {
          obj[key] = item[key];
        }
      });
      return obj;
    }));
  }).catch((err) => {
    console.error(err);
    res.sendStatus(404);
  });
});

// Start server
//if (require.main === module) {
  console.log('Server listening on port %s', port);
  app.listen(port);
//}

export default app;
