fd = {
  createFeatureSet: function() {
    return {
      component : [],
      system    : [],
      category  : [],
      event     : []
    };
  }
};

// `events` stores bitmasks for events/categories
// must not be overwritten as systems might capture reference
// to old object and end up with stale data.
Object.defineProperty(fd, 'events', {
  value: {},
  writable: false
});

Object.defineProperty(fd, 'eventAsync', {
  value: {},
  writable: false
});