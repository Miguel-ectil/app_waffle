import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Verifica se o email foi enviado
    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório!" }, { status: 400 });
    }

    // Busca os dados do leitor
    const { data: leitor, error } = await supabase
      .from("leitores")
      .select("id, streak, last_opened")
      .eq("email", email)
      .single();

    if (error || !leitor) {
      return NextResponse.json({ error: "Leitor não encontrado!" }, { status: 404 });
    }

    // Obtém a data de hoje e a última data registrada
    const hoje = new Date().toISOString().split("T")[0];
    const ultimaAbertura = leitor.last_opened ? leitor.last_opened.split("T")[0] : null;

    // Se já abriu hoje, não faz nada
    if (ultimaAbertura === hoje) {
      return NextResponse.json({ message: "Streak já atualizado hoje!" });
    }

    // Se abriu ontem, aumenta o streak
    let novoStreak = leitor.streak;
    if (ultimaAbertura) {
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      if (ultimaAbertura === ontem.toISOString().split("T")[0]) {
        novoStreak += 1;
      } else {
        novoStreak = 1; // Se não abriu ontem, reseta
      }
    } else {
      novoStreak = 1;
    }

    // Atualiza no banco
    const { error: updateError } = await supabase
      .from("leitores")
      .update({ streak: novoStreak, last_opened: new Date().toISOString() })
      .eq("id", leitor.id);

    if (updateError) {
      return NextResponse.json({ error: "Erro ao atualizar streak!" }, { status: 500 });
    }

    return NextResponse.json({ message: "Streak atualizado!", streak: novoStreak });
  } catch (error) {
    console.error(error, "Erro ao processar...");
    return NextResponse.json({ error: "Erro interno no servidor!" }, { status: 500 });
  }
}
