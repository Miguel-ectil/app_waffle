import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase
    .from("leitores")
    .select("email, streak");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Retorna os leitores ordenados pelo streak
  return NextResponse.json(data);
}
