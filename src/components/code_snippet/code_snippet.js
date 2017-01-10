var EightShapes = EightShapes || {};

EightShapes.CodeSnippet = function() {
    'use strict';
    var $codeSnippet,
        formattedCss = false;

    function updateContent(e, content) {
        if (!formattedCss) {
            formattedCss = html_beautify($(".es-contrast-grid-styles").removeAttr("class").prop('outerHTML'));
        }

        var formattedHtml = html_beautify(content);
        var html = Prism.highlight(formattedCss + "\n\n" + formattedHtml, Prism.languages.html);
        $codeSnippet.html(html);
    }

    var initialize = function initialize() {
        $codeSnippet = $(".es-code-snippet code");
        $(document).on("escg.updateCodeSnippet", updateContent);
    };

    var public_vars = {
        'initialize': initialize
    };

    return public_vars;
}();
