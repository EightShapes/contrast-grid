var EightShapes = EightShapes || {};

EightShapes.ColorForm = function() {
    'use strict';
    var $colorForm,
        $foregroundColorsInput,
        $backgroundColorsInput,
        foregroundColors,
        backgroundColors,
        hexRegex = /^(#?[A-Fa-f0-9]{6}|#?[A-Fa-f0-9]{3})(,.*)?/gim;

    function processColorInput($input) {
        var value = $input.val(),
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

            colorData.hex = hex.toUpperCase();

            if (typeof label !== 'undefined') {
                label = label.slice(1).trim(); //Remove the leading comma matched in the regex and any leading or trailing whitespace
                if (label.length > 0) {
                    colorData.label = label;
                }
            }

            if (hexValues.indexOf(hex) === -1) {
                hexValues.push(hex);
                colors.push(colorData);
            }
        }

        if ($input.attr("id") == "es-color-form__foreground-colors") {
            foregroundColors = colors;
        } else if ($input.attr("id") == "es-color-form__background-colors") {
            backgroundColors = colors;
        }
    }

    function triggerGridUpdate() {
        $colorForm.find(".es-color-form__input").each(function(){
            processColorInput($(this));
        });

        var gridData = {
            foregroundColors: foregroundColors,
            backgroundColors: backgroundColors
        };

        console.log(gridData);

        $(document).trigger('escg.updateGrid', [gridData]);
    }

    function initializeEventHandlers() {
        $foregroundColorsInput.on('keyup', triggerGridUpdate);
        $backgroundColorsInput.on('keyup', triggerGridUpdate);
    }

    var initialize = function initialize() {
        $colorForm = $(".es-color-form"); 
        $foregroundColorsInput = $("#es-color-form__foreground-colors");   
        $backgroundColorsInput = $("#es-color-form__background-colors");   
        initializeEventHandlers();
        triggerGridUpdate();
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();
