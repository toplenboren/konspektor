import {UnControlled as CodeMirror} from "react-codemirror2";
import React, {useState} from "react";

require('codemirror/mode/gfm/gfm')

function CodeMirrorWrapper({onChange, startValue}) {

    const TEXT_VALIDATION_CLASS = 'marked'

    const [editorInstance, setEditorInstance] = useState(null)

    const _validateWord = (word) => {
        return word !== 'what'
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
            if (!validatedWords.has(word) && _isWord(word) && !_validateWord(word.toLowerCase())) {
                _markWordInLine(editor, word, lineNumber)
            }
        })
    }

    const _handleChange = (editor, data, value) => {
        onChange(value)

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
                mode: 'gfm',
                theme: 'default',
                lineNumbers: true,
                firstLineNumber: 0,
                spellcheck: true,
                autocorrect: true
            }}
            onChange={_handleChange}
            editorDidMount={_handleEditorMount}
            onCursorActivity={_validateLine}
        />
        <style jsx>{`
            .editor {
                width: 100%;
                height: 100%;
            }
        `}</style>
        <style jsx global>{`
            .${TEXT_VALIDATION_CLASS} {
                background-color: red;
            }
        `}</style>
        </>
    )
}

export default CodeMirrorWrapper
