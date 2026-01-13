import cv2
import pickle
import numpy as np
import os
from sklearn.neighbors import KNeighborsClassifier
from .models import Attendance

# ---------------- PATH SETUP ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

cascade_path = os.path.join(DATA_DIR, "haarcascade_frontalface_default.xml")
names_path = os.path.join(DATA_DIR, "names.pkl")
faces_path = os.path.join(DATA_DIR, "faces_data.pkl")

# ---------------- LOAD CASCADE ----------------
facedetect = cv2.CascadeClassifier(cascade_path)

def run_attendance():
    if not os.path.exists(names_path) or not os.path.exists(faces_path):
        print("❌ Face data not found. Please run add_faces.py first.")
        return

    with open(names_path, "rb") as f:
        LABELS = pickle.load(f)

    with open(faces_path, "rb") as f:
        FACES = pickle.load(f)

    knn = KNeighborsClassifier(n_neighbors=5)
    knn.fit(FACES, LABELS)

    video = cv2.VideoCapture(0)

    while True:
        ret, frame = video.read()
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = facedetect.detectMultiScale(gray, 1.3, 5)

        for (x, y, w, h) in faces:
            crop = frame[y:y+h, x:x+w]
            resize = cv2.resize(crop, (50, 50)).flatten().reshape(1, -1)

            name = knn.predict(resize)[0]

            cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)
            cv2.putText(frame, name, (x, y-10),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

        cv2.imshow("MirrorMind Face Attendance", frame)

        key = cv2.waitKey(1)

        if key == ord('o'):
            Attendance.objects.create(name=name)
            print("✅ Attendance saved:", name)

        if key == ord('q'):
            break

    video.release()
    cv2.destroyAllWindows()