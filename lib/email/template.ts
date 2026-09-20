import { eventConfig } from "@/lib/config";

interface CertificateEmailProps {
  participantName: string;
  registrationId: string;
  ticketUrl: string;
}

export function generateCertificateEmailHtml({
  participantName,
  registrationId,
  ticketUrl,
}: CertificateEmailProps): string {
  const name = participantName || "Yuva Delegate";

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Participation Certificate & Event Feedback - Yuva Shakti Sangam</title>
</head>
<body style="margin: 0; padding: 0; background-color: #EAE0D0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1C1917;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #EAE0D0; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" style="max-width: 600px; background-color: #FAF4EC; border: 2px solid #292524; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.08);" cellspacing="0" cellpadding="0">
          
          <!-- Bhagwa Header Banner -->
          <tr>
            <td style="background-color: #1C1917; padding: 28px 24px; text-align: center; border-bottom: 3px solid #E65100;">
              <p style="margin: 0 0 6px 0; font-size: 11px; font-weight: 800; color: #FFA000; letter-spacing: 2px; text-transform: uppercase;">
                युवा शक्ति • राष्ट्र शक्ति
              </p>
              <h1 style="margin: 0; font-size: 26px; font-weight: 900; color: #FAF4EC; letter-spacing: 1px; text-transform: uppercase;">
                YUVA <span style="color: #F05A12;">SHAKTI</span> SANGAM
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; color: rgba(250,244,236,0.75); font-family: monospace;">
                06 September 2026 • Ahmedabad
              </p>
            </td>
          </tr>

          <!-- Congratulatory Badge -->
          <tr>
            <td style="padding: 24px 24px 12px 24px; text-align: center;">
              <div style="display: inline-block; background-color: #FEF3C7; border: 1px solid #F59E0B; border-radius: 9999px; padding: 6px 16px; font-size: 12px; font-weight: 800; color: #B45309; text-transform: uppercase; letter-spacing: 1px;">
                ★ Official Participation Certificate Issued
              </div>
              <h2 style="margin: 18px 0 8px 0; font-size: 22px; font-weight: 800; color: #1C1917;">
                Namaste ${name}!
              </h2>
              <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #5A4839;">
                Thank you for participating in <strong>Yuva Shakti Sangam</strong>! Your presence made this gathering vibrant, inspiring, and purposeful.
              </p>
            </td>
          </tr>

          <!-- Delegate ID Badge -->
          <tr>
            <td style="padding: 0 24px 16px 24px; text-align: center;">
              <div style="background-color: #F5EBE1; border: 1px dashed #E65100; border-radius: 12px; padding: 12px 20px; display: inline-block;">
                <span style="font-size: 11px; font-weight: 700; color: #5A4839; text-transform: uppercase; letter-spacing: 1px; display: block;">
                  YOUR REGISTRATION ID
                </span>
                <span style="font-size: 18px; font-weight: 900; font-family: monospace; color: #E65100;">
                  ${registrationId}
                </span>
              </div>
            </td>
          </tr>

          <!-- Two Main Steps Cards -->
          <tr>
            <td style="padding: 0 24px 20px 24px;">
              
              <!-- Step 1: Download Certificate -->
              <table role="presentation" width="100%" style="background-color: #FFFFFF; border: 1px solid rgba(41,37,36,0.15); border-radius: 14px; margin-bottom: 12px; padding: 16px;" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="40" valign="top" style="font-size: 22px; line-height: 1;">
                    📜
                  </td>
                  <td style="padding-left: 12px;">
                    <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 800; color: #1C1917;">
                      1. Download Your Official E-Certificate
                    </h3>
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #5A4839;">
                      Scan the QR code printed on your physical ID card, or click the direct button below to generate your 300 DPI high-resolution PDF certificate with your customized name.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Step 2: Rate & Share Feedback -->
              <table role="presentation" width="100%" style="background-color: #FFFFFF; border: 1px solid rgba(41,37,36,0.15); border-radius: 14px; padding: 16px;" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="40" valign="top" style="font-size: 22px; line-height: 1;">
                    ⭐
                  </td>
                  <td style="padding-left: 12px;">
                    <h3 style="margin: 0 0 4px 0; font-size: 15px; font-weight: 800; color: #1C1917;">
                      2. Rate the Event &amp; Share Feedback
                    </h3>
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #5A4839;">
                      Directly below your certificate, rate the event out of 5 stars and share your feedback, favourite sessions, or suggestions for the organizers.
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Primary CTA Button -->
          <tr>
            <td style="padding: 8px 24px 28px 24px; text-align: center;">
              <a href="${ticketUrl}?cert=1" target="_blank" style="display: inline-block; background: linear-gradient(135deg, #FF6F00 0%, #E65100 100%); color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; padding: 16px 32px; border-radius: 14px; box-shadow: 0 6px 20px rgba(230,81,0,0.35);">
                Access Certificate &amp; Give Feedback →
              </a>
              <p style="margin: 12px 0 0 0; font-size: 11px; color: #8C7867;">
                (You can also simply scan the QR code on your physical ID card with your phone camera)
              </p>
            </td>
          </tr>

          <!-- Notice Strip -->
          <tr>
            <td style="background-color: #F5EBE1; border-top: 1px solid rgba(41,37,36,0.1); padding: 16px 24px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #5A4839; line-height: 1.5;">
                Need assistance? Feel free to reach out to the volunteer coordination team at 
                <a href="mailto:${eventConfig.email}" style="color: #E65100; font-weight: 700; text-decoration: none;">${eventConfig.email}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #1C1917; padding: 20px 24px; text-align: center; color: rgba(250,244,236,0.6); font-size: 11px;">
              <p style="margin: 0 0 4px 0; color: #FFA000; font-weight: 700;">
                Yuva Shakti Sangam 2026
              </p>
              <p style="margin: 0;">
                Shree Saurashtra Patel Samaj, Maninagar, Ahmedabad • Bharat Mata Ki Jai
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}
