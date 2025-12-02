// Simple test to verify API integration
// Update this to match your NEXT_PUBLIC_API_BASE_URL from .env.local
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://192.168.1.2:8000/api';

async function testApiIntegration() {
  console.log('Testing API integration...');
  console.log('API Base URL:', API_BASE_URL);
  
  try {
    const response = await fetch(`${API_BASE_URL}/public/settings`);
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('API Response:', JSON.stringify(data, null, 2));
      
      if (data.success && data.data && data.data.length > 0) {
        const settings = data.data[0];
        console.log('\nExtracted settings:');
        console.log('- Address:', settings.address || 'Not set');
        console.log('- Email:', settings.email || 'Not set');
        console.log('- Phone:', settings.phone || 'Not set');
        console.log('- Logo:', settings.logo || 'Not set');
        console.log('- Title:', settings.title || 'Not set');
        console.log('- Description:', settings.description || 'Not set');
      } else {
        console.log('No settings data found in response');
      }
    } else {
      console.log('API request failed with status:', response.status);
      const errorText = await response.text();
      console.log('Error response:', errorText);
    }
  } catch (error) {
    console.error('Network error:', error.message);
    console.log('\nThis is expected if the Laravel API is not running.');
    console.log('The frontend will use fallback data in this case.');
  }
}

// Run the test
testApiIntegration();
