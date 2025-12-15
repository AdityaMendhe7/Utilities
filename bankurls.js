// create-audio.js
const axios = require("axios");
const fs = require("fs");

// Read input.json file
const bankData = JSON.parse(fs.readFileSync("./input.json", "utf8"));

// Language configurations
const languages = {
  english: {
    code: "en",
    textFunction: (bank) => `Sure, I can share you the contact details of ${bank.bank_name}. You can contact at ${bank.customer_care}. Or write to ${bank.email_Id}. Or you can visit ${bank.bankUrl}.`
  },
  hindi: {
    code: "hi",
    textFunction: (bank) => `ज़रूर, मैं आपको ${bank.bank_name} का संपर्क विवरण साझा कर सकता हूँ। आप ${bank.customer_care} पर संपर्क कर सकते हैं। या ${bank.email_Id} पर लिख सकते हैं। या आप ${bank.bankUrl} पर विजिट कर सकते हैं।`
  },
  punjabi: {
    code: "pa",
    textFunction: (bank) => `ਜ਼ਰੂਰ, ਮੈਂ ਤੁਹਾਨੂੰ ${bank.bank_name} ਦੇ ਸੰਪਰਕ ਵੇਰਵੇ ਸਾਂਝੇ ਕਰ ਸਕਦਾ ਹਾਂ। ਤੁਸੀਂ ${bank.customer_care} 'ਤੇ ਸੰਪਰਕ ਕਰ ਸਕਦੇ ਹੋ। ਜਾਂ ${bank.email_Id} 'ਤੇ ਲਿਖ ਸਕਦੇ ਹੋ। ਜਾਂ ਤੁਸੀਂ ${bank.bankUrl} 'ਤੇ ਵਿਜ਼ਿਟ ਕਰ ਸਕਦੇ ਹੋ।`
  },
  gujarati: {
    code: "gu",
    textFunction: (bank) => `ચોક્કસ, હું તમને ${bank.bank_name} ની સંપર્ક વિગતો શેર કરી શકું છું. તમે ${bank.customer_care} પર સંપર્ક કરી શકો છો. અથવા ${bank.email_Id} પર લખી શકો છો. અથવા તમે ${bank.bankUrl} પર મુલાકાત લઈ શકો છો.`
  },
  marathi: {
    code: "mr",
    textFunction: (bank) => `नक्कीच, मी तुम्हाला ${bank.bank_name} ची संपर्क माहिती सामायिक करू शकतो. तुम्ही ${bank.customer_care} येथे संपर्क साधू शकता. किंवा ${bank.email_Id} येथे लिहू शकता. किंवा तुम्ही ${bank.bankUrl} येथे भेट देऊ शकता.`
  },
  bengali: {
    code: "bn",
    textFunction: (bank) => `নিশ্চয়, আমি আপনাকে ${bank.bank_name} এর যোগাযোগের বিবরণ শেয়ার করতে পারি। আপনি ${bank.customer_care} এ যোগাযোগ করতে পারেন। অথবা ${bank.email_Id} এ লিখতে পারেন। অথবা আপনি ${bank.bankUrl} পরিদর্শন করতে পারেন।`
  },
  telugu: {
    code: "te",
    textFunction: (bank) => `ఖచ్చితంగా, నేను మీకు ${bank.bank_name} యొక్క సంప్రదింపు వివరాలను పంచుకోగలను. మీరు ${bank.customer_care} వద్ద సంప్రదించవచ్చు. లేదా ${bank.email_Id} కి వ్రాయండి. లేదా మీరు ${bank.bankUrl} ని సందర్శించవచ్చు.`
  },
  tamil: {
    code: "ta",
    textFunction: (bank) => `நிச்சயமாக, நான் உங்களுக்கு ${bank.bank_name} இன் தொடர்பு விவரங்களைப் பகிர்ந்து கொள்ள முடியும். நீங்கள் ${bank.customer_care} இல் தொடர்பு கொள்ளலாம். அல்லது ${bank.email_Id} க்கு எழுதலாம். அல்லது நீங்கள் ${bank.bankUrl} ஐப் பார்வையிடலாம்.`
  },
  malayalam: {
    code: "ml",
    textFunction: (bank) => `തീർച്ചയായും, എനിക്ക് നിങ്ങൾക്ക് ${bank.bank_name} ന്റെ കോൺടാക്ട് വിശദാംശങ്ങൾ പങ്കിടാൻ കഴിയും. നിങ്ങൾക്ക് ${bank.customer_care} എന്ന നമ്പറിൽ ബന്ധപ്പെടാം. അല്ലെങ്കിൽ ${bank.email_Id} എന്നതിലേക്ക് എഴുതുക. അല്ലെങ്കിൽ നിങ്ങൾക്ക് ${bank.bankUrl} സന്ദർശിക്കാം.`
  }
};

