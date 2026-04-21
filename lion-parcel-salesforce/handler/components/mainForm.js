export function renderForm(formData, payloadData) {
    const formContainer = document.getElementById('formContainer');
    const ticket = payloadData?.ticketData || {};
    const subject = ticket.issue || '';
    const caseNumber = ticket.ticketId || '';

    const escapeAttr = (value) => String(value).replace(/"/g, '&quot;');
    const row = (label, name, value = '', type = 'text') => `
        <div class="field-container sf-row">
            <label for="${name}">${label}</label>
            <div class="sf-input-wrap">
                <input
                    class="sf-control"
                    id="${name}"
                    name="${name}"
                    type="${type}"
                    value="${escapeAttr(value)}"
                    placeholder="-"
                />
            </div>
        </div>
    `;

    const formHtml = `
        <form id="customForm" class="sf-form">
            ${row('Subject', 'subject', subject)}
            ${row('Case Number', 'case_number', caseNumber)}
            ${row('Customer Status', 'customer_status')}
            ${row('POS Code', 'pos_code')}
            ${row('Nomor Whatsapp Complainer', 'whatsapp_complainer')}
            ${row('Shipment ID/Kode Booking', 'shipment_id')}
            ${row('Keyword/STT', 'keyword_stt')}
            ${row('STT', 'stt')}
            ${row('STT Status', 'stt_status')}
            ${row('Case/Non-Case', 'case_non_case')}
            ${row('Kategori', 'kategori')}
            ${row('Sub-category', 'sub_category')}
            ${row('3LC Escalate To', 'escalate_to')}
            ${row('Case Risk Flag', 'case_risk_flag')}
            ${row('Description', 'description')}
        </form>
    `;

    formContainer.innerHTML = formHtml;
}
