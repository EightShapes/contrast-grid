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
        $('#es-color-form__' + inputName + '-colors').val(text);
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
        broadcastFormValueChange();
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

    function broadcastFormValueChange() {
        var gridData = getCurrentGridData();
        $(document).trigger('escg.colorFormValuesChanged', [gridData]);
        updateUrl();
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
        broadcastFormValueChange();
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
        broadcastFormValueChange();
    }

    function toggleBackgroundColorsInput(e) {
        if (typeof e !== 'undefined') {
            e.preventDefault();
        }
        var $backgroundColors = $("#es-color-form__background-colors"),
            $foregroundColors = $("#es-color-form__foreground-colors");
        if ($(".es-color-form").hasClass("es-color-form--show-background-colors-input")) {
            // hide the background Colors Input
            $(".es-color-form").removeClass("es-color-form--show-background-colors-input");
            $("label[for='es-color-form__foreground-colors']").text("Rows & Columns");
            $foregroundColors.attr("data-persisted-text", $foregroundColors.val());
            $foregroundColors.val($backgroundColors.val());
            $backgroundColors.val("");
            broadcastFormValueChange();
        } else {
            // show the background Colors Input
            $(".es-color-form").addClass("es-color-form--show-background-colors-input");
            $("label[for='es-color-form__foreground-colors']").text("Columns");

            if ($backgroundColors.val().length == 0) {
                // $backgroundColors will already have a value when loading from the url
                $backgroundColors.val($foregroundColors.val());
            }
            
            if (typeof $foregroundColors.attr("data-persisted-text") !== 'undefined') {
                $foregroundColors.val($foregroundColors.attr("data-persisted-text"));
            }
            broadcastFormValueChange();
        }
    }

    function broadcastTileSizeChange(e) {
        var tileSize = $colorForm.find("input[name='es-color-form__tile-size']:checked").val();
        $(document).trigger("escg.tileSizeChanged", [tileSize]);
        updateUrl();
    }

    function broadcastCodeSnippetViewToggle(e) {
        e.preventDefault();
        $(document).trigger("escg.showCodeSnippet");
    }

    function updateUrl() {
        window.history.pushState(false, false, '/?' + $colorForm.serialize());
    }

    function initializeEventHandlers() {
        $foregroundColorsInput.typeWatch({
            wait: 500,
            callback: broadcastFormValueChange
        });
        $backgroundColorsInput.typeWatch({
            wait: 500,
            callback: broadcastFormValueChange
        });
        $(document).on('escg.removeColor', removeColor);
        $(document).on('escg.columnsSorted', sortForegroundColors);
        $(document).on('escg.rowsSorted', sortBackgroundColors);
        $(".es-color-form__show-background-colors, .es-color-form__hide-background-colors").on("click", toggleBackgroundColorsInput)
        $("input[name='es-color-form__tile-size']").on("change", broadcastTileSizeChange);
        $(".es-color-form__view-code-toggle").on("click", broadcastCodeSnippetViewToggle);
    }

    function loadFormDataFromUrl() {
        if (location.search.substr( 1 ).length > 0) {
            $colorForm.deserialize( location.search.substr( 1 ) );
        }

        if ($backgroundColorsInput.val().length > 0) {
            toggleBackgroundColorsInput();
        }
    }

    var initialize = function initialize() {
        $colorForm = $(".es-color-form"); 
        $foregroundColorsInput = $("#es-color-form__foreground-colors");   
        $backgroundColorsInput = $("#es-color-form__background-colors");
        loadFormDataFromUrl(); 
        initializeEventHandlers();
        broadcastFormValueChange();
        broadcastTileSizeChange();
    };

    var public_vars = {
        'initialize': initialize,
        'removeColor': removeColor
    };

    return public_vars;
}();
