/* EightShapes Contrast Grid v1.0.0 */
/* DO NOT EDIT: The contents of this file are dynamically generated and will be overwritten */
var EightShapes = EightShapes || {};

EightShapes.CodeSnippet = function() {
    'use strict';
    var $codeSnippet;

    var updateContent = function updateContent(content) {
        var formatted_html = html_beautify(content);
        var html = Prism.highlight(formatted_html, Prism.languages.html);
        $codeSnippet.html(html);
    }

    var initialize = function initialize() {
        $codeSnippet = $(".es-code-snippet code");
    };

    var public_vars = {
        'initialize': initialize,
        'updateContent': updateContent
    };

    return public_vars;
}();

$(document).ready(function(){
    EightShapes.CodeSnippet.initialize();
});

var EightShapes = EightShapes || {};

EightShapes.ContrastChecker = function() {
    'use strict';

    function addContrastToSwatches($swatches) {
        console.log($swatches.length);
        $swatches.each(function(){
            console.log($(this));
            if (typeof $(this).css("backgroundColor") !== 'undefined' &&
                typeof $(this).css("foregroundColor") !== 'undefined') {

                var backgroundColor = rgb2hex($(this).css("backgroundColor")),
                    foregroundColor = rgb2hex($(this).css("color")),
                    contrastRatio = getContrastRatioForHex(foregroundColor, backgroundColor);
                $(this).find(".es-contrast-grid__contrast-ratio").text(contrastRatio);
            }
        });
    }

    var initialize = function initialize() {
        var $swatches = $(".es-contrast-grid__content-cell:not(.es-contrast-grid__content-cell--blank)");
        addContrastToSwatches($swatches);
        // addAccessibilityToSwatches($swatches);
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();

$(document).ready(function(){
    EightShapes.ContrastChecker.initialize();
});


// MIT Licensed function courtesty of Lea Verou
// https://github.com/LeaVerou/contrast-ratio/blob/gh-pages/color.js
Math.round = (function(){
    var round = Math.round;

    return function (number, decimals) {
        decimals = +decimals || 0;

        var multiplier = Math.pow(10, decimals);

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
    console.log(foregroundColor, backgroundColor);
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
        gridData = {
            foregroundColors: [
                "#FFFFFF",
                "#F0F2F4",
                "#E2E4E9",
                "#C4C9D4",
                "#98A1B3",
                "#7B869D",
                "#6C7893",
                "#535C70",
                "#404653",
                "#363C49",
                "#2B303B",
                "#21242C",
                "#262626"
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
        if (typeof gridData.backgroundColors === 'undefined') {
            return gridData.foregroundColors.slice(0).reverse();
        } else {
            return gridData.backgroundColors;
        }
    }

    function generateForegroundKey() {
        var colors = getForegroundColors();
        for (var i=0; i < colors.length; i++) {
            var hex = colors[i];
            var $foregroundKeyCell = $foregroundKeyCellTemplate.clone().html(hex).css("backgroundColor", hex);
            $foregroundKey.append($foregroundKeyCell);
        }
    }

    function generateContentRows() {
        var foregroundColors = getForegroundColors(),
            backgroundColors = getBackgroundColors();

        for (var i = 0; i < backgroundColors.length; i++) {
            var bg = backgroundColors[i],
                $contentRow = $contentRowTemplate.clone(),
                $backgroundKeyCell = $contentRow.find(".es-contrast-grid__background-key-cell");

            $backgroundKeyCell.html(bg).css("backgroundColor", bg);
            for (var j = 0; j < foregroundColors.length; j++) {
                var fg = foregroundColors[j],
                    $contentCell = $contentCellTemplate.clone().html(fg).css({ backgroundColor: bg, color: fg });

                if (bg == fg) {
                    $contentCell.removeAttr("style").addClass("es-contrast-grid__content-cell--empty").html("");
                }
                $contentRow.append($contentCell);
            }


            $gridContent.append($contentRow);
        }
    }

    function generateGrid() {
        generateForegroundKey();
        generateContentRows();
    }

    function initializeEventHandlers() {
        $updateButton.on("click", triggerUpdate);
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


    var initialize = function initialize() {
        $updateButton = $(".es-contrast-grid__punch-it");
        $grid = $(".es-contrast-grid");
        $gridContent = $grid.find(".es-contrast-grid__content");
        $foregroundKey = $(".es-contrast-grid__foreground-key");

        initializeEventHandlers();
        setTemplateObjects();
        generateGrid();
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();

$(document).ready(function(){
    EightShapes.ContrastGrid.initialize();
});
