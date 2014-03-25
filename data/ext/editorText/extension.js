/* Copyright (c) 2013 The Tagspaces Authors. All rights reserved.
 * Use of this source code is governed by a AGPL3 license that
 * can be found in the LICENSE file. */

define(function(require, exports, module) {
"use strict";

    console.log("Loading editorText extension");
    exports.id = "editorText"; // ID should be equal to the directory name where the ext. is located
    exports.title = "Text Editor based on codemirror";
    exports.type = "editor";
    exports.supportedFileTypes = [
            "h", "c", "clj", "coffee", "coldfusion", "cpp",
            "cs", "css", "groovy", "haxe", "htm", "html",
            "java", "js", "jsm", "json", "latex", "less",
            "ly", "ily", "lua", "markdown", "md", "mdown",
            "mdwn", "mkd", "ml", "mli", "pl", "php",
            "powershell", "py", "rb", "scad", "scala",
            "scss", "sh", "sql", "svg", "textile", "txt", "xml"
         ] ;

    var TSCORE = require("tscore");

    var cmEditor = undefined;
    var extensionDirectory = TSCORE.Config.getExtensionPath()+"/"+exports.id;
    console.log(extensionDirectory);


    exports.init = function(filePath, containerElementID, isViewerMode) {
        console.log("Initalization Text Editor...");
        var fileExt = filePath.substring(filePath.lastIndexOf(".")+1,filePath.length).toLowerCase();

        $("#"+containerElementID).append('<div id="code" name="code" style="width: 100%; height: 100%">');
        var mode = filetype[fileExt];
        if (mode == null) {
            mode = "properties";
        }
        require([
            extensionDirectory+"/codemirror/lib/codemirror",
            extensionDirectory+"/codemirror/keymap/vim",
            extensionDirectory+"/codemirror/addon/search/searchcursor",
            extensionDirectory+"/codemirror/addon/dialog/dialog",
            extensionDirectory+"/codemirror/addon/edit/matchbrackets",
            extensionDirectory+"/codemirror/mode/" + mode + "/" + mode + ".js",
            'css!'+extensionDirectory+'/codemirror/lib/codemirror.css',
            'css!'+extensionDirectory+'/extension.css',
        ], function(CodeMirror) {
            CodeMirror.commands.save = function() {
                TSCORE.FileOpener.saveFile()
            }
            cmEditor = CodeMirror(document.getElementById("code"), {
                fixedGutter: false,
                mode: mode,
                vimMode: true,
                lineNumbers: true,
                lineWrapping: true,
                tabSize: 4,
                collapseRange: true,
                matchBrackets: true,
                readOnly: isViewerMode,
                //theme: "lesser-dark",
                 extraKeys: {
                  "Cmd-S": function(instance) { TSCORE.FileOpener.saveFile() },
                  "Ctrl-S": function(instance) { TSCORE.FileOpener.saveFile() },
                  "Ctrl-Space": "autocomplete",
                }
            });

            //cmEditor.readOnly = isViewerMode;
            cmEditor.setSize("100%","100%");
            TSCORE.IO.loadTextFile(filePath);
        });
    };

    exports.viewerMode = function(isViewerMode) {
        cmEditor.readOnly = isViewerMode;
    };

    exports.setContent = function(content) {
//        console.log("Content: "+content);
        cmEditor.setValue(content);
    };

    exports.getContent = function() {
        return cmEditor.getValue();
    };

    var filetype = new Array();
    filetype["h"] = "clike";
    filetype["c"] = "clike";
    filetype["clj"] = "clojure";
    filetype["coffee"] = "coffeescript";
    filetype["cpp"] = "clike";
    filetype["cs"] = "clike";
    filetype["css"] = "css";
    filetype["groovy"] = "groovy";
    filetype["haxe"] = "haxe";
    filetype["htm"] = "xml";
    filetype["html"] = "xml";
    filetype["java"] = "clike";
    filetype["js"] = "javascript";
    filetype["jsm"] = "javascript";
    filetype["json"] = "javascript";
    filetype["less"] = "less";
    filetype["lua"] = "lua";
    filetype["markdown"] = "markdown";
    filetype["md"] = "markdown";
    filetype["mdown"] = "markdown";
    filetype["mdwn"] = "markdown";
    filetype["mkd"] = "markdown";
    filetype["ml"] = "ocaml";
    filetype["mli"] = "ocaml";
    filetype["pl"] = "perl";
    filetype["php"] = "php";
    filetype["py"] = "python";
    filetype["rb"] = "ruby";
    filetype["sh"] = "shell";
    filetype["sql"] = "sql";
    filetype["svg"] = "xml";
    filetype["xml"] = "xml";

});
