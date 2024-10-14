import { renderForm } from './components/mainForm.js';

let JsonData = null;
let PayloadMessage = null;

function runRenderForm() {
    console.log("JsonData == null", PayloadMessage)
    if (PayloadMessage == null) {
        const messageDisplay = document.getElementById('ticket-title-forbidden');
        messageDisplay.innerText += '403 Access Forbidden';
    } else if (JsonData && PayloadMessage) {
        
        renderForm(JsonData, PayloadMessage);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetch('./assets/json/customFields.json')
        .then(response => response.json())
        .then(jsonData => {
            JsonData = jsonData;  

            runRenderForm();

            let selectElements = document.querySelectorAll('select');

            selectElements.forEach(function (selectElement) {
                new Choices(selectElement, {
                    searchEnabled: true  // Enables the search functionality
                });
            });
        })
        .catch(error => console.error('Error fetching JSON:', error));
});

window.addEventListener('message', function(event) {
    // console.log('Payload message: ', event.data);
    PayloadMessage = event.data; 

    runRenderForm();
});
