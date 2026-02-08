from model.train import Model
from data.dataloader import dataloader


def main():
    
    x, Y, class_names = dataloader()
    model = Model()
    
    model = model.fit(x, Y, class_names)
    
    print(model.__dict__)
    
    return

if __name__ =="__main__":
    main()