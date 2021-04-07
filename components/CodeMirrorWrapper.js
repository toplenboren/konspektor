import {UnControlled as CodeMirror} from "react-codemirror2";
import React, {useState} from "react";

require('codemirror/mode/markdown/markdown')

function CodeMirrorWrapper({onChange}) {
    const [editorInstance, setEditorInstance] = useState(null)

    const _handleChange = (editor, data, value) => {
        onChange(value)
    }

    return (
        <CodeMirror
            value='## I love to code'
            options={{
                mode: 'markdown',
                theme: 'default',
                lineNumbers: true
            }}
            onChange={_handleChange}
        />
    )
}

export default CodeMirrorWrapper
