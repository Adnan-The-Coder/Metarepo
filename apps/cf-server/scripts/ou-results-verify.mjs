/* eslint-disable prefer-const */

// ==============================
// CONFIG VARIABLES
// ==============================

let rollnumber = 160424733001;
const number_of_requests_to_be_made = 481;

const API_ENDPOINT =
  "https://metarepo-cf-server.ghost-server.workers.dev/ou-results/rollnumber";

// ==============================
// MAIN FUNCTION
// ==============================

async function main() {
  console.log("Starting roll number verification process...\n");
  console.log(`📋 Configuration:`);
  console.log(`   - Starting Roll Number: ${rollnumber}`);
  console.log(`   - Total Requests: ${number_of_requests_to_be_made}`);
  console.log(`   - API Endpoint: ${API_ENDPOINT}\n`);

  let foundCount = 0;
  let notFoundCount = 0;
  let errorCount = 0;
  const missingRollNumbers = [];
  const foundRollNumbers = [];

  for (let i = 0; i < number_of_requests_to_be_made; i++) {
    const currentRoll = rollnumber + i;

    try {
      // Print progress every 50 requests
      if (i % 50 === 0) {
        console.log(`\n⏳ Progress: ${i}/${number_of_requests_to_be_made} requests completed\n`);
      }

      // --------------------------------
      // 1️⃣ MAKE GET REQUEST TO API
      // --------------------------------
      const getUrl = `${API_ENDPOINT}/${currentRoll}`;
      console.log(`🔍 Checking Roll Number: ${currentRoll}`);
      console.log(`   URL: ${getUrl}`);

      const apiResponse = await fetch(getUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      // --------------------------------
      // 2️⃣ CHECK RESPONSE STATUS
      // --------------------------------
      if (apiResponse.ok) {
        const apiData = await apiResponse.json();

        if (apiData.success && apiData.data && apiData.data.length > 0) {
          foundCount++;
          foundRollNumbers.push(currentRoll);
          console.log(`✅ FOUND - Roll Number: ${currentRoll}`);
          console.log(`   📊 Entries Count: ${apiData.data.length}`);
          console.log(`   📅 Release Month: ${apiData.data[0].result_release_month_year}`);
          console.log(`   🕐 Created At: ${apiData.data[0].createdAt}\n`);
        } else {
          notFoundCount++;
          missingRollNumbers.push(currentRoll);
          console.log(`❌ NOT FOUND - Roll Number: ${currentRoll}`);
          console.log(`   Message: No data available\n`);
        }
      } else if (apiResponse.status === 404) {
        notFoundCount++;
        missingRollNumbers.push(currentRoll);
        console.log(`❌ NOT FOUND - Roll Number: ${currentRoll}`);
        console.log(`   Status: 404 Not Found\n`);
      } else {
        errorCount++;
        const errorText = await apiResponse.text();
        console.error(`⚠️  ERROR - Roll Number: ${currentRoll}`);
        console.error(`   Status: ${apiResponse.status}`);
        console.error(`   Error: ${errorText.substring(0, 100)}\n`);
      }
    } catch (error) {
      errorCount++;
      console.error(`❌ NETWORK ERROR - Roll Number: ${currentRoll}`);
      console.error(`   Error: ${error.message}\n`);
    }

    // Add a small delay to avoid overwhelming the server
    if (i < number_of_requests_to_be_made - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  }

  // ================================
  // 3️⃣ PRINT SUMMARY REPORT
  // ================================
  console.log("\n\n");
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║           📊 VERIFICATION SUMMARY REPORT                    ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");

  console.log(`📈 Statistics:`);
  console.log(`   ✅ Found: ${foundCount} roll numbers`);
  console.log(`   ❌ Not Found: ${notFoundCount} roll numbers`);
  console.log(`   ⚠️  Errors: ${errorCount} requests`);
  console.log(`   📊 Total Requests: ${number_of_requests_to_be_made}`);
  console.log(`   💯 Success Rate: ${((foundCount / number_of_requests_to_be_made) * 100).toFixed(2)}%\n`);

  if (foundRollNumbers.length > 0) {
    console.log(`✅ FOUND ROLL NUMBERS (${foundRollNumbers.length}):`);
    console.log(`   Range: ${foundRollNumbers[0]} to ${foundRollNumbers[foundRollNumbers.length - 1]}`);
    console.log(`   Total: ${foundRollNumbers.length}\n`);
  }

  if (missingRollNumbers.length > 0 && missingRollNumbers.length <= 50) {
    console.log(`❌ MISSING ROLL NUMBERS (${missingRollNumbers.length}):`);
    console.log(`   ${missingRollNumbers.join(", ")}\n`);
  } else if (missingRollNumbers.length > 50) {
    console.log(`❌ MISSING ROLL NUMBERS (${missingRollNumbers.length}):`);
    console.log(`   First 50: ${missingRollNumbers.slice(0, 50).join(", ")}`);
    console.log(`   (and ${missingRollNumbers.length - 50} more...)\n`);
  }

  console.log(`\n🔗 Next Steps:`);
  console.log(`   1. Review the missing roll numbers above`);
  console.log(`   2. Run the fetch-and-update script to collect missing data`);
  console.log(`   3. Re-run this verification script to confirm\n`);

  console.log("Process completed.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
});
