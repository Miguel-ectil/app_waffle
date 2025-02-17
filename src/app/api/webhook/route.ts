import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const id = searchParams.get("id");

  if (!email || !id) {
    return NextResponse.json({ message: "Faltando parâmetros" }, { status: 400 });
  }

  // Salvar no Supabase
  const { error } = await supabase.from("leitores").insert([
    { email, post_id: id, created_at: new Date() },
  ]);

  if (error) {
    return NextResponse.json({ message: "Erro ao salvar no banco", error }, { status: 500 });
  }

  return NextResponse.json({ message: "Abertura registrada com sucesso!" }, { status: 200 });
}
