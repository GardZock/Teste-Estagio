function updateProductValues(id) {
    const stock = $(`#stock${id}`).val()
    const value = $(`#unValor${id}`).val()
    if (stock && value) {
        $(`#totalValue${id}`).val(`${parseInt(value) * parseInt(stock)}`)
    }
}

function removeProduct(id) {
    $(`#product${id}`).remove();
    const index = productIDS.indexOf(id)
    productIDS.splice(index, 1)
}