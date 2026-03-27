(function() {
  // Ensure Asc.plugin exists
  if (window.Asc && window.Asc.plugin) {
    window.Asc.plugin.init = function() {
      console.log("NHFonts plugin initialized");
    };

    window.Asc.plugin.button = function(id) {
      this.executeCommand("close", "");
    };
  } else {
    console.error("Asc.plugin not available yet");
  }
})();
