import os
import pandas as pd

def dataloader():
    base_dir = os.path.dirname(__file__)  
    csv_path = os.path.join(base_dir, "data.csv")

    df = pd.read_csv(csv_path)

    x = df["text"].tolist()
    Y = df["category"].tolist()
    class_names = df["category"].unique().tolist()

    return x, Y, class_names
