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

// setup s3
const s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: 'https://s3.storage.selcloud.ru',
  s3ForcePathStyle: true,
  region: 'ru-1',
})

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
    return res.send({ error: 'no data provided. Please provide some data' })
  }
  
  const usersData = req.body;
  const { value, playlistname, songname } = usersData;

  if (value === 'dislike') {
    const playlistsMap = {
      'Morning list': 'tracksMorning.txt',
      'Day list': 'tracksDay.txt',
      'Night list': 'tracksNight.txt',
      'non-basic playlist': '?'
    }
    
    const playlistFileName = playlistsMap[playlistname]
    const dislikedSongName = songname
    console.log({playlistFileName, dislikedSongName: songname})
  
    removeDislikedSongFromPlaylist(playlistFileName, dislikedSongName)
      .then(resData => {
        console.log({ resData });
        res.send(resData);
      })
      .catch(err => {console.log({zhzhzh:err});res.send(err)})
  }
  
  sendDataToGoogleSheets(usersData).then(data => {
    res.send(data)
  })
})

function sendDataToGoogleSheets(data) {
  // https://www.npmjs.com/package/axios
  return axios.post(googleSheetWebAppUrl, data)
    .then(function (response) {
      // handle success
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

async function getPlaylist(options) {
  // https://stackoverflow.com/a/52976521/9675926
  try {
    const { bucketName, playlistFolder, playlistFileName } = options;
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

async function updatePlaylist(options, updatedPlaylist) {
  try {
    const { bucketName, playlistFolder, playlistFileName } = options
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
        console.log(data);
      }
    }).promise()
    
    return res
  } catch (e) {
    throw new Error(`Could not upload file to S3: ${e.message}`)
  }
}

async function removeDislikedSongFromPlaylist(playlistFileName, dislikedSongName) {
  // https://developers.selectel.ru/docs/cloud-services/cloud-storage/s3/methods_s3_api/
  const options = {
    bucketName: 'test-bucket-container',  // "bucket" means "container"
    playlistFolder: 'playServerlessTestBucket',
    playlistFileName: playlistFileName
  }
  
  const res = await getPlaylist(options)
    .then(playlistData => playlistData.split((/\r\n|\r|\n/g)))
    .then(trackNames => trackNames.filter(trackName => trackName !== dislikedSongName))
    // .then(trackNames => trackNames.filter(trackName => trackName !== `Tantra - Macumba (Macumba Suite) (Disco Recharge (The Complete Expanded Collection),1979 ).mp3`))
    .then(updatedTrackNames => updatedTrackNames.join('\n'))
    .then(newPlaylist => updatePlaylist(options, newPlaylist))
    .catch(err => {
      console.log(err);
      return err
    })
  
  return res
}

