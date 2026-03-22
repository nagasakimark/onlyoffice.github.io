(function () {

  window.Asc.plugin.init = function () {
    console.log("NHFonts plugin loaded");
  };

  window.Asc.plugin.button = function (id) {
    // Close plugin when X is pressed
    this.executeCommand("close", "");
  };

})();