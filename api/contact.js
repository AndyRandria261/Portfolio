import sendgrid from "@sendgrid/mail";

// Configuration SendGrid
if (process.env.SENDGRID_API_KEY) {
  sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  console.error("SENDGRID_API_KEY is not defined");
}

export default async function handler(req, res) {
  // Headers CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  // Vérifier la méthode
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    console.log("=== API Contact Debug ===");
    console.log("Request body:", req.body);
    console.log("Headers:", req.headers);

    // Vérifier si SENDGRID_API_KEY est définie
    if (!process.env.SENDGRID_API_KEY) {
      console.error("SENDGRID_API_KEY is missing");
      return res.status(500).json({
        success: false,
        message: "Server configuration error - API key missing",
      });
    }

    // Extraire et valider les données
    const { name, email, subject, message } = req.body;

    console.log("Extracted data:", { name, email, subject, message });

    // Validation des champs requis
    if (!name || !email || !message) {
      console.log("Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Missing required fields (name, email, message)",
      });
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log("Invalid email format:", email);
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    console.log("Starting to send email with template...");

    // Préparer les données pour le template
    const templateData = {
      name: name.trim(),
      email: email.trim(),
      subject: subject ? subject.trim() : "No subject provided",
      message: message.trim(),
    };

    console.log("Template data:", templateData);

    // Email to User (Confirmation)
    const userEmailPayload = {
      to: email.trim(),
      from: "andyrandriamanalina@gmail.com",
      templateId: "d-d44968b9f8aa4904ad3997825b69e868",
      dynamicTemplateData: {
        name: name.trim(),
        message: "Thank you for your message! We’ll get back to you soon.",
      },
      replyTo: "andyrandriamanalina@gmail.com",
    };

    // Email to Owner (Notification)
    const ownerEmailPayload = {
      to: "andyrandriamanalina@gmail.com",
      from: "andyrandriamanalina@gmail.com", // Verified sender
      subject: `New Contact Form Submission: ${subject || "No Subject"}`,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${
        subject || "N/A"
      }\nMessage: ${message}`,
    };

    // Send both emails
    await sendgrid.send(userEmailPayload);
    await sendgrid.send(ownerEmailPayload);

    res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error("SendGrid error:", error);

    // Log détaillé pour les erreurs SendGrid
    if (error.response) {
      console.error("SendGrid response status:", error.response.status);
      console.error("SendGrid response headers:", error.response.headers);
      console.error("SendGrid response body:", error.response.body);
    }

    console.error("Full error object:", JSON.stringify(error, null, 2));

    // Messages d'erreur plus spécifiques selon le type d'erreur SendGrid
    let errorMessage = "Failed to send email";
    let statusCode = 500;

    if (error.code === 400 && error.response?.body?.errors) {
      // Erreur de validation SendGrid
      const sgError = error.response.body.errors[0];
      errorMessage = `SendGrid validation error: ${sgError.message}`;
      statusCode = 400;
      console.error("SendGrid validation error details:", sgError);
    } else if (error.code === 401) {
      errorMessage = "Email service authentication failed - check API key";
      statusCode = 500;
    } else if (error.code === 403) {
      errorMessage = "Email service access denied - check API key permissions";
      statusCode = 500;
    } else if (error.message.includes("template")) {
      errorMessage = "Email template error - check template configuration";
      statusCode = 500;
    } else if (error.message.includes("from")) {
      errorMessage =
        "Sender email not verified - check SendGrid sender authentication";
      statusCode = 500;
    } else if (error.response?.body) {
      errorMessage = `SendGrid error: ${
        error.response.body.errors?.[0]?.message || error.message
      }`;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
