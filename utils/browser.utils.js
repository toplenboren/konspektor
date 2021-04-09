export const downloadText = (fileContent) => {
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const yyyy = today.getFullYear();

    const date = mm + '-' + dd + '-' + yyyy;

    const fileName = 'lect-' + date + '.md'
    const element = document.createElement("a");
    const file = new Blob([fileContent],
        {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
}


export const copyText = (text) => {
    navigator.clipboard.writeText(text);
}
