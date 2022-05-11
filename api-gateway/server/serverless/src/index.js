const axios = require('axios');

module.exports.main = (event) => {
  console.log({testLib: axios})
  return `
    Hello from serverless!
    Event: ${event}
  `
}