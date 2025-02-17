import { useEffect, useState } from "react";
import { Button, Typography } from "@mui/material";

export default function UserDashboard({ email }: { email: string }) {
  const [streak] = useState(0);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const updateStreak = async () => {
      const res = await fetch("/api/update-streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
      }
    };

    updateStreak();
  }, [email]);

  return (
    <div className="p-4">
      <Typography variant="h5">🔥 Seu Streak: {streak} dias</Typography>
      <Typography variant="body1" className="mt-2">{message}</Typography>
      <Button variant="contained" color="primary" onClick={() => window.location.reload()}>
        Atualizar
      </Button>
    </div>
  );
}
