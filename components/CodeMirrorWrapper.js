import {UnControlled as CodeMirror} from "react-codemirror2";
import React, {useState} from "react";

require('codemirror/mode/gfm/gfm')
require('codemirror/addon/mode/overlay')
require('../utils/spellcheck')
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
                mode: 'spellcheck',
                theme: 'default',
                lineNumbers: true,
                firstLineNumber: 0,
            }}
            editorDidMount={_handleEditorMount}
        />
        <style jsx>{`
            .editor {
                width: 100%;
                height: 100%;
            }
        `}</style>
        <style jsx global>{`
            .cm-spell-error {
                background-color: red;
            }
        `}</style>
        </>
    )
}

export default CodeMirrorWrapper
