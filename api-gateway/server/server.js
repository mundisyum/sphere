const fs = require('fs');
const axios = require('axios');
const express = require('express')

const app = express()
const port = 3115

const googleSheetWebAppUrl = 'https://script.google.com/macros/s/AKfycbw2nnzCE0PAxGbHe35fgaJeip7Gmw0c49YCaKYmE2UqFBFkM26EMdx3Z4xW4qukz6v0WQ/exec';

app.get('/', (req, res) => {
  console.log('request from express.js route')
  makeRequest()
  .then(data => res.json(data))
})

function makeRequest() {
  // https://www.npmjs.com/package/axios
  return axios.post(googleSheetWebAppUrl, {
    place: 'axios',
    value: 'axios',
    songname: 'axios',
    playlistname: 'axios'
  })
  .then(function (response) {
    // handle success
    console.log(response);
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
