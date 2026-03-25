import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService implements OnModuleInit {
  private readonly logger = new Logger(MailService.name);
  private transporter!: nodemailer.Transporter;

  async onModuleInit() {
    if (process.env.MAIL_USER && process.env.MAIL_PASS) {
      // Production: use configured SMTP
      this.transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.MAIL_PORT) || 587,
        secure: false,
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASS,
        },
      });
      this.logger.log(`Mail configured via ${process.env.MAIL_HOST || 'smtp.gmail.com'}`);
    } else {
      // Development fallback: auto-create a free Ethereal test account
      const testAccount = await nodemailer.createTestAccount();
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: { user: testAccount.user, pass: testAccount.pass },
      });
      this.logger.warn(
        'No MAIL_USER/MAIL_PASS found — using Ethereal test account. ' +
          `Preview emails at https://ethereal.email (login: ${testAccount.user} / ${testAccount.pass})`,
      );
    }
  }

  async sendAttendanceVerification(
    to: string,
    participantName: string,
    projectName: string,
    token: string,
  ): Promise<void> {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const verifyUrl = `${backendUrl}/registrations/verify/${token}`;

    const html = `<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0f4f8;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#1a237e,#3949ab);padding:36px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🎓</div>
      <h1 style="color:#ffffff;margin:0;font-size:22px;font-weight:700;">ระบบจัดการการฝึกอบรม</h1>
      <p style="color:#c5cae9;margin:6px 0 0;font-size:14px;">TMIS · Burapha University Computing Center</p>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#1a237e;margin-top:0;font-size:20px;">ยืนยันการลงทะเบียนอบรม</h2>
      <p style="color:#333;line-height:1.7;">เรียน <strong>${participantName}</strong></p>
      <p style="color:#333;line-height:1.7;">
        ท่านได้ลงทะเบียนเข้าร่วมการอบรม<br>
        <strong style="color:#1a237e;font-size:16px;">${projectName}</strong><br>
        เรียบร้อยแล้ว
      </p>
      <p style="color:#333;line-height:1.7;">
        กรุณาคลิกปุ่มด้านล่างเพื่อ<strong>ยืนยันการเข้าร่วมอบรม</strong>
      </p>
      <div style="text-align:center;margin:36px 0;">
        <a href="${verifyUrl}"
           style="display:inline-block;background:#1a237e;color:#ffffff;padding:16px 40px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:700;">
          ✓ &nbsp;ยืนยันการเข้าร่วมอบรม
        </a>
      </div>
      <div style="background:#fff8e1;border-left:4px solid #ffc107;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px;">
        <p style="margin:0;color:#795548;font-size:14px;">⏳ ลิงก์นี้จะหมดอายุภายใน <strong>7 วัน</strong></p>
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="color:#aaa;font-size:12px;margin:0;line-height:1.6;">
        หากท่านไม่ได้ทำการลงทะเบียน กรุณาเพิกเฉยต่ออีเมลนี้<br>
        หรือติดต่อศูนย์คอมพิวเตอร์มหาวิทยาลัยบูรพา (BUCC)
      </p>
    </div>
  </div>
</body>
</html>`;

    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"TMIS - BUCC" <noreply@bucc.buu.ac.th>',
        to,
        subject: `[TMIS] ยืนยันการลงทะเบียนอบรม - ${projectName}`,
        html,
      });
      this.logger.log(`Email sent to ${to}`);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) this.logger.log(`Preview email at: ${previewUrl}`);
    } catch (err) {
      this.logger.error(`Failed to send email to ${to}: ${err}`);
    }
  }

  // ─── Waiting List Confirmation ────────────────────────────────────────────────

  async sendWaitingListConfirmation(
    to: string,
    participantName: string,
    projectName: string,
    queuePosition: number,
  ): Promise<void> {
    const html = `<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0f4f8;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#e65100,#f57c00);padding:36px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">⏳</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">ระบบจัดการการฝึกอบรม</h1>
      <p style="color:#ffe0b2;margin:6px 0 0;font-size:14px;">TMIS · Burapha University Computing Center</p>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#e65100;margin-top:0;font-size:20px;">บันทึกชื่อในคิวสำรองสำเร็จ</h2>
      <p style="color:#333;line-height:1.7;">เรียน <strong>${participantName}</strong></p>
      <p style="color:#333;line-height:1.7;">
        ท่านได้รับการบันทึกชื่อในคิวสำรองสำหรับการอบรม<br>
        <strong style="color:#e65100;font-size:16px;">${projectName}</strong>
      </p>
      <div style="background:#fff3e0;border-left:4px solid #f57c00;padding:16px 20px;border-radius:0 8px 8px 0;margin:24px 0;">
        <p style="margin:0;color:#bf360c;font-size:15px;">
          🎫 ลำดับคิวสำรองของท่าน: <strong>อันดับที่ ${queuePosition}</strong>
        </p>
        <p style="margin:8px 0 0;color:#bf360c;font-size:14px;">
          หากมีผู้ยกเลิกสิทธิ์ ระบบจะส่งอีเมลยืนยันให้ท่านโดยอัตโนมัติ
        </p>
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="color:#aaa;font-size:12px;margin:0;">
        หากต้องการยกเลิกการจองคิว กรุณาเข้าสู่ระบบ TMIS และยกเลิกในหน้า "ประวัติการอบรม"
      </p>
    </div>
  </div>
</body>
</html>`;

    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"TMIS - BUCC" <noreply@bucc.buu.ac.th>',
        to,
        subject: `[TMIS] บันทึกชื่อในคิวสำรองสำเร็จ - ${projectName}`,
        html,
      });
      this.logger.log(`Waiting list email sent to ${to}`);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) this.logger.log(`Preview email at: ${previewUrl}`);
    } catch (err) {
      this.logger.error(`Failed to send waiting list email to ${to}: ${err}`);
    }
  }

  // ─── Waiting List Promotion ───────────────────────────────────────────────────

  async sendWaitingListPromotion(
    to: string,
    participantName: string,
    projectName: string,
    token: string,
  ): Promise<void> {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3000';
    const verifyUrl = `${backendUrl}/registrations/verify/${token}`;

    const html = `<!DOCTYPE html>
<html lang="th">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:20px;background:#f0f4f8;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
    <div style="background:linear-gradient(135deg,#1b5e20,#2e7d32);padding:36px 32px;text-align:center;">
      <div style="font-size:48px;margin-bottom:12px;">🎉</div>
      <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">ระบบจัดการการฝึกอบรม</h1>
      <p style="color:#c8e6c9;margin:6px 0 0;font-size:14px;">TMIS · Burapha University Computing Center</p>
    </div>
    <div style="padding:36px 32px;">
      <h2 style="color:#1b5e20;margin-top:0;font-size:20px;">🎊 ได้รับสิทธิ์เข้าร่วมอบรมแล้ว!</h2>
      <p style="color:#333;line-height:1.7;">เรียน <strong>${participantName}</strong></p>
      <p style="color:#333;line-height:1.7;">
        มีที่นั่งว่างในการอบรม<br>
        <strong style="color:#1b5e20;font-size:16px;">${projectName}</strong><br>
        ท่านได้รับการเลื่อนขึ้นจากคิวสำรองเป็น<strong>ผู้เข้าร่วมอบรมแล้ว</strong>
      </p>
      <p style="color:#333;line-height:1.7;">
        กรุณาคลิกปุ่มด้านล่างเพื่อ<strong>ยืนยันการเข้าร่วมอบรม</strong>
      </p>
      <div style="text-align:center;margin:36px 0;">
        <a href="${verifyUrl}"
           style="display:inline-block;background:#1b5e20;color:#fff;padding:16px 40px;border-radius:10px;text-decoration:none;font-size:16px;font-weight:700;">
          ✓ &nbsp;ยืนยันการเข้าร่วมอบรม
        </a>
      </div>
      <div style="background:#e8f5e9;border-left:4px solid #4caf50;padding:14px 18px;border-radius:0 8px 8px 0;margin-bottom:24px;">
        <p style="margin:0;color:#1b5e20;font-size:14px;">⏳ ลิงก์นี้จะหมดอายุภายใน <strong>7 วัน</strong></p>
      </div>
      <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
      <p style="color:#aaa;font-size:12px;margin:0;">
        หากท่านไม่ต้องการเข้าร่วม กรุณายกเลิกในระบบ TMIS เพื่อเปิดโอกาสให้ผู้อื่น
      </p>
    </div>
  </div>
</body>
</html>`;

    try {
      const info = await this.transporter.sendMail({
        from: process.env.MAIL_FROM || '"TMIS - BUCC" <noreply@bucc.buu.ac.th>',
        to,
        subject: `[TMIS] 🎉 ได้รับสิทธิ์เข้าร่วมอบรม - ${projectName}`,
        html,
      });
      this.logger.log(`Promotion email sent to ${to}`);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) this.logger.log(`Preview email at: ${previewUrl}`);
    } catch (err) {
      this.logger.error(`Failed to send promotion email to ${to}: ${err}`);
    }
  }
}
