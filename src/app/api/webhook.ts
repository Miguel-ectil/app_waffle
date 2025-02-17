import { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Método não permitido" });
  }

  const { email, id } = req.query;

  if (!email || !id) {
    return res.status(400).json({ message: "Faltando parâmetros" });
  }

  // Salvar no Supabase
  const { error } = await supabase.from("leitores").insert([
    {
      email,
      post_id: id,
      opened_at: new Date(), // Registra a data/hora da abertura
    },
  ]);

  if (error) {
    return res.status(500).json({ message: "Erro ao salvar no banco", error });
  }

  return res.status(200).json({ message: "Abertura registrada com sucesso!" });
}
