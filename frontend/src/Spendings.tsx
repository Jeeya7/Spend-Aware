import { useState } from "react";
import "./style/Spendings.css";
import AddSpending from "./AddSpending";
import { Card, CardContent, Typography, Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: Date;
  notes?: string;
  category?: string;
};

function Spendings() {
  const [showAdd, setShowAdd] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  function addExpense(expense: Expense) {
    setExpenses((prev) => [expense, ...prev]);
  }

  function deleteExpense(id: string) {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <div>
      <h1 className="spendings-title">Spendings Page</h1>

      <header className="top-bar">
        <button className="add-expense-btn" onClick={() => setShowAdd(true)}>
          + Add New Expense
        </button>
      </header>

      {showAdd && (
        <AddSpending onClose={() => setShowAdd(false)} onAdd={addExpense} />
      )}

      <Stack spacing={2} sx={{ mt: 4, maxWidth: 600 }}>
        {expenses.map((e) => (
          <Card
            key={e.id}
            sx={{
              borderRadius: 4,
              border: "1px solid rgba(236,72,153,0.25)",
              background: "linear-gradient(180deg, #FFF7FB 0%, #FFFFFF 100%)",
              boxShadow: "0 12px 30px rgba(236,72,153,0.15)",
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    color: "#9D174D",
                    fontSize: "1.05rem",
                  }}
                >
                  {e.title}
                </Typography>

                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography
                    sx={{
                      fontWeight: 800,
                      color: "#BE185D",
                    }}
                  >
                    ${e.amount}
                  </Typography>

                  <IconButton
                    size="small"
                    onClick={() => deleteExpense(e.id)}
                    sx={{
                      color: "#EC4899",
                      "&:hover": {
                        backgroundColor: "rgba(236,72,153,0.12)",
                      },
                    }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Stack>

              {e.notes && (
                <Typography
                  sx={{
                    mt: 1,
                    color: "rgba(157,23,77,0.7)",
                    fontSize: "0.9rem",
                  }}
                >
                  {e.notes}
                </Typography>
              )}

              {e.category && (
                <Typography
                  sx={{
                    mt: 1,
                    color: "rgba(157,23,77,0.7)",
                    fontSize: "0.9rem",
                  }}
                >
                  Category: {e.category}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Stack>

    </div>
  );
}

export default Spendings;
