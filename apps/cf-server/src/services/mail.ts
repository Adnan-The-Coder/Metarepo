import { Resend } from "resend";
import TEMPLATES from "../templates/templates";

const DEFAULT_ADMIN_EMAIL = "contact@adnanthecoder.com";
const DEFAULT_FROM_NAME = "Adnan";
const DEFAULT_FROM_ADDRESS = "hello@adnanthecoder.com";

async function loadTemplate(name: string) {
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
  apiKey,
}: {
  to: string | string[];
  subject: string;
  html: string;
  fromName?: string;
  fromAddress?: string;
  apiKey?: string; // Resend API key (from env bindings)
}) {
  const key = apiKey || "";
  if (!key) throw new Error("Missing RESEND API key");
  const resend = new Resend(key);

  const from = `${fromName || DEFAULT_FROM_NAME} <${fromAddress || DEFAULT_FROM_ADDRESS}>`;
  const recipients = Array.isArray(to) ? to : [to];

  const data = await resend.emails.send({
    from,
    to: recipients,
    subject,
    html,
  });
  return data;
}

export async function sendBookingEmails(payload: Record<string, any>, env?: Record<string, any>) {
  // payload expected to contain: name,email,company,role,preferredDateTime,timezone,bookingType,goals,about
  const userTpl = await loadTemplate("booking-user.html");
  const adminTpl = await loadTemplate("booking-admin.html");

  const userHtml = renderTemplate(userTpl, payload);
  const adminHtml = renderTemplate(adminTpl, payload);

  const emailPromises: Promise<any>[] = [];

  const apiKey = env?.RESEND_API_KEY || env?.RESEND_KEY || "";
  const adminEmail = env?.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL;
  const fromName = env?.MAIL_FROM_NAME || DEFAULT_FROM_NAME;
  const fromAddress = env?.MAIL_FROM_ADDRESS || DEFAULT_FROM_ADDRESS;

  if (payload.email) {
    emailPromises.push(sendMail({
      to: payload.email,
      subject: `Booking confirmation — ${payload.bookingType || "Consultation"}`,
      html: userHtml,
      fromName,
      fromAddress,
      apiKey,
    }));
  }

  // Notify admin + cc other recipients if provided
  const adminRecipients = [adminEmail];
  if (payload.notify && Array.isArray(payload.notify)) adminRecipients.push(...payload.notify);

  emailPromises.push(sendMail({
    to: adminRecipients,
    subject: `New booking: ${payload.name || "(unknown)"} — ${payload.bookingType || "Consultation"}`,
    html: adminHtml,
    fromName,
    fromAddress,
    apiKey,
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
