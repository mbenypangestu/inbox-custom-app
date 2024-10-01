import { generateField, addDynamicBehavior } from '../templates/form.template.js';

export function renderForm(formData) {
    const formContainer = document.getElementById('formContainer');
    let formHtml = '<form id="customForm">';

    // Generate and show the first layer dropdown
    formHtml += generateField(formData, 1, true);

    // Submit button
    formHtml += '<button type="submit">Submit</button>';
    formHtml += '</form>';

    formContainer.innerHTML = formHtml;

    // Add event listeners for dynamic dropdowns
    addDynamicBehavior(formData);
}
