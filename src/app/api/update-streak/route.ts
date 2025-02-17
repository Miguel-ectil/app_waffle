import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email é obrigatório" }, { status: 400 });
    }

    // Obtém o streak atual
    const { data, error } = await supabase
      .from("leitores")
      .select("streak, last_opened")
      .eq("email", email)
      .single();

    if (error) {
      return NextResponse.json({ error: "Erro ao buscar usuário" }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    // Obtendo a data de hoje considerando o fuso horário correto
    const today = new Date().toISOString().split("T")[0];
    const lastOpened = data.last_opened;

    // Se já abriu hoje, não faz nada
    if (lastOpened === today) {
      return NextResponse.json({ message: "Streak já atualizado hoje" });
    }

    // Verificar se o streak deve ser resetado
    // const lastOpenedDate = new Date(lastOpened);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayString = yesterday.toISOString().split("T")[0];

    const newStreak = lastOpened === yesterdayString ? data.streak + 1 : 1;

    // Atualiza streak
    const { error: updateError } = await supabase
      .from("leitores")
      .update({ streak: newStreak, last_opened: today })
      .eq("email", email);

    if (updateError) {
      return NextResponse.json({ error: "Erro ao atualizar streak" }, { status: 500 });
    }

    return NextResponse.json({ message: "Streak atualizado com sucesso", streak: newStreak });
  } catch (error) {
    console.error(error, "Erro ao processar...");
    return NextResponse.json({ error: "Erro interno no servidor" }, { status: 500 });
  }
}
