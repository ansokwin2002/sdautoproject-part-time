// Simple Node.js script to test the slider API
const fetch = require('node-fetch');

// Update this to match your NEXT_PUBLIC_API_BASE_URL from .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.2:8000/api';

async function testSliderAPI() {
    try {
        console.log('🔄 Testing slider API...');
        console.log('URL:', `${API_BASE_URL}/public/sliders`);
        
        const response = await fetch(`${API_BASE_URL}/public/sliders`);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Response:', JSON.stringify(data, null, 2));
            
            if (data.success && data.data && data.data.length > 0) {
                console.log('\n📸 Image paths found:');
                data.data.forEach((slider, index) => {
                    console.log(`${index + 1}. ID: ${slider.id}, Order: ${slider.ordering}, Image: ${slider.image}`);
                });
            } else {
                console.log('⚠️ No slider data found');
            }
        } else {
            console.log('❌ API Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.log('❌ Network Error:', error.message);
    }
}

testSliderAPI();
