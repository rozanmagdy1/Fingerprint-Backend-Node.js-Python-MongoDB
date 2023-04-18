from tensorflow.keras.models import load_model
import cv2
import numpy as np


def genderprediction(source):
    img = cv2.imread(source)
    img = cv2.resize(img, (96, 96))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = np.reshape(gray, (1, 96, 96, 1))
    saved_model = load_model('./python/Gender_Detection_V4.h5')
    class_names = ['Female', 'Male']
    prediction = saved_model.predict(img, verbose=0)
    female_percentage = (prediction[0][0] / (prediction[0][0] + prediction[0][1])) * 100
    male_percentage = (prediction[0][1] / (prediction[0][0] + prediction[0][1])) * 100
    output_class = class_names[np.argmax(prediction)]

    return female_percentage, male_percentage, output_class


def handprediction(source):
    img = cv2.imread(source)
    img = cv2.resize(img, (224, 224))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = np.reshape(gray, (1, 224, 224, 1))
    saved_model = load_model('./python/fingerprint_PositionDetection.h5')
    class_names = ['Left', 'Right']
    prediction = saved_model.predict(img, verbose=0)
    left_percentage = (prediction[0][0] / (prediction[0][0] + prediction[0][1])) * 100
    right_percentage = (prediction[0][1] / (prediction[0][0] + prediction[0][1])) * 100
    output_class = class_names[np.argmax(prediction)]
    
    return left_percentage, right_percentage, output_class


def fingernameprediction(source):
    img = cv2.imread(source)
    img = cv2.resize(img, (196, 196))
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img = np.reshape(gray, (1, 196, 196, 1))
    saved_model = load_model('./python/fingerprint_fingername_classification88.h5')
    class_name = ['thumb', 'little', 'ring', 'index', 'middle']
    prediction = saved_model.predict(img,verbose=0)
    thump_percentage = (prediction[0][0] / (prediction[0][0] + prediction[0][1])) * 100
    little_percentage = (prediction[0][1] / (prediction[0][0] + prediction[0][1])) * 100
    ring_percentage = (prediction[0][1] / (prediction[0][0] + prediction[0][1])) * 100
    index_percentage = (prediction[0][1] / (prediction[0][0] + prediction[0][1])) * 100
    middle_percentage = (prediction[0][1] / (prediction[0][0] + prediction[0][1])) * 100
    output_class = class_name[np.argmax(prediction)]

    return output_class, thump_percentage, little_percentage, ring_percentage, index_percentage, middle_percentage