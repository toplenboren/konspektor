import {UnControlled as CodeMirror} from "react-codemirror2";
import React from "react";

require('codemirror/mode/gfm/gfm')
require('codemirror/addon/mode/overlay')
require('codemirror/theme/blackboard.css')
require('../utils/spellcheck')

function CodeMirrorWrapper({onChange, startValue}) {

    return (
        <>
            <CodeMirror
                className={'editor'}
                value={startValue}
                options={{
                    mode: 'spellcheck',
                    theme: 'blackboard',
                    lineNumbers: true,
                    firstLineNumber: 0,
                }}
                onChange={(editor, data, value) => onChange(value)}
            />
            <style jsx>{`
                .editor {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
            <style jsx global>{`
                .cm-spell-error {
                    background-color: #4A2525;
                    border-radius: 2px;
                }
            `}</style>
        </>
    )
}

export default CodeMirrorWrapper
