(function () {
  'use strict';

  let keyCounter = 0;
  const allWaypoints = new Map();

  class Waypoint {
    constructor(options) {
      if (!options?.element) throw new Error('No element option passed to Waypoint constructor');
      if (!options?.handler) throw new Error('No handler option passed to Waypoint constructor');

      this.key = `waypoint-${keyCounter++}`;
      this.options = Object.assign({}, Waypoint.defaults, options);
      this.element = this.options.element;
      this.adapter = new Waypoint.Adapter(this.element);
      this.callback = options.handler;
      this.axis = this.options.horizontal ? 'horizontal' : 'vertical';
      this.enabled = this.options.enabled;
      this.triggerPoint = null;
      this.group = Waypoint.Group.findOrCreate({ name: this.options.group, axis: this.axis });
      this.context = Waypoint.Context.findOrCreateByElement(this.options.context);

      if (Waypoint.offsetAliases[this.options.offset]) {
        this.options.offset = Waypoint.offsetAliases[this.options.offset].call(this);
      }

      this.group.add(this);
      this.context.add(this);
      allWaypoints.set(this.key, this);
    }

    queueTrigger(direction) {
      this.group.queueTrigger(this, direction);
    }

    trigger(args) {
      if (this.enabled && this.callback) {
        this.callback(...args);
      }
    }

    destroy() {
      this.context.remove(this);
      this.group.remove(this);
      allWaypoints.delete(this.key);
    }

    disable() {
      this.enabled = false;
      return this;
    }

    enable() {
      this.context.refresh();
      this.enabled = true;
      return this;
    }

    next() {
      return this.group.next(this);
    }

    previous() {
      return this.group.previous(this);
    }

    static invokeAll(method) {
      allWaypoints.forEach(waypoint => waypoint[method]());
    }

    static destroyAll() {
      Waypoint.invokeAll('destroy');
    }

    static disableAll() {
      Waypoint.invokeAll('disable');
    }

    static enableAll() {
      Waypoint.Context.refreshAll();
      allWaypoints.forEach(waypoint => (waypoint.enabled = true));
    }

    static refreshAll() {
      Waypoint.Context.refreshAll();
    }

    static viewportHeight() {
      return window.innerHeight || document.documentElement.clientHeight;
    }

    static viewportWidth() {
      return document.documentElement.clientWidth;
    }
  }

  Waypoint.adapters = [];

  Waypoint.defaults = {
    context: window,
    continuous: true,
    enabled: true,
    group: 'default',
    horizontal: false,
    offset: 0,
  };

  Waypoint.offsetAliases = {
    'bottom-in-view': function () {
      return this.context.innerHeight() - this.adapter.outerHeight();
    },
    'right-in-view': function () {
      return this.context.innerWidth() - this.adapter.outerWidth();
    },
  };

  window.Waypoint = Waypoint;
})();
