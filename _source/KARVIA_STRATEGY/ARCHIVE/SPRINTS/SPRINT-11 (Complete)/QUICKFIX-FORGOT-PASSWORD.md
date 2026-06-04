# Quick Fix: Forgot Password Feature

**Sprint**: 11
**Priority**: P1
**Story Points**: 5
**Status**: Ready for Development

---

## Problem

The "Forgot password?" link on the login page (`/pages/login.html` line 476) points to `/pages/forgot-password.html` which **does not exist**.

**Current State**:
- Login page has link: `<a href="/pages/forgot-password.html">Forgot password?</a>`
- `forgot-password.html` file: **MISSING**
- Backend routes: **MISSING**
- User model fields: **EXIST** (ready to use)

---

## Existing Infrastructure (Ready to Use)

### User Model Fields (Already Present)
**File**: `server/models/User.js` (lines 218-225, 327-334)

```javascript
// Fields exist:
password_reset_token: { type: String },
password_reset_expires: { type: Date }

// Method exists:
userSchema.methods.generatePasswordResetToken = function() {
  const token = crypto.randomBytes(32).toString('hex');
  this.password_reset_token = token;
  this.password_reset_expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  return token;
};
```

### Email Service (Exists)
**File**: `engines/integrations/services/email-service.js`
- Has `sendEmail()` method
- Template-based email support
- Just needs password reset template

---

## Implementation

### 1. Backend Routes (Add to auth.js)

**File**: `server/routes/auth.js`

```javascript
const crypto = require('crypto');

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    // Always return success (don't reveal if email exists)
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      });
    }

    // Generate reset token
    const resetToken = user.generatePasswordResetToken();
    await user.save();

    // Build reset URL
    const resetUrl = `${process.env.APP_URL || 'http://localhost:5000'}/pages/reset-password.html?token=${resetToken}`;

    // Send email (graceful degradation if email service unavailable)
    try {
      // TODO: Implement email sending
      // await EmailService.sendPasswordResetEmail(user.email, resetUrl);
      console.log(`[DEV] Password reset link for ${user.email}: ${resetUrl}`);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
    }

    res.json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link.',
      // DEV ONLY - remove in production
      ...(process.env.NODE_ENV === 'development' && { dev_reset_url: resetUrl })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process request'
    });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Find user with valid token
    const user = await User.findOne({
      password_reset_token: token,
      password_reset_expires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token. Please request a new password reset.'
      });
    }

    // Update password
    user.password_hash = password; // Will be hashed by pre-save middleware
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password has been reset successfully. You can now login with your new password.'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password'
    });
  }
});
```

### 2. Frontend: forgot-password.html

**File**: `client/pages/forgot-password.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forgot Password - Karvia</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f7fafc;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            padding: 48px;
            max-width: 440px;
            width: 100%;
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
        }
        .header img {
            width: 60px;
            margin-bottom: 16px;
        }
        .header h1 {
            font-size: 24px;
            color: #1a202c;
            margin-bottom: 8px;
        }
        .header p {
            color: #718096;
            font-size: 14px;
            line-height: 1.5;
        }
        .form-group {
            margin-bottom: 24px;
        }
        label {
            display: block;
            font-weight: 500;
            margin-bottom: 8px;
            color: #2d3748;
            font-size: 14px;
        }
        input[type="email"] {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 15px;
            transition: all 0.2s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .btn-primary {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }
        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .alert {
            padding: 14px 18px;
            border-radius: 10px;
            margin-bottom: 24px;
            font-size: 14px;
        }
        .alert-error {
            background: #fee;
            color: #c53030;
            border: 1px solid #fc8181;
        }
        .alert-success {
            background: #c6f6d5;
            color: #22543d;
            border: 1px solid #9ae6b4;
        }
        .back-link {
            text-align: center;
            margin-top: 24px;
        }
        .back-link a {
            color: #667eea;
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
        }
        .back-link a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="/images/CD_Icon_large.png" alt="Karvia">
            <h1>Forgot Password?</h1>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
        </div>

        <div id="alert-container"></div>

        <form id="forgot-form">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="you@company.com" required autofocus>
            </div>

            <button type="submit" class="btn-primary" id="submit-btn">Send Reset Link</button>
        </form>

        <div class="back-link">
            <a href="/pages/login.html">Back to Login</a>
        </div>
    </div>

    <script>
        const form = document.getElementById('forgot-form');
        const submitBtn = document.getElementById('submit-btn');
        const alertContainer = document.getElementById('alert-container');

        function showAlert(message, type = 'error') {
            alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value.trim();

            if (!email) {
                showAlert('Please enter your email address.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';

            try {
                const response = await fetch('/api/auth/forgot-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email })
                });

                const result = await response.json();

                if (result.success) {
                    showAlert(result.message, 'success');
                    form.style.display = 'none';
                } else {
                    showAlert(result.message || 'Failed to process request.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Send Reset Link';
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('An error occurred. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Reset Link';
            }
        });
    </script>
</body>
</html>
```

