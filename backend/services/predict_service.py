from backend.model.train import Model
from backend.data.dataloader import dataloader


def predict_service(to_predict: str):
    
    x, Y, class_names = dataloader()
    model = Model().fit(x, Y, class_names)
    prediction =  model.predict(to_predict)
    print(prediction)
    return prediction
