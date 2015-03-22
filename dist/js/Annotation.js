'use strict';

var React = require('react/addons');

var Annotation = React.createClass({displayName: "Annotation",

  propTypes: {
    xPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    yPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    annotation: React.PropTypes.object.isRequired,
    closeAnnotation: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      annotation: {}
    };
  },

  render: function() {
    var styles = {
      'position': 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos
    };

    console.log('annotation:', this.props.annotation);

    return (
      React.createElement("div", {className: "annotator-tooltip", style: styles}, 
        React.createElement("p", null, this.props.annotation.text || '')
      )
    );
  }

});

module.exports = Annotation;