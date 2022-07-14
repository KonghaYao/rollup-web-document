/**
 * Adds the given array of stencils to avoid dynamic loading of shapes.
 */
GraphViewer.prototype.showLocalLightbox = function () {
    var backdrop = document.createElement("div");

    backdrop.style.cssText = "position:fixed;top:0;left:0;bottom:0;right:0;";
    backdrop.style.zIndex = this.lightboxZIndex;
    backdrop.style.backgroundColor = "#000000";
    mxUtils.setOpacity(backdrop, 70);

    document.body.appendChild(backdrop);

    var closeImg = document.createElement("img");
    closeImg.setAttribute("border", "0");
    closeImg.setAttribute("src", Editor.closeBlackImage);
    closeImg.style.cssText = "position:fixed;top:32px;right:32px;";
    closeImg.style.cursor = "pointer";

    mxEvent.addListener(closeImg, "click", function () {
        ui.destroy();
    });

    // LATER: Make possible to assign after instance was created
    urlParams["pages"] = "1";
    urlParams["page"] = this.currentPage;
    urlParams["page-id"] = this.graphConfig.pageId;
    urlParams["layer-ids"] =
        this.graphConfig.layerIds != null &&
        this.graphConfig.layerIds.length > 0
            ? this.graphConfig.layerIds.join(" ")
            : null;
    urlParams["nav"] = this.graphConfig.nav != false ? "1" : "0";
    urlParams["layers"] = this.layersEnabled ? "1" : "0";

    if (this.tagsEnabled) {
        urlParams["tags"] = "{}";
    }

    // PostMessage not working and Permission denied for opened access in IE9-
    if (document.documentMode == null || document.documentMode >= 10) {
        Editor.prototype.editButtonLink = this.graphConfig.edit;
        Editor.prototype.editButtonFunc = this.graphConfig.editFunc;
    }

    EditorUi.prototype.updateActionStates = function () {};
    EditorUi.prototype.addBeforeUnloadListener = function () {};
    EditorUi.prototype.addChromelessClickHandler = function () {};

    // Workaround for lost reference with same ID is to change
    // ID which must be done before calling EditorUi constructor
    var previousShadowId = Graph.prototype.shadowId;
    Graph.prototype.shadowId = "lightboxDropShadow";

    var ui = new EditorUi(
        new Editor(true),
        document.createElement("div"),
        true
    );
    ui.editor.editBlankUrl = this.editBlankUrl;

    // Overrides instance variable and restores prototype state
    ui.editor.graph.shadowId = "lightboxDropShadow";
    Graph.prototype.shadowId = previousShadowId;

    // Disables refresh
    ui.refresh = function () {};

    // Handles escape keystroke
    var keydownHandler = mxUtils.bind(this, function (evt) {
        if (evt.keyCode == 27 /* Escape */) {
            ui.destroy();
        }
    });

    var overflow = this.initialOverflow;
    var destroy = ui.destroy;

    ui.destroy = function () {
        mxEvent.removeListener(
            document.documentElement,
            "keydown",
            keydownHandler
        );
        document.body.removeChild(backdrop);
        document.body.removeChild(closeImg);
        document.body.style.overflow = overflow;
        GraphViewer.resizeSensorEnabled = true;

        destroy.apply(this, arguments);
    };

    var graph = ui.editor.graph;
    var lightbox = graph.container;
    lightbox.style.overflow = "hidden";

    if (this.lightboxChrome) {
        lightbox.style.border = "1px solid #c0c0c0";
        lightbox.style.margin = "40px";

        // Installs the keystroke listener in the target
        mxEvent.addListener(
            document.documentElement,
            "keydown",
            keydownHandler
        );
    } else {
        backdrop.style.display = "none";
        closeImg.style.display = "none";
    }

    // Handles relative images
    var self = this;

    graph.getImageFromBundles = function (key) {
        return self.getImageUrl(key);
    };

    // Handles relative images in print output and temporary graphs
    var uiCreateTemporaryGraph = ui.createTemporaryGraph;

    ui.createTemporaryGraph = function () {
        var newGraph = uiCreateTemporaryGraph.apply(this, arguments);

        newGraph.getImageFromBundles = function (key) {
            return self.getImageUrl(key);
        };

        return newGraph;
    };

    if (this.graphConfig.move) {
        graph.isMoveCellsEvent = function (evt) {
            return true;
        };
    }

    mxUtils.setPrefixedStyle(lightbox.style, "border-radius", "4px");
    lightbox.style.position = "fixed";

    GraphViewer.resizeSensorEnabled = false;
    document.body.style.overflow = "hidden";

    // Workaround for possible rendering issues
    if (!mxClient.IS_SF && !mxClient.IS_EDGE) {
        mxUtils.setPrefixedStyle(lightbox.style, "transform", "rotateY(90deg)");
        mxUtils.setPrefixedStyle(
            lightbox.style,
            "transition",
            "all .25s ease-in-out"
        );
    }

    this.addClickHandler(graph, ui);

    window.setTimeout(
        mxUtils.bind(this, function () {
            // Disables focus border in Chrome
            lightbox.style.outline = "none";
            lightbox.style.zIndex = this.lightboxZIndex;
            closeImg.style.zIndex = this.lightboxZIndex;

            document.body.appendChild(lightbox);
            document.body.appendChild(closeImg);

            ui.setFileData(this.xml);

            mxUtils.setPrefixedStyle(
                lightbox.style,
                "transform",
                "rotateY(0deg)"
            );
            ui.chromelessToolbar.style.bottom = 60 + "px";
            ui.chromelessToolbar.style.zIndex = this.lightboxZIndex;

            // Workaround for clipping in IE11-
            document.body.appendChild(ui.chromelessToolbar);

            ui.getEditBlankXml = mxUtils.bind(this, function () {
                return this.xml;
            });

            ui.lightboxFit();
            ui.chromelessResize();
            this.showLayers(graph, this.graph);

            // Click on backdrop closes lightbox
            mxEvent.addListener(backdrop, "click", function () {
                ui.destroy();
            });
        }),
        0
    );

    return ui;
};
