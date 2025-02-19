(function () {
  'use strict';

  const noop = () => {};
  const { Waypoint } = window;

  class Inview {
    constructor(options) {
      this.options = Waypoint.Adapter.extend({}, Inview.defaults, options);
      this.axis = this.options.horizontal ? 'horizontal' : 'vertical';
      this.waypoints = [];
      this.element = this.options.element;
      this.createWaypoints();
    }

    createWaypoints() {
      const configs = {
        vertical: [
          { down: 'enter', up: 'exited', offset: '100%' },
          { down: 'entered', up: 'exit', offset: 'bottom-in-view' },
          { down: 'exit', up: 'entered', offset: 0 },
          { 
            down: 'exited', 
            up: 'enter', 
            offset: () => -this.adapter.outerHeight() 
          }
        ],
        horizontal: [
          { right: 'enter', left: 'exited', offset: '100%' },
          { right: 'entered', left: 'exit', offset: 'right-in-view' },
          { right: 'exit', left: 'entered', offset: 0 },
          { 
            right: 'exited', 
            left: 'enter', 
            offset: () => -this.adapter.outerWidth() 
          }
        ]
      };

      configs[this.axis].forEach(config => this.createWaypoint(config));
    }

    createWaypoint(config) {
      this.waypoints.push(new Waypoint({
        context: this.options.context,
        element: this.options.element,
        enabled: this.options.enabled,
        handler: direction => this.options[config[direction]]?.call(this, direction),
        offset: config.offset,
        horizontal: this.options.horizontal
      }));
    }

    destroy() {
      this.waypoints.forEach(waypoint => waypoint.destroy());
      this.waypoints = [];
    }

    disable() {
      this.waypoints.forEach(waypoint => waypoint.disable());
    }

    enable() {
      this.waypoints.forEach(waypoint => waypoint.enable());
    }

    static defaults = {
      context: window,
      enabled: true,
      enter: noop,
      entered: noop,
      exit: noop,
      exited: noop
    };
  }

  Waypoint.Inview = Inview;
})();
