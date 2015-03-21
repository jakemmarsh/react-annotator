'use strict';

var React      = require('react/addons');
var _          = require('lodash');

var Indicator  = require('./Indicator');
var Annotation = require('./Annotation');

module.exports = function(settings) {

  var mixin = {

    getInitialState: function() {
      return {
        annotations: settings.annotations || [],
        visibleAnnotation: settings.defaultAnnotation || null,
        addingAnnotation: false,
        annotationText: null,
        xPos: null,
        yPos: null
      };
    },

    _renderLayer: function() {
      // By calling this method in componentDidMount() and componentDidUpdate(), you're effectively
      // creating a "wormhole" that funnels React's hierarchical updates through to a DOM node on an
      // entirely different part of the page.
      React.render(this.renderAnnotation(), this._target);
    },

    _unrenderLayer: function() {
      React.unmountComponentAtNode(this._target);
    },

    componentDidUpdate: function(prevProps, prevState) {
      var hasNewAnnotation = this.state.visibleAnnotation && !_.isEqual(this.state.visibleAnnotation, prevState.visibleAnnotation);
      var hasNewX = this.state.xPos !== prevState.xPos;
      var hasNewY = this.state.yPos !== prevState.yPos;

      if ( hasNewAnnotation || hasNewX || hasNewY ) {
        this._renderLayer();
      }
    },

    componentDidMount: function() {
      this._annotationTarget = settings.element ? document.querySelector(settings.element) : null;

      if ( this.state.visibleAnnotation ) {
        // Appending to the body is easier than managing the z-index of everything on the page.
        // It's also better for accessibility and makes stacking a snap (since components will stack
        // in mount order).
        this._target = document.createElement('div');
        document.body.appendChild(this._target);
        this._renderLayer();
      }

      if ( this._annotationTarget ) {
        this._annotationTarget.addEventListener('click', this.beginAddProcess, false);
      }
    },

    componentWillUnmount: function() {
      this._unrenderLayer();
      document.body.removeChild(this._target);
      this._annotationTarget.removeEventListener('click', this.beginAddProcess, false);
    },

    beginAddProcess: function(evt) {
      var xPos = evt.clientX - this._annotationTarget.clientLeft;
      var yPos = evt.clientY - this._annotationTarget.clientTop;

      this.setState({
        addingAnnotation: true,
        xPos: xPos,
        yPos: yPos
      });
    },

    saveAnnotation: function() {
      this.addAnnotation({
        text: this.state.annotationText,
        xPos: this.state.xPos,
        yPos: this.state.yPos
      }, function() {
        this.setState({
          annotationText: '',
          xPos: null,
          yPos: null
        });
      }.bind(this));
    },

    setVisibleAnnotation: function(annotation, cb) {
      cb = cb || function() {};

      this.setState({ visibleAnnotation: annotation }, cb);
    },

    closeAnnotation: function(cb) {
      cb = cb || function() {};

      this.setState({ annotation: null }, cb);
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

    deleteAnnotation: function(annotationToDelete, cb) {
      var annotationsCopy = _.reject(this.settings.annotations, function(annotation) {
        return _.isEqual(annotation, annotationToDelete);
      });

      cb = cb || function() {};

      this.setState({ annotations: annotationsCopy }, cb);
    },

    renderAnnotationIndicators: function() {
      return this.settings.annotations.map(function(annotation, index) {
        return (
          <Indicator key={index}
                     xPos={annotation.xPos}
                     yPos={annotation.yPos}
                     annotation={annotation} />
        );
      });
    },

    renderAnnotation: function() {
      var element = null;

      if ( this.state.visibleAnnotation ) {
        return (
          <Annotation annotation={this.state.visibleAnnotation} />
        );
      } else if ( this.state.addingAnnotation ) {
        // TODO: what should this element be? A form?
        return (
          <div />
        );
      }

      return element;
    }

  };

  return mixin;

};