;(function() {
  
  var DEFAULT_LOGGER = function(msg, prefix, cssClass) {
    if (prefix) msg = prefix + ' ' + msg;
    console.log(msg);
  }
  
  function Logger(logLine) {
    this.logLine = logLine || DEFAULT_LOGGER;
  }
  
  Logger.prototype = {
    setLogger : function(fn) { this.logLine = fn; },
    message   : function() { this.logLine(msg); },
    debug     : function(msg) { this.logLine(msg, '[DEBUG]', 'debug'); },
    success   : function(msg) { this.logLine(msg, '   [OK]', 'success'); },
    failure   : function(msg) { this.logLine(msg, ' [FAIL]', 'failure'); },
    warning   : function(msg) { this.logLine(msg, ' [WARN]', 'warning'); },
    info      : function(msg) { this.logLine(msg, ' [INFO]', 'info'); },
    error     : function(msg) { this.logLine(msg, '[ERROR]', 'error'); }
  }
  
  fd.Logger = Logger;
  
})();