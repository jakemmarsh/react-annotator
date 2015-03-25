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

  componentDidMount: function() {
    this.refs.textarea.getDOMNode().focus();
  },

  componentDidUpdate: function(prevProps) {
    if ( prevProps.xPos !== this.props.xPos || prevProps.yPos !== this.props.yPos ) {
      this.setState({ text: '' });
      this.refs.textarea.getDOMNode().focus();
    }
  },

  handleKeyDown: function(evt) {
    var keyCode = evt.keyCode || evt.which;

    if ( keyCode === '27' || keyCode === 27 ) {
      this.props.closeForm();
    } else if ( keyCode === '13' || keyCode === 13 ) {
      evt.preventDefault();
      this.props.saveAnnotation(this.state.text);
    }
  },

  render: function() {
    var styles = {
      'position': 'absolute',
      'top': this.props.yPos,
      'left': this.props.xPos
    };

    return (
      <div className="annotator-form" style={styles}>
        <textarea ref="textarea"
                  placeholder="Write a comment..."
                  valueLink={this.linkState('text')}
                  onBlur={this.props.closeForm}
                  onKeyDown={this.handleKeyDown} />
      </div>
    );
  }

});

module.exports = AnnotatorForm;