"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { TextField, Button, Typography, Card } from "@mui/material";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <Card className="p-6 max-w-md mx-auto mt-10 text-center shadow-lg">
      <Typography variant="h5">🔐 Login</Typography>
      <TextField fullWidth label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-4" />
      <TextField
        fullWidth
        label="Senha"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mt-4"
      />
      {error && <Typography color="error" className="mt-2">{error}</Typography>}
      <Button variant="contained" color="primary" fullWidth onClick={handleLogin} className="mt-4">
        Entrar
      </Button>
    </Card>
  );
}
