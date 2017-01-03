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
