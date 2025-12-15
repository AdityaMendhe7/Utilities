// create-audio.js
const axios = require("axios");
const fs = require("fs");

// Read input.json file
const bankData = JSON.parse(fs.readFileSync("./input.json", "utf8"));

// Language configurations
const languages = {
  english: {
    code: "en",
    api: "corover", // corover or newvoice
    textFunction: (bank) => `Sure, I can share you the contact details of ${bank.bank_name}. You can contact at ${bank.customer_care}. Or write to ${bank.email_Id}. Or you can visit ${bank.bankUrl}.`
  },
  hindi: {
    code: "hi",
    api: "corover",
    textFunction: (bank) => `ज़रूर, मैं आपको ${bank.bank_name} का संपर्क विवरण साझा कर सकता हूँ। आप ${bank.customer_care} पर संपर्क कर सकते हैं। या ${bank.email_Id} पर लिख सकते हैं। या आप ${bank.bankUrl} पर विजिट कर सकते हैं।`
  },
  punjabi: {
    code: "pa",
    api: "corover",
    textFunction: (bank) => `ਜ਼ਰੂਰ, ਮੈਂ ਤੁਹਾਨੂੰ ${bank.bank_name} ਦੇ ਸੰਪਰਕ ਵੇਰਵੇ ਸਾਂਝੇ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ${bank.customer_care} 'ਤੇ ਸੰਪਰਕ ਕਰ ਸਕਦੇ ਹੋ। ਜਾਂ ${bank.email_Id} 'ਤੇ ਲਿਖ ਸਕਦੇ ਹੋ। ਜਾਂ ਤੁਸੀਂ ${bank.bankUrl} 'ਤੇ ਵਿਜ਼ਿਟ ਕਰ ਸਕਦੇ ਹੋ।`
  },
  gujarati: {
    code: "gu",
    api: "corover",
    textFunction: (bank) => `ચોક્કસ, હું તમને ${bank.bank_name} ની સંપર્ક વિગતો શેર કરી શકું છું. તમે ${bank.customer_care} પર સંપર્ક કરી શકો છો. અથવા ${bank.email_Id} પર લખી શકો છો. અથવા તમે ${bank.bankUrl} પર મુલાકાત લઈ શકો છો.`
  },
  marathi: {
    code: "mr",
    api: "corover",
    textFunction: (bank) => `नक्कीच, मी तुम्हाला ${bank.bank_name} ची संपर्क माहिती सामायिक करू शकतो. तुम्ही ${bank.customer_care} येथे संपर्क साधू शकता. किंवा ${bank.email_Id} येथे लिहू शकता. किंवा तुम्ही ${bank.bankUrl} येथे भेट देऊ शकता.`
  },
  bengali: {
    code: "bn",
    api: "corover",
    textFunction: (bank) => `নিশ্চয়, আমি আপনাকে ${bank.bank_name} এর যোগাযোগের বিবরণ শেয়ার করতে পারি। আপনি ${bank.customer_care} এ যোগাযোগ করতে পারেন। অথবা ${bank.email_Id} এ লিখতে পারেন। অথবা আপনি ${bank.bankUrl} পরিদর্শন করতে পারেন।`
  },
  telugu: {
    code: "te",
    api: "corover",
    textFunction: (bank) => `ఖచ్చితంగా, నేను మీకు ${bank.bank_name} యొక్క సంప్రదింపు వివరాలను పంచుకోగలను. మీరు ${bank.customer_care} వద్ద సంప్రదించవచ్చు. లేదా ${bank.email_Id} కి వ్రాయండి. లేదా మీరు ${bank.bankUrl} ని సందర్శించవచ్చు.`
  },
  tamil: {
    code: "ta",
    api: "corover",
    textFunction: (bank) => `நிச்சயமாக, நான் உங்களுக்கு ${bank.bank_name} இன் தொடர்பு விவரங்களைப் பகிர்ந்து கொள்ள முடியும். நீங்கள் ${bank.customer_care} இல் தொடர்பு கொள்ளலாம். அல்லது ${bank.email_Id} க்கு எழுதலாம். அல்லது நீங்கள் ${bank.bankUrl} ஐப் பார்வையிடலாம்.`
  },
  malayalam: {
    code: "ml",
    api: "corover",
    textFunction: (bank) => `തീർച്ചയായും, എനിക്ക് നിങ്ങൾക്ക് ${bank.bank_name} ന്റെ കോൺടാക്ട് വിശദാംശങ്ങൾ പങ്കിടാൻ കഴിയും. നിങ്ങൾക്ക് ${bank.customer_care} എന്ന നമ്പറിൽ ബന്ധപ്പെടാം. അല്ലെങ്കിൽ ${bank.email_Id} എന്നതിലേക്ക് എഴുതുക. അല്ലെങ്കിൽ നിങ്ങൾക്ക് ${bank.bankUrl} സന്ദർശിക്കാം.`
  },
  assamese: {
    code: "asm",
    api: "newvoice", // Using NewVoice API
    textFunction: (bank) => `নিশ্চয়, মই আপোনাক ${bank.bank_name} ৰ যোগাযোগৰ তথ্য শ্বেয়াৰ কৰিব পাৰো। আপুনি ${bank.customer_care} ত যোগাযোগ কৰিব পাৰে। বা ${bank.email_Id} লৈ লিখিব পাৰে। বা আপুনি ${bank.bankUrl} ভিজিট কৰিব পাৰে।`
  },
  odia: {
    code: "or",
    api: "newvoice", // Using NewVoice API
    textFunction: (bank) => `ନିଶ୍ଚିତ, ମୁଁ ଆପଣଙ୍କୁ ${bank.bank_name} ର ସମ୍ପର୍କ ବିବରଣୀ ଅଂଶୀଦାର କରିପାରିବି। ଆପଣ ${bank.customer_care} ରେ ସମ୍ପର୍କ କରିପାରିବେ। କିମ୍ବା ${bank.email_Id} ରେ ଲେଖିପାରିବେ। କିମ୍ବା ଆପଣ ${bank.bankUrl} ବୁଲିପାରିବେ।`
  }
};

