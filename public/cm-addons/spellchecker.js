// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

(function(mod) {
    if (typeof exports == "object" && typeof module == "object") // CommonJS
        mod(require("../../lib/codemirror"), require("../markdown/markdown"), require("../../addon/mode/overlay"));
    else if (typeof define == "function" && define.amd) // AMD
        define(["../../lib/codemirror", "../markdown/markdown", "../../addon/mode/overlay"], mod);
    else // Plain browser env
        mod(CodeMirror);
})(function(CodeMirror) {
    "use strict";

    var urlRE = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i

    CodeMirror.defineMode("spellcheck", function(config, modeConfig) {
        var spellcheckOverlay = {
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
                    return TEXT_VALIDATION_CLASS; // CSS class: cm-spell-error

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
