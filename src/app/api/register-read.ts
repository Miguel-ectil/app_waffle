import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Método não permitido" });
    }

    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email é obrigatório" });
    }

    const { error } = await supabase.from("historico_leituras").insert([{ email }]);

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ message: "Abertura registrada com sucesso" });
}
