from m1 import *
from models import *
import json
import sys
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


def matching(source, folder_name, folder_path):
    score, file_path = is_matching(source, folder_name, folder_path)
    if score==[]:
        t1 = threading.Thread(target=model1, args=(source, obj))
        t2 = threading.Thread(target=model2, args=(source, obj))
        t3 = threading.Thread(target=model3, args=(source, obj))

        t1.start()
        t2.start()
        t3.start()
        t1.join()
        t2.join()
        t3.join()

    else:
        obj.update({
            "scoreOfFileMatched": score,
            "fileMatched": file_path
        })


if __name__ == '__main__':
    obj = {}
    result = matching(sys.argv[1], sys.argv[2], sys.argv[3])
    print(json.dumps(obj))
    sys.stdout.flush()
