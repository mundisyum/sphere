const fs = require('fs');
const cors = require('cors')
const axios = require('axios');
const express = require('express')
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


// {
//   // var S3 = require('@aws-sdk/client-s3');
//   //
//   var s3 = new S3({
//     accessKeyId: 'AccountNumber_UserName',
//     secretAccessKey: 'Password',
//     endpoint: 'https://s3.storage.selcloud.ru',
//     s3ForcePathStyle: true,
//     region: 'ru-1a',
//     apiVersion: 'latest'
//   });
//
// // Uploading an object
//
//   var params = {
//     Bucket: 'BucketName',
//     Key: 'ObjectName',
//     Body: 'Test'
//   };
//
//   s3.upload(params, (err, data) => {
//     if (err) {
//       console.log(err, err.stack);
//     } else {
//       console.log(data);
//     }
//     /*
//     data = {
//         ETag: '0cbc6611f5540bd0809a388dc95a615b',
//         Location: 'https://s3.storage.selcloud.ru/BucketName/ObjectName',
//         key: 'ObjectName',
//         Key: 'ObjectName',
//         Bucket: 'BucketName'
//     }
//     */
//
//   });
//
// // Retrieving object metadata
//
//   var params = {
//     Bucket: 'BucketName',
//     Key: 'ObjectName'
//   };
//
//   s3.headObject(params, (err, data) => {
//     if (err) {
//       console.log(err, err.stack);
//     } else {
//       console.log(data);
//     }
//     /*
//     data = {
//         AcceptRanges: 'bytes',
//         LastModified: 2019-12-03T17:29:15.000Z,
//         ContentLength: 4,
//         ETag: '0cbc6611f5540bd0809a388dc95a615b',
//         ContentType: 'application/octet-stream',
//         Metadata: {}
//     }
//     */
//   });
//
// // Retrieving an object
//
//   var params = {
//     Bucket: 'BucketName',
//     Key: 'ObjectName'
//   };
//
//   s3.getObject(params, (err, data) => {
//     if (err) {
//       console.log(err, err.stack);
//     } else {
//       console.log(data);
//     }
//     /*
//     data = {
//         AcceptRanges: 'bytes',
//         LastModified: 2019-12-03T17:29:15.000Z,
//         ContentLength: 4,
//         ETag: '0cbc6611f5540bd0809a388dc95a615b',
//         ContentType: 'application/octet-stream',
//         Metadata: {},
//         Body: <Buffer 54 65 73 74>
//     }
//     */
//   });
//
//
// // Deleting an object
//
//   var params = {
//     Bucket: 'BucketName',
//     Key: 'ObjectName'
//   };
//
//   s3.deleteObject(params, (err, data) => {
//     if (err) {
//       console.log(err, err.stack);
//     } else {
//       console.log(data);
//     }
//     /*
//     data = {
//     }
//     */
//   });
// }