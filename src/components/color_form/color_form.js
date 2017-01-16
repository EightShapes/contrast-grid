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

    function updateInputText(inputName, text) {
        $(`#es-color-form__${inputName}-colors`).val(text);
    }

    function convertGridDataToText(colors) {
        var text = '';

        colors.forEach(function(colorData){
            text += colorData.hex;
            if (typeof colorData.label !== 'undefined') {
                text += ', ' + colorData.label;
            }
            text += '\n';
        });
        return text;
    }

    function removeColorFromData(hex, colors) {
        colors = colors.filter(function(color){
            return color.hex !== hex ? true : false; 
        });
        return colors;
    }

    var removeColor = function removeColor(e, hex, colorset) {
        colorset = colorset === 'background' && backgroundColors.length === 0 ? 'foreground' : colorset;
        var colors = colorset === 'background' ? backgroundColors : foregroundColors,
            gridDataText = '';
        colors = removeColorFromData(hex, colors);
        gridDataText = convertGridDataToText(colors);
        updateInputText(colorset, gridDataText);
        triggerGridUpdate();
    }

    function getCurrentGridData() {
        $colorForm.find(".es-color-form__textarea").each(function(){
            processColorInput($(this));
        });

        var gridData = {
            foregroundColors: foregroundColors,
            backgroundColors: backgroundColors
        };

        return gridData;
    }

    function triggerGridUpdate() {
        var gridData = getCurrentGridData();
        console.log(gridData);
        $(document).trigger('escg.updateGrid', [gridData]);
    }

    function sortForegroundColors(e, sortedColorsKey) {
        var sortedForegroundColors = [],
            gridDataText = '';
        sortedColorsKey.forEach(function(hexKey){
            foregroundColors.forEach(function(colorData){
                if (colorData.hex === hexKey) {
                    sortedForegroundColors.push(colorData);
                }
            });
        });
        gridDataText = convertGridDataToText(sortedForegroundColors);
        updateInputText('foreground', gridDataText);
        triggerGridUpdate();
    }

    function sortBackgroundColors(e, sortedColorsKey) {
        var sortedBackgroundColors = [],
            gridDataText = '',
            inputField = '',
            startingColorData;

        if (backgroundColors.length > 0) {
            inputField = 'background';
            startingColorData = backgroundColors;
        } else {
            inputField = 'foreground';
            startingColorData = foregroundColors;
        }


        sortedColorsKey.forEach(function(hexKey){
            startingColorData.forEach(function(colorData){
                if (colorData.hex === hexKey) {
                    sortedBackgroundColors.push(colorData);
                }
            });
        });
        gridDataText = convertGridDataToText(sortedBackgroundColors);
        updateInputText(inputField, gridDataText);
        triggerGridUpdate();
    }

    function initializeEventHandlers() {
        $foregroundColorsInput.on('keyup', triggerGridUpdate);
        $backgroundColorsInput.on('keyup', triggerGridUpdate);
        $(document).on('escg.removeColor', removeColor);
        $(document).on('escg.columnsSorted', sortForegroundColors);
        $(document).on('escg.rowsSorted', sortBackgroundColors);
    }

    var initialize = function initialize() {
        $colorForm = $(".es-color-form"); 
        $foregroundColorsInput = $("#es-color-form__foreground-colors");   
        $backgroundColorsInput = $("#es-color-form__background-colors");   
        initializeEventHandlers();
        triggerGridUpdate();
    };

    var public_vars = {
        'initialize': initialize,
        'removeColor': removeColor
    };

    return public_vars;
}();
