'use strict';

var React = require('react/addons');

var Indicator = React.createClass({

  propTypes: {
    xPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    yPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    showAnnotation: React.PropTypes.func.isRequired,
    closeAnnotation: React.PropTypes.func.isRequired,
  },

  getDefaultProps: function() {
    return {
      xPos: -1000,
      yPos: -1000
    };
  },

  showAnnotation: function(evt) {
    var xPos = this.props.xPos;
    var yPos = this.props.yPos/* + React.findDOMNode(this).clientHeight/2*/;

    evt.preventDefault();

    this.props.showAnnotation({
      annotation: this.props.annotation,
      xPos: xPos,
      yPos: yPos
    });
  },

  closeAnnotation: function(evt) {
    evt.preventDefault();
    this.props.closeAnnotation();
  },

  render: function() {
    var styles = {
      'position': 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos
    };

    return (
      <div className="annotator-indicator"
           style={styles}
           onMouseOver={this.showAnnotation}
           onMouseLeave={this.closeAnnotation} />
    );
  }

});

module.exports = Indicator;