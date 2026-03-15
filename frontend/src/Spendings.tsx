import { useEffect, useState } from "react";
import "./style/Spendings.css";
import AddSpending from "./AddSpending";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import {
  Card,
  CardContent,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  type SelectChangeEvent,
} from "@mui/material";

export type Expense = {
  id: string;
  title: string;
  amount: number;
  date: Date;
  notes?: string;
  category?: string;
};

type FilterOption = {
  label: string;
  value: string;
};

type ColorsResponse = {
  colors: Record<string, string>;
};

const seedExpenses: Expense[] = [
  {
    id: "1",
    title: "Starbucks Coffee",
    amount: 6.75,
    date: new Date("2026-03-10"),
    notes: "Morning coffee",
    category: "Food",
  },
  {
    id: "2",
    title: "Safeway Groceries",
    amount: 42.3,
    date: new Date("2026-03-09"),
    notes: "Weekly groceries",
    category: "Groceries",
  },
  {
    id: "3",
    title: "Chipotle Lunch",
    amount: 12.5,
    date: new Date("2026-03-08"),
    notes: "Lunch after class",
    category: "Food",
  },
  {
    id: "4",
    title: "Uber Ride",
    amount: 18.2,
    date: new Date("2026-03-07"),
    notes: "Ride to downtown",
    category: "Transport",
  },
  {
    id: "5",
    title: "Netflix Subscription",
    amount: 15.99,
    date: new Date("2026-03-06"),
    notes: "Monthly subscription",
    category: "Entertainment",
  },
  {
    id: "6",
    title: "Trader Joe's",
    amount: 27.45,
    date: new Date("2026-03-05"),
    notes: "Snacks and fruit",
    category: "Groceries",
  },
];

