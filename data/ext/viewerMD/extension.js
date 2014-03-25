/* Copyright (c) 2012-2013 The TagSpaces Authors. All rights reserved.
 * Use of this source code is governed by a AGPL3 license that
 * can be found in the LICENSE file. */

define(function(require, exports, module) {
"use strict";

    console.log("Loading viewerMD");

    exports.id = "viewerMD"; // ID should be equal to the directory name where the ext. is located
    exports.title = "MD Viewer";
    exports.type = "editor";
    exports.supportedFileTypes = [ "md", "markdown", "mdown" ];

    var TSCORE = require("tscore");

    var md2htmlConverter = undefined;
    var containerElID = undefined;
    var currentFilePath = undefined;

    var extensionDirectory = TSCORE.Config.getExtensionPath()+"/"+exports.id;

    exports.init = function(filePath, containerElementID) {
        console.log("Initalization MD Viewer...");
        containerElID = containerElementID;
        currentFilePath = filePath;
        require(['css!'+extensionDirectory+'/viewerMD.css']);
        //require([extensionDirectory+'/showdown/showdown.js'], function() {
            //md2htmlConverter = new Showdown.converter();
            //TSCORE.IO.loadTextFile(filePath);
        //});
        require(['css!'+extensionDirectory+'/marked/default.css']);
        require([extensionDirectory + '/marked/marked',
                extensionDirectory+'/marked/highlight',
        ], function(marked) {
            var languageOverrides = {
              js: 'javascript',
              html: 'xml'
            }
            md2htmlConverter = {};
            md2htmlConverter.makeHtml = marked;
            md2htmlConverter.makeHtml.setOptions({
                highlight: function(code, lang){
                    if(languageOverrides[lang]) lang = languageOverrides[lang];
                    return hljs.LANGUAGES[lang] ? hljs.highlight(lang, code).value : code;
                }
            });
            TSCORE.IO.loadTextFile(filePath);

        });
    };

    exports.setFileType = function(fileType) {
        console.log("setFileType not supported on this extension");
    };

    exports.viewerMode = function(isViewerMode) {
        // set readonly
    };

    exports.setContent = function(content) {
        require([ extensionDirectory+'/mathjax/MathJax.js?config=TeX-AMS_HTML',], function() {
            var UTF8_BOM = "\ufeff";

           // removing the UTF8 bom because it brakes thing like #header1 in the beginning of the document
           if(content.indexOf(UTF8_BOM) == 0) {
               content = content.substring(1,content.length);
           }

           var cleanedContent = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,"");
           $('#'+containerElID).append($("<div>", {
                class: "viewerMDContainer",
            }).append(md2htmlConverter.makeHtml(cleanedContent)));


           var fileDirectory = TSCORE.TagUtils.extractContainingDirectoryPath(currentFilePath);

           $('#'+containerElID+" img[src]").each(function(){
               var currentSrc = $( this ).attr("src");
               if(currentSrc.indexOf("http://") == 0 || currentSrc.indexOf("https://") == 0) {
                   // do nothing if src begins with http(s)://
               } else {
                   $( this ).attr("src","file://"+fileDirectory+TSCORE.dirSeparator+currentSrc);
               }
           });
            MathJax.Hub.Config({tex2jax: {inlineMath: [['$','$']]}});
            MathJax.Hub.Startup.onload();
        });
    };

    exports.getContent = function() {
        $('#'+containerElID).html();
    };

});
