import Head from 'next/head'
import {useState} from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
const CodeMirrorWrapper = dynamic(() => import("../components/CodeMirrorWrapper"), {
    ssr: false,
});

export default function Home() {

    const [text, setText] = useState('## I love to code')

    return (
        <>
            <Head>
                <title>Конспектор</title>
            </Head>
            <section className={'app-container'}>
                <h1>Конспектор</h1>
                <section className={'editor-and-preview-container'}>
                    <section className={'editor__container'}>
                        <CodeMirrorWrapper startValue={text} onChange={setText}/>
                    </section>
                    <section className={'preview__container'}>
                        <ReactMarkdown>
                            {text}
                        </ReactMarkdown>
                    </section>
                </section>
                <style jsx>{`
                      .app-container {
                           
                      } 
                        
                      .editor-and-preview-container {
                           display: flex;
                      }
                      
                      .editor__container {
                           height: 90vh;
                           width: 50vw;
                      }
                        
                      .preview__container {
                           overflow: scroll;
                           height: 90vh;
                           width: 50vw;
                       }
                `}</style>
            </section>
        </>
    )
}
