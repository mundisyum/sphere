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

const googleSheetWebAppUrl = process.env.googleSheetsWebhookUrl;

// setup s3
const s3 = new S3({
  accessKeyId: process.env.accessKeyId,
  secretAccessKey: process.env.secretAccessKey,
  endpoint: 'https://s3.storage.selcloud.ru',
  s3ForcePathStyle: true,
  region: 'ru-1',
})

const fakeData = {
  place: 'fake-data-vServerless-v1',
  value: 'dislike',
  songname: 'heaven',
  playlistname: 'axios'
}

app.get('/testing-route', (req, res) => {
  console.log('request from express.js route')

  sendDataToGoogleSheets(fakeData)
    .then(data => res.send(data))
})

app.post('/sphere-api-middleware', async (req, res) => {
  console.log('sphere-api-middleware')
  
  if (Object.keys(req.body).length === 0) {
    // no data provided
    res.send({ result: 'error', errorMessage: 'no data provided. Please provide some data' })
    return
  }
  
  const usersData = req.body;
  const data = await handleApiRequests(usersData);

  res.send(data);
})

async function handleApiRequests(usersData) {
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
    console.log({ playlistFileName, dislikedSongName: songname })
    
    const res = await removeDislikedSongFromPlaylist(playlistFileName, dislikedSongName)
      .then(() => sendDataToGoogleSheets(usersData))
      .then(response => {
        if (response.result === 'success') {
          return {
            result: 'success',
            message: 'Thanks! App data is updated'
          }
        }
      })
      .catch(err => {
        return {
          result: 'error',
          errorMessage: err.toString()
        }
      })

    return res
  }
  
  const res = await sendDataToGoogleSheets(usersData)
    .then(response => {
      if (response.result === 'success') {
        return {
          result: 'success',
          message: 'Thanks! App data is updated'
        }
      }
    })
    .catch(err => {
      return {
        result: 'error',
        errorMessage: err.toString()
      }
    })
  
  return res
}

async function sendDataToGoogleSheets(data) {
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
// sendDataToGoogleSheets(fakeData)

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
      Key: playlistFolder + '/' + playlistFileName,
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
    .then(trackNames => {
      if (trackNames.includes(dislikedSongName)) {
        return trackNames
      }
      
      throw Error('This song is already deleted from your playlist')
    })
    .then(trackNames => trackNames.filter(trackName => trackName !== dislikedSongName))
    .then(updatedTrackNames => updatedTrackNames.join('\n'))
    .then(newPlaylist => updatePlaylist(options, newPlaylist))

  return res
}

