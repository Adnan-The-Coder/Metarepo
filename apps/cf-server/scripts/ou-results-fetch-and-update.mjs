/* eslint-disable prefer-const */
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

// ==============================
// CONFIG VARIABLES
// ==============================

let rollnumber = 160424733481;
const number_of_curl_requests_to_be_made = 1;
const result_release_month_year = "February-2026";

const OS_MANIA_URL =
  "https://www.osmania.ac.in/res07/20251290.jsp";

const API_ENDPOINT =
  "https://metarepo-cf-server.ghost-server.workers.dev/ou-results";

// ==============================
// MAIN FUNCTION
// ==============================

async function main() {
  console.log("Starting data storage process...\n");

  for (let i = 0; i < number_of_curl_requests_to_be_made; i++) {
    const currentRoll = rollnumber + i;

    console.log(`Processing Roll Number: ${currentRoll}`);

    try {
      // ------------------------------
      // 1️⃣ MAKE CURL REQUEST
      // ------------------------------
      const curlCommand = `curl -k -s -X POST "${OS_MANIA_URL}" -d "mbstatus=SEARCH" -d "htno=${currentRoll}"`;

      console.log(`📍 Executing curl command:\n${curlCommand}\n`);

      const { stdout, stderr } = await execAsync(curlCommand);

      console.log(`📊 Curl stdout length: ${stdout.length} bytes`);
      console.log(`📊 Curl stderr: ${stderr || "No errors"}\n`);

      if (stderr) {
        console.warn(`⚠️  Warning: ${stderr}`);
      }

      if (!stdout || stdout.trim() === "") {
        throw new Error("Empty HTML response received from curl.");
      }

      console.log("✔ Curl request successful.");
      console.log(`📄 Response preview (first 500 chars):\n${stdout.substring(0, 500)}\n`);

      // ------------------------------
      // 2️⃣ PREPARE JSON BODY
      // ------------------------------
      const requestBody = {
        rollnumber: String(currentRoll),
        html_response: stdout,
        result_release_month_year: result_release_month_year,
      };

      // ------------------------------
      // 3️⃣ SEND TO API ENDPOINT
      // ------------------------------
      console.log(`🌐 Sending to API endpoint: ${API_ENDPOINT}`);

      const apiResponse = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!apiResponse.ok) {
        const errorText = await apiResponse.text();
        throw new Error(
          `API POST failed with status ${apiResponse.status}: ${errorText}`
        );
      }

      const apiData = await apiResponse.json();
      console.log("✔ Stored in API successfully:", apiData.message);
      console.log("--------------------------------------------------\n");
    } catch (error) {
      console.error("❌ ERROR OCCURRED:");
      console.error(error.message);
      console.error("Terminating loop immediately.");
      break; // 🔴 Stop loop immediately on failure
    }
  }

  console.log("Process completed.");
}

main().catch((err) => {
  console.error("Fatal error:", err);
});