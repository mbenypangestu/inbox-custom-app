import { renderForm } from './components/mainForm.js';

let PayloadMessage = null;

function initTabs() {
    const tabCreate = document.getElementById('tabCreateCase');
    const tabSearch = document.getElementById('tabSearchCase');
    const createPanel = document.getElementById('createCasePanel');
    const searchPanel = document.getElementById('searchCasePanel');
    const title = document.getElementById('ticket-title');

    if (!tabCreate || !tabSearch || !createPanel || !searchPanel || !title) {
        return;
    }

    const setActiveTab = (activeTab) => {
        const isCreateActive = activeTab === 'create';
        tabCreate.classList.toggle('is-active', isCreateActive);
        tabSearch.classList.toggle('is-active', !isCreateActive);
        tabCreate.setAttribute('aria-selected', String(isCreateActive));
        tabSearch.setAttribute('aria-selected', String(!isCreateActive));
        createPanel.classList.toggle('hidden', !isCreateActive);
        searchPanel.classList.toggle('hidden', isCreateActive);
        title.textContent = isCreateActive ? 'Create Case' : 'Search Case';
    };

    tabCreate.addEventListener('click', () => setActiveTab('create'));
    tabSearch.addEventListener('click', () => setActiveTab('search'));
}

function runRenderForm() {
    if (PayloadMessage) {
        renderForm(null, PayloadMessage);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    runRenderForm();
});

window.addEventListener('message', function(event) {
    const messageDisplay = document.getElementById('ticket-title');
    const ticketId = event?.data?.ticketData?.ticketId;
    if (ticketId) {
        messageDisplay.innerText = `Create Case (#${ticketId})`;
    }

    PayloadMessage = event.data; 

    runRenderForm();
});
