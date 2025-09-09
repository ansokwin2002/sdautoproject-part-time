import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export async function POST(request: Request) {
  const logFilePath = path.join(process.cwd(), 'contact-form.log');
  const log = (message: string) => {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFilePath, `${timestamp} - ${message}\n`);
  };

  log('Processing contact form submission...');
  log('--- Email Configuration ---');
  log(`EMAIL_HOST: ${process.env.EMAIL_HOST}`)
  log(`EMAIL_PORT: ${process.env.EMAIL_PORT}`)
  log(`EMAIL_SECURE: ${process.env.EMAIL_SECURE}`)
  log(`EMAIL_USER: ${process.env.EMAIL_USER}`)
  log(`EMAIL_PASS is set: ${!!process.env.EMAIL_PASS}`)
  log('--------------------------');

  try {

    const { 
      companyName, 
      name, 
      email, 
      phone, 
      vin, 
      vehicleMakeModel, 
      vehicleYear, 
      engineCapacity, 
      partsRequired 
    } = await request.json();

    const logoUrl = "https://sdauto.com.au/assets/logo.png";

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const adminMailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background-color: #ffffff; color: #333333; padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
          <img src="${logoUrl}" alt="SD Auto Part Logo" style="max-width: 150px; margin-bottom: 10px;"/>
          <h1 style="margin: 0;">New Auto Parts Inquiry</h1>
        </div>
        <div style="padding: 30px;">
          <div style="background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; padding: 20px; margin-top: 20px;">
            <h2 style="color: #0d47a1;">Inquiry Details</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; font-weight: bold;">Company:</td><td style="padding: 10px 0;">${companyName || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; font-weight: bold;">Contact Name:</td><td style="padding: 10px 0;">${name}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; font-weight: bold;">Email:</td><td style="padding: 10px 0;"><a href="mailto:${email}">${email}</a></td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; font-weight: bold;">Phone:</td><td style="padding: 10px 0;">${phone || 'N/A'}</td></tr>
            </table>
            <h2 style="color: #0d47a1; margin-top: 30px;">Vehicle Information</h2>
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; font-weight: bold;">VIN:</td><td style="padding: 10px 0;">${vin || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; font-weight: bold;">Make/Model:</td><td style="padding: 10px 0;">${vehicleMakeModel || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; font-weight: bold;">Year:</td><td style="padding: 10px 0;">${vehicleYear || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #eee;"><td style="padding: 10px 0; font-weight: bold;">Engine:</td><td style="padding: 10px 0;">${engineCapacity || 'N/A'}</td></tr>
            </table>
            <h2 style="color: #0d47a1; margin-top: 30px;">Parts Required</h2>
              <p style="margin: 0;">${partsRequired}</p>
          </div>
        </div>
        <div style="background-color: #f4f4f4; color: #777; padding: 15px; text-align: center; font-size: 12px;">
          <p>This email was sent from the contact form on your website.</p>
        </div>
      </div>
    </div>
    `;

    const customerMailHtml = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f4f4; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #fff; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden;">
        <div style="background-color: #ffffff; color: #333333; padding: 20px; text-align: center; border-bottom: 1px solid #eee;">
          <img src="${logoUrl}" alt="SD Auto Part Logo" style="max-width: 150px; margin-bottom: 10px;"/>
          <h1 style="margin: 0;">Thank You For Your Inquiry!</h1>
        </div>
        <div style="padding: 30px;">
          <p>Hi ${name},</p>
          <p>We have successfully received your request and our team is looking into it. Here is a complete copy of the information you submitted:</p>
          <div style="background-color: #f9f9f9; border: 1px solid #eee; border-radius: 5px; padding: 20px; margin-top: 20px;">
            <h3 style="color: #0d47a1; margin-top: 0;">Your Details:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px 0; font-weight: bold;">Company:</td><td style="padding: 8px 0;">${companyName || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td style="padding: 8px 0;">${phone || 'N/A'}</td></tr>
            </table>
            <h3 style="color: #0d47a1; margin-top: 20px;">Vehicle Information:</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px 0; font-weight: bold;">VIN:</td><td style="padding: 8px 0;">${vin || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px 0; font-weight: bold;">Make/Model:</td><td style="padding: 8px 0;">${vehicleMakeModel || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px 0; font-weight: bold;">Year:</td><td style="padding: 8px 0;">${vehicleYear || 'N/A'}</td></tr>
              <tr style="border-bottom: 1px solid #ddd;"><td style="padding: 8px 0; font-weight: bold;">Engine:</td><td style="padding: 8px 0;">${engineCapacity || 'N/A'}</td></tr>
            </table>
            <h3 style="color: #0d47a1; margin-top: 20px;">Parts Required:</h3>
            <p style="margin: 5px 0;">${partsRequired}</p>
          </div>
          <p style="margin-top: 30px;">We will get back to you with a quote as soon as possible. If you have any questions, please reply directly to this email.</p>
        </div>
        <div style="background-color: #f4f4f4; color: #777; padding: 15px; text-align: center; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} SD Auto Part. All rights reserved.</p>
          <p>87 Kookaburra Avenue, Werribee, Victoria 3030, Australia</p>
        </div>
      </div>
    </div>
    `;

    const adminMailOptions = {
      from: `"SD Auto Part" <${process.env.EMAIL_USER}>`,
      to: 'ansokwin@gmail.com',
      subject: `New Auto Parts Inquiry from ${name}`,
      replyTo: email,
      html: adminMailHtml,
    };

    const customerMailOptions = {
      from: `"SD Auto Part" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your Auto Parts Inquiry with SD Auto Part',
      html: customerMailHtml,
    };

    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json({ message: 'Emails sent successfully!' }, { status: 200 });
  } catch (error: any) {
    log('!!! FAILED TO SEND EMAIL !!!');
    log(`Error Message: ${error.message}`);
    log(`Error Stack: ${error.stack}`);
    log(`Error Response: ${error.response}`);
    console.error('Error sending email:', {
      message: error.message,
      stack: error.stack,
      response: error.response,
    });
    return NextResponse.json({ message: 'Failed to send email.' }, { status: 500 });
  }
}
