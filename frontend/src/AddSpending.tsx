import { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  Stack,
} from "@mui/material";
import type { Expense } from "./Spendings";

type Props = {
  onClose: () => void;
  onAdd: (expense: Expense) => void;
};

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 420,
  bgcolor: "#FFF7FB", 
  borderRadius: 5,    
  p: 4,

  boxShadow: `
    0 20px 40px rgba(236,72,153,0.15),
    0 8px 20px rgba(17,24,39,0.12)
  `,

  border: "1px solid rgba(236,72,153,0.25)",
};



export default function AddSpending({ onClose, onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const num = Number(amount);
    if (!title.trim() || !Number.isFinite(num) || num <= 0) return;

    onAdd({
      id: crypto.randomUUID(),
      title: title.trim(),
      amount: num,
      date: new Date(),
      notes: notes.trim() || undefined,
    });

    onClose();
  }

  return (
    <Modal open onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" sx={{
                                        fontWeight: 300,
                                        color: "#BE185D",
                                        mb: 1,
                                    }}>
            Add Expense
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              
            />

            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />

            <TextField
              label="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={2}
            />

            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Add
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}
