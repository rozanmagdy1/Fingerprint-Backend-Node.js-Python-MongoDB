from models import *
import sys
import json

def get_estimated_info(source):
    female, male, gender = genderprediction(source)
    left, right, position = handprediction(source)
    return {
        "gender": gender,
        "male_percentage": male,
        "female_percentage": female,
        "hand_position": position,
        "right_percentage": right,
        "left_percentage": left,
    }


if __name__ == '__main__':
    result = get_estimated_info(sys.argv[1])
    print(json.dumps(result))
    sys.stdout.flush()
