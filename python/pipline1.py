from m1 import *
from models import *
import json
import sys

def matching(source, folder_name, folder_path):
    score, file_path = is_matching(source, folder_name, folder_path)
    if score==[]:
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
    else:
        return {
            "scoreOfFileMatched": score,
            "fileMatched": file_path
        }


if __name__ == '__main__':
    result = matching(sys.argv[1], sys.argv[2], sys.argv[3])
    print(json.dumps(result))
    sys.stdout.flush()
