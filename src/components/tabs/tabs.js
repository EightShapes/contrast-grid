var EightShapes = EightShapes || {};

EightShapes.Tabs = function() {
    'use strict';

    function hideVisibleGlobalTabs() {
        $(".es-tabs__label--active").removeClass("es-tabs__label--active");
        $("body").removeClass( function(index, className) {
            return (className.match (/(^|\s)es-tabs__global-panel--\S+/g) || []).join(' ');
        });
    }

    function showGlobalTab(e) {
        var $tabs = $(e.target).closest(".es-tabs__label"),
            tabId = $tabs.attr("for");
        hideVisibleGlobalTabs();
        $("body").addClass(tabId);
        $tabs.addClass("es-tabs__label--active");
        console.log("escg.show-tab-" + tabId);
        $(document).trigger("escg.show-tab-" + tabId);
    }

    function setEventHandlers() {
        $(".es-tabs__label").on("click", showGlobalTab);
    }

    var initialize = function initialize() {
        setEventHandlers();
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();
