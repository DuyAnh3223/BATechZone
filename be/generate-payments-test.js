/**
 * Script to generate payments for existing installments
 * Usage: node generate-payments-test.js [installmentId]
 */

import fetch from 'node-fetch';

const installmentId = process.argv[2] || 8;
const BASE_URL = 'http://localhost:5000/api';

// You need a valid session token - get it from browser cookies
const SESSION_TOKEN = 'your_user_session_token_here';

async function generatePayments() {
    try {
        console.log(`Generating payments for installment ${installmentId}...`);
        
        const response = await fetch(`${BASE_URL}/installments/${installmentId}/generate-payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cookie': `user_session_token=${SESSION_TOKEN}`
            }
        });

        const data = await response.json();
        
        if (data.success) {
            console.log('✅ Success:', data.message);
            console.log('Generated payments:', JSON.stringify(data.data, null, 2));
        } else {
            console.error('❌ Error:', data.message);
        }
    } catch (error) {
        console.error('❌ Network error:', error.message);
    }
}

generatePayments();
