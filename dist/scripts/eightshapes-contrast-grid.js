/* EightShapes Contrast Grid v1.0.0 */
/* DO NOT EDIT: The contents of this file are dynamically generated and will be overwritten */
var EightShapes = EightShapes || {};

EightShapes.CodeSnippet = function() {
    'use strict';
    var $codeSnippet,
        formattedCss = false;

    function removeInteractionHooksFromMarkup(html) {
        var $markup = $(html).clone();
        $markup = $markup.find(".es-contrast-grid__key-swatch-controls").remove().end();
        $markup = $markup.find(".es-contrast-grid__table--dragtable-initialized").removeClass('es-contrast-grid__table--dragtable-initialized').end();
        $markup = $markup.find(".es-contrast-grid__content--sortable-initialized.ui-sortable").removeClass('es-contrast-grid__content--sortable-initialized ui-sortable').end();
        console.log($markup);

        return $markup.prop('outerHTML');
    }

    function updateContent(e, content) {
        content = removeInteractionHooksFromMarkup(content);
        $codeSnippet = $(".es-code-snippet code");

        if (!formattedCss) {
            formattedCss = html_beautify($(".es-contrast-grid-styles").removeAttr("class").prop('outerHTML'));
        }

        var formattedHtml = html_beautify(content, {preserve_newlines: false});
        var html = Prism.highlight(formattedHtml + "\n\n" + formattedCss, Prism.languages.html);
        $codeSnippet.html(html);
    }

    function showCodeSnippet() {
        $(".es-contrast-grid__outer-wrap").addClass("es-contrast-grid__outer-wrap--code-snippet-visible");
    }

    function hideCodeSnippet(e) {
        if (typeof e !== 'undefined') {
            e.preventDefault();
        }
        $(".es-contrast-grid__outer-wrap").removeClass("es-contrast-grid__outer-wrap--code-snippet-visible");
    }

    function setEventHandlers() {
        var clipboard = new Clipboard('.es-code-snippet__copy-button');
        clipboard.on('success', function(e) {
            $(e.trigger).removeClass("es-code-snippet__copy-button--clicked");
            $(e.trigger).prop('offsetHeight');
            $(e.trigger).addClass("es-code-snippet__copy-button--clicked").find(".es-code-snippet__copy-response").text('Copied!');
            e.clearSelection();
        });

        clipboard.on('error', function(e) {
            $(e.trigger).removeClass("es-code-snippet__copy-button--clicked");
            $(e.trigger).prop('offsetHeight');
            $(e.trigger).addClass("es-code-snippet__copy-button--clicked").find(".es-code-snippet__copy-response").text('Press Ctrl + C to copy');
        });

        $("body").on("click", ".es-code-snippet__copy-button", function(e){
            e.preventDefault();
        });

        $(".es-code-snippet__hide-snippet").on("click", hideCodeSnippet);

        $(document).on("escg.contrastGridUpdated", updateContent);
        $(document).on("escg.showCodeSnippet", showCodeSnippet);
    }

    var initialize = function initialize() {
        setEventHandlers();
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();

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

    function toggleBackgroundColorsInput(e) {
        e.preventDefault();
        var $backgroundColors = $("#es-color-form__background-colors"),
            $foregroundColors = $("#es-color-form__foreground-colors");
        if ($(".es-color-form").hasClass("es-color-form--show-background-colors-input")) {
            // hide the background Colors Input
            $(".es-color-form").removeClass("es-color-form--show-background-colors-input");
            $("label[for='es-color-form__foreground-colors']").text("Rows & Columns");
            $foregroundColors.attr("data-persisted-text", $foregroundColors.val());
            $foregroundColors.val($backgroundColors.val());
            $backgroundColors.val("");
            triggerGridUpdate();
        } else {
            // show the background Colors Input
            $(".es-color-form").addClass("es-color-form--show-background-colors-input");
            $("label[for='es-color-form__foreground-colors']").text("Columns");

            $backgroundColors.val($foregroundColors.val());
            
            if (typeof $foregroundColors.attr("data-persisted-text") !== 'undefined') {
                $foregroundColors.val($foregroundColors.attr("data-persisted-text"));
            }
            triggerGridUpdate();
        }
    }

    function broadcastTileSizeChange(e) {
        $(document).trigger("escg.tileSizeChanged", [$(e.target).val()]);
    }

    function broadcastCodeSnippetViewToggle(e) {
        e.preventDefault();
        $(document).trigger("escg.showCodeSnippet");
    }

    function initializeEventHandlers() {
        $foregroundColorsInput.on('keyup', triggerGridUpdate);
        $backgroundColorsInput.on('keyup', triggerGridUpdate);
        $(document).on('escg.removeColor', removeColor);
        $(document).on('escg.columnsSorted', sortForegroundColors);
        $(document).on('escg.rowsSorted', sortBackgroundColors);
        $(".es-color-form__show-background-colors, .es-color-form__hide-background-colors").on("click", toggleBackgroundColorsInput)
        $("input[name='es-color-form__tile-size']").on("change", broadcastTileSizeChange);
        $(".es-color-form__view-code-toggle").on("click", broadcastCodeSnippetViewToggle);
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

var EightShapes = EightShapes || {};

EightShapes.ContrastGrid = function() {
    'use strict';
    var $updateButton,
        $grid,
        $gridContent,
        $foregroundKey,
        $foregroundKeyCellTemplate,
        $contentRowTemplate,
        $contentCellTemplate,
        $backgroundKey,
        showInlineStylesAsHex = true,
        showLabelsOnColumnKeys = false,
        gridData = {
            foregroundColors: [
                {
                    hex: "#000",
                    label: "Black"
                },
                {
                    hex: "#323232"
                },
                {
                    hex: "#4D4D4D"
                },
                {
                    hex: "#F3F1F1"
                },
                {
                    hex: "#FFF",
                    label: "White"
                },
                {
                    hex: "#DC6729"
                },
                {
                    hex: "#3995A9",
                    label: "Link Color"
                }
            ]
        };

    function convertRgbInlineStylesToHex(string) {
        const rgbRegex = /rgba?\((\d+),\s?(\d+),\s?(\d+)\)/gim;
        let m;

        function replaceWithHex(match, p1, p2, p3) {
            return "#" +
              ("0" + parseInt(p1,10).toString(16)).slice(-2) +
              ("0" + parseInt(p2,10).toString(16)).slice(-2) +
              ("0" + parseInt(p3,10).toString(16)).slice(-2)
        }

        string = string.replace(rgbRegex, replaceWithHex);
        return string;
    }

    function getGridMarkup() {
        var markup = $grid.prop('outerHTML');
        if (showInlineStylesAsHex) {
            markup = convertRgbInlineStylesToHex(markup);
        }

        return markup;
    }

    function getForegroundColors() {
        return gridData.foregroundColors;
    }

    function getBackgroundColors() {
        if (typeof gridData.backgroundColors === 'undefined' || gridData.backgroundColors.length === 0) {
            return gridData.foregroundColors.slice(0);
        } else {
            return gridData.backgroundColors;
        }
    }

    function generateForegroundKey() {
        var colors = getForegroundColors();
        for (var i=0; i < colors.length; i++) {
            var hex = colors[i].hex,
                hexLabel = typeof colors[i].label === 'undefined' ? hex : colors[i].label,
                $foregroundKeyCell = $foregroundKeyCellTemplate.clone(),
                $swatch = $foregroundKeyCell.find('.es-contrast-grid__key-swatch'),
                $label = $swatch.find(".es-contrast-grid__key-swatch-label-text"),
                $hexLabel = $swatch.find(".es-contrast-grid__key-swatch-label-hex"),
                $removeAction = $swatch.find(".es-contrast-grid__key-swatch-remove");

            $swatch.css("backgroundColor", hex).attr('data-hex', hex);
            $removeAction.attr('data-hex', hex).attr('data-colorset', 'foreground');

            if (showLabelsOnColumnKeys) {
                $label.text(hexLabel);
                if (hex !== hexLabel) {
                    $hexLabel.text(hex);
                }
            } else {
                $label.text(hex);
            }

            $foregroundKey.append($foregroundKeyCell);
        }
    }

    function generateContentRows() {
        var foregroundColors = getForegroundColors(),
            backgroundColors = getBackgroundColors();

        for (var i = 0; i < backgroundColors.length; i++) {
            var bg = backgroundColors[i].hex,
                bgLabel = typeof backgroundColors[i].label === 'undefined' ? bg : backgroundColors[i].label, 
                $contentRow = $contentRowTemplate.clone(),
                $backgroundKeyCell = $contentRow.find(".es-contrast-grid__background-key-cell"),
                $swatch = $backgroundKeyCell.find('.es-contrast-grid__key-swatch'),
                $label = $swatch.find(".es-contrast-grid__key-swatch-label-text"),
                $hexLabel = $swatch.find(".es-contrast-grid__key-swatch-label-hex"),
                $removeAction = $swatch.find(".es-contrast-grid__key-swatch-remove");

            $swatch.css("backgroundColor", bg).attr('data-hex', bg);
            $removeAction.attr('data-hex', bg).attr('data-colorset', 'background');
            $label.text(bgLabel);
            if (bgLabel !== bg) {
                $hexLabel.text(bg);
            }

            for (var j = 0; j < foregroundColors.length; j++) {
                var fg = foregroundColors[j].hex,
                    $contentCell = $contentCellTemplate.clone();

                $contentCell.find(".es-contrast-grid__swatch").css({ backgroundColor: bg, color: fg });

                if (bg == fg) {
                    $contentCell.html("").append("<div class='es-contrast-grid__swatch-spacer'></div>");
                }
                $contentRow.append($contentCell);
            }


            $gridContent.append($contentRow);
        }
    }

    function disableDragUi() {
        $(".es-contrast-grid__content.es-contrast-grid__content--sortable-initialized").sortable('destroy');
        $(".es-contrast-grid__table.es-contrast-grid__table--dragtable-initialized").dragtable('destroy');
    }

    function enableDragUi() {
        // Draggable Rows
        $(".es-contrast-grid__content").addClass('es-contrast-grid__content--sortable-initialized').sortable({
            axis: 'y',
            containment: '.es-contrast-grid',
            placeholder: 'es-contrast-grid__row-placeholder',
            handle: '.es-contrast-grid__key-swatch-drag-handle--row',
            tolerance: 'pointer',
            start: function(event, ui) {
                var columnCount = $(".es-contrast-grid__row-placeholder td").length;
                ui.placeholder.html("").append("<td colspan='" + columnCount + "'></td>");
                $(".es-contrast-grid__foreground-key").find("th").each(function(index){
                    ui.helper.find("td:nth-child(" + (index + 1) + ")").width($(this).outerWidth() + "px");
                    // console.log($(this).outerWidth());
                });
            },
            update: function(table) {
                var sortedColors = extractBackgroundColorsFromGrid();
                broadcastRowSort(sortedColors);
            }
        });

        // Draggable Columns
        $(".es-contrast-grid__table").addClass('es-contrast-grid__table--dragtable-initialized').dragtable({
            containment: '.es-contrast-grid',
            dragHandle: '.es-contrast-grid__key-swatch-drag-handle--column',
            dragaccept: '.es-contrast-grid__foreground-key-cell',
            persistState: function(table) {
                var sortedColors = extractForegroundColorsFromGrid();
                broadcastColumnSort(sortedColors);
            }
        });
    }

    function extractForegroundColorsFromGrid() {
        var sortedForegroundColors = [];
        $(".es-contrast-grid__key-swatch--foreground").each(function(){
            sortedForegroundColors.push($(this).attr("data-hex"));
        });

        return sortedForegroundColors;
    }

    function extractBackgroundColorsFromGrid() {
        var sortedBackgroundColors = [];
        $(".es-contrast-grid__key-swatch--background").each(function(){
            sortedBackgroundColors.push($(this).attr("data-hex"));
        });

        return sortedBackgroundColors;
    }

    function broadcastRowSort(sortedColors) {
        $(document).trigger("escg.rowsSorted", [sortedColors]);
    }

    function broadcastColumnSort(sortedColors) {
        $(document).trigger("escg.columnsSorted", [sortedColors]);
    }

    function broadcastGridUpdate() {
        $(document).trigger("escg.contrastGridUpdated", [getGridMarkup()]);
    }

    function setKeyCellWidth() {
        var columnCount = $(".es-contrast-grid__table tr:first-child td").length;
        $(".es-contrast-grid__key-cell").attr("colspan", columnCount);
    }

    function generateGrid() {
        generateForegroundKey();
        generateContentRows();
        setKeyCellWidth();
        addContrastToSwatches();
        addAccessibilityToSwatches();
        setKeySwatchLabelColors();
        truncateContrastDisplayValues();
        disableDragUi();
        enableDragUi();
        svg4everybody(); // render icons on IE
        broadcastGridUpdate();
    }

    function truncateContrastDisplayValues() {
        $(".es-contrast-grid__contrast-ratio").each(function(){
            $(this).text($(this).text().slice(0, -1));
        });
    }

    function addAccessibilityToSwatches() {
        var $swatches = $(".es-contrast-grid__swatch");
        $swatches.each(function(){
            var contrast = parseFloat($(this).find(".es-contrast-grid__contrast-ratio").text()),
                $pill = $(this).find(".es-contrast-grid__accessibility-label"),
                pillText = "DNP";

            if (contrast >= 7.0) {
                pillText = "AAA";
            } else if (contrast >= 4.5) {
                pillText = "AA";
            } else if (contrast >= 3.0) {
                pillText = "AA18";
            }

            $pill.text(pillText).addClass("es-contrast-grid__accessibility-label--" + pillText.toLowerCase());
        });
    }

    function setKeySwatchLabelColors() {
        var $keys = $(".es-contrast-grid__key-swatch");
        $keys.each(function(){
            var backgroundColor = rgb2hex($(this).css("backgroundColor")),
                contrastWithWhite = getContrastRatioForHex("#FFFFFF", backgroundColor);

            if (contrastWithWhite === 1) {
                $(this).addClass("es-contrast-grid--bordered-swatch es-contrast-grid--dark-label");
            } else if (contrastWithWhite < 4.0) {
                $(this).addClass("es-contrast-grid--dark-label");
            }
        });
    }

    function addContrastToSwatches() {
        var $swatches = $(".es-contrast-grid__swatch");
        $swatches.each(function(){
            if (typeof $(this).css("backgroundColor") !== 'undefined' &&
                typeof $(this).css("color") !== 'undefined') {
                var backgroundColor = rgb2hex($(this).css("backgroundColor")),
                    foregroundColor = rgb2hex($(this).css("color")),
                    contrastRatio = getContrastRatioForHex(foregroundColor, backgroundColor),
                    contrastWithWhite = getContrastRatioForHex("#FFFFFF", backgroundColor);
                $(this).find(".es-contrast-grid__contrast-ratio").text(contrastRatio);
                if (contrastWithWhite === 1) {
                    $(this).addClass("es-contrast-grid--bordered-swatch es-contrast-grid--dark-label");
                } else if (contrastWithWhite < 4.0) {
                    $(this).addClass("es-contrast-grid--dark-label");
                }
            }
        });
    }


    function triggerUpdate() {
        EightShapes.CodeSnippet.updateContent(getGridMarkup());
    }

    function setTemplateObjects() {
        // Remove templates from the DOM after cloning into JS
        $foregroundKeyCellTemplate = $("#es-contrast-grid__foreground-key-cell-template").clone().removeAttr("id");
        $("#es-contrast-grid__foreground-key-cell-template").remove();
        $contentCellTemplate = $("#es-contrast-grid__content-cell-template").clone().removeAttr("id");
        $("#es-contrast-grid__content-cell-template").remove();
        
        $contentRowTemplate = $("#es-contrast-grid__content-row-template").clone().removeAttr("id");

        $("#es-contrast-grid__content-row-template").remove();
    }

    function setGridData(data) {
        gridData = data;
    }

    function resetGrid() {
        $grid.find(".es-contrast-grid__content-row").remove();
        $grid.find(".es-contrast-grid__foreground-key-cell").remove();
    }

    function setColumnLabelStatus() {
        if (gridData.backgroundColors.length > 0) {
            showLabelsOnColumnKeys = true;
        } else {
            showLabelsOnColumnKeys = false;
        }
    }

    function updateGrid(event, data) {
        setGridData(data);
        resetGrid();
        setColumnLabelStatus();
        generateGrid();
    }

    function changeTileSize(e, tileSize) {
        $(".es-contrast-grid").removeClass("es-contrast-grid--regular es-contrast-grid--compact es-contrast-grid--large")
            .addClass('es-contrast-grid--' + tileSize);
        resetGrid();
        generateGrid();
    }

    function initializeEventHandlers() {
        $(document).on("escg.updateGrid", updateGrid);
        $(document).on("escg.tileSizeChanged", changeTileSize);
        $(document).on('click', '.es-contrast-grid__key-swatch-remove', function(e){
            e.preventDefault();
            $(document).trigger('escg.removeColor', [$(this).attr('data-hex'), $(this).attr('data-colorset')]);
        });
    }

    var initialize = function initialize() {
        $grid = $(".es-contrast-grid");
        $gridContent = $grid.find(".es-contrast-grid__content");
        $foregroundKey = $(".es-contrast-grid__foreground-key");

        initializeEventHandlers();
        setTemplateObjects();
    };


    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();


// MIT Licensed function courtesty of Lea Verou
// https://github.com/LeaVerou/contrast-ratio/blob/gh-pages/color.js
Math.round = (function(){
    var round = Math.round;

    return function (number, decimals) {
        decimals = +decimals || 0;

        var multiplier = Math.pow(100, decimals);

        return round(number * multiplier) / multiplier;
    };
})();

// MIT Licensed functions courtesty of Qambar Raza
// https://github.com/Qambar/color-contrast-checker/blob/master/src/colorContrastChecker.js
var rgbClass = {
    "toString": function() {
        return '<r: ' + this.r +
            ' g: ' + this.g +
            ' b: ' + this.b +
            ' >';
    }
};

function getRGBFromHex(color) {
    var rgb = Object.create(rgbClass),
        rVal,
        gVal,
        bVal;

    if (typeof color !== 'string') {
        throw new Error('must use string');
    }

    rVal = parseInt(color.slice(1, 3), 16);
    gVal = parseInt(color.slice(3, 5), 16);
    bVal = parseInt(color.slice(5, 7), 16);

    rgb.r = rVal;
    rgb.g = gVal;
    rgb.b = bVal;

    return rgb;
}

function calculateSRGB(rgb) {
    var sRGB = Object.create(rgbClass),
        key;

    for (key in rgb) {
        if (rgb.hasOwnProperty(key)) {
            sRGB[key] = parseFloat(rgb[key] / 255, 10);
        }
    }

    return sRGB;
}

function calculateLRGB(rgb) {
    var sRGB = calculateSRGB(rgb);
    var lRGB = Object.create(rgbClass),
        key,
        val = 0;

    for (key in sRGB) {
        if (sRGB.hasOwnProperty(key)) {
            val = parseFloat(sRGB[key], 10);
            if (val <= 0.03928) {
                lRGB[key] = val / 12.92;
            } else {
                lRGB[key] = Math.pow(((val + 0.055) / 1.055), 2.4);
            }
        }
    }

    return lRGB;
}

function calculateLuminance(lRGB) {
    return (0.2126 * lRGB.r) + (0.7152 * lRGB.g) + (0.0722 * lRGB.b);
}

function getContrastRatio(lumA, lumB) {
    var ratio,
        lighter,
        darker;

    if (lumA >= lumB) {
        lighter = lumA;
        darker = lumB;
    } else {
        lighter = lumB;
        darker = lumA;
    }

    ratio = (lighter + 0.05) / (darker + 0.05);

    return Math.round(ratio, 1);
}

function getContrastRatioForHex(foregroundColor, backgroundColor) {
    var color1 = getRGBFromHex(foregroundColor),
        color2 = getRGBFromHex(backgroundColor),
        l1RGB = calculateLRGB(color1),
        l2RGB = calculateLRGB(color2),
        l1 = calculateLuminance(l1RGB),
        l2 = calculateLuminance(l2RGB);

    return getContrastRatio(l1, l2);
}

function rgb2hex(rgb) {
    if (/^#[0-9A-F]{6}$/i.test(rgb)) {
        return rgb;
    }

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    function hex(x) {
        return ("0" + parseInt(x, 10).toString(16)).slice(-2);
    }
    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}

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

$(document).ready(function(){
    // Initialize the various components in the correct order
    EightShapes.ContrastGrid.initialize();
    EightShapes.CodeSnippet.initialize();
    EightShapes.ColorForm.initialize();
    EightShapes.Tabs.initialize();
});
