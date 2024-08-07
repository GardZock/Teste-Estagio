let productIDS = [];
let attachmentIDS = [];

const isValid = {
    cnpj: (cnpj) => {
        if (!cnpj) return false;
        cnpj = cnpj.replace(/[^\d]/g, '');

        if (cnpj.length !== 14) return false;
        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        return true;
    },
    cep: (cep) => {
        if (!cep) return false;
        cep = cep.replace(/[^\d]/g, '');
        if (cep.length !== 8) return false;
        if (/^(\d)\1{7}$/.test(cep)) return false;

        return true;
    },
    phone: (phone) => {
        if (!phone) return false;
        phone = phone.replace(/[^\d]/g, '');

        if (!/^\+?\d{1,3} ?\(?\d{2}\)? ?\d{5}-?\d{4}$/.test(phone)) return false;
        return true;
    },
    email: (email) => {
        if (!email) return false;
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
        return true;
    }
}

$(document).ready(function () {
    sessionStorage.clear();
    $('#cep').on('blur', function () {
        var cep = $(this).val().replace(/\D/g, '');
        if (cep != "") {
            var validacep = /^[0-9]{8}$/;
            if (validacep.test(cep)) {
                $('#address').val('...');
                $('#dist').val('...');
                $('#city').val('...');
                $('#state').val('...');

                $.getJSON("https://viacep.com.br/ws/" + cep + "/json/?callback=?", function (dados) {
                    if (!("erro" in dados)) {
                        $('#address').val(dados.logradouro);
                        $('#dist').val(dados.bairro);
                        $('#city').val(dados.localidade);
                        $('#state').val(dados.uf);
                    } else {
                        clearForm();
                    }
                });
            } else {
                clearForm();
            }
        } else {
            clearForm();
        }
    });

    $('#addProductButton').click(function () {
        const id = productIDS.length > 0 ? productIDS.length + 1 : 0
        productIDS.push(id)
        const productHTML = `
            <li id="product${id}">
                <div class="container-fluid d-flex">
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-danger border border-2 border-black" onclick="removeProduct(${id})">
                            <img src="assets/images/trash.svg" alt="trash icon" class="icon to_white">
                        </button>
                    </div>
                    <div class="container border border-2 d-flex m-3 px-3 py-4 rounded border-black">
                        <div class="p-3 rounded-circle bg-primary d-flex">
                            <img src="assets/images/box.svg" alt="Product Image" class="product_image to_white">
                        </div>
                        <div class="w-100 mx-4">
                            <div class="w-100">
                                <div class="form-group">
                                    <label for="product_name${id}">Produto</label>
                                    <div>
                                        <input type="text" class="form-control" id="product_name${id}" name="product_name${id}" required>
                                    </div>
                                </div>
                                <div class="w-100 d-flex gap-3">
                                    <div class="form-group w-25">
                                        <label for="UnSize${id}">UND. Medida</label>
                                        <select class="form-select" id="UnSize${id}" name="UnSize">
                                            <option value="kg">Quilograma (kg)</option>
                                            <option value="g">Grama (g)</option>
                                            <option value="l">Litro (l)</option>
                                            <option value="ml">Mililitro (ml)</option>
                                            <option value="m">Metro (m)</option>
                                            <option value="cm">Centímetro (cm)</option>
                                            <option value="mm">Milímetro (mm)</option>
                                            <option value="un">Unidade (un)</option>
                                        </select>
                                    </div>
                                    <div class="form-group w-25">
                                        <label for="stock${id}">QTD. em Estoque</label>
                                        <div>
                                            <input type="number" class="form-control" id="stock${id}" name="stock${id}" onchange="updateProductValues(${id})" required>
                                        </div>
                                    </div>
                                    <div class="form-group w-25">
                                        <label for="unValor${id}">Valor Unitário</label>
                                        <div>
                                            <input type="number" class="form-control" id="unValor${id}" name="unValor${id}" onchange="updateProductValues(${id})" required>
                                        </div>
                                    </div>
                                    <div class="form-group w-25">
                                        <label for="totalValue${id}">Valor Total</label>
                                        <div>
                                            <input type="number" class="form-control" id="totalValue${id}" name="totalValue${id}" disabled>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        `;
        $('#productsContainer').append(productHTML);
    });

    $('#addAttachmentButton').click(function () {
        const id = attachmentIDS.length > 0 ? attachmentIDS.length : 0
        attachmentIDS.push(id)
        const attachmentHTML = `
            <div style="display: none;" id="attachment${id}">
                <div class="border border-2 border-black rounded p-3 d-flex mb-2">
                    <div class="d-flex align-items-center gap-2">
                        <button type="button" class="btn btn-danger border border-2 border-black" onclick="removeAttachment(${id})">
                            <img src="assets/images/trash.svg" alt="trash icon" class="icon to_white">
                        </button>
                        <button type="button" class="btn btn-info" id="viewAttachment${id}">
                            <img src="assets/images/eye.svg" alt="eye icon" class="icon to_white">
                        </button>
                    </div>
                    <div class="mx-5 align-items-center d-flex pt-2">
                        <input type="file" class="form-control" id="fileInput${id}" onchange="updateAttachmentName(${id})" style="display: none;">
                        <p class="fw-bolder fs-5" id="fileName${id}">Selecionar arquivo</p>
                    </div>
                </div>
            </div>
        `;
        $('#attachmentsContainer').append(attachmentHTML);
        $(`#fileInput${id}`).click();
    });

    $("#form_forn").on('submit', async function (event) {
        event.preventDefault();
        const errors = await checkErros(event);
        if (!errors) return;

        if (productIDS.length < 1 || attachmentIDS.length < 1) {
            alert('É necessário pelo menos 1 produto/anexo para salvar o fornecedor.')
            event.preventDefault()
            return;
        }

        const products = []
        for (const id of productIDS) {
            if (!$(`#product_name${id}`).val()) continue;
            products.push({
                indice: id,
                descricaoProduto: $(`#product_name${id}`).val(),
                unidadeMedida: $(`#UnSize${id}`).val(),
                qtdeEstoque: $(`#stock${id}`).val(),
                valorUnitario: $(`#unValor${id}`).val(),
                valorTotal: $(`#totalValue${id}`).val()
            })
        }

        const annexes = []
        for (const id of attachmentIDS) {
            const attachment = JSON.parse(sessionStorage.getItem(`attachment${id}`))
            if (!attachment) continue;
            annexes.push({
                indice: id,
                nomeArquivo: attachment.name,
                blobArquivo: base64toBlob(attachment.base64, attachment.fileType)
            })
        }

        const data = {
            razaoSocial: $("#compName").val(),
            nomeFantasia: $("#fantasyName").val(),
            cnpj: $("#cnpj").val(),
            inscricaoEstadual: $("#statIns").val(),
            inscricaoMunicipal: $("#cityIns").val(),
            nomeContato: $("#name").val(),
            telefoneContato: `+${$("#phone").val().replace(/[^\d]/g, '')}`,
            emailContato: $("#email").val(),
            produtos: products,
            anexos: annexes
        }

        $("#modalContainer").append(`
            <div>
            <pre><code id="jsonOutput"></code></pre>
            </div>
            `)
        $('#jsonOutput').text(JSON.stringify(data, null, 2));

        const Modal = new bootstrap.Modal('#loadingModal')
        Modal.show()
        console.log(data);
    })
});

function checkErros(event) {
    const data = {
        cep: $("#cep").val(),
        cnpj: $("#cnpj").val(),
        phone: $("#phone").val(),
        email: $("#email").val()
    }

    let errors = []
    for (const valids in isValid) {
        const er = isValid[valids](data[valids])
        er ? '' : errors.push(`${valids}`)
    }

    if (errors.length > 0) {
        for (const err of errors) {
            $(`#${err}-error`).show();
        }
        event.preventDefault();
        return false;
    } else {
        for (const err in data) {
            $(`#${err}-error`).hide();
        }
        return true;
    }
}

function clearForm() {
    $('#address').val('');
    $('#dist').val('');
    $('#city').val('');
    $('#state').val('');
}
