import ReactMarkdown from "react-markdown";
const gfm = require('remark-gfm')

export default function ReactMarkdownWrapper({text}) {
    return (
        <ReactMarkdown plugins={[[gfm, {singleTilde: false}]]}>
            {text}
        </ReactMarkdown>
    )
}
