$(document).ready(function(){
    // Initialize the various components in the correct order
    EightShapes.ContrastGrid.initialize();
    EightShapes.CodeSnippet.initialize();
    EightShapes.ColorForm.initialize();

    $(".es-code-toggle").on("click", function(){
        $("body").addClass("es-code-toggle--visible");
        $(document).trigger("escg.show-tab-es-tabs__global-panel--copy-code");
    });

    $(".es-code-snippet__hide-button").on("click", function(){
        $("body").removeClass("es-code-toggle--visible");
    });
});
