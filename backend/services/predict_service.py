from backend.model.train import Model
from backend.data.dataloader import dataloader

x, Y, class_names = dataloader()
model = Model().fit(x, Y, class_names)

def predict_service(to_predict: str):
    
    prediction =  model.predict(to_predict)
    print(prediction)
    return prediction
