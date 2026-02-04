from pathlib import Path
import cv2

BASE_DIR = Path(__file__).resolve().parent.parent

FACES_DIR = BASE_DIR / "Faces"
DATA_DIR = FACES_DIR / "data"

FACES_DIR.mkdir(exist_ok=True)
DATA_DIR.mkdir(exist_ok=True)

CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
face_cascade = cv2.CascadeClassifier(CASCADE_PATH)

FACES_PKL = str(DATA_DIR / "faces_data.pkl")
LABELS_PKL = str(DATA_DIR / "labels.pkl")

faces_data_store = {}
face_counter = {}
face_saved = set()
