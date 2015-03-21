react-annotator
===============

A React mixin to allow for user annotations directly on images. An example can be seen [here](http://jakemmarsh.com/react-annotator/).

---

### Getting Started

1. `npm install --save react-annotator`
2. `var ReactAnnotatorMixin = require('react-annotator').Mixin`

```javascript
var ReactAnnotatorMixin = require('react-annotator').Mixin;
var annotatorSettings = {

};

var App = React.createClass({

  mixins: [ReactAnnotatorMixin(annotatorSettings, 'img')],

  ...

});
```

---

### Options

---

### Methods

---

### Styling

##### Indicator

##### Annotation

---

### Testing

All tests for this package are within the `__tests__/` directory. If you wish to run the tests:

1. `git clone git@github.com:jakemmarsh/react-annotator.git`
2. `cd react-annotator`
3. `npm install`
4. `npm test`
