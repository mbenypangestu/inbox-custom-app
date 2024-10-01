import { renderForm } from './components/mainForm.js';

document.addEventListener('DOMContentLoaded', () => {
    fetch('./assets/json/customFields.json')
        .then(response => response.json())
        .then(jsonData => {
            console.log("jsonData", jsonData)
            renderForm(jsonData);
        })
        .catch(error => console.error('Error fetching JSON:', error));
});