async function voiceapi(payload) {
  let result;
  const axiosConfig = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      Connection: "keep-alive",
      "auth-Key": "2b5fb5d4-0753-4302-b661-f8580e9effb0",
      "sec-ch-ua-mobile": "?0",
      "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.159 Safari/537.36",
      "Content-Type": "application/json",
      Accept: "application/json, text/plain, */*",
      "Cache-Control": "max-age=31536000",
      "app-id": "29fd4f94-f793-4227-9588-056b5ffb1318",
      "Sec-Fetch-Site": "same-origin",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Dest": "empty",
      Referer: "https://assistant.corover.mobi/irctc/chatbot.html",
      "Accept-Language": "en-GB,en-US;q=0.9,en;q=0.8",
    },
  };

  try {
    const res = await axios.post(
      "https://cognitive.service.corover.ai/dynamic/convertRealTimeAudioWav",
      payload,
      axiosConfig
    );
    result = res.data["Uploaded URL"];
  } catch (error) {
    console.error("Voice API Error:", error.message);
    result = null;
  }

  return result;
}

async function BucketStore(result) {
  try {
    const response = await axios.get(
      `https://cognitive.service.corover.ai/util/save?url=${result}`
    );
    return response.data["saved"];
  } catch (error) {
    console.error("Bucket Store Error:", error.message);
    console.log("bucket api ERROR!!!");
    return null;
  }
}

async function processBankForLanguage(bank, languageName, languageConfig, bankIndex) {
  const langText = languageConfig.textFunction(bank);
  const cleanText = langText.replace(/\n/gi, " ").replace(/\s+/g, " ").trim();
  
  console.log(`   ${languageName.toUpperCase()}: ${cleanText.substring(0, 80)}...`);

  const payload = {
    sourceText: cleanText,
    sourceLanguage: languageConfig.code,
  };

  try {
    const audioUrl = await voiceapi(payload);
    
    if (audioUrl) {
      const bucketUrl = await BucketStore(audioUrl);
      
      if (bucketUrl) {
        return {
          language: languageName,
          language_code: languageConfig.code,
          text: cleanText,
          audio_url: bucketUrl,
          success: true
        };
      }
    }
  } catch (error) {
    console.error(`   ❌ Error in ${languageName}:`, error.message);
  }
  
  return {
    language: languageName,
    language_code: languageConfig.code,
    text: cleanText,
    audio_url: null,
    error: "Failed to generate or save audio",
    success: false
  };
}

async function main() {
  const output = [];

  console.log(`📊 Processing ${bankData.length} banks in ${Object.keys(languages).length} languages...\n`);
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
      console.log(`\n   🌐 Processing ${languageName.toUpperCase()}...`);
      
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
  }

  // Save output to output.json
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
    console.log(`   ${lang.toUpperCase()}: ${stats.success}/${stats.total} (${stats.rate}%)`);
  });
  
  // Save summary to separate file
  fs.writeFileSync("summary.json", JSON.stringify(summary, null, 2));
  console.log(`\n📄 Detailed summary saved to summary.json`);
}

function generateSummary(output) {
  const languageStats = {};
  let totalAudios = 0;
  let successfulAudios = 0;
  
  // Initialize language stats
  Object.keys(languages).forEach(lang => {
    languageStats[lang] = { success: 0, total: 0, rate: 0 };
  });
  
  // Calculate stats
  output.forEach(bank => {
    bank.audios.forEach(audio => {
      const lang = audio.language;
      languageStats[lang].total++;
      totalAudios++;
      
      if (audio.success) {
        languageStats[lang].success++;
        successfulAudios++;
      }
    });
  });
  
  // Calculate percentages
  Object.keys(languageStats).forEach(lang => {
    const stats = languageStats[lang];
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
    generated_timestamp: new Date().toISOString()
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