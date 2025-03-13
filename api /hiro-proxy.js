// api/hiro-proxy.js
export default async function handler(req, res) {
    const { endpoint } = req.query;
    const HIRO_API_KEY = process.env.HIRO_API_KEY; // Asegúrate de definirla en Vercel

    if (!endpoint) {
        return res.status(400).json({ error: "Falta el endpoint en la solicitud" });
    }

    try {
        const response = await fetch(`https://api.hiro.so/${endpoint}`, {
            headers: { "x-api-key": HIRO_API_KEY }
        });

        if (!response.ok) {
            throw new Error("Error en la API de Hiro");
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
