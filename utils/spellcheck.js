// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("codemirror/lib/codemirror"), require("codemirror/mode/markdown/markdown"), require("codemirror/addon/mode/overlay"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["", "codemirror/lib/codemirror", "codemirror/mode/markdown/markdown"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    CodeMirror.defineMode("spellcheck", function(config, modeConfig) {
        const Typo = require('typo-js')
        const dictionary = new Typo("en_US", null, null, {dictionaryPath: 'dictionaries'})
        const RX_WORD = "!\"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ "
        const spellcheckOverlay = {
            token: function (stream) {
                var ch = stream.peek();
                var word = "";

                if (RX_WORD.includes(ch)) {
                    stream.next();
                    return null;
                }

                while ((ch = stream.peek()) != null && !RX_WORD.includes(ch)) {
                    word += ch;
                    stream.next();
                }

                if (dictionary && !dictionary.check(word))
                    return 'spell-error'; // CSS class: cm-spell-error

                return null;
            }
        };

        var markdownConfig = {
            taskLists: true,
            strikethrough: true,
            emoji: true
        };
        for (var attr in modeConfig) {
            markdownConfig[attr] = modeConfig[attr];
        }
        markdownConfig.name = "markdown";
        return CodeMirror.overlayMode(CodeMirror.getMode(config, markdownConfig), spellcheckOverlay);

    }, "markdown");

    CodeMirror.defineMIME("text/x-spellcheck", "spellcheck");
});
