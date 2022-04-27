const fs = require('fs');
const cors = require('cors')
const axios = require('axios');
const express = require('express')

const app = express()
const port = 3200

// parse application/json
// app.use(bodyParser.json())
app.use(express.json());

// allow cross-origin requests to pass
app.use(cors())

const googleSheetWebAppUrl = 'https://script.google.com/macros/s/AKfycbzQJ3ISgcq7pFqIbBZzIyKT4Ejc7kbWUYeAmdwRJLAFfa43luvTj_NLSx2mAT1q1chI9g/exec';

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
// makeRequest()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
