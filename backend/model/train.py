class Model():
    def __init__(self, vocab_size=None, alpha=1.0):
        self.feature_count_per_class = {}
        self.total_feature_count_per_class = {}
        self.class_counts = {}
        self.alpha = alpha
        self.vocab_size = vocab_size
        self.vocab = set()

    def tokenize(self, x):
        return x.lower().split()

    def fit(self, x, Y, class_names=None):

        if class_names is None:
            class_names = list(dict.fromkeys(Y))

        for c in class_names:
            self.class_counts[c] = 0
            self.total_feature_count_per_class[c] = 0
            self.feature_count_per_class[c] = {}

        for text, label in zip(x, Y):
            # class count
            self.class_counts[label] += 1

            # tokenize
            tokens = self.tokenize(text)

            # update token counts + totals + vocab
            for token in tokens:
                self.vocab.add(token)

                if token in self.feature_count_per_class[label]:
                    self.feature_count_per_class[label][token] += 1
                else:
                    self.feature_count_per_class[label][token] = 1

                self.total_feature_count_per_class[label] += 1

        self.vocab_size = len(self.vocab)
        return self
