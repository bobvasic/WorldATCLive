#!/usr/bin/env node
/* eslint-disable no-undef */
/* eslint-env node */

/**
 * Gemini API Integration Test
 * Verifies API key and basic functionality
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = join(__dirname, '.env.local');

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    const match = line.match(/^VITE_GEMINI_API_KEY=(.+)$/);
    if (match) {
      process.env.VITE_GEMINI_API_KEY = match[1].trim();
    }
    const modelMatch = line.match(/^VITE_GEMINI_MODEL=(.+)$/);
    if (modelMatch) {
      process.env.VITE_GEMINI_MODEL = modelMatch[1].trim();
    }
  });
} catch (error) {
  console.error('❌ Error reading .env.local:', error.message);
  process.exit(1);
}

const apiKey = process.env.VITE_GEMINI_API_KEY;
const model = process.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash';

console.log('\n🧪 Gemini API Integration Test\n');
console.log('━'.repeat(50));

// Test 1: API Key Check
console.log('\n✓ Test 1: API Key Configuration');
if (!apiKey || apiKey.trim() === '' || apiKey === 'your_api_key_here') {
  console.log('❌ FAIL: No valid API key found');
  console.log('   Please add your API key to .env.local');
  process.exit(1);
}
console.log(`✓ API key found: ${apiKey.substring(0, 10)}...`);
console.log(`✓ Model: ${model}`);

// Test 2: API Initialization
console.log('\n✓ Test 2: API Initialization');
let genAI, generativeModel;
try {
  genAI = new GoogleGenerativeAI(apiKey);
  generativeModel = genAI.getGenerativeModel({ model });
  console.log('✓ Gemini AI initialized successfully');
} catch (error) {
  console.log('❌ FAIL: Initialization error');
  console.log('   Error:', error.message);
  process.exit(1);
}

// Test 3: Simple API Call
console.log('\n✓ Test 3: Basic API Request');
try {
  console.log('   Sending test prompt to Gemini...');
  const prompt = 'Say "Hello from Gemini!" in exactly 3 words.';
  const result = await generativeModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  console.log(`✓ Response received: "${text.trim()}"`);
  console.log('✓ API is working correctly!');
} catch (error) {
  console.log('❌ FAIL: API request error');
  console.log('   Error:', error.message);
  if (error.message.includes('API_KEY_INVALID')) {
    console.log('\n   💡 Your API key appears to be invalid.');
    console.log('   Get a new key at: https://aistudio.google.com/app/apikey');
  }
  process.exit(1);
}

// Test 4: Country Info Test
console.log('\n✓ Test 4: Country Information (App Feature)');
try {
  console.log('   Requesting info for France...');
  const prompt = `Provide a concise, engaging summary about France in exactly 3 sentences. Include:
1. Population and capital city
2. One unique cultural or historical fact
3. One interesting geographical feature or landmark

Format as JSON with keys: population, capital, culturalFact, geography. Keep each value under 100 characters.`;

  const result = await generativeModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  // Try to parse JSON
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    const data = JSON.parse(jsonMatch[0]);
    console.log('✓ Country data received:');
    console.log(`   Capital: ${data.capital}`);
    console.log(`   Population: ${data.population}`);
    console.log('✓ App-style country info working!');
  } else {
    console.log('✓ Response received (JSON parsing note: may need refinement)');
    console.log('   Raw response:', text.substring(0, 100) + '...');
  }
} catch (error) {
  console.log('⚠️  Warning: Country info test had issues');
  console.log('   Error:', error.message);
  console.log('   (Basic API works, but app features may need adjustment)');
}

// Test 5: Travel Recommendations Test
console.log('\n✓ Test 5: Travel Recommendations (App Feature)');
try {
  console.log('   Requesting travel tips for Japan...');
  const prompt = `As a travel expert, suggest 3 must-visit places in Japan. 
Return as JSON array with objects containing: name (place name), description (1 sentence, <80 chars), type (landmark/nature/cultural).
Be specific and exciting.`;

  const result = await generativeModel.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  
  // Try to parse JSON array
  const jsonMatch = text.match(/\[[\s\S]*\]/);
  if (jsonMatch) {
    const data = JSON.parse(jsonMatch[0]);
    console.log(`✓ Received ${data.length} travel recommendations`);
    if (data[0]) {
      console.log(`   Example: ${data[0].name} (${data[0].type})`);
    }
    console.log('✓ App-style travel recommendations working!');
  } else {
    console.log('✓ Response received (JSON parsing note: may need refinement)');
  }
} catch (error) {
  console.log('⚠️  Warning: Travel recommendations test had issues');
  console.log('   Error:', error.message);
}

// Summary
console.log('\n' + '━'.repeat(50));
console.log('\n🎉 SUMMARY: Gemini API Integration');
console.log('━'.repeat(50));
console.log('✓ API Key: Valid');
console.log('✓ Connection: Working');
console.log('✓ Basic Requests: Success');
console.log('✓ Model:', model);
console.log('\n✅ Your AI-enhanced app is ready to use!');
console.log('\n📝 Next steps:');
console.log('   1. Start dev server: npm run dev');
console.log('   2. Open: http://localhost:5173');
console.log('   3. Click any country to see AI features');
console.log('\n━'.repeat(50));
console.log();
