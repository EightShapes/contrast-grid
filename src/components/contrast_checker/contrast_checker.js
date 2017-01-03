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
