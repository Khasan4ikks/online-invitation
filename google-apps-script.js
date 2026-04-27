/**
 * Google Apps Script для RSVP-анкеты.
 * Где указать Spreadsheet ID: вставьте ID таблицы в SPREADSHEET_ID.
 * Где указать название листа: поменяйте SHEET_NAME, если лист называется не RSVP.
 */
const SPREADSHEET_ID = 'PASTE_YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = 'RSVP';

/**
 * doPost(e) принимает JSON с сайта, валидирует поля, записывает строку в Google Sheets
 * и возвращает JSON-ответ для script.js.
 */
function doPost(e) {
  try {
    const body = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    const data = JSON.parse(body);

    const guestName = String(data.guest_name || '').trim();
    const attendanceStatus = String(data.attendance_status || '').trim();
    const partnerName = String(data.partner_name || '').trim();
    const submittedAt = String(data.submitted_at || new Date().toISOString()).trim();
    const source = String(data.source || 'wedding-invitation-site').trim();

    const allowedStatuses = ['Буду обязательно', 'Буду с парой/семьей', 'Не могу приехать :('];

    if (!guestName) return jsonResponse({ ok: false, error: 'guest_name is required' }, 400);
    if (allowedStatuses.indexOf(attendanceStatus) === -1) return jsonResponse({ ok: false, error: 'attendance_status is invalid' }, 400);
    if (attendanceStatus === 'Буду с парой/семьей' && !partnerName) return jsonResponse({ ok: false, error: 'partner_name is required' }, 400);

    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['submitted_at', 'guest_name', 'attendance_status', 'partner_name', 'source']);
    }

    sheet.appendRow([submittedAt, guestName, attendanceStatus, partnerName, source]);

    return jsonResponse({ ok: true });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message || 'Unexpected error' }, 500);
  }
}

/** Возвращает JSON-ответ. Apps Script не позволяет полноценно выставлять HTTP-код в ContentService, но код оставлен для читаемости. */
function jsonResponse(payload, statusCode) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
