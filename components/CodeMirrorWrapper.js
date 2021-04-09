import {UnControlled as CodeMirror} from "react-codemirror2";
import React from "react";

require('codemirror/mode/gfm/gfm')
require('codemirror/addon/mode/overlay')
require('codemirror/theme/abcdef.css')
require('../utils/spellcheck')
require('codemirror/addon/scroll/simplescrollbars')
require('codemirror/addon/scroll/simplescrollbars.css')

function CodeMirrorWrapper({onChange, startValue}) {

    return (
        <>
            <CodeMirror
                className={'editor'}
                value={startValue}
                options={{
                    mode: 'spellcheck',
                    theme: 'abcdef',
                    lineNumbers: true,
                    firstLineNumber: 0,
                }}
                onChange={(editor, data, value) => onChange(value)}
                autoCursor={false}
            />
            <style jsx>{`
                .editor {
                    width: 100%;
                    height: 100%;
                }
            `}</style>
            <style jsx global>{`
                .CodeMirror {
                    height: 100%;
                }
            
                .cm-s-abcdef.CodeMirror {
                    background: black;
                }
                
                .CodeMirror-gutters {
                    background: black !important;
                    border-right: 2px solid #292f34 !important;
                }
                
                .cm-spell-error {
                    background-color: #4A2525;
                    border-radius: 2px;
                }
            `}</style>
        </>
    )
}

export default CodeMirrorWrapper
