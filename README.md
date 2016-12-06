# Demo Project LunchIT

This project is a demo of integration Auth0 with React

---

## Resources

- https://auth0.com/docs/quickstart/spa/react
- https://auth0.com/docs/overview
- https://auth0.com/blog/

--

On Auth0.com

* Setup auth0 account
* create a client application
* single page application
* setup your connections
* add localhost:3000 as a Callback URL
* add localhost:3000 as a CORS Origin

--

## Step 1

Setting up the API to be secure

```
npm install express-jwt dotenv -S
```

Grab the id and secret from auth0's dashboard
for our client access application.

Create a `.env` file

```
AUTH0_SECRET=[your secret here]
AUTH0_ID=[your id here]
```

Build our middlewhere

> Disclaimer: this middlewhere is built to work with
express api apps....

Create a `jwt-validate.js` file

```
require('dotenv').config()
const jwt = require('express-jwt')

module.exports = jwt({
  secret: new Buffer(process.env.AUTH0_SECRET, 'base64'),
  audience: process.env.AUTH0_ID
})
```

Example api test server

```
npm install json-server -S
json -I -f package.json -e \
  'this.scripts.start = "json-server db.json \
  --watch --port 4000 -m ./jwt-validate"' \
```

Create db.json

```
{
  persons: [],
  places: [],
  widgets: []
}
```

## Step 2

Setting the web app

Install auth0-lock

```
// In your web application
npm install auth0-lock -S
npm install jwt-decode moment -S
```

Create the `src/utils/auth.js` file

```
const Auth0Lock = require('auth0-lock').default
const jwtDecode = require('jwt-decode')
const moment = require('moment')

module.exports = function (clientId, domain) {
  const lock = new Auth0Lock(clientId, domain)

  lock.on('authenticated', _doAuthentication)

  function login () {
    lock.show()
  }

  let notifyFunction = null

  function _doAuthentication (authResult) {
    setToken(authResult.idToken)
    lock.getUserInfo(authResult.accessToken, function(error, profile) {
      if (error) return console.log(error.message)
      localStorage.setItem('profile', JSON.stringify(profile))
      if (notifyFunction) { notifyFunction(profile) }

    })
  }

  function logout () {
    localStorage.removeItem('id_token')
    localStorage.removeItem('profile')
  }

  function setToken (idToken) {
    localStorage.setItem('id_token', idToken)
  }

  function getToken () {
    return localStorage.getItem('id_token')
  }

  function loggedIn () {
    return getToken() ? true : false
  }

  function notify (fn) {
    notifyFunction = fn
  }
  // check it web token is expired
  // is so prompt the user to login again...
  if (getToken()) {
    const info = jwtDecode(getToken())
    // console.log('current ', moment().toString())
    // console.log('expires ', moment.unix(info.exp).toString())
    if (moment().isAfter(moment.unix(info.exp))) {
      logout()
    }
  }
  return {
    login,
    logout,
    loggedIn,
    setToken,
    getToken,
    notify
  }
}

```

Create a `.env` file and add our DOMAIN and ID

```
REACT_APP_API=[API URL]
REACT_APP_ID=[AUTH0 ID]
REACT_APP_DOMAIN=[AUTH0 DOMAIN]
```

In `src/app.js` we want to include the `src/utils/auth.js` file

```
const auth = require('./utils/auth')(
  process.env.REACT_APP_ID,
  process.env.REACT_APP_DOMAIN

)
```

Using React Router version 4, we want to create a Authorization Check
function in our `app.js` component

```
const MatchWhenAuthorized = ({component: Component, logout: logout, ...rest}) =>
<Match {...rest} render={props => auth.loggedIn() ?
  <div>
    <div style={{float: 'right'}}><button onClick={logout}>Logout</button></div>
    <Component {...props} logout={logout} />
  </div> : <Redirect to="/" /> } />

```

Set a logout flag on getInitialState of our App Component:

```
getInitialState () {
  return {
    logout: false
  }
}
```

Create a logout method on our App Component

```
logout(e) {
  auth.logout()
  this.setState({logout: true})
}
```

In the app with react router, use the HashRouter to
allow for Auth0 to have a consistent callback url.

> NOTE: This currently is a bug with auth0 or react, it
may be fixed in the future.

## Step 3

On your login component page add the auth.login method call
on componentDidMount.

```
componentDidMount() {
  this.props.auth.notify(profile => {
    this.setState({
      picture: profile.picture,
      nickname: profile.nickname
    })
  })

  if (!this.props.auth.loggedIn() &&
    this.props.location.hash.indexOf('access_token') === -1) {
    this.props.auth.login()
  }

  if (localStorage.getItem('profile')) {
    const profile = JSON.parse(localStorage.getItem('profile'))
    this.setState({
      picture: profile.picture,
      nickname: profile.nickname
    })
  }
},
```

## Step 4

In order to make secure api calls, we need to pass the jwt token in
the Authorization header as a Bearer token.

```
const setHeader = (header = {}) => {
  header.Authorization = `Bearer ${localStorage.getItem('id_token')}`
  return header
}
```

## Summary

Notes:

* Notify React when auth status changes - like logout
* Performing jwt exp check when the app is initialized to confirm that the
token is not expired.
* Make sure to run both the api directory and web directory at the same time.

---