// Common headers for all APIs
const commonHeaders = {
  "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
  "Content-Type": "application/json"
};

// Corover API function
async function coroverVoiceAPI(payload) {
  let result;
  const axiosConfig = {
    headers: {
      ...commonHeaders,
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
      "auth-Key": "2b5fb5d4-0753-4302-b661-f8580e9effb0",
      "sec-ch-ua-mobile": "?0",
      "Cache-Control": "max-age=31536000",
      "app-id": "29fd4f94-f793-4227-9588-056b5ffb1318",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      Referer: "https://assistant.corover.mobi/irctc/chatbot.html",
    },
    timeout: 30000
  };

  try {
    const res = await axios.post(
      "https://cognitive.service.corover.ai/dynamic/convertRealTimeAudioWav",
      payload,
      axiosConfig
    );
    result = res.data["Uploaded URL"];
    console.log(`   Corover API Response: Success - URL generated`);
  } catch (error) {
    console.error("Corover Voice API Error:", error.message);
    if (error.response) {
      console.error("Response data:", JSON.stringify(error.response.data));
      console.error("Response status:", error.response.status);
    }
    result = null;
  }

  return result;
}

// NewVoice API function using the correct endpoint
async function newVoiceAPI(text, languageCode) {
  let result;
  
  // Map language codes to Bhashini API codes
  const languageEndpoints = {
    "asm": "as",  // Assamese -> as
    "or": "or"    // Odia -> or
  };
  
  const endpointCode = languageEndpoints[languageCode];
  
  if (!endpointCode) {
    console.error(`   No endpoint defined for language code: ${languageCode}`);
    return null;
  }
  
  const apiUrl = `https://pmkisan.corover.ai/pmkisanAPI/nlp/VoiceApiBhashini/${endpointCode}`;
  
  const axiosConfig = {
    headers: {
      ...commonHeaders,
      "appId": "0708775d-c6af-4a88-ac47-346571727a0a",
    },
    timeout: 30000
  };

  const payload = {
    "Text": text
  };

  console.log(`   Calling NewVoice API: ${apiUrl}`);

  try {
    const res = await axios.post(
      apiUrl,
      payload,
      axiosConfig
    );
    
    console.log(`   NewVoice API Response Status: ${res.status}`);
    
    // Extract URL from response
    if (res.data) {
      // Check if response.data itself is a string URL
      if (typeof res.data === 'string' && res.data.startsWith('http')) {
        result = res.data;
        console.log(`   Extracted string URL: ${result}`);
      } 
      // Check for AudioURL property (from your log: { AudioURL: '...' })
      else if (res.data.AudioURL) {
        result = String(res.data.AudioURL);
        console.log(`   Extracted AudioURL: ${result}`);
      }
      // Check for audioUrl property
      else if (res.data.audioUrl) {
        result = String(res.data.audioUrl);
        console.log(`   Extracted audioUrl: ${result}`);
      }
      // Check for Uploaded URL property
      else if (res.data["Uploaded URL"]) {
        result = String(res.data["Uploaded URL"]);
        console.log(`   Extracted Uploaded URL: ${result}`);
      }
      // Check if response is the URL object directly
      else if (typeof res.data === 'object' && res.data.url) {
        result = String(res.data.url);
        console.log(`   Extracted url property: ${result}`);
      }
      else {
        // Try to stringify and find URL
        const jsonStr = JSON.stringify(res.data);
        const urlMatch = jsonStr.match(/"https?:\/\/[^"]+"/);
        if (urlMatch) {
          result = urlMatch[0].replace(/"/g, '');
          console.log(`   Found URL in JSON: ${result}`);
        } else {
          console.error(`   Could not extract URL from response:`, JSON.stringify(res.data));
          result = null;
        }
      }
    } else {
      console.error(`   Empty response from API`);
      result = null;
    }
    
    // Validate result is a string URL
    if (result && typeof result !== 'string') {
      console.error(`   Result is not a string, converting:`, typeof result, result);
      result = String(result);
    }
    
  } catch (error) {
    console.error("NewVoice API Error:", error.message);
    if (error.response) {
      console.error("Response data:", JSON.stringify(error.response.data));
      console.error("Response status:", error.response.status);
    }
    result = null;
  }

  return result;
}

async function voiceapi(text, languageConfig) {
  const { code, api } = languageConfig;
  
  if (api === "newvoice") {
    console.log(`   Using NewVoice API for ${code.toUpperCase()}`);
    return await newVoiceAPI(text, code);
  } else {
    console.log(`   Using Corover API for ${code.toUpperCase()}`);
    const payload = {
      sourceText: text,
      sourceLanguage: code,
    };
    return await coroverVoiceAPI(payload);
  }
}

async function BucketStore(result) {
  if (!result) {
    console.error("   Cannot save null result to bucket");
    return null;
  }
  
  // Ensure result is a string
  const urlString = String(result).trim();
  
  // Check if it's already a valid URL
  if (!urlString.startsWith('http')) {
    console.error(`   Invalid URL format: ${urlString}`);
    return null;
  }
  
  try {
    console.log(`   Saving to bucket: ${urlString}`);
    const response = await axios.get(
      `https://cognitive.service.corover.ai/util/save?url=${encodeURIComponent(urlString)}`,
      { timeout: 60000 }
    );
    
    const savedUrl = response.data && response.data["saved"];
    if (savedUrl) {
      console.log(`   ✅ Saved to bucket URL: ${savedUrl}`);
      return savedUrl;
    } else {
      console.error(`   No saved URL in bucket response:`, response.data);
      return null;
    }
  } catch (error) {
    console.error("Bucket Store Error:", error.message);
    if (error.response) {
      console.error("Response status:", error.response.status);
    } else if (error.code === 'ECONNABORTED') {
      console.error("Bucket API timeout - server might be busy");
    }
    return null;
  }
}

async function processBankForLanguage(bank, languageName, languageConfig, bankIndex) {
  const langText = languageConfig.textFunction(bank);
  const cleanText = langText.replace(/\n/gi, " ").replace(/\s+/g, " ").trim();
  
  console.log(`\n   ${languageName.toUpperCase()} (${languageConfig.api}):`);
  console.log(`   Text: ${cleanText}`);

  try {
    const audioUrl = await voiceapi(cleanText, languageConfig);
    
    if (audioUrl) {
      // Ensure audioUrl is a string
      const audioUrlString = String(audioUrl).trim();
      console.log(`   ✅ Audio generated successfully: ${audioUrlString}`);
      
      // Always try to save to bucket for consistency
      const bucketUrl = await BucketStore(audioUrlString);
      
      if (bucketUrl) {
        return {
          language: languageName,
          language_code: languageConfig.code,
          api_used: languageConfig.api,
          text: cleanText,
          audio_url: bucketUrl,
          raw_audio_url: audioUrlString,
          success: true
        };
      } else {
        // If bucket save fails but we have a URL, use it directly
        console.log(`   ⚠️  Bucket save failed, using direct URL: ${audioUrlString}`);
        return {
          language: languageName,
          language_code: languageConfig.code,
          api_used: languageConfig.api,
          text: cleanText,
          audio_url: audioUrlString,
          raw_audio_url: audioUrlString,
          bucket_save_failed: true,
          success: true
        };
      }
    } else {
      console.log(`   ❌ Audio generation failed - no URL returned`);
      return {
        language: languageName,
        language_code: languageConfig.code,
        api_used: languageConfig.api,
        text: cleanText,
        audio_url: null,
        error: "No audio URL returned from API",
        success: false
      };
    }
  } catch (error) {
    console.error(`   ❌ Error in ${languageName} (${languageConfig.api}):`, error.message);
    return {
      language: languageName,
      language_code: languageConfig.code,
      api_used: languageConfig.api,
      text: cleanText,
      audio_url: null,
      error: error.message,
      success: false
    };
  }
}

async function main() {
  const output = [];

  console.log(`📊 Processing ${bankData.length} banks in ${Object.keys(languages).length} languages...\n`);
  console.log("=".repeat(80));
  console.log("🌐 APIs Used:");
  console.log("   - Corover API: English, Hindi, Punjabi, Gujarati, Marathi, Bengali, Telugu, Tamil, Malayalam");
  console.log("   - NewVoice Bhashini API: Assamese, Odia");
  console.log("=".repeat(80));

  for (let bankIndex = 0; bankIndex < bankData.length; bankIndex++) {
    const bank = bankData[bankIndex];
    
    console.log(`\n🔵 Bank ${bankIndex + 1}/${bankData.length}: ${bank.bank_name}`);
    console.log("-".repeat(80));

    const bankResult = {
      bank_name: bank.bank_name,
      customer_care: bank.customer_care,
      email_Id: bank.email_Id,
      bankUrl: bank.bankUrl,
      audios: [],
      generated_timestamp: new Date().toISOString()
    };

    // Process each language for this bank
    for (const [languageName, languageConfig] of Object.entries(languages)) {
      console.log(`\n   🌐 Processing ${languageName.toUpperCase()} (${languageConfig.api.toUpperCase()})...`);
      
      const languageResult = await processBankForLanguage(
        bank, 
        languageName, 
        languageConfig,
        bankIndex
      );
      
      bankResult.audios.push(languageResult);
      
      if (languageResult.success) {
        console.log(`   ✅ ${languageName.toUpperCase()} audio generated successfully!`);
      } else {
        console.log(`   ❌ ${languageName.toUpperCase()} audio generation failed.`);
      }
    }

    output.push(bankResult);
    console.log("\n" + "=".repeat(80));
    
    // Save progress after each bank (in case of crash)
    fs.writeFileSync(`output-progress-${bankIndex + 1}.json`, JSON.stringify(output, null, 2));
    console.log(`💾 Progress saved to output-progress-${bankIndex + 1}.json`);
  }

  // Save final output to output.json
  fs.writeFileSync("output.json", JSON.stringify(output, null, 2));
  
  // Generate summary statistics
  const summary = generateSummary(output);
  
  console.log(`\n🎉 Output saved to output.json`);
  console.log(`📊 Summary Report:`);
  console.log(`   Total Banks: ${summary.totalBanks}`);
  console.log(`   Total Languages: ${summary.totalLanguages}`);
  console.log(`   Successful Audios: ${summary.successfulAudios}`);
  console.log(`   Failed Audios: ${summary.failedAudios}`);
  console.log(`   Success Rate: ${summary.successRate}%\n`);
  
  console.log("📋 Language-wise Success Rate:");
  Object.entries(summary.languageStats).forEach(([lang, stats]) => {
    console.log(`   ${lang.toUpperCase()}: ${stats.success}/${stats.total} (${stats.rate}%) [API: ${stats.api}]`);
  });
  
  console.log("\n🔧 API-wise Usage:");
  Object.entries(summary.apiStats).forEach(([api, stats]) => {
    console.log(`   ${api.toUpperCase()}: ${stats.success}/${stats.total} audios (${stats.rate}%)`);
  });
  
  // Save summary to separate file
  fs.writeFileSync("summary.json", JSON.stringify(summary, null, 2));
  console.log(`\n📄 Detailed summary saved to summary.json`);
  
  // Also save a simplified version
  const simplifiedOutput = output.map(bank => ({
    bank_name: bank.bank_name,
    audios: bank.audios.map(audio => ({
      language: audio.language,
      audio_url: audio.audio_url,
      success: audio.success
    }))
  }));
  fs.writeFileSync("output-simplified.json", JSON.stringify(simplifiedOutput, null, 2));
  console.log(`📄 Simplified output saved to output-simplified.json`);
}

function generateSummary(output) {
  const languageStats = {};
  const apiStats = {
    corover: { success: 0, total: 0, rate: 0 },
    newvoice: { success: 0, total: 0, rate: 0 }
  };
  
  let totalAudios = 0;
  let successfulAudios = 0;
  
  // Initialize language stats
  Object.keys(languages).forEach(lang => {
    languageStats[lang] = { 
      success: 0, 
      total: 0, 
      rate: 0,
      api: languages[lang].api 
    };
  });
  
  // Calculate stats
  output.forEach(bank => {
    bank.audios.forEach(audio => {
      const lang = audio.language;
      const api = audio.api_used || languages[lang]?.api || 'unknown';
      
      languageStats[lang].total++;
      
      if (apiStats[api]) {
        apiStats[api].total++;
      }
      
      totalAudios++;
      
      if (audio.success) {
        languageStats[lang].success++;
        
        if (apiStats[api]) {
          apiStats[api].success++;
        }
        
        successfulAudios++;
      }
    });
  });
  
  // Calculate percentages
  Object.keys(languageStats).forEach(lang => {
    const stats = languageStats[lang];
    stats.rate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
  });
  
  Object.keys(apiStats).forEach(api => {
    const stats = apiStats[api];
    stats.rate = stats.total > 0 ? Math.round((stats.success / stats.total) * 100) : 0;
  });
  
  return {
    totalBanks: output.length,
    totalLanguages: Object.keys(languages).length,
    totalAudios: totalAudios,
    successfulAudios: successfulAudios,
    failedAudios: totalAudios - successfulAudios,
    successRate: totalAudios > 0 ? Math.round((successfulAudios / totalAudios) * 100) : 0,
    languageStats: languageStats,
    apiStats: apiStats,
    generated_timestamp: new Date().toISOString(),
    api_endpoints: {
      corover: "https://cognitive.service.corover.ai/dynamic/convertRealTimeAudioWav",
      newvoice: {
        asm: "https://pmkisan.corover.ai/pmkisanAPI/nlp/VoiceApiBhashini/as",
        or: "https://pmkisan.corover.ai/pmkisanAPI/nlp/VoiceApiBhashini/or"
      }
    }
  };
}

// Error handling for file reading
try {
  if (!fs.existsSync("./input.json")) {
    console.error("❌ Error: input.json file not found!");
    console.log("Please create input.json with your bank data.");
    console.log("\nExample input.json format:");
    console.log(JSON.stringify([
      {
        "bank_name": "The South Indian Bank",
        "customer_care": "18004251809 or 18001029408",
        "email_Id": "customercare@sib.co.in",
        "bankUrl": "https://www.southindianbank.com"
      }
    ], null, 2));
    process.exit(1);
  }
  
  main().catch(error => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });
} catch (error) {
  console.error("❌ Error reading input.json:", error.message);
  process.exit(1);
}