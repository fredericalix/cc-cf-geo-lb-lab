// index.js
const express = require('express');
const AWS = require('aws-sdk');
const cors = require('cors');

// Configure AWS
AWS.config.update({
  region: 'us-west-2', // Change to your region
  endpoint: process.env.CELLAR_ADDON_HOST,
  accessKeyId: process.env.CELLAR_ADDON_KEY_ID,
  secretAccessKey: process.env.CELLAR_ADDON_KEY_SECRET
});

const app = express();
const s3 = new AWS.S3();

app.use(cors({
    origin: 'https://geotest.pancasat-lab.cloud'
}));

app.get('/', async (req, res) => {
  try {
    let params1,params2
    if (process.env.GEOZONE === 'EU') {
        params1 = { Bucket: 'validdefred', Key: 'images1.png' };
        params2 = { Bucket: 'validdefred', Key: 'images2.png' };
  } else {
        params1 = { Bucket: 'validdefred', Key: 'images2.png' };
        params2 = { Bucket: 'validdefred', Key: 'images1.png' };
  }
    const [data1, data2] = await Promise.all([
      s3.getObject(params1).promise(),
      s3.getObject(params2).promise()
    ]);

    const image1 = data1.Body.toString('base64');
    const image2 = data2.Body.toString('base64');

    res.send(`
      <html>
        <body>
          <img src="data:image/png;base64,${image1}" />
          <img src="data:image/png;base64,${image2}" />
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
