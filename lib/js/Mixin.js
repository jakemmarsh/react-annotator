'use strict';

var React          = require('react/addons');
var _              = require('lodash');

var Indicator      = require('./Indicator');
var Annotation     = require('./Annotation');
var AnnotatorForm  = require('./AnnotatorForm');

module.exports = function(settings) {

  var mixin = {

    _target: null,

    getInitialState: function() {
      return {
        annotations: settings.annotations || [],
        visibleAnnotation: null,
        annotationXPos: null,
        annotationYPos: null,
        addingAnnotation: false,
        newAnnotationXPos: null,
        newAnnotationYPos: null
      };
    },

    _renderAnnotatorLayer: function() {
      // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
      // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
      // entirely different part of the page.
      if ( !this._target ) {
        this._target = document.createElement('div');
        document.body.appendChild(this._target);
      }

      React.render(this.renderAnnotationOrForm(), this._target);
    },

    _unrenderAnnotatorLayer: function() {
      if ( this._target ) {
        React.unmountComponentAtNode(this._target);
      }
    },

    _beginAddProcess: function(evt) {
      var xPos = parseInt(evt.clientX) - parseInt(this._annotationTarget.clientLeft);
      var yPos = parseInt(evt.clientY) - parseInt(this._annotationTarget.clientTop);

      this.setState({
        addingAnnotation: true,
        newAnnotationXPos: xPos,
        newAnnotationYPos: yPos
      }, this._renderAnnotatorLayer);
    },

    _saveAnnotation: function(text) {
      this.addAnnotation({
        text: text,
        xPos: this.state.newAnnotationXPos,
        yPos: this.state.newAnnotationYPos
      }, this._closeForm);
    },

    _setVisibleAnnotation: function(options) {
      this.setState({
        visibleAnnotation: options.annotation,
        annotationXPos: options.xPos,
        annotationYPos: options.yPos
      }, this._renderAnnotatorLayer);
    },

    _closeAnnotation: function() {
      this.setState({
        visibleAnnotation: null,
        annotationXPos: null,
        annotationYPos: null
      }, this._unrenderAnnotatorLayer);
    },

    _closeForm: function() {
      this.setState({
        addingAnnotation: false,
        newAnnotationXPos: null,
        newAnnotationYPos: null
      }, this._unrenderAnnotatorLayer);
    },

    componentDidMount: function() {
      this._annotationTarget = settings.element ? document.querySelector(settings.element) : null;

      if ( this.state.visibleAnnotation ) {
        // Appending to the body is easier than managing the z-index of everything on the page.
        // It's also better for accessibility and makes stacking a snap (since components will stack
        // in mount order).
        this._renderAnnotatorLayer();
      }

      if ( this._annotationTarget ) {
        this._annotationTarget.addEventListener('click', this._beginAddProcess, false);
      }
    },

    componentWillUnmount: function() {
      if ( this._target ) {
        this._unrenderAnnotatorLayer();
        document.body.removeChild(this._target);
      }

      if ( this._annotationTarget ) {
        this._annotationTarget.removeEventListener('click', this._beginAddProcess, false);
      }
    },

    serializeAnnotations: function() {
      return this.state.annotations;
    },

    addAnnotation: function(annotation, cb) {
      var annotationsCopy = this.state.annotations;

      cb = cb || function() {};

      annotationsCopy.push(annotation);

      this.setState({ annotations: annotationsCopy }, cb);
    },

    removeAnnotation: function(annotationToDelete, cb) {
      var annotationsCopy = _.reject(this.state.annotations, function(annotation) {
        return _.isEqual(annotation, annotationToDelete);
      });

      cb = cb || function() {};

      this.setState({ annotations: annotationsCopy }, cb);
    },

    renderAnnotationIndicators: function() {
      return _.map(this.state.annotations, function(annotation, index) {
        return (
          <Indicator key={index}
                     annotation={annotation}
                     showAnnotation={this._setVisibleAnnotation}
                     closeAnnotation={this._closeAnnotation} />
        );
      }.bind(this));
    },

    renderAnnotationOrForm: function() {
      var element = null;

      if ( this.state.addingAnnotation ) {
        element = (
          <AnnotatorForm xPos={this.state.newAnnotationXPos}
                         yPos={this.state.newAnnotationYPos}
                         saveAnnotation={this._saveAnnotation}
                         closeForm={this._closeForm} />
        );
      } else if ( this.state.visibleAnnotation ) {
        element = (
          <Annotation annotation={this.state.visibleAnnotation} />
        );
      }

      return element;
    }

  };

  return mixin;

};