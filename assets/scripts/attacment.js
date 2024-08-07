function removeAttachment(id) {
    $(`#attachment${id}`).remove();
    sessionStorage.removeItem(`attachment${id}`)
    const index = attachmentIDS.indexOf(id)
    attachmentIDS.splice(index, 1)
}

async function updateAttachmentName(id) {
    const fileInput = $(`#fileInput${id}`)[0];
    const file = fileInput.files[0];

    if (file) {
        const base64 = await blobToBase64(file);
        sessionStorage.setItem(`attachment${id}`, JSON.stringify({
            name: file.name,
            base64: base64,
            fileName: file.name.split('.')[0],
            fileType: file.type
        }));

        $(`#fileName${id}`).text(file.name);
        $(`#viewAttachment${id}`).attr('onclick', `downloadAttachment(${id})`);
        $(`#attachment${id}`).show();
    } else {
        $(`#fileInput${id}`).remove();
        const index = attachmentIDS.indexOf(id)
        attachmentIDS.splice(index, 1)
    }
}

function downloadAttachment(id) {
    const fileInput = $(`#fileInput${id}`)[0];
    const file = fileInput.files[0];
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
}