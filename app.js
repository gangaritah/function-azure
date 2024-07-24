const { EmailClient } = require("@azure/communication-email");

module.exports = async function (context, req) {
    context.log('JavaScript HTTP trigger function processed a request.');

    // Verifica si la petición es POST
    if (req.method !== 'POST') {
        context.res = {
            status: 405,
            body: "Method Not Allowed. Please use POST."
        };
        return;
    }

    // Lee el cuerpo de la petición POST
    const requestBody = req.body;

    // Verifica si el cuerpo de la petición contiene los datos necesarios
    if (!requestBody || !requestBody.to || !requestBody.subject || !requestBody.content) {
        context.res = {
            status: 400,
            body: "Bad Request. Please provide 'to', 'subject', and 'content' in the request body."
        };
        return;
    }

    // Obtén la cadena de conexión de las configuraciones de la aplicación
    const connectionString = process.env.COMMUNICATION_SERVICES_CONNECTION_STRING;
    
    // Crea el cliente de correo electrónico
    const emailClient = new EmailClient(connectionString);

    // Configura el mensaje de correo electrónico usando los datos de la petición
    const message = {
        senderAddress: `${process.env.SENDER_EMAIL}@${process.env.EMAIL_DOMAIN}.azurecomm.net`,
        content: {
            subject: requestBody.subject,
            plainText: requestBody.content,
            html: `<html><body>${requestBody.content}</body></html>`
        },
        recipients: {
            to: [
                {
                    address: requestBody.to,
                    displayName: requestBody.displayName || "Recipient"
                }
            ]
        }
    };

    try {
        // Envía el correo electrónico
        const poller = await emailClient.beginSend(message);
        const result = await poller.pollUntilDone();

        context.res = {
            status: 200,
            body: `Correo enviado. ID del mensaje: ${result.messageId}`
        };
    } catch (error) {
        context.res = {
            status: 500,
            body: `Error al enviar el correo: ${error.message}`
        };
    }
};
