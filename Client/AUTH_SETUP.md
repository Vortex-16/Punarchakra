# Authentication Enhancement - Setup Guide

## Overview

This guide covers the enhanced authentication system for Punarchakra with advanced features including:

- ✅ Password strength validation
- ✅ Email & password confirmation
- ✅ Google OAuth integration
- ✅ Facebook OAuth integration
- ✅ Forgot password / reset password flow
- ✅ Real-time form validation
- ✅ Premium UI with animations
- ✅ Toast notifications

## 🚀 Quick Setup

### 1. Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the required values:

```env
NEXTAUTH_SECRET=your_secret_here
GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret
FACEBOOK_CLIENT_ID=your_facebook_id
FACEBOOK_CLIENT_SECRET=your_facebook_secret
EMAIL_USER=your_smtp_email
EMAIL_PASSWORD=your_smtp_password
```

### 2. Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 3. Setup OAuth Providers

#### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new OAuth 2.0 Client ID
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Client Secret to `.env.local`

#### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/apps/)
2. Create a new app or use existing
3. Add Facebook Login product
4. Add Valid OAuth Redirect URI: `http://localhost:3000/api/auth/callback/facebook`
5. Copy App ID (Client ID) and App Secret to `.env.local`

### 4. Setup Email (Nodemailer)

#### Option A: Gmail

1. Enable 2-Factor Authentication on your Google Account
2. Create an [App Password](https://support.google.com/accounts/answer/185833)
3. Use it as `EMAIL_PASSWORD`

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

#### Option B: Other SMTP Providers

- **Outlook**: smtp-mail.outlook.com (port 587)
- **Yahoo**: smtp.mail.yahoo.com (port 587)
- **Custom SMTP**: Use your provider's settings

## 🎨 UI Features

### Enhanced Login Page (`/login`)

- Facebook & Google OAuth buttons
- Remember me checkbox
- Forgot password link
- Real-time validation
- Toast notifications
- Loading states for each provider

### Enhanced Register Page (`/register`)

- Password strength indicator with visual feedback
- Confirm password field with match validation
- Real-time email validation
- Name validation (min 2 chars)
- Animated success screen
- Input field icons

### Forgot Password Page (`/forgot-password`)

- Email input with validation
- Send reset link functionality
- Success confirmation screen
- Link expiry notification (1 hour)

### Reset Password Page (`/reset-password/[token]`)

- Token validation on load
- Password strength indicator
- Confirm password with match validation
- Invalid/expired token handling
- Success redirect to login

## 🔐 Security Features

### Password Requirements

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character (!@#$%^&\* etc.)

### validation

- Email format validation
- Name validation (2+ characters)
- Password strength checking
- Real-time feedback

## 📱 Responsive Design

All auth pages are fully responsive with:

- Mobile-first design
- 3D Smart Bin animation (desktop only)
- Dark mode support
- Smooth transitions

## 🧪 Testing the Features

### Test Registration

1. Navigate to `http://localhost:3000/register`
2. Fill in the form with:
   - Name (min 2 chars)
   - Valid email
   - Strong password (see requirements)
   - Confirm password (must match)
3. Submit and verify success screen

### Test Login

1. Navigate to `http://localhost:3000/login`
2. Try credential login with registered account
3. Try Google OAuth
4. Try Facebook OAuth

### Test Password Reset

1. Click "Forgot password?" on login page
2. Enter registered email
3. Check email for reset link
4. Click link and set new password
5. Login with new password

## 🛠 Backend Integration Required

To fully enable these features, implement these backend endpoints:

### Email Verification

```
POST /api/auth/verify-email
Body: { token: string }
```

### Password Reset Request

```
POST /api/auth/forgot-password
Body: { email: string }
```

### Password Reset

```
POST /api/auth/reset-password
Body: { token: string, newPassword: string }
```

### Facebook OAuth

```
POST /api/auth/facebook
Body: { name: string, email: string, facebookId: string }
```

### Email Availability Check (Optional)

```
GET /api/auth/check-email?email=user@example.com
```

## 📦 New Components

- `PasswordStrengthIndicator.tsx` - Visual password strength feedback
- `AuthNotification.tsx` - Toast notification system
- `validation.ts` - Client-side validation utilities
- `authApi.ts` - Centralized auth API calls

## 🎯 Next Steps

1. ✅ Frontend UI enhancements - **COMPLETE**
2. ⏳ Backend API endpoints - **TODO**
3. ⏳ Email template design - **TODO**
4. ⏳ Rate limiting implementation - **TODO**
5. ⏳ Email verification flow - **TODO**

## 💡 Tips

- Always use HTTPS in production
- Store OAuth secrets securely
- Implement rate limiting on backend
- Use refresh tokens for long sessions
- Add CAPTCHA for registration
- Implement email verification before account activation

## 🐛 Troubleshooting

### OAuth not working

- Check redirect URIs match exactly
- Verify credentials in `.env.local`
- Clear browser cache and cookies

### Email not sending

- Verify SMTP credentials
- Check firewall/port 587 access
- For Gmail, ensure App Password is used

### Password strength not showing

- Check console for errors
- Verify PasswordStrengthIndicator import
- Ensure password field has onChange handler

## 📚 Documentation

- [NextAuth.js Docs](https://next-auth.js.org/)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [Nodemailer Docs](https://nodemailer.com/)

---

Built with ❤️ for Punarchakra
