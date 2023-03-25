from tensorflow.keras.models import load_model
import cv2
import numpy as np



def read_img(image):
    img = cv2.imread(image)
    img = cv2.resize(img, (224, 224))  # resize image to match model's expected sizing
    img = np.reshape(img, (1, 224, 224, 3))  # return the image with shaping that TF wants.
    return img


def genderprediction(source):
    img = read_img(source)
    saved_model = load_model('./python/fingerprint_GenderDetection85%.h5')
    class_names = ['Female', 'Male']
    prediction = saved_model.predict(img,verbose=0)
    female_percentage = (prediction[0][0] / (prediction[0][0] + prediction[0][1])) * 100
    male_percentage = (prediction[0][1] / (prediction[0][0] + prediction[0][1])) * 100
    output_class = class_names[np.argmax(prediction)]

    return female_percentage, male_percentage, output_class


def handprediction(source):
    img = read_img(source)
    saved_model = load_model('./python/fingerprint_PositionDetection.h5')
    class_names = ['Left', 'Right']
    prediction = saved_model.predict(img,verbose=0)
    left_percentage = (prediction[0][0] / (prediction[0][0] + prediction[0][1])) * 100
    right_percentage = (prediction[0][1] / (prediction[0][0] + prediction[0][1])) * 100
    output_class = class_names[np.argmax(prediction)]

    return left_percentage, right_percentage, output_class