const cors = require('cors')
const shared = require('./shared')
const express = require('express')
const {
  loginCredentials,
  handleApiRequests,
  sendDataToGoogleSheets,
} = shared;

// the app will crash if there are any syntax errors with this json
// const loginCredentials = JSON.parse(process.env.loginCredentials);
// log credentials to see if they are correct
console.log({loginCredentials})

const app = express()
const port = 3200

// parse application/json
// app.use(bodyParser.json())
app.use(express.json());

// allow cross-origin requests to pass
app.use(cors())

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

app.post('/test-login', async (req, res) => {
  const testLoginCredentials = [
    {
      login: 'username-test-1',
      password: 'very-strong-password-002'
    }
  ]
  
  const { login, password } = req.body
  const isLoggedIn = testLoginCredentials.filter(
    credentials => credentials.login === login && credentials.password === password
  ).length === 1
  
  res.send('test login route works, isLoggedIn: ' + isLoggedIn)
})


app.post('/sphere-api-middleware', async (req, res) => {
  console.log('sphere-api-middleware')
  
  const { login, password } = req.body
  const isLoggedIn = loginCredentials.filter(
    credentials => credentials.login === login && credentials.password === password
  ).length === 1
  
  if (isLoggedIn === false) {
    res.send({result: 'error', errorMessage: 'You must be logged in to proceed this action'})
    return
  }
  
  if (Object.keys(req.body).length === 0) {
    // no data provided
    res.send({ result: 'error', errorMessage: 'No data provided. Please provide some data' })
    return
  }
  
  const usersData = req.body;
  const data = await handleApiRequests(usersData);

  res.send(data);
})

// uncomment for testing in a console
// because this function will be executed automatically on each codechange
// sendDataToGoogleSheets(fakeData)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})