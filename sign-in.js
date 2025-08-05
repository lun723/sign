function goToPage(pageUrl) {
    window.location.href = pageUrl;
}

function apiRequest(url, method = 'POST', data = {}, headers = {}) {
    return fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
        body: method !== 'GET' ? JSON.stringify(data) : undefined,
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => {
                throw err;
            });
        }
        return response.json();
    });
}

function setupInputValidation(inputId, buttonSelector) {
    const input = document.getElementById(inputId);
    const button = document.querySelector(buttonSelector);

    if (input && button) {
        button.disabled = true;

        input.addEventListener("input", function () {
            button.disabled = input.value.trim().length === 0;
        });
    }
}

function handleFormSubmit(options) {
    const form = document.getElementById('form');
    if (!form) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = Object.fromEntries(new FormData(form).entries());

        if (options.validate && !options.validate(formData)) {
            return;
        }

        apiRequest(options.apiUrl, options.method || 'POST', formData, options.headers || {})
            .then(data => {
                if (typeof options.onSuccess === 'function') {
                    options.onSuccess(data);
                }
            })
            .catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: '系統錯誤，請稍後再試',
                });
            });
    });
}

function togglePassword() {
    var password = document.getElementById("password");
    var toggleIcon = document.getElementById("toggleIcon");
    
    if (password.type === "password") {
        password.type = "text";
        toggleIcon.classList.remove("fa-eye-slash");
        toggleIcon.classList.add("fa-eye");
    } else {
        password.type = "password";
        toggleIcon.classList.remove("fa-eye");
        toggleIcon.classList.add("fa-eye-slash");
    }
}

function sendVerificationCode() {
    const sendButton = document.querySelector(".toggle-text");
    const phoneInput = document.querySelector("input[name='phoneNumber']");
    const phoneNumber = phoneInput.value.trim();
    
    const phoneRegex = /^\+?\d{10,}$/;
    if (!phoneRegex.test(phoneNumber)) {
        Swal.fire({
            icon: 'error',
            title: '錯誤',
            text: '請輸入有效的手機號碼',
        });
        return;
    }

    Swal.fire({
        icon: 'success',
        title: '成功',
        text: '已寄送驗證碼',
    });

    sendButton.classList.add("disabled");
    sendButton.style.pointerEvents = "none";
    sendButton.style.opacity = "0.6";
    
    let timeLeft = 180; 
    sendButton.textContent = `重新寄送（${timeLeft}s）`;

    // const payload = {
    //     phoneNumber: phoneNumber
    // };

    // apiRequest('/api/send-verification', 'POST', {
    //     payload
    // })

    const countdown = setInterval(() => {
        timeLeft--;
        sendButton.textContent = `重新寄送（${timeLeft}s）`;

        if (timeLeft <= 0) {
            clearInterval(countdown);
            sendButton.classList.remove("disabled");
            sendButton.style.pointerEvents = "auto";
            sendButton.style.opacity = "1";
            sendButton.textContent = "寄送驗證碼";
        }
    }, 1000);
}

function signInForm() {
    handleFormSubmit( {
        apiUrl: '/api/login',
        method: 'POST',
    });
}

function verifyPhone(url) {
    handleFormSubmit( {
        apiUrl: '/api/login',
        method: 'POST',
    });
    goToPage(url);
}

function settingsPassword() {
    handleFormSubmit( {
        apiUrl: '/api/login',
        method: 'POST',
    });
}

function settingsSignupPassword(url) {
    handleFormSubmit( {
        apiUrl: '/api/login',
        method: 'POST',
    });
    goToPage(url);
}

document.addEventListener("DOMContentLoaded", function () {
    setupInputValidation("password", ".btn.btn-danger");
    setupInputValidation("verification", ".btn.btn-danger");
    setupInputValidation("name", ".btn.btn-danger");
});