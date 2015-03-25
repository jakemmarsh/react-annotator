'use strict';

var React = require('react/addons');

var Indicator = React.createClass({

  propTypes: {
    annotation: React.PropTypes.object.isRequired,
    showAnnotation: React.PropTypes.func.isRequired,
    closeAnnotation: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      annotation: {
        text: '',
        xPos: -1000,
        yPos: -1000
      }
    };
  },

  stopPropagation: function(evt) {
    // Prevent clicks on indicators from triggering new annotation form
    evt.preventDefault();
    evt.stopPropagation();
  },

  showAnnotation: function(evt) {
    var element = this.getDOMNode();
    var xPos = this.props.annotation.xPos;
    var yPos = this.props.annotation.yPos + element.offsetHeight;

    if ( evt ) { evt.preventDefault(); }

    this.props.showAnnotation({
      annotation: this.props.annotation,
      xPos: xPos,
      yPos: yPos
    });
  },

  closeAnnotation: function(evt) {
    if ( evt ) { evt.preventDefault(); }

    this.props.closeAnnotation();
  },

  render: function() {
    var styles = {
      'position': 'absolute',
      'top': this.props.annotation.yPos,
      'left': this.props.annotation.xPos
    };

    return (
      <div ref="self"
           className="annotator-indicator"
           style={styles}
           onMouseOver={this.showAnnotation}
           onClick={this.stopPropagation} />
    );
  }

});

module.exports = Indicator;