import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const { data: user } = await supabase
      .from("leitores")
      .select("streak")
      .eq("email", email)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    const { data: badge } = await supabase
      .from("badges")
      .select("nome")
      .lte("streak_min", user.streak)
      .order("streak_min", { ascending: false })
      .limit(1)
      .single();

    return NextResponse.json({ streak: user.streak, badge: badge?.nome || "Sem Badge" });
  } catch (error) {
    console.error(error, "Erro ao processar...");
    return NextResponse.json({ error: "Erro interno no servidor!" }, { status: 500 });
  }
}
