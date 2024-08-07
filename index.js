let productCount = 0;
let attachmentCount = 0;


const isValid = {
    cpnj: (cnpj) => {
        console.log(cnpj)
        cnpj = cnpj.replace(/^\d+$/, '');

        if (cnpj.length !== 14) return false;

        if (/^(\d)\1{13}$/.test(cnpj)) return false;

        let length = cnpj.length - 2;
        let digits = cnpj.slice(-2);
        let sum = 0;
        let pos = length - 7;

        for (let i = length; i >= 0; i--) {
            sum += cnpj[i] * pos--;
            if (pos < 2) pos = 9;
        }

        let result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result != digits[0]) return false;

        length += 1;
        sum = 0;
        pos = length - 7;

        for (let i = length; i >= 0; i--) {
            sum += cnpj[i] * pos--;
            if (pos < 2) pos = 9;
        }

        result = sum % 11 < 2 ? 0 : 11 - sum % 11;
        if (result != digits[1]) return false;

        return true;
    },
    cep: (cep) => {
        cep = cep.replace(/^\d+$/, '');
            if (cep.length !== 8) return false;
            if (/^(\d)\1{7}$/.test(cep)) return false;

            return true;
    },
    tel: (phone) => {
        phone = phone.replace(/^\d+$/, '');

        if (phone.length !== 10 && phone.length !== 11) return false;
        if (/^(\d)\1{9,10}$/.test(phone)) return false;
    }
}

$(document).ready(function () {
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

    function clearForm() {
        $('#address').val('');
        $('#dist').val('');
        $('#city').val('');
        $('#state').val('');
    }

    $('#addProductButton').click(function () {
        productCount++;
        const productHTML = `
            <li id="product${productCount}">
                <div class="container-fluid d-flex">
                    <div class="d-flex align-items-center">
                        <button type="button" class="btn btn-danger border border-2 border-black" onclick="removeProduct(${productCount})">
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
                                    <label for="product_name${productCount}">Produto</label>
                                    <div>
                                        <input type="text" class="form-control" id="product_name${productCount}" name="product_name${productCount}" required>
                                    </div>
                                </div>
                                <div class="w-100 d-flex gap-3">
                                    <div class="form-group w-25">
                                        <label for="UnSize${productCount}">UND. Medida</label>
                                        <select class="form-select" id="UnSize" name="UnSize">
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
                                        <label for="stock${productCount}">QTD. em Estoque</label>
                                        <div>
                                            <input type="number" class="form-control" id="stock${productCount}" name="stock${productCount}" onchange="updateProduct(${productCount})" required>
                                        </div>
                                    </div>
                                    <div class="form-group w-25">
                                        <label for="unValor${productCount}">Valor Unitário</label>
                                        <div>
                                            <input type="number" class="form-control" id="unValor${productCount}" name="unValor${productCount}" onchange="updateProduct(${productCount})" required>
                                        </div>
                                    </div>
                                    <div class="form-group w-25">
                                        <label for="totalValue${productCount}">Valor Total</label>
                                        <div>
                                            <input type="number" class="form-control" id="totalValue${productCount}" name="totalValue${productCount}" disabled>
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
        attachmentCount++;
        const attachmentHTML = `
            <div class="border border-2 border-black rounded p-3 d-flex mb-2" id="attachment${attachmentCount}">
                <div class="d-flex align-items-center gap-2">
                    <button type="button" class="btn btn-danger border border-2 border-black" onclick="removeAttachment(${attachmentCount})">
                        <img src="assets/images/trash.svg" alt="trash icon" class="icon to_white">
                    </button>
                    <button type="button" class="btn btn-info" id="viewAttachment${attachmentCount}">
                        <img src="assets/images/eye.svg" alt="eye icon" class="icon to_white">
                    </button>
                </div>
                <div class="mx-5 align-items-center d-flex pt-2">
                    <input type="file" class="form-control" id="fileInput${attachmentCount}" style="display: none;" onchange="updateAttachmentName(${attachmentCount})">
                    <p class="fw-bolder fs-5" id="fileName${attachmentCount}">Selecionar arquivo</p>
                </div>
            </div>
        `;
        $('#attachmentsContainer').append(attachmentHTML);
        $(`#fileInput${attachmentCount}`).click();
    });

    $("#form_forn").on('submit', function (event) {
        event.preventDefault();

        const data = {
            cep: $("#cep").val(),
            cnpj: $("#cnpj").val(),
            tel: $("#tel").val()
        }
        console.log(data)
        
        let errors = []
        for(const valids in isValid) {
            const er = isValid[valids](data[valids])
            er ? erros.push(`${valids}`) : ''
        }

        if (!errors) {
            for(const err of errors) {
                $(`#${err}-error`).show();
            }
            event.preventDefault();
        } else {
            for(const err of errors) {
                $(`#${err}-error`).hide();
            }
        }

        if (productCount < 1 || attachmentCount < 1) {
            alert('É necessário pelo menos 1 produto/anexo para salvar o fornecedor.')
            event.preventDefault()
        }
    })
});

function updateProduct(id) {
    const stock = $(`#stock${id}`).val()
    const value = $(`#unValor${id}`).val()
    if (stock && value) {
        $(`#totalValue${id}`).val(`${parseInt(value) * parseInt(stock)}`)
    }
}

function removeProduct(id) {
    $(`#product${id}`).remove();
}

function removeAttachment(id) {
    $(`#attachment${id}`).remove();
}

function updateAttachmentName(id) {
    const fileInput = $(`#fileInput${id}`)[0];
    const fileName = fileInput.files[0].name;
    $(`#fileName${id}`).text(fileName);
    $(`#viewAttachment${id}`).attr('onclick', `downloadAttachment(${id})`);
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
