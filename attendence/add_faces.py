import cv2
import pickle
import numpy as np
import os

# ---------------- PATH SETUP ----------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

cascade_path = os.path.join(DATA_DIR, "haarcascade_frontalface_default.xml")

facedetect = cv2.CascadeClassifier(cascade_path)
print("Cascade Loaded:", not facedetect.empty())

# ---------------- CAMERA ----------------
video = cv2.VideoCapture(0)
faces_data = []
i = 0

name = input("Enter Your Name: ")

# ---------------- FACE CAPTURE ----------------
while True:
    ret, frame = video.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = facedetect.detectMultiScale(gray, 1.3, 5)

    for (x, y, w, h) in faces:
        crop_img = frame[y:y+h, x:x+w]
        resized_img = cv2.resize(crop_img, (50, 50))

        if len(faces_data) < 100 and i % 10 == 0:
            faces_data.append(resized_img)

        i += 1

        cv2.putText(frame, str(len(faces_data)), (50, 50),
                    cv2.FONT_HERSHEY_COMPLEX, 1, (0, 255, 0), 2)
        cv2.rectangle(frame, (x, y), (x+w, y+h), (0, 255, 0), 2)

    cv2.imshow("Collecting Faces", frame)

    if cv2.waitKey(1) == ord('q') or len(faces_data) == 100:
        break

video.release()
cv2.destroyAllWindows()

# ---------------- PROCESS DATA ----------------
faces_data = np.asarray(faces_data)
faces_data = faces_data.reshape(100, -1)

names_path = os.path.join(DATA_DIR, "names.pkl")
faces_path = os.path.join(DATA_DIR, "faces_data.pkl")

# ---------------- SAVE NAMES ----------------
if not os.path.exists(names_path):
    names = [name] * 100
else:
    with open(names_path, "rb") as f:
        names = pickle.load(f)
    names = names + [name] * 100

with open(names_path, "wb") as f:
    pickle.dump(names, f)

# ---------------- SAVE FACE DATA ----------------
if not os.path.exists(faces_path):
    with open(faces_path, "wb") as f:
        pickle.dump(faces_data, f)
else:
    with open(faces_path, "rb") as f:
        old_faces = pickle.load(f)

    new_faces = np.append(old_faces, faces_data, axis=0)

    with open(faces_path, "wb") as f:
        pickle.dump(new_faces, f)

print("✅ Face data saved successfully!")