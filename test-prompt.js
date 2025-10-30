/* eslint-disable no-undef */
/* eslint-env node */
import { GoogleGenerativeAI } from '@google/generative-ai';
import { readFileSync } from 'fs';

const envContent = readFileSync('.env.local', 'utf-8');
const match = envContent.match(/VITE_GEMINI_API_KEY=(.+)/);
const apiKey = match ? match[1].trim() : null;
const modelMatch = envContent.match(/VITE_GEMINI_MODEL=(.+)/);
const model = modelMatch ? modelMatch[1].trim() : 'gemini-2.5-flash';

console.log('\n🧪 Testing AI Prompts for FRANCE\n');

const genAI = new GoogleGenerativeAI(apiKey);
const ai = genAI.getGenerativeModel({ model });

// Test Country Info
console.log('1️⃣ Testing Country Info Prompt...\n');
try {
  const prompt1 = `You are a travel expert. Provide brief AI insights about France.

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "population": "actual population with capital city name",
  "capital": "capital city name only",
  "culturalFact": "one fascinating cultural or historical fact (max 80 chars)",
  "geography": "one interesting geographical feature (max 80 chars)"
}

Be specific, engaging, and concise.`;

  const result1 = await ai.generateContent(prompt1);
  const text1 = result1.response.text();
  console.log('✅ Response received:\n');
  console.log(text1);
  
  const jsonMatch = text1.match(/\{[\s\S]*?\}/);
  if (jsonMatch) {
    const data = JSON.parse(jsonMatch[0]);
    console.log('\n✅ Parsed JSON:', data);
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}

// Test Travel Recommendations
console.log('\n\n2️⃣ Testing TOP 10 Places Prompt...\n');
try {
  const prompt2 = `You are a top travel expert. List the TOP 10 MUST-VISIT places in France for travelers.

Return ONLY valid JSON array (no markdown, no code blocks):
[
  {
    "name": "place name",
    "description": "why visit (max 70 chars)",
    "type": "landmark" or "nature" or "cultural"
  }
]

Be specific with actual place names. Make descriptions exciting and brief.`;

  const result2 = await ai.generateContent(prompt2);
  const text2 = result2.response.text();
  console.log('✅ Response received:\n');
  console.log(text2);
  
  const jsonMatch = text2.match(/\[[\s\S]*?\]/);
  if (jsonMatch) {
    const data = JSON.parse(jsonMatch[0]);
    console.log(`\n✅ Parsed ${data.length} places:`);
    data.slice(0, 3).forEach((p, i) => console.log(`   ${i+1}. ${p.name} - ${p.description}`));
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}

console.log('\n✅ DONE! Prompts working correctly.\n');
