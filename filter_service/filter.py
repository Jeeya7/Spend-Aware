def filter_service(spendings: dict, category: str):
    spendings_filtered = {}
    for spending in spendings:
        if spendings[spending] == category:
            spendings_filtered[spending] = category
            
    return spendings_filtered
    