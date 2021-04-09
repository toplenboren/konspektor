import Head from 'next/head'
import {useEffect, useState} from "react";
import ReactMarkdown from "react-markdown";
import dynamic from "next/dynamic";
import {Copy, Download, Columns, Image, Edit, Monitor} from '@geist-ui/react-icons'
import {Button, ButtonGroup, Divider, Page, Text, useToasts} from '@geist-ui/react'
const gfm = require('remark-gfm')

const CodeMirrorWrapper = dynamic(() => import("../components/CodeMirrorWrapper"), {
    ssr: false,
});


export default function Home() {

    const DISPLAY_MODES = {
        'edit':'edit',
        'both':'both',
        'render':'render'
    }

    const [text, setText] = useState('## I love to code')
    const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.both)
    const [wideMode, setWideMode] = useState(false)

    const [, setToast] = useToasts()
    const toast = type => setToast({
        text: 'Скопировал!',
        type,
    })

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

    const _downloadText = () => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const yyyy = today.getFullYear();

        const date = mm + '-' + dd + '-' + yyyy;

        const fileName = 'lect-' + date + '.md'
        const element = document.createElement("a");
        const file = new Blob([text],
            {type: 'text/plain;charset=utf-8'});
        element.href = URL.createObjectURL(file);
        element.download = fileName;
        document.body.appendChild(element);
        element.click();
    }

    return (
        <>
            <Head>
                <title>Конспектор</title>
            </Head>
            <Page size={wideMode ? 'what' : 'large'} dotBackdrop={true} className={'app-container'}>
                <section className={'header'}>
                    <section>
                    <ButtonGroup ghost size="small">
                        <Button iconRight={<Edit/>} onClick={() => setDisplayMode(DISPLAY_MODES.edit)}/>
                        <Button iconRight={<Columns/>} onClick={() => setDisplayMode(DISPLAY_MODES.both)}/>
                        <Button iconRight={<Image/>} onClick={() => setDisplayMode(DISPLAY_MODES.render)}/>
                    </ButtonGroup>
                    <ButtonGroup ghost size={'small'}>
                        <Button  iconRight={<Monitor/>} onClick={() => setWideMode(!wideMode)}/>
                    </ButtonGroup>
                    </section>
                    <Text h4 style={{marginBottom: 0}}>Конспектор</Text>
                    <section>

                        <ButtonGroup ghost size={'small'}>
                            <Button iconRight={<Copy/>} onClick={() => {toast('success'); navigator.clipboard.writeText(text);}}/>
                            <Button iconRight={<Download/>} onClick={() => _downloadText()}>
                                Скачать файл
                            </Button>
                        </ButtonGroup>
                    </section>
                </section>
                <Divider/>
                <section className={'editor-and-preview-container'}>
                    <section className={'transition ' + _getEditorAndRenderClassNamesByDisplayMode().editor}>
                        <CodeMirrorWrapper startValue={text} onChange={setText}/>
                    </section>
                    <section className={'p-sm transition ' + _getEditorAndRenderClassNamesByDisplayMode().renderer}>
                        <ReactMarkdown plugins={[[gfm, {singleTilde: false}]]}>
                            {text}
                        </ReactMarkdown>
                    </section>
                </section>
                <style jsx>{`
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    
                    .display-none {
                        display: none;
                    }

                    .editor-and-preview-container {
                        display: flex;
                    }

                    .transition {
                         transition: all 150ms ease-in-out;
                    }

                    .w-full {
                        width: 100%;
                    }

                    .w-half {
                        width: 50%;
                    }

                    .h-full {
                        height: 100vh;
                    }
                    
                    .p-sm {
                        padding: 10px;
                    }
                `}</style>
            </Page>
        </>
    )
}
