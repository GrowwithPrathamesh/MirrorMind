import base64
from django.core.files.base import ContentFile
from .models import Student, StudentFace


def save_face_image(student: Student, base64_image: str):
    """
    base64_image = 'data:image/jpeg;base64,...'
    """
    format, imgstr = base64_image.split(";base64,")
    ext = format.split("/")[-1]

    image_file = ContentFile(
        base64.b64decode(imgstr),
        name=f"{student.id}_face.{ext}",
    )

    StudentFace.objects.create(
        student=student,
        face_image=image_file
    )
