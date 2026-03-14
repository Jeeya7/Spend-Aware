from backend.model.train import Model
from backend.data.dataloader import dataloader


def train_service():
    x, Y, class_names = dataloader()
    model = Model().fit(x, Y, class_names)