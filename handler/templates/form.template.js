export function generateField(field, isVisible = false, requireds) {
    let fieldHtml = '';
    const visibilityClass = isVisible ? '' : 'hidden';

    if (field.field_type === 'dropdown') {
        fieldHtml += `<div class="field-container ${visibilityClass}" data-level="${field.class_hierarchical_level}">`;
        fieldHtml += `<label for="${field.field_title}">${field.field_title}:</label>`;
        fieldHtml += `<select id="${field.field_title}" name="${field.field_title}" class="dynamic-dropdown" data-level="${field.class_hierarchical_level}" select-one>`;
        fieldHtml += `<option value="" disabled selected>Select ${field.field_title}</option>`;
        field.field_value.forEach(option => {
            fieldHtml += `<option value="${option.toLowerCase()}">${option}</option>`;
        });
        fieldHtml += `</select>`;
        fieldHtml += `</div>`;
    } else if (field.field_type === 'text') {
        fieldHtml += `<div class="field-container ${visibilityClass}" data-level="${field.class_hierarchical_level}">`;
        fieldHtml += `<label for="${field.field_title}">${field.field_title}:</label>`;
        fieldHtml += `<input type="text" id="${field.field_title}" name="${field.field_title}" placeholder="${field.field_description || field.field_title}" />`;
        fieldHtml += `</div>`;
    } else if (field.field_type === 'date') {
        fieldHtml += `<div class="field-container ${visibilityClass}" data-level="${field.class_hierarchical_level}">`;
        fieldHtml += `<label for="${field.field_title}">${field.field_title}:</label>`;
        fieldHtml += `<input type="date" id="${field.field_title}" name="${field.field_title}" />`;
        fieldHtml += `</div>`;
    } else if (field.field_type === 'number') {
        fieldHtml += `<div class="field-container ${visibilityClass}" data-level="${field.class_hierarchical_level}">`;
        fieldHtml += `<label for="${field.field_title}">${field.field_title}:</label>`;
        fieldHtml += `<input type="number" id="${field.field_title}" name="${field.field_title}" placeholder="${field.field_title}" />`;
        fieldHtml += `</div>`;
    }

    // Check for nested dynamic fields and add them recursively, initially Hidden
    if (field.dynamic_hierarchical_field && field.dynamic_hierarchical_field.length > 0) {
        fieldHtml += '<div class="nested-fields">';
        field.dynamic_hierarchical_field.forEach(nestedField => {
            fieldHtml += generateField(nestedField.field_list_details[0], false, nestedField.required_fields); // Nested fields hidden initially
        });
        fieldHtml += '</div>';
    }

    return fieldHtml;
}

export function addDynamicBehavior(formData) {
    console.log("===================== Start addDynamicBehavior =========================")
    const formContainer = document.getElementById('formContainer');

    formContainer.addEventListener('change', (event) => {
        const target = event.target;

        if (target.classList.contains('dynamic-dropdown')) {
            const selectedValue = target.value;
            const currentLevel = parseInt(target.getAttribute('data-level').replace('l', ''));

            // Clear nested fields below the current level
            clearNestedFields(currentLevel);

            const matchingField = findMatchingField(formData, selectedValue, currentLevel);
            const nestedContainer = target.closest('.field-container').nextElementSibling;

            if (matchingField && nestedContainer) {
                // Clear previous nested fields
                nestedContainer.innerHTML = '';

                matchingField.field_list_details.forEach(nestedField => {
                    // Append only if not already present
                    if (!nestedContainer.querySelector(`#${nestedField.field_title}`)) {
                        nestedContainer.innerHTML += generateField(nestedField, true);
                    }
                });

                // Ensure the new dropdown also has event listeners for further nesting
                nestedContainer.querySelectorAll('.dynamic-dropdown').forEach(dropdown => {
                    dropdown.addEventListener('change', event => addDynamicBehavior(matchingField.field_list_details[0])); // Attach listeners recursively
                });

                let selectElements = document.querySelectorAll('select');

                // Loop through each select element and initialize Choices.js with search enabled
                selectElements.forEach(function (selectElement) {
                    new Choices(selectElement, {
                        searchEnabled: true  // Enables the search functionality
                    });
                });
            }
        }
    });
    
    console.log("===================== End addDynamicBehavior =========================")
}

// Clear nested fields based on the current level
function clearNestedFields(currentLevel) {
    const fieldContainers = document.querySelectorAll('.field-container[data-level]');
    
    fieldContainers.forEach(container => {
        const level = parseInt(container.getAttribute('data-level').replace('l', ''));
        const nestedContainer = container.nextElementSibling; // Find the nested fields container
        
        // Check if the nested container exists and if its level is greater than the current level
        if (level > currentLevel && nestedContainer) {
            nestedContainer.innerHTML = ''; // Clear nested fields
        }
    });
}

// Find the matching field based on the selected value and hierarchical level
function findMatchingField(formData, selectedValue, currentLevel) {
    if (parseInt(formData.class_hierarchical_level.replace('l', '')) === currentLevel) {
        return formData.dynamic_hierarchical_field.find(field =>
            field.choosen_value.toLowerCase() === selectedValue.toLowerCase()
        );
    }

    // Search recursively in the dynamic_hierarchical_field
    for (const dynamicField of formData.dynamic_hierarchical_field) {
        const result = findMatchingField(dynamicField.field_list_details[0], selectedValue, currentLevel);
        if (result) {
            return result;
        }
    }

    return null;
}
