
// Doi tuong validator
function Validator(options) {

    // Ham thuc hien validate
    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector)
        var errorMessage = rule.test(inputElement.value)

            if (errorMessage) {
                errorElement.innerText = errorMessage
                inputElement.parentElement.classList.add('invalid')
            } else {
                errorElement.innerText = ''
                inputElement.parentElement.classList.remove('invalid')

            }
    }

    // Lay element cua form can validate
    var forElement = document.querySelector(options.form)

    console.log(options.rules)

    if (forElement) {
        options.rules.forEach(function(rule) {
            var inputElement = forElement.querySelector(rule.selector)            

            if (inputElement) {
                // Xu ly truong hop blur khoi input
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }

                // Xu ly moi khi nguoi dung nhap vao input
                inputElement.oninput = function() {
                    var errorElement = inputElement.parentElement.querySelector('.form-message')
                    errorElement.innerText = ''
                    inputElement.parentElement.classList.remove('invalid')
                }
            }
        })
    }

}

// Dinh nghia rules
Validator.isRequired = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined : 'Vui lòng nhập vào trường hợp này' 
        }
    }
}

Validator.isEmail = function(selector) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return regex.test(value) ? undefined : 'Vui lòng nhập email'
        }
    }
}

Validator.isPassword = function(selector, min) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : `Vui lòng nhập password hợp lệ (ít nhất ${min} ký tự, bao gồm chữ và số)`;
        }
    }
}

