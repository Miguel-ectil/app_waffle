import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Faltando o parâmetro 'email'" });
  }

  // Salvar no Supabase
  const { error } = await supabase.from("leitores").insert([
    {
      email,
      created_at: new Date(), // Data de registro
    },
  ]);

  if (error) {
    return res.status(500).json({ message: "Erro ao salvar no banco", error });
  }

  return res.status(200).json({ message: "Webhook recebido e salvo com sucesso!" });
}
