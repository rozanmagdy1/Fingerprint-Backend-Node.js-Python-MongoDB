import cv2
import os
from datetime import datetime


def matching(source_image, folder_name, folder_path):
    source_image = cv2.imread(source_image)
    score = 0
    image = None
    kp1, kp2, mp = None, None, None
    scores = []
    paths = []
    for file in [file for file in os.listdir(folder_name)]:
        target_image = cv2.imread(folder_path + file)
        # feature extraction SIFT Algo
        sift = cv2.SIFT.create()
        # detectAndCompute method to detect and compute Key points and descriptors
        kp1, des1 = sift.detectAndCompute(source_image, None)
        kp2, des2 = sift.detectAndCompute(target_image, None)
        """"
        k=2 best 2 matches point
        FlannBasedMatcher to get best matches point and contain a collection of algorithms
        It take dictionary that determined algorithm and num of tree
        (the num of point that want to compare it with the actually point)
        """
        matches = cv2.FlannBasedMatcher(dict(algorithm=1, trees=10), dict()).knnMatch(des1, des2, k=2)
        mp = []
        for p, q in matches:
            if p.distance < 0.1 * q.distance:  # if dist less than .1  between 2 points then it is good match point
                mp.append(p)
                key_points = 0
                if len(kp1) <= len(kp2):
                    key_points = len(kp1)
                else:
                    key_points = len(kp2)

                if len(mp) / key_points * 100 > score:
                    score = len(mp) / key_points * 100
                    scores.append(score)
                    paths.append(file)
                    # draw matches key points by line
                    result = cv2.drawMatches(source_image, kp1, target_image, kp2, mp, None)
                    result = cv2.resize(result, None, fx=2.5, fy=2.5)
                    cv2.waitKey(0)
                    cv2.destroyAllWindows()
                    break
    return scores, paths


def get_max_score_and_file(scores_arr, paths_arr):
    max_score = scores_arr[0]
    for i in range(0, len(scores_arr), 1):
        if scores_arr[i] > max_score:
            max_score = scores_arr[i]
            continue
    index = scores_arr.index(max_score)
    return max_score, paths_arr[index]


def is_matching(test_image, folder, folder_path):
    x, y = matching(test_image, folder, folder_path)
    if x == []:
        return x, y
    else:
        Score, File = get_max_score_and_file(x, y)
        return Score, File
