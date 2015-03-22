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
        annotationText: null,
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
      });
    },

    _saveAnnotation: function() {
      this.addAnnotation({
        text: this.state.annotationText,
        newAnnotationXPos: this.state.newAnnotationXPos,
        newAnnotationYPos: this.state.newAnnotationYPos
      }, function() {
        this.setState({
          annotationText: '',
          newAnnotationXPos: null,
          newAnnotationYPos: null
        });
      }.bind(this));
    },

    _setVisibleAnnotation: function(options, cb) {
      cb = cb || function() {};

      console.log('setting as visible:', options.annotation);

      this.setState({
        visibleAnnotation: options.annotation,
        annotationXPos: options.xPos,
        annotationYPos: options.yPos
      }, function() {
        cb();
        this._renderAnnotatorLayer();
      }.bind(this));
    },

    _closeAnnotation: function(cb) {
      cb = cb || function() {};

      this.setState({
        annotation: null,
        annotationXPos: null,
        annotationYPos: null
      }, function() {
        cb();
        this._unrenderAnnotatorLayer();
      }.bind(this));
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
                     xPos={annotation.xPos}
                     yPos={annotation.yPos}
                     annotation={annotation}
                     setAnnotation={this._setVisibleAnnotation}
                     closeAnnotation={this._closeAnnotation} />
        );
      }.bind(this));
    },

    renderAnnotationOrForm: function() {
      var element = null;

      if ( this.state.visibleAnnotation ) {
        element = (
          <Annotation annotation={this.state.visibleAnnotation}
                      xPos={this.state.annotationXPos}
                      yPos={this.state.annotationYPos} />
        );
      } else if ( this.state.addingAnnotation ) {
        element = (
          <AnnotatorForm />
        );
      }

      return element;
    }

  };

  return mixin;

};