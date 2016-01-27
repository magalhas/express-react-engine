# express-react-engine

This is an [Express](http://expressjs.com) view engine for [React's](http://http://facebook.github.io/react/) JSX that supports server side rendering and **it is not limited to static markdown**.

## Usage

```
npm install express-react-engine react react-dom
```

Make sure you install `react` and `react-dom` as dependencies.


### Add it to your Express App

```javascript
var ReactEngine = require('express-react-engine');
var app = express();

app.set('views', __dirname + '/components');
app.engine('jsx', ReactEngine());
```

Change your *views directory* to match your *components directory* and set `jsx` as your view engine.


## Options

`wrapper` is a React component that renders the Html element as well as the initial props and children Html.

### Example

``` javascript
app.engine('jsx', reactEngine({wrapper: 'html.jsx'}));
```

**/components/html.jsx**
``` javascript
var React = require('react');

var Html = React.createClass({
  render: function () {
    return (
      <html>
        <head>
          <title>{this.props.props.title}</title>
          <link rel='stylesheet' type='text/css' href='/stylesheets/style.css' />
        </head>
        <body>
            <div id='view' dangerouslySetInnerHTML={{__html: this.props.body}} />
            <script type='application/json' dangerouslySetInnerHTML={{__html: JSON.stringify(this.props.props)}} />
            <script src='/javascripts/bundle.js' />
        </body>
      </html>
    );
  }
});

module.exports = Html;

```

## Views

Your `views` can be simple modules that export a React Component.

```javascript
var React = require('react');

var Home = React.createClass({
  render: function () {
    return (
      <div>
        E.T. Phone Home!
      </div>
    );
  }
});

module.exports = Home;
```

## Routes

You can use your `routes` the same way you always did in **Express**. Just render the React component instead of a jade/hjs/hbs template. Passing an object to the component as `props` is also straightforward, just add it as the second argument of `res.render()`.

```javascript
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
  res.render('home/index.jsx', { foo: 'bar' });
});

module.exports = router;

```
Now `foo` will be available within the component as `this.props.foo`.

## Layouts

Obviously you can still use Layouts if you want. Just create a component that will render the "layout stuff" and pass him via props the component that you want to be laid out :)
