import { Resend } from "resend";
import TEMPLATES from "../templates/templates";

const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "contact@adnanthecoder.com";
const FROM_NAME = process.env.MAIL_FROM_NAME || "Adnan";
const FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS || "hello@adnanthecoder.com";

const resend = new Resend(RESEND_API_KEY);

async function loadTemplate(name: string) {
  // Prefer built-in templates (serverless-friendly). Fall back to key lookup.
  const key = name.endsWith(".html") ? name : `${name}.html`;
  const tpl = TEMPLATES[key];
  if (tpl) return tpl;
  throw new Error(`Template not found: ${name}`);
}

function renderTemplate(tpl: string, data: Record<string, any>) {
  return tpl.replace(/{{\s*([a-zA-Z0-9_.]+)\s*}}/g, (_, key) => {
    const parts = key.split(".");
    let val: any = data;
    for (const p of parts) {
      if (val == null) return "";
      val = val[p];
    }
    return String(val ?? "");
  });
}

export async function sendMail({
  to,
  subject,
  html,
  fromName,
  fromAddress,
}: {
  to: string | string[];
  subject: string;
  html: string;
  fromName?: string;
  fromAddress?: string;
}) {
  const from = `${fromName || FROM_NAME} <${fromAddress || FROM_ADDRESS}>`;
  const recipients = Array.isArray(to) ? to : [to];

  // Resend accepts array of recipients
  const data = await resend.emails.send({
    from,
    to: recipients,
    subject,
    html,
  });
  return data;
}

export async function sendBookingEmails(payload: Record<string, any>) {
  // payload expected to contain: name,email,company,role,preferredDateTime,timezone,bookingType,goals,about
  const userTpl = await loadTemplate("booking-user.html");
  const adminTpl = await loadTemplate("booking-admin.html");

  const userHtml = renderTemplate(userTpl, payload);
  const adminHtml = renderTemplate(adminTpl, payload);

  const emailPromises: Promise<any>[] = [];

  if (payload.email) {
    emailPromises.push(sendMail({
      to: payload.email,
      subject: `Booking confirmation — ${payload.bookingType || "Consultation"}`,
      html: userHtml,
    }));
  }

  // Notify admin + cc other recipients if provided
  const adminRecipients = [ADMIN_EMAIL];
  if (payload.notify && Array.isArray(payload.notify)) adminRecipients.push(...payload.notify);

  emailPromises.push(sendMail({
    to: adminRecipients,
    subject: `New booking: ${payload.name || "(unknown)"} — ${payload.bookingType || "Consultation"}`,
    html: adminHtml,
  }));

  const results = await Promise.allSettled(emailPromises);
  return results;
}

export async function renderNamedTemplate(name: string, data: Record<string, any>) {
  const tpl = await loadTemplate(name);
  return renderTemplate(tpl, data);
}

export default {
  sendMail,
  sendBookingEmails,
  renderNamedTemplate,
};
