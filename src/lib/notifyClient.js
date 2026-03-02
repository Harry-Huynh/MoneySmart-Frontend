"use client";

import { buildEmailContent } from "./buildEmailContent";
import { detailsToHtml } from "./emailToHtml";
import { sendEmailJS } from "./emailjsSender";

export async function sendNotificationsClient({ notifications, to_email, customerName }) {
  if (!notifications?.length || !to_email) return;

  for (const n of notifications) {
    const content = buildEmailContent(n.type, { ...n.payload, customerName });
    if (!content) continue;

    try {
      await withTimeout(
        sendEmailJS({
    to_email,
    to_name: customerName,
    subject: content.subject,

    title: content.title,
    badge: content.badge,
    severity: content.severity,
    summary: content.summary,
    details_html: detailsToHtml(content.details),
    cta_url: content.cta_url,
    cta_text: content.cta_text,
    footer_note: content.footer_note,
  }),
  6000
      );
      await sleep(400);
    } catch (e) {
      console.error("Email send failed:", e);
    }
  }
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("Email timeout")), ms)),
  ]);
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}