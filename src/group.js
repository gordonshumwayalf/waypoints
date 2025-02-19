(function () {
  'use strict';

  const groups = { vertical: {}, horizontal: {} };
  const { Waypoint } = window;

  class Group {
    constructor({ name, axis }) {
      this.name = name;
      this.axis = axis;
      this.id = `${name}-${axis}`;
      this.waypoints = [];
      this.triggerQueues = { up: [], down: [], left: [], right: [] };

      groups[axis][name] = this;
    }

    add(waypoint) {
      this.waypoints.push(waypoint);
    }

    clearTriggerQueues() {
      this.triggerQueues = { up: [], down: [], left: [], right: [] };
    }

    flushTriggers() {
      Object.entries(this.triggerQueues).forEach(([direction, waypoints]) => {
        const isReverse = direction === 'up' || direction === 'left';
        waypoints.sort(isReverse ? (a, b) => b.triggerPoint - a.triggerPoint : (a, b) => a.triggerPoint - b.triggerPoint);

        waypoints.forEach((waypoint, i) => {
          if (waypoint.options.continuous || i === waypoints.length - 1) {
            waypoint.trigger([direction]);
          }
        });
      });

      this.clearTriggerQueues();
    }

    next(waypoint) {
      this.waypoints.sort((a, b) => a.triggerPoint - b.triggerPoint);
      const index = this.waypoints.findIndex(wp => wp === waypoint);
      return index !== -1 && index < this.waypoints.length - 1 ? this.waypoints[index + 1] : null;
    }

    previous(waypoint) {
      this.waypoints.sort((a, b) => a.triggerPoint - b.triggerPoint);
      const index = this.waypoints.findIndex(wp => wp === waypoint);
      return index > 0 ? this.waypoints[index - 1] : null;
    }

    queueTrigger(waypoint, direction) {
      this.triggerQueues[direction].push(waypoint);
    }

    remove(waypoint) {
      this.waypoints = this.waypoints.filter(wp => wp !== waypoint);
    }

    first() {
      return this.waypoints[0] || null;
    }

    last() {
      return this.waypoints[this.waypoints.length - 1] || null;
    }

    static findOrCreate(options) {
      return groups[options.axis][options.name] || new Group(options);
    }
  }

  Waypoint.Group = Group;
})();
