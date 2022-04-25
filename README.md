# Sphere

## Goals
  - create secure api gateway, which handles application logic
    - [X] create google sheet playground table
    - [ ] change like/dislike http method from GET to POST
      - [ ] on client
      - [X] on google apps script
    - [ ] create serverless api gateway which filters non-logged-in users
    - [ ] create serverless api gateway which manages requests
    - [ ] delete song from playlist if dislike happened
      - [ ] on server (from txt file)
      - [ ] on client (remove from current shuffled playlist)
    - [ ] create a foundation for serverless function (create package.json and add additional dependencies)
    - [ ] [optional for now] set environment variables for google sheet web app
    - [ ] [optional for now] set environment variables for users and their predefined passwords
  - create frontend login auth logic
    - [X] show popup
    - [X] store password in local storage
    - [X] check if user is logged-in. if not logged-in -> show login popup 
    - [ ] show error message if password is incorrect
  - connect frontend with backend
    - [ ] connect test frontend page with test backend locally (not via serverless function for now)
    - [ ] connect frontend auth with backend
  - misc (other)
    - [ ] make like/dislike request only after song ends
