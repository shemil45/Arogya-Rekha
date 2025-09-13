/**
 * Healthcare Provider Authentication System
 * Handles login, signup, validation, and security features
 */

// Global variables
let currentAuthMode = 'login';

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupEventListeners();
});

/**
 * Initialize authentication system
 */
function initializeAuth() {
    // Set initial state
    toggleAuthMode('login');
    
    // Check for saved login state
    checkRememberMe();
    
    // Initialize form validation
    initializeValidation();
}

/**
 * Setup event listeners for forms and interactions
 */
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Forgot password form
    const forgotPasswordForm = document.getElementById('forgotPasswordForm');
    if (forgotPasswordForm) {
        forgotPasswordForm.addEventListener('submit', handleForgotPassword);
    }
    
    // Real-time validation
    setupRealTimeValidation();
}

/**
 * Toggle between login and signup modes
 */
function toggleAuthMode(mode) {
    const loginSection = document.getElementById('loginSection');
    const signupSection = document.getElementById('signupSection');
    const loginTab = document.getElementById('loginTab');
    const signupTab = document.getElementById('signupTab');
    
    if (mode === 'login') {
        loginSection.style.display = 'block';
        signupSection.style.display = 'none';
        loginTab.classList.add('active');
        signupTab.classList.remove('active');
        currentAuthMode = 'login';
    } else {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
        signupTab.classList.add('active');
        loginTab.classList.remove('active');
        currentAuthMode = 'signup';
    }
    
    // Clear any existing validation messages
    clearValidationMessages();
}

/**
 * Show/hide department field based on role selection
 */
function toggleDepartmentField() {
    const role = document.getElementById('role').value;
    const departmentGroup = document.getElementById('departmentGroup');
    const departmentSelect = document.getElementById('department');
    
    if (role === 'doctor') {
        departmentGroup.style.display = 'block';
        departmentSelect.required = true;
    } else {
        departmentGroup.style.display = 'none';
        departmentSelect.required = false;
        departmentSelect.value = '';
    }
}

/**
 * Toggle password visibility
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    const icon = button.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

/**
 * Detect Caps Lock key
 */
function detectCapsLock(event) {
    const capsLockOn = event.getModifierState && event.getModifierState('CapsLock');
    const warning = document.getElementById('capsLockWarning');
    
    if (warning) {
        warning.style.display = capsLockOn ? 'block' : 'none';
    }
}

/**
 * Validate password strength for signup
 */
function validatePassword(password) {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Update requirement indicators
    Object.keys(requirements).forEach(req => {
        const element = document.getElementById(`req-${req}`);
        if (element) {
            element.classList.toggle('met', requirements[req]);
        }
    });
    
    return Object.values(requirements).every(req => req);
}

/**
 * Check password confirmation match
 */
function checkPasswordMatch() {
    const password = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const validation = document.getElementById('confirmPasswordValidation');
    
    if (confirmPassword && password !== confirmPassword) {
        validation.textContent = 'Passwords do not match';
        validation.className = 'validation-message error';
        return false;
    } else {
        validation.textContent = '';
        validation.className = 'validation-message';
        return true;
    }
}

/**
 * Show forgot password modal
 */
function showForgotPassword() {
    const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
    modal.show();
}

/**
 * Handle login form submission
 */
function handleLogin(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateLoginForm(formData)) {
        return;
    }
    
    // Show loading state
    setButtonLoading('login-btn', true);
    
    // Simulate API call
    setTimeout(() => {
        // Store login data
        localStorage.setItem('providerRole', formData.get('hospital'));
        localStorage.setItem('providerId', formData.get('doctorId'));
        localStorage.setItem('rememberMe', formData.get('rememberMe') ? 'true' : 'false');
        
        // Show success message
        showToast('Login successful! Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
            window.location.href = './dashboard.html';
        }, 1500);
        
        setButtonLoading('login-btn', false);
    }, 2000);
}

/**
 * Handle signup form submission
 */
