import sendgrid from "@sendgrid/mail";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, subject, message } = req.body;

  try {
    await sendgrid.send({
      to: "andyrandriamanalina@gmail.com",
      from: "andyrandriamanalina@gmail.com",
      templateId: "d-d44968b9f8aa4904ad3997825b69e86",
      dynamicTemplateData: {
        name,
        email,
        subject,
        message,
      },
      replyTo: email, //  lets you reply directly to the user
    });

    res.status(200).json({ success: true, message: "Email sent ✅" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong ❌" });
  }
}
