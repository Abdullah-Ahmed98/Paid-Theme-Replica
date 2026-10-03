/* ==========================================================================
   Vendor shims
   --------------------------------------------------------------------------
   The B-Agent theme's template.js calls $("select").select2({...})
   unconditionally on document ready. The bundled select2 asset is a dead
   stub, so we register a chainable no-op before template.js loads. Nothing in
   this project uses a <select>, but the guard keeps the console clean and
   future-proof if one is added.
   ========================================================================== */
(function ($) {
    "use strict";

    if (!$) {
        return;
    }

    if (!$.fn.select2) {
        $.fn.select2 = function () {
            return this;
        };
    }
})(window.jQuery);