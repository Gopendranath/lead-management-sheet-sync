/**
 * Lead Management System — Google Apps Script
 *
 * This script runs as a time-based trigger in Google Apps Script.
 * It checks the Google Sheet for leads that:
 *   - Have status = "NEW"
 *   - Were created more than 24 hours ago
 *
 * For matching leads, it:
 *   1. Sends a reminder email
 *   2. CCs the admin email
 *   3. Updates the sheet with "Reminder Sent" in column J
 *
 * SETUP:
 *   1. Open Google Sheets → Extensions → Apps Script
 *   2. Paste this code into Code.gs
 *   3. Update CONFIG below with your values
 *   4. Run setupDailyTrigger() once to create the 9 AM trigger
 *   5. Authorize when prompted
 */

// ─── Configuration ──────────────────────────────────────────
const CONFIG = {
  ADMIN_EMAIL: "baban567899@gmail.com", // Admin email for CC
  SENDER_NAME: "Lead Management System",
  SHEET_NAME: "Sheet1",

  // Column indices (0-based)
  COL_ID: 0, // A
  COL_NAME: 1, // B
  COL_EMAIL: 2, // C
  COL_PHONE: 3, // D
  COL_COURSE: 4, // E
  COL_COLLEGE: 5, // F
  COL_YEAR: 6, // G
  COL_STATUS: 7, // H
  COL_CREATED_AT: 8, // I
  COL_REMINDER: 9, // J — "Reminder Sent" column
};

// ─── Main Function (runs daily at 9 AM) ─────────────────────
function checkAndSendReminders() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(
    CONFIG.SHEET_NAME,
  );

  if (!sheet) {
    Logger.log("Sheet not found: " + CONFIG.SHEET_NAME);
    return;
  }

  const data = sheet.getDataRange().getValues();
  const now = new Date();
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  let reminderCount = 0;

  // Skip header row (index 0)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const status = String(row[CONFIG.COL_STATUS]).trim().toUpperCase();
    const reminderSent = String(row[CONFIG.COL_REMINDER]).trim();
    const createdAt = new Date(row[CONFIG.COL_CREATED_AT]);

    // Skip if already reminded or not in NEW status
    if (status !== "NEW" || reminderSent === "Reminder Sent") {
      continue;
    }

    // Skip if created less than 24 hours ago
    if (createdAt >= twentyFourHoursAgo) {
      continue;
    }

    // Send reminder email
    const leadName = row[CONFIG.COL_NAME];
    const leadEmail = row[CONFIG.COL_EMAIL];
    const leadCourse = row[CONFIG.COL_COURSE];
    const leadCollege = row[CONFIG.COL_COLLEGE];

    try {
      sendReminderEmail(leadName, leadEmail, leadCourse, leadCollege);

      // Mark as "Reminder Sent" in column J
      sheet.getRange(i + 1, CONFIG.COL_REMINDER + 1).setValue("Reminder Sent");
      reminderCount++;

      Logger.log("Reminder sent for: " + leadName + " (" + leadEmail + ")");
    } catch (error) {
      Logger.log(
        "Failed to send reminder for " + leadEmail + ": " + error.message,
      );
    }
  }

  Logger.log("Total reminders sent: " + reminderCount);
}

// ─── Email Sender ───────────────────────────────────────────
function sendReminderEmail(name, email, course, college) {
  const subject = "Follow-up Required: New Lead - " + name;

  const body = [
    "Hi Team,",
    "",
    "This is a reminder that the following lead has been pending for more than 24 hours:",
    "",
    "  Name:    " + name,
    "  Email:   " + email,
    "  Course:  " + course,
    "  College: " + college,
    "",
    "Please follow up at your earliest convenience.",
    "",
    "— Lead Management System",
  ].join("\n");

  const htmlBody = [
    "<div style='font-family: Arial, sans-serif; padding: 20px;'>",
    "  <h2 style='color: #333;'>Follow-up Required</h2>",
    "  <p>This is a reminder that the following lead has been pending for more than 24 hours:</p>",
    "  <table style='border-collapse: collapse; margin: 16px 0;'>",
    "    <tr><td style='padding: 8px; font-weight: bold;'>Name:</td><td style='padding: 8px;'>" +
      name +
      "</td></tr>",
    "    <tr><td style='padding: 8px; font-weight: bold;'>Email:</td><td style='padding: 8px;'>" +
      email +
      "</td></tr>",
    "    <tr><td style='padding: 8px; font-weight: bold;'>Course:</td><td style='padding: 8px;'>" +
      course +
      "</td></tr>",
    "    <tr><td style='padding: 8px; font-weight: bold;'>College:</td><td style='padding: 8px;'>" +
      college +
      "</td></tr>",
    "  </table>",
    "  <p>Please follow up at your earliest convenience.</p>",
    "  <hr style='border: none; border-top: 1px solid #eee;'>",
    "  <p style='color: #888; font-size: 12px;'>— Lead Management System</p>",
    "</div>",
  ].join("");

  MailApp.sendEmail({
    to: CONFIG.ADMIN_EMAIL,
    cc: CONFIG.ADMIN_EMAIL,
    subject: subject,
    body: body,
    htmlBody: htmlBody,
    name: CONFIG.SENDER_NAME,
  });
}

// ─── Trigger Setup (run once manually) ──────────────────────
function setupDailyTrigger() {
  // Delete existing triggers for this function
  const triggers = ScriptApp.getProjectTriggers();
  for (const trigger of triggers) {
    if (trigger.getHandlerFunction() === "checkAndSendReminders") {
      ScriptApp.deleteTrigger(trigger);
    }
  }

  // Create a new daily trigger at 9 AM
  ScriptApp.newTrigger("checkAndSendReminders")
    .timeBased()
    .everyDays(1)
    .atHour(9)
    .create();

  Logger.log("✅ Daily trigger set for 9 AM");
}
