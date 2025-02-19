(function () {
  'use strict';

  const displayNoneMessage = `You have a Waypoint element with display: none. 
For more information on why this is a bad idea, read:
http://imakewebthings.com/waypoints/guides/debugging/#display-none`;

  const fixedMessage = `You have a Waypoint element with fixed positioning. 
For more information on why this is a bad idea, read:
http://imakewebthings.com/waypoints/guides/debugging/#fixed-position`;

  function checkWaypointStyles() {
    if (!window.Waypoint || !window.Waypoint.Context) {
      console.warn('Waypoint library is not loaded.');
      return;
    }

    const originalRefresh = window.Waypoint.Context.prototype.refresh;

    window.Waypoint.Context.prototype.refresh = function () {
      Object.values(this.waypoints).forEach(waypointGroup => {
        Object.values(waypointGroup).forEach(waypoint => {
          if (!waypoint.enabled) return;

          const style = window.getComputedStyle(waypoint.element);
          if (!style) return;

          if (style.display === 'none') console.warn(displayNoneMessage);
          if (style.position === 'fixed') console.warn(fixedMessage);
        });
      });

      return originalRefresh.call(this);
    };
  }

  checkWaypointStyles();
})();
