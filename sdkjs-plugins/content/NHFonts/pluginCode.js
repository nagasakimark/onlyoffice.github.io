(function () {
  window.Asc.plugin.init = function () {
    console.log("NHFonts plugin loaded");
  };

  window.Asc.plugin.button = function (id) {
    this.executeCommand("close", "");
  };
})();
