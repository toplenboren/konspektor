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
                return {
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
                }
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
