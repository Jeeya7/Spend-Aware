import io
import matplotlib.pyplot as plt


def visualize(expenses):

    category_totals = {}

    for expense in expenses:
        category = expense.category or "Uncategorized"
        category_totals[category] = category_totals.get(category, 0) + expense.amount

    categories = list(category_totals.keys())
    amounts = list(category_totals.values())

    plt.figure(figsize=(8, 5))
    plt.bar(categories, amounts)
    plt.title("Expenses by Category")
    plt.xlabel("Category")
    plt.ylabel("Amount")

    plt.xticks(rotation=30, ha="right")
    plt.tight_layout()

    img_buffer = io.BytesIO()
    plt.savefig(img_buffer, format="png")
    img_buffer.seek(0)
    plt.close()

    return img_buffer