from backend.model.train import Model
from backend.data.dataloader import dataloader


def fill_filter_service():
    
    _, _, class_names = dataloader()
    return class_names
