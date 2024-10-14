import { generateField, addDynamicBehavior } from '../templates/form.template.js';

export function renderForm(formData, payloadData) {
    console.log("Json FormData", formData);
    console.log("payloadData Mesage", payloadData);

    const formContainer = document.getElementById('formContainer');
    let formHtml = '<form id="customForm">';

    formHtml += generateField(formData, payloadData, true, false);

    formHtml += '<button type="submit">Submit</button>';
    formHtml += '</form>';

    formContainer.innerHTML = formHtml;

    addDynamicBehavior(formData);
}