function Spendings() {
  const [showAdd, setShowAdd] = useState(false);
  const [expenses, setExpenses] = useState<Expense[]>(seedExpenses);
  const [displayedExpenses, setDisplayedExpenses] =
    useState<Expense[]>(seedExpenses);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(
    null
  );
  const [categoryDraft, setCategoryDraft] = useState("");
  const [colorDraft, setColorDraft] = useState("#EC4899");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error"
  >("success");

  const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [filterLoading, setFilterLoading] = useState(false);

  const [categoryColors, setCategoryColors] = useState<Record<string, string>>(
    {}
  );
  const [colorLoading, setColorLoading] = useState(false);

  const [chartUrl, setChartUrl] = useState<string | null>(null);
  const [chartLoading, setChartLoading] = useState(false);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    if (!selectedFilter) {
      setDisplayedExpenses(expenses);
      return;
    }

    applyFilter(selectedFilter, expenses);
  }, [expenses, selectedFilter]);

  useEffect(() => {
    assignColorsToCategoriesOnLoad();
  }, [expenses]);

  useEffect(() => {
    fetchChart(displayedExpenses);
  }, [displayedExpenses]);

  useEffect(() => {
    return () => {
      if (chartUrl) {
        URL.revokeObjectURL(chartUrl);
      }
    };
  }, [chartUrl]);

  async function fetchFilterOptions() {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/fill_filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: string[] = await res.json();

      setFilterOptions(
        data.map((item) => ({
          label: item,
          value: item,
        }))
      );
    } catch (error) {
      console.error("Error fetching filter values:", error);
      setSnackbarMessage("Could not load filter values.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  }

  async function fetchChart(expensesToVisualize: Expense[]) {
    if (expensesToVisualize.length === 0) {
      setChartUrl((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return null;
      });
      return;
    }

    try {
      setChartLoading(true);

      const payload = {
        expenses: expensesToVisualize.map((expense) => ({
          title: expense.title,
          category: expense.category?.trim() || "Uncategorized",
          amount: expense.amount,
        })),
      };

      const res = await fetch("http://127.0.0.1:8004/api/visualize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Could not generate chart.");
      }

      const blob = await res.blob();
      const imageUrl = URL.createObjectURL(blob);

      setChartUrl((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return imageUrl;
      });
    } catch (error) {
      console.error("Error fetching chart:", error);
      setChartUrl((prevUrl) => {
        if (prevUrl) URL.revokeObjectURL(prevUrl);
        return null;
      });
      setSnackbarMessage("Could not load expense graph.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setChartLoading(false);
    }
  }

  async function assignColorsToCategoriesOnLoad() {
    const categories = Array.from(
      new Set(
        expenses
          .map((expense) => expense.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    );

    if (categories.length === 0) return;

    try {
      const res = await fetch("http://127.0.0.1:8003/api/category_colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories }),
      });

      const data: ColorsResponse = await res.json();
      setCategoryColors(data.colors);
    } catch (error) {
      console.error("Error assigning initial category colors:", error);
    }
  }

  async function assignColorsToCategories() {
    const categories = Array.from(
      new Set(
        expenses
          .map((expense) => expense.category?.trim())
          .filter((category): category is string => Boolean(category))
      )
    );

    if (categories.length === 0) {
      setSnackbarMessage("No categories found to assign colors.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    try {
      setColorLoading(true);

      const res = await fetch("http://127.0.0.1:8003/api/category_colors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ categories }),
      });

      const data: ColorsResponse = await res.json();
      setCategoryColors(data.colors);

      setSnackbarMessage("Colors assigned to categories.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Error assigning category colors:", error);
      setSnackbarMessage("Could not assign category colors.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setColorLoading(false);
    }
  }

  async function applyFilter(
    filterValue: string,
    spendingsToFilter: Expense[]
  ) {
    try {
      setFilterLoading(true);

      const spendingsDict: Record<string, string> = {};

      spendingsToFilter.forEach((s) => {
        const trimmedCategory = s.category?.trim();
        if (trimmedCategory) {
          spendingsDict[s.title] = trimmedCategory;
        }
      });

      const res = await fetch("http://127.0.0.1:8002/api/filter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          spendings: spendingsDict,
          category: filterValue,
        }),
      });

      const data: Record<string, string> = await res.json();
      const filteredTitles = Object.keys(data);

      const filteredExpenses = spendingsToFilter.filter((expense) =>
        filteredTitles.includes(expense.title)
      );

      setDisplayedExpenses(filteredExpenses);
    } catch (error) {
      console.error("Error applying filter:", error);
      setSnackbarMessage("Could not apply filter.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setFilterLoading(false);
    }
  }

  function handleFilterChange(event: SelectChangeEvent) {
    const value = event.target.value;
    setSelectedFilter(value);

    if (!value) {
      setDisplayedExpenses(expenses);
    }
  }

  function requestDelete(id: string) {
    setPendingDeleteId(id);
    setConfirmOpen(true);
  }

  function cancelDelete() {
    setConfirmOpen(false);
    setPendingDeleteId(null);
  }

  function confirmDelete() {
    if (pendingDeleteId) {
      setExpenses((prev) => prev.filter((e) => e.id !== pendingDeleteId));
    }
    cancelDelete();
  }

  function handleSnackbarClose() {
    setSnackbarOpen(false);
  }

  function addExpense(expense: Expense) {
    setExpenses((prev) => [expense, ...prev]);
  }

  function updateCategory(id: string, newCategory: string) {
    const trimmedCategory = newCategory.trim();

    setExpenses((prev) =>
      prev.map((expense) =>
        expense.id === id ? { ...expense, category: trimmedCategory } : expense
      )
    );
  }

  function startEditingCategory(id: string, currentCategory?: string) {
    const trimmedCategory = currentCategory?.trim() || "";
    setEditingCategoryId(id);
    setCategoryDraft(trimmedCategory);
    setColorDraft(categoryColors[trimmedCategory] || "#EC4899");
  }

  function cancelEditingCategory() {
    setEditingCategoryId(null);
    setCategoryDraft("");
    setColorDraft("#EC4899");
  }

  async function saveCategory(id: string) {
    const expense = expenses.find((e) => e.id === id);
    if (!expense) return;

    const trimmedCategory = categoryDraft.trim();

    if (!trimmedCategory) {
      setSnackbarMessage("Please select a category.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }

    updateCategory(id, trimmedCategory);

    try {
      const res = await fetch("http://127.0.0.1:8001/api/append_expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: expense.title,
          category: trimmedCategory,
        }),
      });

      const data: { status: string } = await res.json();

      if (data.status !== "saved") {
        setSnackbarMessage("Could not save category.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        return;
      }

      const updatedCatColors = {
        ...categoryColors,
        [trimmedCategory]: colorDraft,
      };

      const colorRes = await fetch(
        "http://127.0.0.1:8003/api/reassign_category_colors",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cat_colors: updatedCatColors,
            category: trimmedCategory,
            new_color: colorDraft,
          }),
        }
      );

      const colorData: ColorsResponse = await colorRes.json();
      setCategoryColors(colorData.colors);

      const trainRes = await fetch("http://127.0.0.1:8000/api/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const trainData: { status: string } = await trainRes.json();

      if (trainData.status !== "model retrained") {
        console.error("Model retraining failed.");
      }

      setSnackbarMessage("Category and color updated.");
      setSnackbarSeverity("success");
    } catch (error) {
      console.error("API error:", error);
      setSnackbarMessage("Server error while saving category.");
      setSnackbarSeverity("error");
    }

    setSnackbarOpen(true);
    cancelEditingCategory();
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

      <Stack spacing={2} sx={{ mt: 3, maxWidth: 1100 }}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: "100%" }}
        >
          <FormControl fullWidth size="small">
            <InputLabel id="filter-label">Filter</InputLabel>
            <Select
              labelId="filter-label"
              value={selectedFilter}
              label="Filter"
              onChange={handleFilterChange}
              sx={{
                borderRadius: 2,
                backgroundColor: "#fff",
              }}
            >
              <MenuItem value="">All</MenuItem>
              {filterOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            variant="contained"
            onClick={assignColorsToCategories}
            sx={{
              minWidth: { xs: "100%", sm: 150 },
              textTransform: "none",
              borderRadius: 2,
              backgroundColor: "#EC4899",
              "&:hover": {
                backgroundColor: "#DB2777",
              },
            }}
          >
            Assign Colors
          </Button>
        </Stack>

        {filterLoading && (
          <Typography
            sx={{
              color: "rgba(157,23,77,0.75)",
              fontSize: "0.95rem",
            }}
          >
            Applying filter...
          </Typography>
        )}

        {colorLoading && (
          <Typography
            sx={{
              color: "rgba(157,23,77,0.75)",
              fontSize: "0.95rem",
            }}
          >
            Loading category colors...
          </Typography>
        )}
      </Stack>

      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={4}
        alignItems="flex-start"
        sx={{ mt: 4, maxWidth: 1100 }}
      >
        <Stack spacing={2} sx={{ flex: 1, minWidth: 0, width: "100%" }}>
          {displayedExpenses.map((e) => {
            const isEditing = editingCategoryId === e.id;
            const trimmedCategory = e.category?.trim() || "";
            const cardColor = trimmedCategory
              ? categoryColors[trimmedCategory] || "#EC4899"
              : "#EC4899";

            return (
              <Card
                key={e.id}
                sx={{
                  borderRadius: 4,
                  borderLeft: `10px solid ${cardColor}`,
                  borderTop: `2px solid ${cardColor}`,
                  borderRight: `1px solid ${cardColor}55`,
                  borderBottom: `1px solid ${cardColor}55`,
                  backgroundColor: `${cardColor}22`,
                  boxShadow: `0 12px 30px ${cardColor}33`,
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
                        ${e.amount.toFixed(2)}
                      </Typography>

                      <IconButton
                        size="small"
                        onClick={() => requestDelete(e.id)}
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

                  <Stack spacing={1.2} sx={{ mt: 2 }}>
                    {!isEditing ? (
                      <>
                        <Stack direction="row" spacing={1.2} alignItems="center">
                          <Typography
                            sx={{
                              color: "rgba(157,23,77,0.9)",
                              fontSize: "0.98rem",
                            }}
                          >
                            <span style={{ fontWeight: 700 }}>Category:</span>{" "}
                            {trimmedCategory || "Uncategorized"}
                          </Typography>

                          {trimmedCategory &&
                            categoryColors[trimmedCategory] && (
                              <div
                                style={{
                                  width: 14,
                                  height: 14,
                                  borderRadius: "50%",
                                  backgroundColor:
                                    categoryColors[trimmedCategory],
                                  border: "1px solid rgba(0,0,0,0.15)",
                                }}
                              />
                            )}
                        </Stack>

                        <Button
                          variant="text"
                          onClick={() => startEditingCategory(e.id, e.category)}
                          sx={{
                            alignSelf: "flex-start",
                            textTransform: "none",
                            fontWeight: 600,
                            color: "#EC4899",
                            paddingLeft: 0,
                            minWidth: "auto",
                            "&:hover": {
                              backgroundColor: "transparent",
                              color: "#BE185D",
                            },
                          }}
                        >
                          Edit Category
                        </Button>
                      </>
                    ) : (
                      <>
                        <FormControl fullWidth size="small">
                          <InputLabel id={`edit-category-label-${e.id}`}>
                            Category
                          </InputLabel>
                          <Select
                            labelId={`edit-category-label-${e.id}`}
                            value={categoryDraft}
                            label="Category"
                            onChange={(event) => {
                              const newCategory = event.target.value.trim();
                              setCategoryDraft(newCategory);
                              setColorDraft(
                                categoryColors[newCategory] || "#EC4899"
                              );
                            }}
                            sx={{
                              borderRadius: 2,
                              backgroundColor: "#fff",
                            }}
                          >
                            {filterOptions.map((option) => {
                              const optionCategory = option.value.trim();

                              return (
                                <MenuItem
                                  key={option.value}
                                  value={optionCategory}
                                >
                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                  >
                                    <div
                                      style={{
                                        width: 12,
                                        height: 12,
                                        borderRadius: "50%",
                                        backgroundColor:
                                          categoryColors[optionCategory] ||
                                          "#EC4899",
                                        border: "1px solid rgba(0,0,0,0.15)",
                                      }}
                                    />
                                    <span>{option.label}</span>
                                  </Stack>
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>

                        {categoryDraft.trim() && (
                          <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                          >
                            <Typography
                              sx={{
                                color: "rgba(157,23,77,0.9)",
                                fontSize: "0.95rem",
                                fontWeight: 600,
                              }}
                            >
                              Pick Color:
                            </Typography>

                            <input
                              type="color"
                              value={colorDraft}
                              onChange={(event) =>
                                setColorDraft(event.target.value)
                              }
                              style={{
                                width: 44,
                                height: 36,
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                              }}
                            />
                          </Stack>
                        )}

                        <Stack direction="row" spacing={1}>
                          <Button
                            variant="contained"
                            onClick={() => saveCategory(e.id)}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              backgroundColor: "#EC4899",
                              "&:hover": {
                                backgroundColor: "#DB2777",
                              },
                            }}
                          >
                            Save
                          </Button>

                          <Button
                            variant="outlined"
                            onClick={cancelEditingCategory}
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                              borderColor: "rgba(236,72,153,0.35)",
                              color: "#BE185D",
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </>
                    )}
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        <Card
          sx={{
            width: { xs: "100%", lg: 380 },
            flexShrink: 0,
            position: { lg: "sticky" },
            top: { lg: 24 },
            borderRadius: 4,
            background:
              "linear-gradient(135deg, rgba(255,240,246,0.95), rgba(253,242,248,0.95))",
            border: "1px solid rgba(236,72,153,0.18)",
            boxShadow: "0 10px 30px rgba(236,72,153,0.12)",
          }}
        >
          <CardContent>
            <Typography
              sx={{
                fontWeight: 700,
                color: "#9D174D",
                fontSize: "1.05rem",
                mb: 2,
              }}
            >
              Expense Visualization
            </Typography>

            {chartLoading ? (
              <Typography
                sx={{
                  color: "rgba(157,23,77,0.75)",
                  fontSize: "0.95rem",
                }}
              >
                Generating chart...
              </Typography>
            ) : chartUrl ? (
              <img
                src={chartUrl}
                alt="Expenses by category"
                style={{
                  width: "100%",
                  borderRadius: "14px",
                  display: "block",
                }}
              />
            ) : (
              <Typography
                sx={{
                  color: "rgba(157,23,77,0.75)",
                  fontSize: "0.95rem",
                }}
              >
                No chart available.
              </Typography>
            )}
          </CardContent>
        </Card>
      </Stack>

      <Dialog open={confirmOpen} onClose={cancelDelete}>
        <DialogTitle>Delete expense?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            This will permanently remove the expense. You can’t undo this.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Spendings;