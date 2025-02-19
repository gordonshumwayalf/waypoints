(function () {
  'use strict';

  const { jQuery: $, Waypoint } = window;

  class Sticky {
    constructor(options) {
      this.options = $.extend({}, Waypoint.defaults, Sticky.defaults, options);
      this.element = this.options.element;
      this.$element = $(this.element);

      this.createWrapper();
      this.createWaypoint();
    }

    createWaypoint() {
      const { handler, direction, stuckClass } = this.options;

      this.waypoint = new Waypoint({
        ...this.options,
        element: this.wrapper,
        handler: (directionTriggered) => {
          const shouldBeStuck = direction.includes(directionTriggered);
          this.$wrapper.height(shouldBeStuck ? this.$element.outerHeight(true) : '');
          this.$element.toggleClass(stuckClass, shouldBeStuck);

          if (typeof handler === 'function') {
            handler.call(this, directionTriggered);
          }
        }
      });
    }

    createWrapper() {
      if (this.options.wrapper) {
        this.$element.wrap(this.options.wrapper);
      }
      this.$wrapper = this.$element.parent();
      this.wrapper = this.$wrapper[0];
    }

    destroy() {
      if (this.$element.parent()[0] === this.wrapper) {
        this.waypoint.destroy();
        this.$element.removeClass(this.options.stuckClass);
        if (this.options.wrapper) {
          this.$element.unwrap();
        }
      }
    }

    static defaults = {
      wrapper: '<div class="sticky-wrapper" />',
      stuckClass: 'stuck',
      direction: 'down right'
    };
  }

  Waypoint.Sticky = Sticky;
})();
