import { google } from "googleapis";
import { env } from "../config/env.js";

interface LeadRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  college: string;
  year: string;
  status: string;
  createdAt: Date;
}

class GoogleSheetsService {
  private sheets;
  private isConfigured: boolean;

  constructor() {
    this.isConfigured = !!(env.GOOGLE_CLIENT_EMAIL && env.GOOGLE_PRIVATE_KEY && env.GOOGLE_SHEET_ID);

    if (this.isConfigured) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: env.GOOGLE_CLIENT_EMAIL,
          private_key: env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });

      this.sheets = google.sheets({ version: "v4", auth });
    } else {
      console.warn("[Google Sheets] Not configured — skipping integration.");
    }
  }

  /**
   * Append a row for a new lead. Returns the row number as a string (sheetRowId).
   */
  async appendRow(lead: LeadRow): Promise<string | null> {
    if (!this.isConfigured || !this.sheets) {
      console.warn("[Google Sheets] Skipping appendRow — not configured.");
      return null;
    }

    try {
      const response = await this.sheets.spreadsheets.values.append({
        spreadsheetId: env.GOOGLE_SHEET_ID,
        range: "Sheet1!A:I",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [
            [
              lead.id,
              lead.name,
              lead.email,
              lead.phone,
              lead.course,
              lead.college,
              lead.year,
              lead.status,
              lead.createdAt.toISOString(),
            ],
          ],
        },
      });

      // Extract the row number from the updatedRange (e.g., "Sheet1!A5:I5" → "5")
      const updatedRange = response.data.updates?.updatedRange;
      if (updatedRange) {
        const match = updatedRange.match(/(\d+)$/);
        if (match) {
          return match[1];
        }
      }

      return null;
    } catch (error) {
      console.error("[Google Sheets] Error appending row:", error);
      throw error;
    }
  }

  /**
   * Update a specific row (by sheetRowId) with new data.
   */
  async updateRow(sheetRowId: string, data: { status: string }): Promise<void> {
    if (!this.isConfigured || !this.sheets) {
      console.warn("[Google Sheets] Skipping updateRow — not configured.");
      return;
    }

    try {
      // Status is in column H (column 8)
      await this.sheets.spreadsheets.values.update({
        spreadsheetId: env.GOOGLE_SHEET_ID,
        range: `Sheet1!H${sheetRowId}`,
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[data.status]],
        },
      });
    } catch (error) {
      console.error("[Google Sheets] Error updating row:", error);
      throw error;
    }
  }
}

export const googleSheetsService = new GoogleSheetsService();
