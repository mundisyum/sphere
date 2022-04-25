const fs = require('fs');
const axios = require('axios');
const express = require('express')

const app = express()
const port = 3000

const googleSheetWebAppUrl = 'https://script.google.com/macros/s/AKfycbzDsOI2ntHfNNov03i6VCH2dcQxx-D0vaa6R0NnSGS6cpAqd6BaphtcQ_6uSHBMKfUb7g/exec';

app.get('/', (req, res) => {
  console.log('request from express.js route')
  makeRequest()
    .then(data => res.json(data))
})

function makeRequest() {
  // https://www.npmjs.com/package/axios
  return axios.get(googleSheetWebAppUrl)
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
