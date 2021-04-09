import Head from 'next/head'
import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";

const CodeMirrorWrapper = dynamic(() => import("../components/CodeMirrorWrapper"), {
    ssr: false,
});
import {Copy, Download, Columns, Image, Edit} from '@geist-ui/react-icons'
import {Button, ButtonGroup, Text} from '@geist-ui/react'

export default function Home() {

    const DISPLAY_MODES = {
        'edit':'edit',
        'both':'both',
        'render':'render'
    }

    const [text, setText] = useState('## I love to code')
    const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.both)

    useEffect(() => {
        const BACKUP_NAME = 'k0nsp3kt0r__t3XXXt'

        const backup = window.localStorage.getItem(BACKUP_NAME)
        if (backup) {

        }

        return () => {
            window.localStorage.setItem(BACKUP_NAME, text);
        }
    }, [])

    const _getEditorAndRenderClassNamesByDisplayMode = () => {
        switch (displayMode) {
            case DISPLAY_MODES.both: {
                return {renderer: 'w-half',editor: 'w-half'}
            }
            case DISPLAY_MODES.edit: {
                return {renderer: 'display-none',editor: 'w-full'}
            }
            case DISPLAY_MODES.render: {
                return {renderer: 'w-full',editor: 'display-none'}
            }
        }
    }

    return (
        <>
            <Head>
                <title>Конспектор</title>
            </Head>
            <section className={'app-container'}>
                <Text h4>Конспектор</Text>
                <ButtonGroup ghost size="small">
                    <Button iconRight={<Edit/>} onClick={() => setDisplayMode(DISPLAY_MODES.edit)}/>
                    <Button iconRight={<Columns/>} onClick={() => setDisplayMode(DISPLAY_MODES.both)}/>
                    <Button iconRight={<Image/>} onClick={() => setDisplayMode(DISPLAY_MODES.render)}/>
                </ButtonGroup>
                <ButtonGroup ghost size={'small'}>
                    <Button iconRight={<Copy/>}/>
                    <Button iconRight={<Download/>}>
                        Скачать
                    </Button>
                </ButtonGroup>
                <section className={'editor-and-preview-container'}>
                    <section className={_getEditorAndRenderClassNamesByDisplayMode().editor}>
                        <CodeMirrorWrapper startValue={text} onChange={setText}/>
                    </section>
                    <section className={_getEditorAndRenderClassNamesByDisplayMode().renderer}>
                        <ReactMarkdown>
                            {text}
                        </ReactMarkdown>
                    </section>
                </section>
                <style jsx>{`
                    .display-none {
                        display: none;
                    }
                    
                    .editor-and-preview-container {
                        display: flex;
                    }
                    
                    .w-full {
                        width: 100vw;
                    }
                    
                    .w-half {
                        width: 50vw;
                    }
                    
                    .h-full {
                        height: 100vh;
                    }
                `}</style>
            </section>
        </>
    )
}
