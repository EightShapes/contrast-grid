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
