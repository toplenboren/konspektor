import {UnControlled as CodeMirror} from "react-codemirror2";
import React, {useState} from "react";

const gfm = require('codemirror/mode/gfm/gfm')
const overlay = require('codemirror/addon/mode/overlay')
const Typo = require("typo-js");

function CodeMirrorWrapper({onChange, startValue}) {

    const RX_WORD = "!\"#$%&()*+,-./:;<=>?@[\\]^_`{|}~ "
    const TEXT_VALIDATION_CLASS = 'marked'
    const dictionary = new Typo("en_US", null, null, {dictionaryPath: 'dictionaries'})
    const [editorInstance, setEditorInstance] = useState(null)

    const _validateWord = (word) => {
        if (dictionary !== null) {
            return dictionary.check(word)
        }
        return true
    }

    const _clearWordMarkingsInLine = (editor, lineNumber) => {
        editor.findMarks({
                line: lineNumber,
                ch: 0
            }, {
                line: lineNumber,
                ch: editor.getLine(lineNumber).length
            }
        ).forEach(mark => mark.clear())
    }

    const _markWordInLine = (editor, word, lineNumber) => {

        const lineString = editor.getLine(lineNumber)

        const wordOccurrences = [...lineString.matchAll(word)].map(match => ({
            start: match.index,
            end: match.index + word.length
        }))

        wordOccurrences.forEach(w => {
            editor.markText({
                line: lineNumber,
                ch: w.start
            }, {
                line: lineNumber,
                ch: w.end
            }, {
                'className':TEXT_VALIDATION_CLASS
            })
        })
    }

    const _isWord = (word) => {
        return (!/[^a-zA-Z]/.test(word))
    }

    const _validateLine = (editor) => {
        const lineNumber = editor.getCursor().line
        const lineWords = editor.getLine(lineNumber).split(' ')
        const validatedWords = new Set()

        lineWords.forEach(word => {
            if (!validatedWords.has(word) && _isWord(word) && lineWords[lineWords.length] !== word && !_validateWord(word.toLowerCase())) {

                _markWordInLine(editor, word, lineNumber)
            }
        })
    }

    const _handleChange = (editor, event) => {
        onChange(editor.getValue())
    }

    const _handleEditorMount = (editor) => {
        setEditorInstance(editor)
    }

    return (
        <>
        <CodeMirror
            className={'editor'}
            value={startValue}
            options={{
                mode: 'spellchecker',
                backdrop: 'gfm',
                theme: 'default',
                lineNumbers: true,
                firstLineNumber: 0,
            }}
            editorDidMount={_handleEditorMount}
            //onCursorActivity={_validateLine}
            defineMode={{name:'spellchecker', fn: function(config, parserConfig) {

                    function forgeOverlayMode(base, overlay, combine) {
                        return {

                            token: function(stream, state) {
                                if (stream != state.streamSeen ||
                                    Math.min(state.basePos, state.overlayPos) < stream.start) {
                                    state.streamSeen = stream;
                                    state.basePos = state.overlayPos = stream.start;
                                }

                                if (stream.start == state.basePos) {
                                    state.baseCur = base.token(stream, state.base);
                                    state.basePos = stream.pos;
                                }
                                if (stream.start == state.overlayPos) {
                                    stream.pos = stream.start;
                                    state.overlayCur = overlay.token(stream, state.overlay);
                                    state.overlayPos = stream.pos;
                                }
                                stream.pos = Math.min(state.basePos, state.overlayPos);

                                // state.overlay.combineTokens always takes precedence over combine,
                                // unless set to null
                                if (state.overlayCur == null) return state.baseCur;
                                else if (state.baseCur != null &&
                                    state.overlay.combineTokens ||
                                    combine && state.overlay.combineTokens == null)
                                    return state.baseCur + " " + state.overlayCur;
                                else return state.overlayCur;
                            },

                            indent: base.indent && function(state, textAfter, line) {
                                return base.indent(state.base, textAfter, line);
                            },
                            electricChars: base.electricChars,

                            innerMode: function(state) { return {state: state.base, mode: base}; },

                            blankLine: function(state) {
                                var baseToken, overlayToken;
                                if (base.blankLine) baseToken = base.blankLine(state.base);
                                if (overlay.blankLine) overlayToken = overlay.blankLine(state.overlay);

                                return overlayToken == null ?
                                    baseToken :
                                    (combine && baseToken != null ? baseToken + " " + overlayToken : overlayToken);
                            }
                        };
                    };

                const spellCheckerOverlay = {
                    token: function(stream) {
                        var ch = stream.peek();
                        var word = "";

                        if(RX_WORD.includes(ch)) {
                            stream.next();
                            return null;
                        }

                        while((ch = stream.peek()) != null && !RX_WORD.includes(ch)) {
                            word += ch;
                            stream.next();
                        }

                        if(dictionary && !dictionary.check(word))
                            return TEXT_VALIDATION_CLASS; // CSS class: cm-spell-error

                        return null;
                    }
                }

                return forgeOverlayMode(gfm, spellCheckerOverlay)
            }}}
        />
        <style jsx>{`
            .editor {
                width: 100%;
                height: 100%;
            }
        `}</style>
        <style jsx global>{`
            .cm-${TEXT_VALIDATION_CLASS} {
                background-color: red;
            }
        `}</style>
        </>
    )
}

export default CodeMirrorWrapper
