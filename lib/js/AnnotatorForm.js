'use strict';

var React = require('react/addons');

var AnnotatorForm = React.createClass({

  mixins: [React.addons.LinkedStateMixin],

  propTypes: {
    xPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    yPos: React.PropTypes.oneOfType([
      React.PropTypes.number,
      React.PropTypes.string
    ]).isRequired,
    saveAnnotation: React.PropTypes.func.isRequired,
    closeForm: React.PropTypes.func.isRequired
  },

  getInitialState: function() {
    return {
      text: ''
    };
  },

  _handleEscapeKey: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '27' || keyCode === 27 ) {
      this.props.closeForm();
    }
  },

  _submitOnEnter: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '13' || keyCode === 13 ) {
      evt.preventDefault();
      this.props.saveAnnotation(this.state.text);
    }
  },

  componentDidMount: function() {
    document.addEventListener('keypress', this._handleEscapeKey, false);
  },

  componentWillUnmount: function() {
    document.removeEventListener('keypress', this._handleEscapeKey, false);
  },

  render: function() {
    var styles = {
      'position': 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos
    };

    return (
      <div className="annotator-form" style={styles}>
        <textarea placeholder="Write a comment..."
                  valueLink={this.linkState('text')}
                  onKeyPress={this._submitOnEnter} />
      </div>
    );
  }

});

module.exports = AnnotatorForm;