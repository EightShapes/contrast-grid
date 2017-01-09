var EightShapes = EightShapes || {};

EightShapes.ColorForm = function() {
    'use strict';
    var $colorForm,
        $foregroundColorsInput,
        $backgroundColorsInput,
        foregroundColors,
        backgroundColors,
        hexRegex = /^(#?[A-Fa-f0-9]{6}|#?[A-Fa-f0-9]{3})(,.*)?/gim;

    function processFormSubmission(e) {
        e.preventDefault();
        var gridData = {
            foregroundColors: foregroundColors
        };

        $(document).trigger('escg.updateGrid', [gridData]);
    }

    function processColorInput(e) {
        var $input = $(e.target),
            value = $input.val(),
            m,
            hexValues = [],
            colors = [];

        while ((m = hexRegex.exec(value)) !== null) {
             if (m.index === hexRegex.lastIndex) {
                 hexRegex.lastIndex++;
             }
             
            var hex = m[1],
                label = m[2],
                colorData = {hex: false};

            if (hex.indexOf("#") !== 0) {
                hex = "#" + hex;
            }

            colorData.hex = hex;

            if (typeof label !== 'undefined') {
                label = label.slice(1).trim(); //Remove the leading comma matched in the regex and any leading or trailing whitespace
                if (label.length > 0) {
                    colorData.label = label;
                }
            }

            if (hexValues.indexOf(hex) === -1) {
                colors.push(colorData);
            }
        }

        if ($(e.target).attr("id") == "es-color-form__foreground-colors") {
            foregroundColors = colors;
        } else if ($(e.target).attr("id") == "es-color-form__background-colors") {
            backgroundColors = colors;
        }

        processFormSubmission(e);
    }

    function initializeEventHandlers() {
        $colorForm.on('submit', processFormSubmission);
        $foregroundColorsInput.on('keyup', processColorInput);
    }

    var initialize = function initialize() {
        $colorForm = $(".es-color-form"); 
        $foregroundColorsInput = $("#es-color-form__foreground-colors");   
        $backgroundColorsInput = $("#es-color-form__background-colors");   
        initializeEventHandlers();
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();

$(document).ready(function(){
    EightShapes.ColorForm.initialize();
});
