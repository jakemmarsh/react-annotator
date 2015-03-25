'use strict';

var React = require('react/addons');

var Annotation = React.createClass({

  propTypes: {
    xPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    yPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    position: React.PropTypes.string.isRequired,
    annotation: React.PropTypes.object.isRequired
  },

  getDefaultProps: function() {
    return {
      xPos: -1000,
      yPos: -1000,
      position: 'bottom',
      annotation: {}
    };
  },

  render: function() {
    var classes = 'annotator-tooltip ' + this.props.position;
    var styles = {
      'position': 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos
    };

    console.log('visible annotation:', this.props.annotation);

    return (
      <div className={classes} style={styles}>
        <p>{this.props.annotation.text || ''}</p>
      </div>
    );
  }

});

module.exports = Annotation;