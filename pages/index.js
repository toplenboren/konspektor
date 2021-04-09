import Head from 'next/head'
import {useEffect, useState} from "react";
import dynamic from "next/dynamic";
import {Copy, Download, Columns, Image, Edit, Monitor, Trash} from '@geist-ui/react-icons'
import {Button, ButtonGroup, Divider, Modal, Page, Text, useModal, useToasts} from '@geist-ui/react'
import {downloadText, copyText} from "../utils/browser.utils";
import ReactMarkdownWrapper from "../components/ReactMarkdownWrapper";

const CodeMirrorWrapper = dynamic(() => import("../components/CodeMirrorWrapper"), {
    ssr: false,
});


export default function Home() {

    const BACKUP_TEXT_NAME = 'k0nsp3kt0r__t3XXXt'

    const START_TEXT = '# I love React'

    const DISPLAY_MODES = {
        'edit':'edit',
        'both':'both',
        'render':'render'
    }

    const [text, setText] = useState(START_TEXT)
    const [displayMode, setDisplayMode] = useState(DISPLAY_MODES.edit)
    const [wideMode, setWideMode] = useState(false)
    const { visible, setVisible, bindings } = useModal()

    const [, setToast] = useToasts()
    const toast = type => setToast({
        text: 'Скопировал!',
        type,
    })

    useEffect(() => {
        const backup_text = window.localStorage.getItem(BACKUP_TEXT_NAME)
        if (backup_text) {
            setText(backup_text)
        }
    }, [])

    const _resetApp = () => {
        window.localStorage.setItem(BACKUP_TEXT_NAME, START_TEXT)
        setText(START_TEXT)
    }

    const _getEditorAndRenderClassNamesByDisplayMode = () => {
        switch (displayMode) {
            case DISPLAY_MODES.both: {
                return {renderer: 'h-full w-half',editor: 'h-full w-half'}
            }
            case DISPLAY_MODES.edit: {
                return {renderer: 'display-none',editor: 'h-full w-full'}
            }
            case DISPLAY_MODES.render: {
                return {renderer: 'h-full w-full',editor: 'display-none'}
            }
        }
    }

    return (
        <>
            <Head>
                <title>Конспектор</title>
            </Head>
            <Page style={{height: '100vh'}} size={wideMode ? 'what' : 'large'}>
                <section className={'app-container'}>
                    <section className={'header'}>
                        <section>
                        <ButtonGroup ghost size="small">
                            <Button iconRight={<Edit/>} onClick={() => setDisplayMode(DISPLAY_MODES.edit)}/>
                            <Button iconRight={<Columns/>} onClick={() => setDisplayMode(DISPLAY_MODES.both)}/>
                            <Button iconRight={<Image/>} onClick={() => setDisplayMode(DISPLAY_MODES.render)}/>
                        </ButtonGroup>
                        <ButtonGroup ghost size={'small'}>
                            <Button iconRight={<Monitor/>} onClick={() => setWideMode(!wideMode)}/>
                        </ButtonGroup>
                        </section>
                        <Text h4 style={{marginBottom: 0}}>Конспектор</Text>
                        <section>
                            <ButtonGroup ghost size={'small'}>
                                <Button iconRight={<Copy/>} onClick={() => {toast('success'); copyText(text)}}/>
                                <Button iconRight={<Download/>} onClick={() => downloadText(text)}>
                                    Скачать файл
                                </Button>
                            </ButtonGroup>
                            <ButtonGroup type={'alert'} size={'small'}>
                                <Modal {...bindings}>
                                    <Modal.Title>Привет</Modal.Title>
                                    <Modal.Content>
                                        <Text style={{textAlign:'center'}}>Точно хочешь все удалить и начать сначала?</Text>
                                    </Modal.Content>
                                    <Modal.Action passive onClick={() => setVisible(false)}>Назад</Modal.Action>
                                    <Modal.Action type={'warning'} onClick={() => {setVisible(false); _resetApp()}}>Удалить</Modal.Action>
                                </Modal>
                                <Button iconRight={<Trash/>} onClick={() => {setVisible(true)}}/>
                            </ButtonGroup>
                        </section>
                    </section>
                    <Divider/>
                    <section className={'editor-and-preview-container'}>
                        <section className={'transition ' + _getEditorAndRenderClassNamesByDisplayMode().editor}>
                            <CodeMirrorWrapper startValue={text} onChange={(newText) => {window.localStorage.setItem(BACKUP_TEXT_NAME, newText); setText(newText)}}/>
                        </section>
                        <section className={'p-sm transition ' + _getEditorAndRenderClassNamesByDisplayMode().renderer}>
                            <ReactMarkdownWrapper text={text}/>
                        </section>
                    </section>
                </section>
                <style jsx>{`
                    .header {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }

                    .app-container {
                        display: flex;
                        flex-direction: column;

                        height: 100%;
                        max-height: 100vh;
                    }

                    .display-none {
                        display: none;
                    }

                    .editor-and-preview-container {
                        flex-grow: 1;
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
                        height: 100%;
                    }

                    .p-sm {
                        padding: 10px;
                    }

                    .scrolls-y {
                        overflow-y: scroll;
                    }
                `}</style>
            </Page>
        </>
    )
}
