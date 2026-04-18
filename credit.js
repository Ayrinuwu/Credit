document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitButton = document.querySelector('button[type="submit"]');
    const modal = document.getElementById('modal');

    function showError(input, message) {
        const existingError = input.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        input.style.borderColor = '#FF0000';

        const error = document.createElement('div');
        error.className = 'error-message';
        error.style.color = '#FF0000';
        error.style.fontSize = 'clamp(10px, 0.7vw, 12px)';
        error.style.marginTop = '5px';
        error.style.marginBottom = '5px';
        error.textContent = message;

        input.parentElement.insertBefore(error, input.nextSibling);
    }

    function removeError(input) {
        input.style.borderColor = '#DEDDDD';
        const error = input.parentElement.querySelector('.error-message');
        if (error) {
            error.remove();
        }
    }

    function validateSum(sum) {
        const num = parseFloat(sum);
        if (isNaN(num)) return 'Сумма должна быть числом';
        if (num < 100000) return 'Сумма должна быть не менее 100 000 ₽';
        if (num > 10000000) return 'Сумма должна быть не более 10 000 000 ₽';
        return '';
    }

    function validateTerm(term) {
        const num = parseInt(term);
        if (isNaN(num)) return 'Срок должен быть числом';
        if (num < 1) return 'Срок должен быть не менее 1 месяца';
        if (num > 120) return 'Срок должен быть не более 120 месяцев';
        return '';
    }

    function validateIncome(income) {
        const num = parseFloat(income);
        if (isNaN(num)) return 'Доход должен быть числом';
        if (num < 0) return 'Доход не может быть отрицательным';
        if (num < 27093) return 'Минимальный доход должен быть не менее 27 093 ₽';
        return '';
    }

    function validateAddress(address) {
        if (!address || address.trim().length === 0) {
            return 'Введите адрес регистрации';
        }
        if (address.trim().length < 20) {
            return 'Введите полный адрес';
        }
        return '';
    }

    function validateWorkplace(workplace) {
        if (!workplace || workplace.trim().length === 0) {
            return 'Введите место работы';
        }
        return '';
    }
    
    function validateCheckboxes() {
        const personalDataCheckbox = document.querySelector('.agreements input:first-child');
        if (!personalDataCheckbox.checked) {
            return 'Необходимо согласие на обработку персональных данных';
        }
        return '';
    }

    function validateForm() {
        let isValid = true;

        const inputs = document.querySelectorAll('.forms input');
        const sumInput = inputs[0];
        const termInput = inputs[1];
        const incomeInput = inputs[2];
        const addressInput = inputs[3];
        const workplaceInput = inputs[4];

        const sumError = validateSum(sumInput.value);
        if (sumError) {
            showError(sumInput, sumError);
            isValid = false;
        } else {
            removeError(sumInput);
        }

        const termError = validateTerm(termInput.value);
        if (termError) {
            showError(termInput, termError);
            isValid = false;
        } else {
            removeError(termInput);
        }

        const incomeError = validateIncome(incomeInput.value);
        if (incomeError) {
            showError(incomeInput, incomeError);
            isValid = false;
        } else {
            removeError(incomeInput);
        }

        const addressError = validateAddress(addressInput.value);
        if (addressError) {
            showError(addressInput, addressError);
            isValid = false;
        } else {
            removeError(addressInput);
        }

        const workplaceError = validateWorkplace(workplaceInput.value);
        if (workplaceError) {
            showError(workplaceInput, workplaceError);
            isValid = false;
        } else {
            removeError(workplaceInput);
        }

        const checkboxError = validateCheckboxes();
        if (checkboxError) {
            const agreementsDiv = document.querySelector('.agreements');
            const existingError = agreementsDiv.querySelector('.checkbox-error');
            if (!existingError) {
                const error = document.createElement('div');
                error.className = 'checkbox-error';
                error.style.color = '#FF0000';
                error.style.fontSize = 'clamp(10px, 0.7vw, 12px)';
                error.style.marginTop = '10px';
                error.textContent = checkboxError;
                agreementsDiv.appendChild(error);
            }
            isValid = false;
        } else {
            const existingError = document.querySelector('.agreements .checkbox-error');
            if (existingError) {
                existingError.remove();
            }
        }
        
        return isValid;
    }

    if (form && submitButton && modal) {
        submitButton.addEventListener('click', function(event) {
            event.preventDefault();

            if (validateForm()) {
                modal.classList.add('show');

                setTimeout(function() {
                    modal.classList.remove('show');
                }, 10000);

            } else {
                const firstError = document.querySelector('.error-message');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
        
        const inputs = document.querySelectorAll('.forms input');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                if (input === inputs[0]) {
                    const error = validateSum(input.value);
                    if (error) {
                        showError(input, error);
                    } else {
                        removeError(input);
                    }
                } else if (input === inputs[1]) {
                    const error = validateTerm(input.value);
                    if (error) {
                        showError(input, error);
                    } else {
                        removeError(input);
                    }
                } else if (input === inputs[2]) {
                    const error = validateIncome(input.value);
                    if (error) {
                        showError(input, error);
                    } else {
                        removeError(input);
                    }
                } else if (input === inputs[3]) {
                    const error = validateAddress(input.value);
                    if (error) {
                        showError(input, error);
                    } else {
                        removeError(input);
                    }
                } else if (input === inputs[4]) {
                    const error = validateWorkplace(input.value);
                    if (error) {
                        showError(input, error);
                    } else {
                        removeError(input);
                    }
                }
            });
        });

        const checkboxes = document.querySelectorAll('.agreements input');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const error = validateCheckboxes();
                const agreementsDiv = document.querySelector('.agreements');
                const existingError = agreementsDiv.querySelector('.checkbox-error');
                
                if (error && !existingError) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'checkbox-error';
                    errorDiv.style.color = '#FF0000';
                    errorDiv.style.fontSize = 'clamp(10px, 0.7vw, 12px)';
                    errorDiv.style.marginTop = '10px';
                    errorDiv.textContent = error;
                    agreementsDiv.appendChild(errorDiv);
                } else if (!error && existingError) {
                    existingError.remove();
                }
            });
        });
    }

    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
});