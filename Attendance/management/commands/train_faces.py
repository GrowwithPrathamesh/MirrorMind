from django.core.management.base import BaseCommand
import pickle, os
from sklearn.neighbors import KNeighborsClassifier

class Command(BaseCommand):
    help = "Train face recognition model"

    def handle(self, *args, **kwargs):
        with open("data/faces_data.pkl", "rb") as f:
            faces = pickle.load(f)

        with open("data/names.pkl", "rb") as f:
            names = pickle.load(f)

        model = KNeighborsClassifier(n_neighbors=3)
        model.fit(faces, names)

        os.makedirs("models", exist_ok=True)
        with open("models/knn_model.pkl", "wb") as f:
            pickle.dump(model, f)

        self.stdout.write("✅ Face model trained successfully")