CATEGORY_COLORS = [
    "#EF4444",  # red
    "#F97316",  # orange
    "#F59E0B",  # amber
    "#EAB308",  # yellow
    "#84CC16",  # lime
    "#22C55E",  # green
    "#10B981",  # emerald
    "#14B8A6",  # teal
    "#06B6D4",  # cyan
    "#0EA5E9",  # sky
    "#3B82F6",  # blue
    "#6366F1",  # indigo
    "#8B5CF6",  # violet
    "#A855F7",  # purple
    "#D946EF",  # fuchsia
    "#EC4899",  # pink
    "#F43F5E",  # rose
    "#64748B",  # slate
    "#78716C",  # stone
    "#9CA3AF",  # gray
]

def assign_colors(categories):

    result = {}

    for i, category in enumerate(categories):
        color = CATEGORY_COLORS[i % len(CATEGORY_COLORS)]
        result[category] = color

    return {"colors": result}


def reassign_colors(cat_colors: dict[str, str], category: str, new_color: str):
    updated = cat_colors.copy()
    updated[category] = new_color
    return {"colors": updated}