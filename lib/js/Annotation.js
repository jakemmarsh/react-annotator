'use strict';

var React = require('react/addons');

var Annotation = React.createClass({

  propTypes: {
    annotation: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      annotation: {}
    };
  },

  render: function() {
    var styles = {
      'position': 'absolute',
      'top': this.props.annotation.yPos,
      'left': this.props.annotation.xPos
    };

    console.log('visible annotation:', this.props.annotation);

    return (
      <div className="annotator-tooltip" style={styles}>
        <p>{this.props.annotation.text || ''}</p>
      </div>
    );
  }

});

module.exports = Annotation;