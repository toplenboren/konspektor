import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState} from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
const CodeMirrorWrapper = dynamic(() => import("../components/CodeMirrorWrapper"), {
    ssr: false,
});

export default function Home() {

    const [text, setText] = useState('')

    return (
        <>
            <section className={'app-container'}>
                <h1>Конспектор</h1>
                <section className={'editor-and-preview-container'}>
                    <CodeMirrorWrapper onChange={setText}/>
                    <section className={'react-markdown__container'}>
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
                        
                      .react-markdown__container {
                           overflow: scroll;
                           height: 90vh;
                           width: 50vw;
                       }
                `}</style>
            </section>
        </>
    )
}
