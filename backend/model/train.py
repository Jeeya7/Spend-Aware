import numpy as np

class Model:
    def __init__(self, vocab_size=None, alpha=1.0):
        self.feature_count_per_class = {}
        self.total_feature_count_per_class = {}
        self.class_counts = {}
        self.alpha = alpha
        self.vocab_size = vocab_size
        self.vocab = set()
        self.class_names = []

        self.log_class = {}          
        self.log_likelihood = {}    
        self.unknown_log = {}       

    def tokenize(self, x):
        return x.lower().split()

    def fit(self, x, Y, class_names=None):
        if class_names is None:
            class_names = list(dict.fromkeys(Y))

        # init
        for c in class_names:
            self.class_counts[c] = 0
            self.total_feature_count_per_class[c] = 0
            self.feature_count_per_class[c] = {}
            self.log_likelihood[c] = {}   
            
        self.class_names = class_names

        # count
        for text, label in zip(x, Y):
            self.class_counts[label] += 1
            tokens = self.tokenize(text)

            for token in tokens:
                self.vocab.add(token)
                self.feature_count_per_class[label][token] = (
                    self.feature_count_per_class[label].get(token, 0) + 1
                )
                self.total_feature_count_per_class[label] += 1

        self.vocab_size = len(self.vocab)
        total_docs = len(Y)

        # log priors
        for c in class_names:
            self.log_class[c] = np.log(self.class_counts[c] / total_docs) if self.class_counts[c] > 0 else -np.inf

        # log likelihoods + unknown
        for c in class_names:
            denom = self.total_feature_count_per_class[c] + self.alpha * self.vocab_size
            self.unknown_log[c] = np.log(self.alpha / denom)

            for w in self.vocab:
                count_wc = self.feature_count_per_class[c].get(w, 0)
                prob = (count_wc + self.alpha) / denom
                self.log_likelihood[c][w] = np.log(prob)

        return self

    def predict(self, x):
        
        text = self.tokenize(x)
        pred_prob = []

        for label in self.class_names:
            score = self.log_class[label]
            for tok in text:
                score += self.log_likelihood[label].get(tok, self.unknown_log[label])
            pred_prob.append(score)

        return self.class_names[int(np.argmax(pred_prob))]
    
    

            
        