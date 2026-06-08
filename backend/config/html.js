export const getOtpHtml = ({ email, otp }) => {
    const appName = process.env.APP_NAME || "Authentication App";
    const html = `<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${appName} Verification Code</title>
    </head>
    
    <body>
    <table
        role="presentation"
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="background:#f6f7fb;"
    >
    <tr>
    <td align="center" style="padding:24px;">

    <table
        role="presentation"
        border="0"
        cellspacing="0"
        cellpadding="0"
        width="600"
        style="
            width:600px;
            max-width:600px;
            background:#ffffff;
            border:1px solid #e9ecf3;
            border-radius:12px;
        "
    >
    <tr>
    <td
        style="
            background:#111827;
            padding:18px 24px;
            text-align:center;
        "
    >
    <span
        style="
            color:#ffffff;
            font-weight:700;
            font-size:16px;
            letter-spacing:0.3px;
            font-family:Arial, Helvetica, sans-serif;
        "
    >
    Authentication App
    </span>
    </td>
    </tr>


        <!-- Body -->
<tr>
    <td style="padding:32px;">
        <h1 style="
            margin:0 0 12px 0;
            font-size:22px;
            line-height:1.3;
            color:#111111;
            font-weight:700;
        ">
            Verify your Account
        </h1>

        <p style="
            margin:0 0 16px 0;
            font-size:15px;
            line-height:1.6;
            color:#444444;
        ">
            Use the verification code below to complete your account registration.
        </p>

        <table
            role="presentation"
            border="0"
            align="center"
            cellspacing="0"
            cellpadding="0"
            width="100%"
            style="margin:20px 0;"        >
            <tr>
                <td align="center">
                    <span style="
                        display:inline-block;
                        background:#f3f4f6;
                        border:1px solid #e5e7eb;
                        border-radius:10px;
                        padding:14px 20px;
                        font-size:32px;
                        font-weight:700;
                        letter-spacing:10px;
                        color:#111111;
                    ">
                        ${otp}
                    </span>
                </td>
            </tr>
        </table>

        <p style="
            color:#555555;
            font-size:14px;
            line-height:1.6;
            margin:0 0 12px 0;
        ">
            This code will expire in <strong>5 minutes</strong>.
        </p>

        <p style="
            color:#555555;
            font-size:14px;
            line-height:1.6;
            margin:0;
        ">
            If this wasn't initiated, this email can be safely ignored.
        </p>
    </td>
</tr>
        <!-- Footer -->
        <tr>
        <td
        style="
            text-align:center;
            color:#6b7280;
            font-size:12px;
            line-height:1.6;
            padding:16px 24px 0 24px;
            font-family:Arial, Helvetica, sans-serif;
        "
    >
        © ${new Date().getFullYear()} Authentication App
        </td>
        </tr>
        <tr>
        <td height="16" aria-hidden="true"></td>
        </tr>
        </table>
        </td>
        </tr>
        </table>
    </body>
    </html>
    `;
    return html;
};

export const getVerifyEmailHtml = ({ email, token }) => {
    const appName = process.env.APP_NAME || "Authentication App";
    const baseUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const verifyUrl = `${baseUrl.replace(/\/+$/, "")}/token/${encodeURIComponent(token)}`;
    
    const html = `<!DOCTYPE html>
<html lang="en">
    <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>${appName} Verify Your Account</title>
    </head>

    <body style="margin:0;padding:0;background:#f6f7fb;font-family:Arial,Helvetica,sans-serif;">

    <table
        role="presentation"
        width="100%"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="background:#f6f7fb;"
    >
    <tr>
    <td align="center" style="padding:24px;">

    <table
        role="presentation"
        width="600"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="
            width:600px;
            max-width:600px;
            background:#ffffff;
            border:1px solid #e9ecf3;
            border-radius:12px;
        "
    >

    <!-- Header -->
    <tr>
    <td
        style="
            background:#111827;
            padding:18px 24px;
            text-align:center;
        "
    >
    <span
        style="
            color:#ffffff;
            font-size:16px;
            font-weight:700;
            letter-spacing:0.3px;
        "
    >
    ${appName}
    </span>
    </td>
    </tr>

    <!-- Content -->
    <tr>
    <td style="padding:32px;">

    <h1
        style="
            margin:0 0 12px;
            font-size:22px;
            line-height:1.3;
            color:#111111;
            font-weight:700;
        "
    >
    Verify your Account
    </h1>

    <p
        style="
            margin:0 0 16px;
            font-size:15px;
            line-height:1.6;
            color:#444444;
        "
    >
    Thanks for registering with ${appName}. Click the button below to verify your account.
    </p>

    <table
        role="presentation"
        border="0"
        cellspacing="0"
        cellpadding="0"
        style="margin:20px 0;"
    >
    <tr>
    <td align="center">

    <a
        href="${verifyUrl}"
        target="_blank"
        rel="noopener"
        style="
            background:#111827;
            color:#ffffff;
            text-decoration:none;
            padding:12px 20px;
            border-radius:8px;
            font-size:14px;
            font-weight:600;
            display:inline-block;
        "
    >
    Verify Account
    </a>

    </td>
    </tr>
    </table>

    <p
        style="
            color:#555555;
            font-size:14px;
            line-height:1.6;
            margin:0 0 12px;
        "
    >
    If the button doesn't work, copy and paste this link into your browser:
    </p>

    <p
        style="
            color:#555555;
            font-size:14px;
            line-height:1.6;
            word-break:break-all;
            margin:0 0 12px;
        "
    >
    <a
        href="${verifyUrl}"
        target="_blank"
        rel="noopener"
        style="
            color:#111827;
            text-decoration:underline;
        "
    >
    ${verifyUrl}
    </a>
    </p>

    <p
        style="
            color:#555555;
            font-size:14px;
            line-height:1.6;
            margin:0;
        "
    >
    If this wasn't you, you can safely ignore this email.
    </p>

    </td>
    </tr>

    <!-- Footer -->
    <tr>
    <td
        style="
            text-align:center;
            color:#6b7280;
            font-size:12px;
            line-height:1.6;
            padding:20px 24px;
            border-top:1px solid #e9ecf3;
        "
    >
    © ${new Date().getFullYear()} ${appName}. All rights reserved.
    </td>
    </tr>

    </table>

    </td>
    </tr>
    </table>

    </body>
</html>`;
return html;
};