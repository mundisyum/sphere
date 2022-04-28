const cors = require('cors')
const axios = require('axios');
const express = require('express')
const S3 = require('aws-sdk/clients/s3');
require('dotenv').config()

const app = express()
const port = 3200

// parse application/json
// app.use(bodyParser.json())
app.use(express.json());

// allow cross-origin requests to pass
app.use(cors())

const googleSheetWebAppUrl = 'https://script.google.com/macros/s/AKfycbwvHsB6fEUWTTQf2ifSSDj_803tyheIEr41J1Q8SgJLzYX_0xTKqlMWRNko7Kj9KS0Qog/exec';

app.get('/testing-route', (req, res) => {
  console.log('request from express.js route')
  const fakeData = {
    place: 'fake-data',
    value: 'axios',
    songname: 'heaven',
    playlistname: 'axios'
  }
  
  sendDataToGoogleSheets(fakeData)
  .then(data => res.send(data))
})

app.post('/sphere-api-middleware', (req, res) => {
  console.log('sphere-api-middleware')
  
  if (Object.keys(req.body).length === 0) {
    // no data provided
    return res.send({error: 'no data provided. Please provide some data'})
  }
  
  const usersData = req.body;
  console.log({usersDatad: usersData})
  sendDataToGoogleSheets(usersData).then(data => {
    res.send(data)
  })
})

function sendDataToGoogleSheets(data) {
  // https://www.npmjs.com/package/axios
  return axios.post(googleSheetWebAppUrl, data)
  .then(function (response) {
    // handle success
    // console.log(response);
    return response.data;
  })
  .catch(function (error) {
    // handle error
    console.log(error);
  })
}

// uncomment for testing in a console
// because this function will be executed automatically on each codechange
// sendDataToGoogleSheets({
//     place: 'test-fake-data',
//     value: 'axios',
//     songname: 'heaven',
//     playlistname: 'axios-playlist'
//   })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})


// setup s3
var s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: 'https://s3.storage.selcloud.ru',
  s3ForcePathStyle: true,
  region: 'ru-1',
})

// https://developers.selectel.ru/docs/cloud-services/cloud-storage/s3/methods_s3_api/
const bucketName = 'test-bucket-container' // "bucket" means "container"
const playlistFolder = 'playServerlessTestBucket'
const playlistFileName = 'tracksDay.txt'

async function getPlaylist() {
  // https://stackoverflow.com/a/52976521/9675926
  try {
    const params = {
      Bucket: bucketName,
      Key: playlistFolder + '/' + playlistFileName
    }
    
    const data = await s3.getObject(params).promise();
    
    return data.Body.toString('utf8');
  } catch (e) {
    throw new Error(`Could not retrieve file from S3: ${e.message}`)
  }
}

// async function uploadPlaylist(bucket, objectKey) {
async function uploadPlaylist(updatedPlaylist) {
  // update playlist
  try {
    const params = {
      Bucket: bucketName,
      Key: playlistFolder + '/' + 'test-prefix-new--' + playlistFileName,
      Body: updatedPlaylist,
      ContentType: 'text/plain'
    };
    
    const res = await s3.upload(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
      } else {
        data.ваы = 'еуые'
        console.log(data);
      }
    }).promise()
    
    return res
  } catch (e) {
    throw new Error(`Could not upload file to S3: ${e.message}`)
  }
}

const dislikedTrackName = `D Rebel Band  Solid.mp3`

getPlaylist()
.then(playlistData => playlistData.split((/\r\n|\r|\n/g)))
.then(trackNames => trackNames.filter(trackName => trackName !== dislikedTrackName))
// .then(trackNames => trackNames.filter((trackName, i) => i !== 0))
.then(updatedTrackNames => updatedTrackNames.join('\n'))
.then(newPlaylist => uploadPlaylist(newPlaylist))
