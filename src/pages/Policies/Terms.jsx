import React from 'react'

const TermsConditions = () => {
    return(
        <div className="relative w-full mx-auto px-6 py-8 max-w-4xl">
            <h1 className="font-bold text-4xl mb-6">XfinanceBull Academy - Terms of Service</h1>
            <p>Effective Date: March 1st, 2025</p>
            <p>Last Updated: March 13th, 2025</p>

            <p className="mt-4">
                Welcome to XfinanceBull Academy! These Terms of Service ("Terms") govern your use of our online courses,
                website, and services. By accessing or using our platform, you agree to these Terms. If you do not agree,
                please do not use our services.
            </p>

            {/* General Terms Section */}
            <h2 className="font-bold text-2xl mt-10">1. GENERAL TERMS</h2>

            <p className="mt-4"><span className="font-semibold">1.1 Who We Are</span><br/>
                XfinanceBull Academy ("we," "us," "our") provides online courses on financial education, investing, and related topics.
            </p>

            <p className="mt-4"><span className="font-semibold">1.2 Eligibility</span><br/>
                To access our courses, you must be at least 18 years old or have parental/guardian consent if under 18.
            </p>

            <p className="mt-4"><span className="font-semibold">1.3 Account Creation</span><br/>
                <ul className="list-disc pl-8">
                    <li>You must provide accurate and complete information when registering.</li>
                    <li>You are responsible for maintaining the security of your account.</li>
                    <li>You must not share your account with others.</li>
                </ul>
            </p>

            {/* Course Access & Usage Section */}
            <h2 className="font-bold text-2xl mt-10">2. COURSE ACCESS & USAGE</h2>

            <p className="mt-4"><span className="font-semibold">2.1 License to Use Our Courses</span><br/>
                When you purchase or enrol in a course, you receive a non-exclusive, non-transferable license to view the content for personal, non-commercial use only.
            </p>

            <p className="mt-4"><span className="font-semibold">2.2 Prohibited Activities</span><br/>
                You may NOT:
                <ul className="list-disc pl-8">
                    <li>Share, copy, or resell course materials.</li>
                    <li>Use automated tools (bots, scrapers) to access content.</li>
                    <li>Disrupt the platform or engage in illegal activity.</li>
                </ul>
            </p>

            {/* Payments & Refunds Section */}
            <h2 className="font-bold text-2xl mt-10">3. PAYMENTS & REFUNDS</h2>

            <p className="mt-4"><span className="font-semibold">3.1 Pricing & Payments</span><br/>
                Course prices are displayed at checkout. Payments are processed via [Stripe, PayPal, etc.]. All payments are final unless otherwise stated.
            </p>

            <p className="mt-4"><span className="font-semibold">3.2 Refund Policy</span><br/>
                Refund requests must be made within [X days] of purchase. Refunds are not available for courses that have been fully accessed or downloaded. We reserve the right to refuse refunds for violations of these Terms.
            </p>

            {/* Intellectual Property Section */}
            <h2 className="font-bold text-2xl mt-10">4. INTELLECTUAL PROPERTY</h2>

            <p className="mt-4"><span className="font-semibold">4.1 Course Content Ownership</span><br/>
                All content (videos, PDFs, quizzes, materials) is owned by XfinanceBull Academy. You may not reproduce, distribute, or modify our content without written permission.
            </p>

            <p className="mt-4"><span className="font-semibold">4.2 User-Generated Content</span><br/>
                If you submit reviews or feedback, you grant us permission to use it for marketing or improvement purposes.
            </p>

            {/* Disclaimers & Limitation of Liability Section */}
            <h2 className="font-bold text-2xl mt-10">5. DISCLAIMERS & LIMITATION OF LIABILITY</h2>

            <p className="mt-4"><span className="font-semibold">5.1 No Financial or Legal Advice</span><br/>
                Our courses are for recreational purposes only and do not constitute financial, investment, or legal advice. You should consult a licensed professional before making financial decisions.
            </p>

            <p className="mt-4"><span className="font-semibold">5.2 Limitation of Liability</span><br/>
                We are not responsible for any losses or damages resulting from course use. Our maximum liability is limited to the amount you paid for the course.
            </p>

            {/* Termination of Account Section */}
            <h2 className="font-bold text-2xl mt-10">6. TERMINATION OF ACCOUNT</h2>

            <p className="mt-4">
                We reserve the right to suspend or terminate accounts that:
                <ul className="list-disc pl-8">
                    <li>Violate these Terms.</li>
                    <li>Engage in fraud, abuse, or illegal activities.</li>
                </ul>
                If your account is terminated, you will not receive a refund.
            </p>

            {/* Privacy Policy Section */}
            <h2 className="font-bold text-2xl mt-10">7. PRIVACY POLICY</h2>

            <p className="mt-4">
                Your personal data is handled according to our <a href="/privacy-policy" className="text-blue-500 underline">Privacy Policy</a>, which explains how we collect, store, and use your information.
            </p>

            {/* Changes to Terms Section */}
            <h2 className="font-bold text-2xl mt-10">8. CHANGES TO THESE TERMS</h2>

            <p className="mt-4">
                We may update these Terms from time to time. Any changes will be posted on our website, and your continued use means you accept the new Terms.
            </p>

            {/* Contact Section */}
            <h2 className="font-bold text-2xl mt-10">9. CONTACT US</h2>

            <p className="mt-4">
                For questions, please contact us through our <a href="https://twitter.com/XfinanceBull" className="text-blue-500 underline">X (Twitter) account</a>.
            </p>
        </div>
    )
}

export default TermsConditions
