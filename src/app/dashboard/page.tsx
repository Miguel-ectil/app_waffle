"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Button, Card, Typography } from "@mui/material";
import UserDashboard from "./user";

interface RankingEntry {
  email: string;
  streak: number;
}

export default function Dashboard() {
  const [ranking, setRanking] = useState<RankingEntry[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      const { data } = await supabase
        .from("leitores")
        .select("email, streak")
        .order("streak", { ascending: false });

      setRanking(data || []);
    };

    fetchRanking();
  }, []);

  // Função para resetar o streak de um usuário
  const resetStreak = async (email: string) => {
    await fetch("/api/reset-streak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    // Atualiza o ranking depois do reset
    setRanking((prev) =>
      prev.map((u) => (u.email === email ? { ...u, streak: 0 } : u))
    );
  };

  return (
    <div className="p-6">
      <Typography variant="h4" className="mb-6 font-bold text-gray-800 text-center">
        🏆 Ranking de Engajamento
      </Typography>

      {/* Layout Responsivo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {ranking.map((user) => (
          <Card
            key={user.email}
            className="p-6 flex flex-col items-center bg-gradient-to-br from-blue-100 to-blue-50 shadow-lg rounded-2xl transition-transform transform hover:scale-105"
          >
            <Typography variant="h6" className="text-gray-700 font-semibold text-center">
              {user.email}
            </Typography>
            <Typography variant="h5" className="text-blue-600 font-bold mt-2">
              🔥 {user.streak}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              className="mt-4 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              onClick={() => resetStreak(user.email)}
            >
              Resetar
            </Button>
          </Card>
        ))}
      </div>

      {/* Seção de Dashboard */}
      <div className="p-6 mt-10 bg-white shadow-md rounded-lg">
        <h1 className="text-2xl font-bold text-gray-800 text-center">Dashboard</h1>
        <UserDashboard email="teste@email.com" />
      </div>
    </div>
  );
}