function handleSignup(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateSignupForm(formData)) {
        return;
    }
    
    // Show loading state
    setButtonLoading('signup-btn', true);
    
    // Simulate API call
    setTimeout(() => {
        // Store signup data
        const userData = {
            hospital: formData.get('hospital'),
            role: formData.get('role'),
            department: formData.get('department'),
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            providerId: formData.get('providerId'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('providerData', JSON.stringify(userData));
        
        // Show success message
        showToast('Account created successfully! Please check your email for verification.', 'success');
        
        // Switch to login mode
        setTimeout(() => {
            toggleAuthMode('login');
            setButtonLoading('signup-btn', false);
        }, 2000);
    }, 3000);
}

/**
 * Handle forgot password form submission
 */
function handleForgotPassword(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validate form
    if (!validateForgotPasswordForm(formData)) {
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Sending...';
    submitBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        showToast('Password reset instructions sent to your email.', 'success');
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
        modal.hide();
        
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

/**
 * Validate login form
 */
function validateLoginForm(formData) {
    let isValid = true;
    
    // Hospital validation
    if (!formData.get('hospital')) {
        showValidationError('hospitalValidation', 'Please select a healthcare facility');
        isValid = false;
    } else {
        clearValidationError('hospitalValidation');
    }
    
    // Provider ID validation
    const providerId = formData.get('doctorId');
    if (!providerId) {
        showValidationError('doctorIdValidation', 'Provider ID is required');
        isValid = false;
    } else if (!/^[A-Z0-9]{6,12}$/.test(providerId)) {
        showValidationError('doctorIdValidation', 'Provider ID must be 6-12 characters, letters and numbers only');
        isValid = false;
    } else {
        clearValidationError('doctorIdValidation');
    }
    
    // Password validation
    if (!formData.get('password')) {
        showValidationError('passwordValidation', 'Password is required');
        isValid = false;
    } else {
        clearValidationError('passwordValidation');
    }
    
    return isValid;
}

/**
 * Validate signup form
 */
function validateSignupForm(formData) {
    let isValid = true;
    
    // Hospital validation
    if (!formData.get('hospital')) {
        showValidationError('signupHospitalValidation', 'Please select a healthcare facility');
        isValid = false;
    } else {
        clearValidationError('signupHospitalValidation');
    }
    
    // Role validation
    if (!formData.get('role')) {
        showValidationError('roleValidation', 'Please select your professional role');
        isValid = false;
    } else {
        clearValidationError('roleValidation');
    }
    
    // Department validation (if doctor)
    if (formData.get('role') === 'doctor' && !formData.get('department')) {
        showValidationError('departmentValidation', 'Please select your medical department');
        isValid = false;
    } else {
        clearValidationError('departmentValidation');
    }
    
    // Name validation
    if (!formData.get('firstName')) {
        showValidationError('firstNameValidation', 'First name is required');
        isValid = false;
    } else {
        clearValidationError('firstNameValidation');
    }
    
    if (!formData.get('lastName')) {
        showValidationError('lastNameValidation', 'Last name is required');
        isValid = false;
    } else {
        clearValidationError('lastNameValidation');
    }
    
    // Provider ID validation
    const providerId = formData.get('providerId');
    if (!providerId) {
        showValidationError('signupProviderIdValidation', 'Provider ID is required');
        isValid = false;
    } else if (!/^[A-Z0-9]{6,12}$/.test(providerId)) {
        showValidationError('signupProviderIdValidation', 'Provider ID must be 6-12 characters, letters and numbers only');
        isValid = false;
    } else {
        clearValidationError('signupProviderIdValidation');
    }
    
    // Email validation
    const email = formData.get('email');
    if (!email) {
        showValidationError('emailValidation', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showValidationError('emailValidation', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearValidationError('emailValidation');
    }
    
    // Phone validation
    const phone = formData.get('phone');
    if (!phone) {
        showValidationError('phoneValidation', 'Contact number is required');
        isValid = false;
    } else if (!/^[0-9]{10}$/.test(phone)) {
        showValidationError('phoneValidation', 'Please enter a valid 10-digit phone number');
        isValid = false;
    } else {
        clearValidationError('phoneValidation');
    }
    
    // Password validation
    const password = formData.get('password');
    if (!password) {
        showValidationError('newPasswordValidation', 'Password is required');
        isValid = false;
    } else if (!validatePassword(password)) {
        showValidationError('newPasswordValidation', 'Password does not meet requirements');
        isValid = false;
    } else {
        clearValidationError('newPasswordValidation');
    }
    
    // Confirm password validation
    if (!checkPasswordMatch()) {
        isValid = false;
    }
    
    // Terms validation
    if (!formData.get('agreeTerms')) {
        showValidationError('agreeTermsValidation', 'You must agree to the terms and conditions');
        isValid = false;
    } else {
        clearValidationError('agreeTermsValidation');
    }
    
    // HIPAA validation
    if (!formData.get('hipaaCompliance')) {
        showValidationError('hipaaComplianceValidation', 'You must acknowledge HIPAA compliance requirements');
        isValid = false;
    } else {
        clearValidationError('hipaaComplianceValidation');
    }
    
    return isValid;
}

/**
 * Validate forgot password form
 */
function validateForgotPasswordForm(formData) {
    let isValid = true;
    
    if (!formData.get('resetProviderId')) {
        showValidationError('resetProviderIdValidation', 'Provider ID is required');
        isValid = false;
    } else {
        clearValidationError('resetProviderIdValidation');
    }
    
    const email = formData.get('resetEmail');
    if (!email) {
        showValidationError('resetEmailValidation', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showValidationError('resetEmailValidation', 'Please enter a valid email address');
        isValid = false;
    } else {
        clearValidationError('resetEmailValidation');
    }
    
    return isValid;
}

/**
 * Setup real-time validation
 */
function setupRealTimeValidation() {
    // Provider ID validation
    const providerIdInputs = ['doctorId', 'signupProviderId'];
    providerIdInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                const value = this.value;
                const validationId = id + 'Validation';
                
                if (value && !/^[A-Z0-9]{6,12}$/.test(value)) {
                    showValidationError(validationId, 'Provider ID must be 6-12 characters, letters and numbers only');
                } else {
                    clearValidationError(validationId);
                }
            });
        }
    });
    
    // Email validation
    const emailInputs = ['email', 'resetEmail'];
    emailInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                const value = this.value;
                const validationId = id + 'Validation';
                
                if (value && !isValidEmail(value)) {
                    showValidationError(validationId, 'Please enter a valid email address');
                } else {
                    clearValidationError(validationId);
                }
            });
        }
    });
    
    // Phone validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const value = this.value;
            const validationId = 'phoneValidation';
            
            if (value && !/^[0-9]{10}$/.test(value)) {
                showValidationError(validationId, 'Please enter a valid 10-digit phone number');
            } else {
                clearValidationError(validationId);
            }
        });
    }
}

