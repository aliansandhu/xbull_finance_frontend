import React from 'react'

const PrivacyPolicy = () => {
    return (
        <div className="relative w-full mx-auto px-6 py-8 max-w-4xl">
            <h1 className="font-bold text-4xl mb-6">Privacy Policy – XfinanceBull Academy</h1>
            <p>Effective Date: March 1st, 2025</p>
            <p>Last Updated: March 13th, 2025</p>

            <p className="mt-4">
                Welcome to XfinanceBull Academy! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal data when you use our website and online courses.
                By accessing XfinanceBull Academy, you agree to this Privacy Policy. If you do not agree, please do not use our services.
            </p>

            {/* Information We Collect Section */}
            <h2 className="font-bold text-2xl mt-10">1. INFORMATION WE COLLECT</h2>

            <p className="mt-4"><span className="font-semibold">1.1 Personal Information</span><br/>
                We may collect the following types of personal information:
                <ul className="list-disc pl-8">
                    <li>Name</li>
                    <li>Email Address</li>
                    <li>Phone Number (if provided)</li>
                    <li>Billing Address & Payment Details (handled by secure third-party payment processors)</li>
                    <li>Account Login Credentials</li>
                </ul>
            </p>

            <p className="mt-4"><span className="font-semibold">1.2 Non-Personal Information</span><br/>
                We may collect the following types of non-personal information:
                <ul className="list-disc pl-8">
                    <li>Device Information (IP address, browser type, operating system)</li>
                    <li>Usage Data (course progress, interactions with content)</li>
                    <li>Cookies & Tracking Data (for analytics & performance)</li>
                </ul>
                We do not collect sensitive data such as social security numbers or financial investment details.
            </p>

            {/* How We Use Your Information Section */}
            <h2 className="font-bold text-2xl mt-10">2. HOW WE USE YOUR INFORMATION</h2>

            <p className="mt-4"><span className="font-semibold">2.1 Providing & Improving Our Services</span><br/>
                We use your information for the following purposes:
                <ul className="list-disc pl-8">
                    <li>Enrolling you in courses and granting access.</li>
                    <li>Processing payments securely.</li>
                    <li>Improving course content based on user feedback.</li>
                </ul>
            </p>

            <p className="mt-4"><span className="font-semibold">2.2 Communication</span><br/>
                We use your data to:
                <ul className="list-disc pl-8">
                    <li>Send course updates, promotions, and account-related notifications.</li>
                    <li>Provide customer support and respond to inquiries.</li>
                </ul>
            </p>

            <p className="mt-4"><span className="font-semibold">2.3 Analytics & Marketing</span><br/>
                We analyze user behaviour to:
                <ul className="list-disc pl-8">
                    <li>Enhance our platform.</li>
                    <li>Show targeted promotions (only with consent).</li>
                </ul>
                We do not sell your personal data to third parties.
            </p>

            {/* How We Protect Your Data Section */}
            <h2 className="font-bold text-2xl mt-10">3. HOW WE PROTECT YOUR DATA</h2>

            <p className="mt-4">
                We implement strict security measures to safeguard your personal information:
                <ul className="list-disc pl-8">
                    <li>Encryption: All data is encrypted during transmission.</li>
                    <li>Secure Payments: Transactions are processed through [Stripe, PayPal, etc.] using industry-standard security.</li>
                    <li>Access Controls: Only authorized personnel can access your data.</li>
                </ul>
                Despite our efforts, no online system is 100% secure. Please use strong passwords and keep your account information private.
            </p>

            {/* Cookies & Tracking Technologies Section */}
            <h2 className="font-bold text-2xl mt-10">4. COOKIES & TRACKING TECHNOLOGIES</h2>

            <p className="mt-4">
                We use cookies and similar technologies to:
                <ul className="list-disc pl-8">
                    <li>Remember your login session.</li>
                    <li>Track course progress.</li>
                    <li>Improve website performance.</li>
                </ul>
                You can disable cookies in your browser settings, but some features may not work properly.
            </p>

            {/* Third-Party Services Section */}
            <h2 className="font-bold text-2xl mt-10">5. THIRD-PARTY SERVICES</h2>

            <p className="mt-4">
                We may share necessary data with trusted third-party services, including:
                <ul className="list-disc pl-8">
                    <li>Payment Processors (e.g., Stripe, PayPal)</li>
                    <li>Analytics Providers (e.g., Google Analytics)</li>
                    <li>Email Marketing Platforms (e.g., Mailchimp, SendGrid)</li>
                </ul>
                These providers follow strict data protection policies.
            </p>

            {/* Your Data Rights Section */}
            <h2 className="font-bold text-2xl mt-10">6. YOUR DATA RIGHTS</h2>

            <p className="mt-4">
                Under data protection laws, you have the right to:
                <ul className="list-disc pl-8">
                    <li>Access Your Data – Request a copy of your personal information.</li>
                    <li>Correct Your Data – Update inaccurate details.</li>
                    <li>Delete Your Data – Request account deletion.</li>
                    <li>Withdraw Consent – Opt out of marketing emails.</li>
                </ul>
                To exercise your rights, contact us through our X (Twitter) account.
            </p>

            {/* Data Retention Section */}
            <h2 className="font-bold text-2xl mt-10">7. DATA RETENTION</h2>

            <p className="mt-4">
                We keep your data only as long as necessary for:
                <ul className="list-disc pl-8">
                    <li>Course access & billing records.</li>
                    <li>Legal or compliance requirements.</li>
                </ul>
                If you request account deletion, we permanently remove your personal information unless required for legal purposes.
            </p>

            {/* Children's Privacy Section */}
            <h2 className="font-bold text-2xl mt-10">8. CHILDREN'S PRIVACY</h2>

            <p className="mt-4">
                XfinanceBull Academy is not intended for children under 16. If we discover a child’s data has been collected, we will delete it immediately.
            </p>

            {/* Changes to Privacy Policy Section */}
            <h2 className="font-bold text-2xl mt-10">9. CHANGES TO THIS PRIVACY POLICY</h2>

            <p className="mt-4">
                We may update this Privacy Policy from time to time. Any changes will be posted on our website, and your continued use means you accept the updated policy.
            </p>

            {/* Contact Us Section */}
            <h2 className="font-bold text-2xl mt-10">10. CONTACT US</h2>

            <p className="mt-4">
                If you have any questions about this Privacy Policy, please contact: Through ‘X’ account message system. @XfinaceBull
            </p>

            <p className="mt-4">
                By using XfinanceBull Academy, you agree to this Privacy Policy. Thank you for trusting us with your learning experience!
            </p>
        </div>
    )
}

export default PrivacyPolicy
