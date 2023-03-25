from m2 import *
import sys
import json

def match_two_images(source, suspect):
    result = matching(source, suspect)
    return {
        "result": result
    }


if __name__ == '__main__':
    result = match_two_images(sys.argv[1], sys.argv[2])
    print(json.dumps(result))
    sys.stdout.flush()


