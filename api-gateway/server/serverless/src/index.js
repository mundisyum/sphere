const axios = require('axios');
const S3 = require('aws-sdk/clients/s3');
require('dotenv').config()

const loginCredentials = JSON.parse(process.env.loginCredentials);
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
  "place": "playServerlessTest2",
  "value": "like",
  "songname": "Wolf Mller & Niklas Wandt - 23.Dub Dub - Dub (Dub Dub Dub Dub Dub - Instrumentalmusik Remixed, 2020-01-01).mp3",
  "playlistFileName": "tracksMorning.txt",
  "login": "playServerlessTest2",
  "password": "test-password"
}

async function handleApiRequests(usersData) {
  // the app will crash if there are any syntax errors with this json
  // log credentials to see if they are correct
  console.log({ loginCredentials })
  
  if (usersData === undefined || Object.keys(usersData).length === 0) {
    // no data provided
    return { result: 'error', message: 'No data provided. Please provide some data' }
  }
  
  const { login, password } = usersData
  const isLoggedIn = loginCredentials.filter(
    credentials => credentials.login === login && credentials.password === password
  ).length === 1
  
  const { isLoginRequest } = usersData
  if (isLoginRequest) {
    if (isLoggedIn) {
      return {
        result: 'success',
        message: 'Congrats! You are successfully logged in'
      }
    }
    
    return {
      result: 'error',
      message: 'Sorry, wrong password. Try again, please'
    }
  }
  
  if (isLoggedIn === false) {
    return {
      result: 'error',
      message: 'You must be logged in to proceed this action'
    }
  }
  
  const { value, playlistFileName, songname } = usersData;
  
  if (value === 'like' || songname === 'crossfaded') {
    const res = await sendDataToGoogleSheets(usersData)
      .then(response => {
        if (response.result === 'success') {
          if (songname === 'crossfaded') {
            return {
              result: 'error',
              message: 'Song\'s name is ' + songname + '\nThis bug is logged to google sheets'
            }
          }
          
          // like case
          return {
            result: 'success',
            message: 'Thanks for your like! App data is updated'
          }
        }
      })
      .catch(err => {
        console.log({ err })
        return {
          result: 'error',
          message: err.toString()
        }
      })
    
    return res
  }
  
  if (value === 'dislike') {
    
    if (playlistFileName === undefined) {
      return {
        result: 'error',
        message: 'Can\'t dislike. Please, send playlistFileName to server (something like \'tracksMorning.txt\')'
      }
    }
    
    const options = {
      // "bucket" means "container"
      // bucketName should be replaced with real (production) bucket name
      // for example, bucketName could be "Sphere"
      bucketName: 'test-bucket-container',
      playlistFileName: playlistFileName,
      playlistFolder: login, // so, playlistFolder will be something like "playPrognoz" or "playServersell"
      dislikedSongName: songname
    }
    
    const res = await removeDislikedSongFromPlaylist(options)
      .then(() => sendDataToGoogleSheets(usersData))
      .then(response => {
        if (response.result === 'success') {
          return {
            result: 'success',
            message: 'Disliked song is now deleted from your playlist\n\n' +
              'Disliked song name is: \n' + options.dislikedSongName
          }
        }
      })
      .catch(err => {
        return {
          result: 'error',
          message: err.toString()
        }
      })
    
    return res
  }
  
  return {
    result: 'error',
    message: 'logged-in but no action provided'
  }
}

// this function is used as a wrapper,
// which catches and returns possible errors as data
// this function may also be used as a serverless function
async function handle_api_requests(usersData) {
  return await handleApiRequests(usersData)
    .catch(err => {
      return {
        result: 'error',
        message: err.toString()
      }
    });
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
  } catch (error) {
    throw new Error(`Could not retrieve file from S3: ${error.message}`)
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

async function removeDislikedSongFromPlaylist(options) {
  // https://developers.selectel.ru/docs/cloud-services/cloud-storage/s3/methods_s3_api/
  const { dislikedSongName } = options
  
  const res = await getPlaylist(options)
    .then(playlistData => playlistData.split((/\r\n|\r|\n/g)))
    .then(trackNames => {
      console.log(dislikedSongName)
      if (trackNames.includes(dislikedSongName)) {
        return trackNames
      }
      
      throw Error('Cannot delete this song from your playlist because there is no such song in your playlist.\n' +
        'Song title: ' + dislikedSongName)
    })
    .then(trackNames => trackNames.filter(trackName => trackName !== dislikedSongName))
    .then(updatedTrackNames => updatedTrackNames.join('\n'))
    .then(newPlaylist => updatePlaylist(options, newPlaylist))
  
  return res
}

module.exports = {
  axios,
  loginCredentials,
  googleSheetWebAppUrl,
  s3,
  fakeData,
  handle_api_requests,
  sendDataToGoogleSheets,
  getPlaylist,
}