var EightShapes = EightShapes || {};

EightShapes.CodeSnippet = function() {
    'use strict';
    var $codeSnippet;

    function updateContent(e, content) {
        var formatted_html = html_beautify(content);
        var formatted_css = html_beautify($(".es-contrast-grid-styles").removeAttr("class").prop('outerHTML'));
        var html = Prism.highlight(formatted_css + "\n\n" + formatted_html, Prism.languages.html);
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

$(document).ready(function(){
    EightShapes.CodeSnippet.initialize();
});
