const React = require('react')
const { Link } = require('react-router')

const Home = React.createClass({
  render() {
    return (
      <div>
        <h1>LunchIt</h1>
        <h3>Menu</h3>
        <ul>
          <li>
            <a href="/favorites">Favorites</a>
          </li>
          <li>
            <a href="">Circles</a>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </div>
    )
  }
})

module.exports = Home
