"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, Typography } from "@mui/material";

export default function Home() {
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error) setUser(data?.user);

      // Buscar streak no banco (exemplo)
      const { data: streakData } = await supabase
        .from("leitores")
        .select("streak")
        .eq("email", data?.user?.email)
        .single();
      
      if (streakData) setStreak(streakData.streak);
    };

    fetchUser();
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <Card className="w-96 shadow-lg">
        <CardContent className="text-center">
          <Typography variant="h6">Bem-vindo, {user?.email}</Typography>
          <Typography variant="h4" className="mt-4">🔥 Streak: {streak} dias</Typography>
          <Typography className="mt-2 text-gray-500">
            Continue acessando a newsletter para aumentar sua sequência!
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}
