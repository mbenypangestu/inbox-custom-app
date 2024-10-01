import { renderForm } from './components/mainForm.js';

document.addEventListener('DOMContentLoaded', () => {
    fetch('./assets/json/customFields.json')
        .then(response => response.json())
        .then(jsonData => {
            console.log("jsonData", jsonData)
            renderForm(jsonData);

            let selectElements = document.querySelectorAll('select');

            // Loop through each select element and initialize Choices.js with search enabled
            selectElements.forEach(function (selectElement) {
                new Choices(selectElement, {
                    searchEnabled: true  // Enables the search functionality
                });
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
});
