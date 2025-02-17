import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Método POST para o webhook
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Faltando o parâmetro 'email'" }, { status: 400 });
    }

    // Salvar no Supabase
    const { error } = await supabase.from("leitores").insert([{ email, created_at: new Date() }]);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "Webhook recebido e salvo com sucesso!" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Erro ao salvar no banco", error }, { status: 500 });
  }
}
