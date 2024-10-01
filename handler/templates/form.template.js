export function generateField(field, isVisible = false) {
    let fieldHtml = '';
    const visibilityClass = isVisible ? '' : 'hidden';

    if (field.field_type === 'dropdown') {
        fieldHtml += `<div class="field-container ${visibilityClass}" data-level="${field.class_hierarchical_level}">`;
        fieldHtml += `<label for="${field.field_title}">${field.field_title}:</label>`;
        fieldHtml += `<select id="${field.field_title}" name="${field.field_title}" class="dynamic-dropdown" data-level="${field.class_hierarchical_level}">`;
        fieldHtml += `<option value="" disabled selected>Select ${field.field_title}</option>`;
        field.field_value.forEach(option => {
            fieldHtml += `<option value="${option.toLowerCase()}">${option}</option>`;
        });
        fieldHtml += `</select>`;
        fieldHtml += `</div>`;
    } else if (field.field_type === 'input') {
        fieldHtml += `<div class="field-container ${visibilityClass}" data-level="${field.class_hierarchical_level}">`;
        fieldHtml += `<label for="${field.field_title}">${field.field_title}:</label>`;
        fieldHtml += `<input type="text" id="${field.field_title}" name="${field.field_title}" placeholder="${field.field_title}" />`;
        fieldHtml += `</div>`;
    }

    // Check for nested dynamic fields and add them recursively, initially Hidden
    if (field.dynamic_hirarchical_field && field.dynamic_hirarchical_field.length > 0) {
        fieldHtml += '<div class="nested-fields">';
        field.dynamic_hirarchical_field.forEach(nestedField => {
            fieldHtml += generateField(nestedField.field_list_details[nestedField.field_list_details.length - 1], false); // Nested fields hidden initially
        });
        fieldHtml += '</div>';
    }

    return fieldHtml;
}

export function addDynamicBehavior(formData) {
    const formContainer = document.getElementById('formContainer');
    formContainer.addEventListener('change', (event) => {
        const target = event.target;

        // console.log("target.classList", target.classList)
        console.log("target.value", target.value)

        if (target.classList.contains('dynamic-dropdown')) {
            const selectedValue = target.value;
            const currentLevel = parseInt(target.getAttribute('data-level').replace('l', ''));
            const nextLevel = currentLevel + 1;

            // Find the matching field in the current formData hierarchy
            const matchingField = findMatchingField(formData, selectedValue, currentLevel);

            if (matchingField) {
                const nestedContainer = target.closest('.field-container').nextElementSibling; // Find the next sibling for nested fields

                if (nestedContainer) {
                    // Clear out any previous nested fields
                    nestedContainer.innerHTML = '';

                    // Dynamically render the next level of fields
                    matchingField.field_list_details.forEach(nestedField => {
                        nestedContainer.innerHTML += generateField(nestedField, true); // Show the next level
                    });

                    // Ensure the new dropdown also has event listeners for further nesting
                    nestedContainer.querySelectorAll('.dynamic-dropdown').forEach(dropdown => {
                        dropdown.addEventListener('change', event => addDynamicBehavior(formData)); // Attach listeners recursively
                    });
                }
            } else {
                const nestedContainer = target.closest('.field-container').nextElementSibling;
                console.log("There is no match content", nestedContainer);
                nestedContainer.querySelectorAll('.field-container').forEach(field => {
                    field.remove();
                });
            }
        }
    });
}

// Find the matching field based on the selected value and hierarchical level
function findMatchingField(formData, selectedValue, currentLevel) {
    console.log("formData.dynamic_hirarchical_field",formData.dynamic_hirarchical_field)
    if (parseInt(formData.class_hierarchical_level.replace('l', '')) === currentLevel) {
        return formData.dynamic_hirarchical_field.find(field => 
            field.choosen_value.toLowerCase() === selectedValue.toLowerCase()
        );
    }

    // Search recursively in the dynamic_hirarchical_field
    for (const dynamicField of formData.dynamic_hirarchical_field) {
        const result = findMatchingField(dynamicField.field_list_details[dynamicField.field_list_details.length - 1], selectedValue, currentLevel);
        if (result) {
            return result;
        }
    }

    return null;
}
