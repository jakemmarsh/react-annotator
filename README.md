react-annotator
===============

A React mixin to allow for user annotations directly on images, similar to [Red Pen](https://redpen.io/). An example can be seen [here](http://jakemmarsh.com/react-annotator/).

---

### Getting Started

1. `npm install --save react-annotator`
2. `var ReactAnnotatorMixin = require('react-annotator').Mixin`
3. `mixins: [ReactAnnotatorMixin({settings})]`
4. call `this.renderAnnotationIndicators()` somewhere in the component's `render()` function in order to render the individual indicators.

```javascript
var ReactAnnotatorMixin = require('react-annotator').Mixin;
var annotatorSettings = {
  element: '.annotator-parent-image',
  annotations: [
    {
      text: 'This is an annotation on the image.',
      xPos: 127,
      yPos: 431
    },
    {
      text: 'This is another annotation on the image.',
      xPos: 513,
      yPos: 289
    }
  ]
};

var App = React.createClass({

  mixins: [ReactAnnotatorMixin(annotatorSettings)],

  ...

  render: function() {
    return (
      <div>
        ...
        {this.renderAnnotationIndicators()}
      </div>
    );
  }

});
```

---

### Options

A Javascript object is passed to the `ReactAnnotatorMixin` to specify options, as well as any previously created or saved annotations (there is also a method to define these asychronously, discussed below.) The options are:

- `element` (string): the element selector for the parent element which the annotations are intended for. No default value, and the annotation system will not be rendered without a valid element.
- `annotations` (array): the array of annotations to be displayed on the parent element. Defaults to an empty array.

Each "annotation" in the array represents one indicator on the parent element, which triggers its textual annotation when triggered. An annotation has the following structure:

```json
{
  "text": "The tip, comment, note, etc. that was saved for this annotation.",
  "xPos": "The X coordinate of the annotation indicator, in relation to the parent element.",
  "yPos": "The Y coordinate of the annotation indicator, in relation to the parent element."
}
```

---

### Methods

Upon including the mixin, a handful of functions will be available to your component. Some of these are interned strictly for internal use in the mixin (all prefixed with an underscore), but there are a few that are intended to provide you with more complex options and interactions. These are outlined below.

##### `setAnnotations(annotations, cb)`

This function is intended to provide you with a method to asynchronously define your annotations (if they need to be fetched from a database, etc.) It takes a list of annotations (of the form discussed earlier), along with an optional callback function as parameters. This will completely overwrite any existing annotations, setting `this.state.annotations` equal to the `annotations` parameter. Once the state is updated, the callback function will be invoked.

##### `addAnnotation(annotation, cb)`

This function takes an annotation (of the form discussed earlier), along with an optional callback function as parameters. It pushes the new annotation onto the existing list, updates its state, and invokes the callback function.

##### `removeAnnotation(annotation, cb)`

This function takes an annotation (of the form discussed earlier), along with an optional callback function as parameters. It iterates over the current list of annotations, removing any determined to be equal to the annotation passed (using [lodash](https://lodash.com/)'s `_.isEqual` function.) The state is then updated accordingly, and the callback function is invoked.

##### `serializeAnnotations()`

This returns the list of annotations currently within the mixin's state. This is essentially a wrapper for the value `this.state.annotations`.

---

### Styling

Some basic styling is provided in `/dist/css/annotator.css`. This can either be included directly in your project, or used as a base for your own custom styles. Below, the HTML structure of the annotation system is also outlined for custom styling.

The annotation system consists of two main elements for each annotation: an `indicator` and a `tooltip`. An indicator is a small, simple element positioned absolutely on the parent element. Upon hover, the associated annotation is triggered which the user can then read.

In addition, when an empty space is clicked on the parent element an annotation `form` is triggered. This allows the user to enter the annotation text to be saved for that point.

##### Indicator

```html
<div class="annotator-indicator"></div>
```

##### Annotation

```html
<div class="annotator-annotation">
  {Text of annotation.}
</div>
```

##### Form

```html
<form class="annotator-form">
  <textarea class="annotator-form-textarea"></textarea>
  <div class="annotator-form-button-container">
    <button class="annotator-btn cancel">Cancel</button>
    <button class="annotator-btn save">Save</button>
  </div>
</form>
```

---

### Testing

All tests for this package are within the `__tests__/` directory. If you wish to run the tests:

1. `git clone git@github.com:jakemmarsh/react-annotator.git`
2. `cd react-annotator`
3. `npm install`
4. `npm test`
