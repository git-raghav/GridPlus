const nodemailer = require("nodemailer");

//fire email
async function sendFireAlertEmail(meterName, location) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        secure: true, // Use secure connection
        port: 465, // Port for secure connection
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: "raghavagarwal3618@gmail.com",
        subject: "🔥 Fire Detected!",
        text: `Fire detected at meter "${meterName}" located at "${location}". Please take immediate action.`,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("🚨 Fire alert email sent.");
    } catch (err) {
        console.error("❌ Error sending email:", err.message);
    }
}

//alert email
async function sendAlertEmail(meter, alertReasons) {
    const transporter = nodemailer.createTransport({
        service: "gmail", // Or another SMTP provider
        secure: true, // Use secure connection
        port: 465, // Port for secure connection
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const subject = `⚠️ Alert for Meter: ${meter.name}`;
    const text = `
Meter Name: ${meter.name}
Location: ${meter.location}

Reasons:
- ${alertReasons.join("\n- ")}

Latest Readings:
- Current: ${meter.current.at(-1)} A
- Voltage: ${meter.voltage.at(-1)} V
- Power Factor: ${meter.powerFactor.at(-1)}
- Temperature: ${meter.temperature.at(-1)} °C
- Load: ${meter.load.at(-1)} W
    `;

    const mailOptions = {
        from: "projectgroup950@gmail.com",
        to: "raghavagarwal3618@gmail.com", // Replace with actual recipient
        subject,
        text,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("🚨 Alert email sent successfully.");
    } catch (error) {
        console.error("❌ Failed to send alert email:", error);
    }
}

module.exports = {
    sendFireAlertEmail,
    sendAlertEmail,
};
