const fs = require('fs');
const cors = require('cors')
const axios = require('axios');
const express = require('express')
// const { S3Client, ListBucketsCommand } = require("@aws-sdk/client-s3");
const S3 = require('aws-sdk/clients/s3');
// console.log({SSX: S3})
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


{
  
  console.log({accessKeyId: process.env.accessKeyId, secretAccessKey: process.env.secretAccessKey})
  var s3 = new S3({
    accessKeyId: process.env.accessKeyId,
    secretAccessKey: process.env.secretAccessKey,
    endpoint: 'https://s3.storage.selcloud.ru',
    s3ForcePathStyle: true,
    region: 'ru-1',
  })
  console.log({s3})
  
  // Call S3 to list the buckets
  // s3.listBuckets(function(err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //   } else {
  //     console.log("Success", data.Buckets);
  //   }
  // });
  
  async function getPlaylist(bucket, objectKey) {
    // https://stackoverflow.com/a/52976521/9675926
    try {
      const params = {
        Bucket: bucket,
        Key: objectKey
      }
      
      const data = await s3.getObject(params).promise();
      
      return data.Body.toString('utf8');
    } catch (e) {
      throw new Error(`Could not retrieve file from S3: ${e.message}`)
    }
  }
  
  // To retrieve you need to use `await getObject()` or `getObject().then()`
  // const myObject = await getObject('my-bucket', 'path/to/the/object.txt');
  
  // https://developers.selectel.ru/docs/cloud-services/cloud-storage/s3/methods_s3_api/
  const testContainerName = 'test-bucket-container' // "bucket" means "container"
  const testObjectName = 'playServerlessTestBucket'
  
  // const dislikedTrackName = 'Cyril Walker - 03 - Cyril Walker - So Proud (Saturday Night,2012-01-01 ).mp3'
  // const myObject = getObject(testContainerName, testObjectName + '/' + 'tracksDay.txt')
  // .then(data => data.split((/\r\n|\r|\n/g)))
  // .then(trackNames => trackNames.filter(trackName => trackName !== dislikedTrackName))
  // .then(newTracklist => console.log(newTracklist.length))
  // // .then(console.log)
  
  var params = {
    Bucket: testContainerName,
    Key: 'testObjectNametxt.txt',
    // Body: 'Test-2',
    Body: ['Test-2', 'Tet-3'].join('\n'),
    ContentType: 'text/plain'
  };
  
  s3.upload(params, (err, data) => {
    if (err) {
      console.log(err, err.stack);
    } else {
      data.ваы = 'еуые'
      console.log(data);
    }
    /*
    data = {
        ETag: '0cbc6611f5540bd0809a388dc95a615b',
        Location: 'https://s3.storage.selcloud.ru/BucketName/ObjectName',
        key: 'ObjectName',
        Key: 'ObjectName',
        Bucket: 'BucketName'
    }
    */
    
  });
  
  // async function uploadPlaylist(bucket, objectKey) {
  async function uploadPlaylist(newPlaylist) {
    // update playlist
    try {
      // const
      var params = {
        Bucket: testContainerName,
        Key: 'testObjectNametxttets.txt',
        // Body: 'Test-2',
        Body: ['upload-test-2', 'Tets-4'].join('\n'),
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
      // const data = await s3.getObject(params).promise();
      
      // return data.Body.toString('utf8');
    } catch (e) {
      throw new Error(`Could not upload file to S3: ${e.message}`)
    }
  }
  
  uploadPlaylist().then(
  (res) => {
    console.log('upload-playlist')
    console.log({res1: res})
  }
  )
  
  {
    // var params = {
    //   Bucket: 'BucketName',
    //   Key: 'ObjectName'
    // };
    
    // var params = {
    //   Bucket: testContainerName,
    //   Key: testObjectName
    // };
    //
    // s3.getObject(params, (err, data) => {
    //   if (err) {
    //     console.log(err, err.stack);
    //   } else {
    //     console.log("Success", data.Body);
    //   }
    //   /*
    //   data = {
    //       AcceptRanges: 'bytes',
    //       LastModified: 2019-12-03T17:29:15.000Z,
    //       ContentLength: 4,
    //       ETag: '0cbc6611f5540bd0809a388dc95a615b',
    //       ContentType: 'application/octet-stream',
    //       Metadata: {},
    //       Body: <Buffer 54 65 73 74>
    //   }
    //   */
    // });
  }
}