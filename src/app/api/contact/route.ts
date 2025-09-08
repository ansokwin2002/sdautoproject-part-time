import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
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

    // Create a transporter using your SMTP details
    // IMPORTANT: Use environment variables for these credentials in a real application
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 1. Email to Admin
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: 'ansokwin@gmail.com', // Admin's email address
      subject: `New Auto Parts Inquiry from ${name}`,
      html: `
        <h1>New Auto Parts Inquiry</h1>
        <p>You have received a new message from your website contact form.</p>
        <h2>Contact Details:</h2>
        <ul>
          <li><strong>Company:</strong> ${companyName || 'Not provided'}</li>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
        </ul>
        <h2>Vehicle Information:</h2>
        <ul>
          <li><strong>VIN:</strong> ${vin || 'Not provided'}</li>
          <li><strong>Make/Model:</strong> ${vehicleMakeModel || 'Not provided'}</li>
          <li><strong>Year:</strong> ${vehicleYear || 'Not provided'}</li>
          <li><strong>Engine:</strong> ${engineCapacity || 'Not provided'}</li>
        </ul>
        <h2>Parts Required:</h2>
        <p>${partsRequired}</p>
      `,
    };

    // 2. Confirmation Email to Customer
    const customerMailOptions = {
      from: process.env.EMAIL_USER,
      to: email, // Customer's email address
      subject: 'Thank you for your inquiry!',
      html: `
        <h1>Thank You for Your Inquiry</h1>
        <p>Hi ${name},</p>
        <p>We have received your request for auto parts and will get back to you shortly. Here is a summary of your inquiry:</p>
        <h2>Your Vehicle Information:</h2>
        <ul>
          <li><strong>Make/Model:</strong> ${vehicleMakeModel || 'Not provided'}</li>
          <li><strong>Year:</strong> ${vehicleYear || 'Not provided'}</li>
        </ul>
        <h2>Parts You Requested:</h2>
        <p>${partsRequired}</p>
        <p>If you have any other questions, please reply to this email.</p>
        <p>Best regards,<br/>The SD Auto Part Team</p>
      `,
    };

    // Send both emails
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(customerMailOptions);

    return NextResponse.json({ message: 'Emails sent successfully!' }, { status: 200 });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ message: 'Failed to send email.' }, { status: 500 });
  }
}
