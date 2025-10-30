/* eslint-disable no-undef */
/* eslint-env node */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;

if (!apiKey) {
  console.log('No API key found');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

console.log('Testing different model names...\n');

const modelsToTry = [
  'gemini-1.5-flash-latest',
  'gemini-1.5-pro-latest',
  'gemini-1.5-flash',
  'gemini-1.5-pro',
  'gemini-pro',
  'gemini-1.0-pro',
  'models/gemini-1.5-flash',
  'models/gemini-pro'
];

for (const modelName of modelsToTry) {
  try {
    console.log(`Testing: ${modelName}...`);
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent('Say hello');
    const text = result.response.text();
    console.log(`✅ SUCCESS: ${modelName} works!`);
    console.log(`   Response: ${text.substring(0, 50)}...`);
    console.log(`\n🎉 Use this model: ${modelName}\n`);
    break;
  } catch (error) {
    console.log(`❌ Failed: ${error.message.substring(0, 80)}...`);
  }
}