### 3. Frontend: reset-password.html

**File**: `client/pages/reset-password.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Password - Karvia</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f7fafc;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 16px;
            box-shadow: 0 4px 24px rgba(0,0,0,0.08);
            padding: 48px;
            max-width: 440px;
            width: 100%;
        }
        .header {
            text-align: center;
            margin-bottom: 32px;
        }
        .header img { width: 60px; margin-bottom: 16px; }
        .header h1 { font-size: 24px; color: #1a202c; margin-bottom: 8px; }
        .header p { color: #718096; font-size: 14px; }
        .form-group { margin-bottom: 24px; }
        label {
            display: block;
            font-weight: 500;
            margin-bottom: 8px;
            color: #2d3748;
            font-size: 14px;
        }
        input[type="password"] {
            width: 100%;
            padding: 14px 16px;
            border: 2px solid #e2e8f0;
            border-radius: 10px;
            font-size: 15px;
            transition: all 0.2s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .btn-primary {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 10px;
            font-size: 15px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
        }
        .btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }
        .alert {
            padding: 14px 18px;
            border-radius: 10px;
            margin-bottom: 24px;
            font-size: 14px;
        }
        .alert-error { background: #fee; color: #c53030; border: 1px solid #fc8181; }
        .alert-success { background: #c6f6d5; color: #22543d; border: 1px solid #9ae6b4; }
        .password-requirements {
            font-size: 12px;
            color: #718096;
            margin-top: 8px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="/images/CD_Icon_large.png" alt="Karvia">
            <h1>Reset Password</h1>
            <p>Enter your new password below.</p>
        </div>

        <div id="alert-container"></div>

        <form id="reset-form">
            <div class="form-group">
                <label for="password">New Password</label>
                <input type="password" id="password" name="password" placeholder="Enter new password" required>
                <p class="password-requirements">Minimum 8 characters</p>
            </div>

            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" id="confirm_password" name="confirm_password" placeholder="Confirm new password" required>
            </div>

            <button type="submit" class="btn-primary" id="submit-btn">Reset Password</button>
        </form>
    </div>

    <script>
        const form = document.getElementById('reset-form');
        const submitBtn = document.getElementById('submit-btn');
        const alertContainer = document.getElementById('alert-container');

        // Get token from URL
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');

        if (!token) {
            alertContainer.innerHTML = '<div class="alert alert-error">Invalid reset link. Please request a new password reset.</div>';
            form.style.display = 'none';
        }

        function showAlert(message, type = 'error') {
            alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        }

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirm_password').value;

            if (password.length < 8) {
                showAlert('Password must be at least 8 characters.');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('Passwords do not match.');
                return;
            }

            submitBtn.disabled = true;
            submitBtn.textContent = 'Resetting...';

            try {
                const response = await fetch('/api/auth/reset-password', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ token, password })
                });

                const result = await response.json();

                if (result.success) {
                    showAlert(result.message, 'success');
                    form.style.display = 'none';
                    setTimeout(() => {
                        window.location.href = '/pages/login.html';
                    }, 2000);
                } else {
                    showAlert(result.message || 'Failed to reset password.');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Reset Password';
                }
            } catch (error) {
                console.error('Error:', error);
                showAlert('An error occurred. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Reset Password';
            }
        });
    </script>
</body>
</html>
```

---

## Implementation Checklist

### Backend (auth.js)
- [ ] Add `const crypto = require('crypto');` at top
- [ ] Add `POST /api/auth/forgot-password` route
- [ ] Add `POST /api/auth/reset-password` route

### Frontend
- [ ] Create `client/pages/forgot-password.html`
- [ ] Create `client/pages/reset-password.html`

### Testing
- [ ] Test forgot password flow (valid email)
- [ ] Test forgot password flow (invalid email - should still show success)
- [ ] Test reset password with valid token
- [ ] Test reset password with expired token
- [ ] Test reset password with invalid token

---

## Security Considerations

1. **Always return success** for forgot-password (don't reveal if email exists)
2. **Token expires in 10 minutes** (configurable in User model)
3. **Token is one-time use** (cleared after successful reset)
4. **Minimum password length**: 8 characters
5. **Rate limiting**: Consider adding rate limiting to prevent abuse (future enhancement)

---

## Estimated Effort

| Task | Time |
|------|------|
| Backend routes | 30 min |
| forgot-password.html | 30 min |
| reset-password.html | 30 min |
| Testing | 30 min |
| **Total** | **2 hours** |

---

**Status**: Ready for Sprint 11
**Assignee**: TBD
**Dependencies**: None (User model already has required fields)
