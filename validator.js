
// Doi tuong validator
function Validator(options) {
    function getParent(element, selector) {
        while (element.parentElement) {
            if (element.parentElement.matches(selector)) {
                return element.parentElement
            }
            element = element.parentElement
        }
    }

    var selectorRules = {}

    // Ham thuc hien validate
    function validate(inputElement, rule) {
        var errorElement = getParent(inputElement, options.formGroupSelector).querySelector(options.errorSelector)
        var errorMessage

        // Lay ra cac rules cua selectoc
        var rules = selectorRules[rule.selector]

        // Lap qua tung rule va kiem tra 
        // Neu co loi thi dung viec kiem tra
        for (var i = 0; i < rules.length; ++i) {
            switch (inputElement.type) {
                case 'radio':
                case 'checkbox':
                    errorMessage = rules[i](
                        formElement.querySelector(rule.selector + ':checked')
                    )
                    break
                default:
                    errorMessage = rules[i](inputElement.value)
            }
            if (errorMessage) break
        }

        if (errorMessage) {
                errorElement.innerText = errorMessage
                getParent(inputElement, options.formGroupSelector).classList.add('invalid')
        } else {
                errorElement.innerText = ''
                getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
        }

        return !errorMessage
    }

    // Lay element cua form can validate
    var formElement = document.querySelector(options.form)

    if (formElement) {
        // Khi submit form
        formElement.onsubmit = function(e) {
            e.preventDefault()

            var isFormValid = true

            // Lap qua tung rules va validate
            options.rules.forEach(function(rule) {
                var inputElement = formElement.querySelector(rule.selector)  
                var isValid = validate(inputElement, rule)
                if (!isValid) {
                    isFormValid = false
                }
            })

            if (isFormValid) {
                // Truong hop submit voi javascript
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll('[name]')
                    var formValues = Array.from(enableInputs).reduce(function(values, input) {
                        
                        switch(input.type) {
                            case 'radio':
                                values[input.name] = formElement.querySelector('input[name="' + input.name + '"]:checked').value
                                break
                            case 'checkbox':
                                if (!input.matches(':checked')) {
                                    values[input.name] = ''
                                    return values
                                }
                                if (!Array.isArray(values[input.name])) {
                                    values[input.name] = []
                                }
                                values[input.name].push(input.value)
                                break
                            case 'file':
                                values[input.name] = input.files
                                break
                            default:
                                values[input.name] = input.value
                        }

                        return values
                    }, {})
                    
                    options.onSubmit(formValues)
                } 
                // Truong hop submit voi hanh vi mac dinh
                else {
                    formElement.submit()
                }
            }
        }

        // Lap qua moi rule va xu ly (lang nghe su kien blur, input, ...)
        options.rules.forEach(function(rule) {

            // luu lai cac rules cho moi input
            if (Array.isArray(selectorRules[rule.selector])) {
                 selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test]
            }

            var inputElements = formElement.querySelectorAll(rule.selector)    
            
            Array.from(inputElements).forEach(function (inputElement) {
                // Xu ly truong hop blur khoi input
                inputElement.onblur = function() {
                    validate(inputElement, rule)
                }

                // Xu ly moi khi nguoi dung nhap vao input
                inputElement.oninput = function() {
                    var errorElement = getParent(inputElement, options.formGroupSelector).querySelector('.form-message')
                    errorElement.innerText = ''
                    getParent(inputElement, options.formGroupSelector).classList.remove('invalid')
                }
            })
        })
    }

}

// Dinh nghia rules
Validator.isRequired = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            return value ? undefined : message || 'Vui lòng nhập vào trường hợp này' 
        }
    }
}

Validator.isEmail = function(selector, message) {
    return {
        selector: selector,
        test: function(value) {
            var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            return regex.test(value) ? undefined : message || 'Vui lòng nhập email'
        }
    }
}

Validator.isPassword = function(selector, min, message) {
    return {
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined : message || `Vui lòng nhập password hợp lệ (ít nhất ${min} ký tự, bao gồm chữ và số)`;
        }
    }
}

Validator.isConfirmed = function(selector, getConfirmValue, message) {
    return {
        selector: selector,
        test: function(value) {
            return value === getConfirmValue() ? undefined : message || 'Giá trị nhập vào không chính xác'
        }
    }
}