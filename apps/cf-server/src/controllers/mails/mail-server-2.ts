/* eslint-disable @nx/enforce-module-boundaries */
// Mail-Server is powered by Resend 
// Can handle 100 emails per day and 3000 emails per month 

import { Context } from "hono";
import mailService from "../../services/mail";

export const mail_server_2 = async (c: Context) => {
  try {
    const body = await c.req.json();

    // If this is a booking payload from the front-end form, handle specialized flow
    if (body && (body.bookingType || body.preferredDateTime || body.email)) {
      const payload = {
        name: body.name || body.fullName || body.displayName || "",
        email: body.email,
        company: body.company || "",
        role: body.role || "",
        preferredDateTime: body.preferredDateTime || body.date || "",
        timezone: body.timezone || "UTC",
        bookingType: body.bookingType || body.type || "Consultation",
        goals: body.goals || "",
        about: body.about || "",
        duration: body.duration || (body.bookingType === "call-15" ? "15 minutes" : (body.duration || "45 minutes")),
        tagline: body.tagline || "",
        notify: body.notify || undefined,
      } as Record<string, any>;

      const results = await mailService.sendBookingEmails(payload, c.env);
      return c.json({ success: true, results }, { status: 200 });
    }

    // Generic template send: accept templateName + data OR raw html
    const { templateName, templateData, subject, html, recipients, fromName, fromAddress } = body || {};

    if (templateName && templateData && subject && recipients) {
      const rendered = await mailService.renderNamedTemplate(templateName, templateData);
      const resp = await mailService.sendMail({
        to: recipients,
        subject,
        html: rendered,
        fromName,
        fromAddress,
        apiKey: c.env.RESEND_API_KEY,
      },
      );
      return c.json({ success: true, result: resp }, { status: 200 });
    }

    // Fallback: raw html send
    if (html && subject && recipients) {
      const resp = await mailService.sendMail({
        to: recipients,
        subject,
        html,
        fromName: fromName || "AdnanTheCoder",
        fromAddress: fromAddress || "hello@adnanthecoder.com",
        apiKey: c.env.RESEND_API_KEY,
      });
      return c.json({ success: true, result: resp }, { status: 200 });
    }

    return c.json({ success: false, error: "Invalid payload" }, { status: 400 });
  } catch (error: any) {
    console.error("Mail server error:", error);
    return c.json({ success: false, error: error?.toString?.() || String(error) }, { status: 500 });
  }
};