/**
 * Initialize form validation
 */
function initializeValidation() {
    // Add Bootstrap validation classes
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });
}

/**
 * Check remember me functionality
 */
function checkRememberMe() {
    const rememberMe = localStorage.getItem('rememberMe');
    const providerId = localStorage.getItem('providerId');
    
    if (rememberMe === 'true' && providerId) {
        const rememberMeCheckbox = document.getElementById('rememberMe');
        const doctorIdInput = document.getElementById('doctorId');
        
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
        if (doctorIdInput) doctorIdInput.value = providerId;
    }
}

/**
 * Set button loading state
 */
function setButtonLoading(buttonId, loading) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (loading) {
        button.classList.add('loading');
        button.disabled = true;
        if (btnText) btnText.style.display = 'none';
        if (btnLoader) btnLoader.style.display = 'inline';
    } else {
        button.classList.remove('loading');
        button.disabled = false;
        if (btnText) btnText.style.display = 'inline';
        if (btnLoader) btnLoader.style.display = 'none';
    }
}

/**
 * Show validation error
 */
function showValidationError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.className = 'validation-message error';
    }
}

/**
 * Clear validation error
 */
function clearValidationError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
        element.className = 'validation-message';
    }
}

/**
 * Clear all validation messages
 */
function clearValidationMessages() {
    const validationMessages = document.querySelectorAll('.validation-message');
    validationMessages.forEach(msg => {
        msg.textContent = '';
        msg.className = 'validation-message';
    });
}

/**
 * Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    // Use existing App.showToast if available, otherwise create custom toast
    if (typeof App !== 'undefined' && App.showToast) {
        App.showToast(message, type);
    } else {
        // Fallback toast implementation
        const toast = document.querySelector('.app-toast');
        if (toast) {
            toast.textContent = message;
            toast.className = `app-toast show ${type}`;
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
}

/**
 * Utility function to format provider ID
 */
function formatProviderId(input) {
    return input.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

// Add input formatting for provider ID fields
document.addEventListener('DOMContentLoaded', function() {
    const providerIdInputs = ['doctorId', 'signupProviderId', 'resetProviderId'];
    providerIdInputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                this.value = formatProviderId(this);
            });
        }
    });
});

// Export functions for global access
window.toggleAuthMode = toggleAuthMode;
window.toggleDepartmentField = toggleDepartmentField;
window.togglePassword = togglePassword;
window.detectCapsLock = detectCapsLock;
window.validatePassword = validatePassword;
window.checkPasswordMatch = checkPasswordMatch;
window.showForgotPassword = showForgotPassword;
