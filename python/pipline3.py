from models import *
import sys
import json
import threading

def model1(source, obj):
    female, male, gender = genderprediction(source)
    obj.update({
        "gender": gender,
        "male_percentage": male,
        "female_percentage": female,
    })


def model2(source, obj):
    left, right, position = handprediction(source)
    obj.update({
        "hand_position": position,
        "right_percentage": right,
        "left_percentage": left,
    })


def model3(source, obj):
    name, thump, little, ring, index, middle = fingernameprediction(source)
    obj.update({
        "Finger_name": name,
        "Thump_percentage": thump,
        "Little_percentage": little,
        "Ring_percentage": ring,
        "Index_percentage": index,
        "Middle_percentage": middle
    })


def get_estimated_info(source):
    t1 = threading.Thread(target=model1, args=(source, obj))
    t2 = threading.Thread(target=model2, args=(source, obj))
    t3 = threading.Thread(target=model3, args=(source, obj))

    t1.start()
    t2.start()
    t3.start()
    t1.join()
    t2.join()
    t3.join()

if __name__ == '__main__':
    obj = {}
    result = get_estimated_info(sys.argv[1])
    print(json.dumps(obj))
    sys.stdout.flush()

