var EightShapes = EightShapes || {};

EightShapes.CodeSnippet = function() {
    'use strict';
    var $codeSnippet,
        formattedCss = false;

    function updateContent(e, content) {
        $codeSnippet = $(".es-code-snippet code");

        if (!formattedCss) {
            formattedCss = html_beautify($(".es-contrast-grid-styles").removeAttr("class").prop('outerHTML'));
        }

        var formattedHtml = html_beautify(content);
        var html = Prism.highlight(formattedHtml + "\n\n" + formattedCss, Prism.languages.html);
        $codeSnippet.html(html);
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

        $(document).on("escg.contrastGridUpdated", updateContent);
    }

    var initialize = function initialize() {
        setEventHandlers();
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();
