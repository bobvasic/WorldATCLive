/* eslint-disable no-undef */
/* eslint-env node */
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
  console.log('No API key found');
  process.exit(1);
}

console.log('\n🔍 Checking Gemini API Key Status\n');
console.log('API Key:', apiKey.substring(0, 15) + '...');

// Try to list models via REST API
const url = `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`;

console.log('\nFetching available models from API...\n');

try {
  const response = await fetch(url);
  const data = await response.json();
  
  if (response.ok && data.models) {
    console.log(`✅ API Key is VALID!\n`);
    console.log(`Found ${data.models.length} available models:\n`);
    
    data.models.forEach(model => {
      const name = model.name.replace('models/', '');
      const methods = model.supportedGenerationMethods || [];
      if (methods.includes('generateContent')) {
        console.log(`✓ ${name}`);
      }
    });
    
    // Show recommended model
    const flashModel = data.models.find(m => m.name.includes('flash') && m.supportedGenerationMethods?.includes('generateContent'));
    if (flashModel) {
      console.log(`\n🎯 RECOMMENDED: Use "${flashModel.name.replace('models/', '')}"`);
    }
  } else {
    console.log('❌ API Key Error:', data.error?.message || 'Unknown error');
    console.log('\n💡 Please verify your API key at:');
    console.log('   https://aistudio.google.com/app/apikey');
  }
} catch (error) {
  console.log('❌ Network Error:', error.message);
}
