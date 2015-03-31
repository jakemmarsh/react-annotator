'use strict';

var React          = require('react/addons');
var _              = require('lodash');

var Indicator      = require('./Indicator');
var Annotation     = require('./Annotation');
var AnnotatorForm  = require('./AnnotatorForm');

module.exports = function(settings) {

  var mixin = {

    _target: null,

    _annotationTarget: null,

    _addCallback: settings.addCallback || function() {},

    getInitialState: function() {
      return {
        annotations: settings.annotations || [],
        visibleAnnotation: null,
        annotationXPos: null,
        annotationYPos: null,
        annotationPosition: null,
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
      var xPos = evt.clientX;
      var yPos = evt.clientY;

      if ( !this.state.visibleAnnotation ) {
        this.setState({
          addingAnnotation: true,
          newAnnotationXPos: xPos,
          newAnnotationYPos: yPos
        }, this._renderAnnotatorLayer);
      }
    },

    _saveAnnotation: function(text) {
      var rect = this._annotationTarget.getBoundingClientRect();
      var annotation = {
        text: text,
        xPos: this.state.newAnnotationXPos - rect.left,
        yPos: this.state.newAnnotationYPos - rect.top
      };

      this.addAnnotation(annotation, function() {
        this._addCallback(annotation);
        this._closeForm();
      }.bind(this));
    },

    _calculateAnnotationPosition: function(options) {
      var position = null;

      if ( options.yPos + 250 > document.body.offsetHeight ) {
        position = 'right';
      } else {
        position = 'bottom';
      }

      return position;
    },

    _setVisibleAnnotation: function(options) {
      var rect = this._annotationTarget.getBoundingClientRect();

      options.xPos += rect.left;
      options.yPos += rect.top;
      this.setState({
        addingAnnotation: false,
        newAnnotationXPos: null,
        newAnnotationYPos: null,
        visibleAnnotation: options.annotation,
        annotationXPos: options.xPos,
        annotationYPos: options.yPos,
        annotationPosition: this._calculateAnnotationPosition(options)
      }, this._renderAnnotatorLayer);
    },

    _closeAnnotation: function() {
      this.setState({
        visibleAnnotation: null,
        annotationXPos: null,
        annotationYPos: null,
        annotationPosition: null
      }, this._unrenderAnnotatorLayer);
    },

    _closeForm: function() {
      this.setState({
        addingAnnotation: false,
        newAnnotationXPos: null,
        newAnnotationYPos: null
      }, this._unrenderAnnotatorLayer);
    },

    _bindClick: function() {
      this._annotationTarget = settings.element ? document.querySelector(settings.element) : null;

      if ( this._annotationTarget ) {
        this._annotationTarget.addEventListener('click', this._beginAddProcess, false);
      }
    },

    _unbindClick: function() {
      if ( this._annotationTarget ) {
        this._annotationTarget.removeEventListener('click', this._beginAddProcess, false);
      }
    },

    componentDidMount: function() {
      if ( this.state.visibleAnnotation ) {
        // Appending to the body is easier than managing the z-index of everything on the page.
        // It's also better for accessibility and makes stacking a snap (since components will stack
        // in mount order).
        this._renderAnnotatorLayer();
      }

      this._bindClick();
    },

    componentDidUpdate: function() {
      this._bindClick();
    },

    componentWillUnmount: function() {
      var isRendered = this.state.addingAnnotation || this.state.visibleAnnotation;

      if ( this._target && isRendered ) {
        this._unrenderAnnotatorLayer();
        document.body.removeChild(this._target);
      }

     this._unbindClick();
    },

    setAddCallback: function(cb) {
      this._addCallback = cb || function() {};
    },

    getAnnotations: function() {
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
          <Annotation xPos={this.state.annotationXPos}
                      yPos={this.state.annotationYPos}
                      position={this.state.annotationPosition}
                      annotation={this.state.visibleAnnotation} />
        );
      }

      return element;
    }

  };

  return mixin;

};