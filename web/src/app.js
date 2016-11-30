const React = require('react')
const { Match, BrowserRouter } = require('react-router')
const { Home, About, Favorites, FavoriteForm } = require('./pages')

const App = React.createClass({
  render() {
    return (
      <BrowserRouter>
        <div>
          <Match exactly pattern="/" component={Home} />
          <Match exactly pattern="/favorites" component={Favorites} />
          <Match pattern="/favorites/new" component={FavoriteForm} />
          <Match pattern="/about" component={About} />
        </div>
      </BrowserRouter>

    )
  }
})

module.exports = App
