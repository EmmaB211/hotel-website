import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { BookingWithRelations } from "@/types";

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return null;
  }
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

export async function sendBookingConfirmationEmail(booking: BookingWithRelations) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] SMTP not configured — skipping booking confirmation email.");
    return;
  }

  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h2 style="color:#8a5a2b;">Booking Received — ${siteConfig.name}</h2>
      <p>Dear ${booking.guest.fullName},</p>
      <p>Thank you for choosing ${siteConfig.name}. Your booking has been received and is currently <strong>${booking.status}</strong>.</p>
      <table style="width:100%; border-collapse: collapse; margin-top: 16px;">
        <tr><td style="padding:6px 0;">Booking Reference</td><td style="text-align:right;"><strong>${booking.reference}</strong></td></tr>
        <tr><td style="padding:6px 0;">Room</td><td style="text-align:right;">${booking.room.name}</td></tr>
        <tr><td style="padding:6px 0;">Check-in</td><td style="text-align:right;">${formatDate(booking.checkIn)}</td></tr>
        <tr><td style="padding:6px 0;">Check-out</td><td style="text-align:right;">${formatDate(booking.checkOut)}</td></tr>
        <tr><td style="padding:6px 0;">Guests</td><td style="text-align:right;">${booking.adults} adults, ${booking.children} children</td></tr>
        <tr><td style="padding:6px 0;">Total Estimated</td><td style="text-align:right;"><strong>${formatCurrency(booking.totalAmount.toString(), booking.currency)}</strong></td></tr>
      </table>
      <p style="margin-top:16px;">If you have any questions, contact us at ${siteConfig.phoneDisplay} or ${siteConfig.email}.</p>
      <p>We look forward to welcoming you.</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM || siteConfig.email,
    to: booking.guest.email,
    subject: `Booking Confirmation — ${booking.reference}`,
    html,
  });
}

export async function sendContactNotificationEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const transporter = getTransporter();
  if (!transporter) {
    console.warn("[email] SMTP not configured — skipping contact notification email.");
    return;
  }

  await transporter.sendMail({
    from: process.env.SMTP_FROM || siteConfig.email,
    to: siteConfig.email,
    replyTo: data.email,
    subject: `New Contact Message: ${data.subject}`,
    html: `<p><strong>${data.name}</strong> (${data.email}) wrote:</p><p>${data.message}</p>`,
  });
}
