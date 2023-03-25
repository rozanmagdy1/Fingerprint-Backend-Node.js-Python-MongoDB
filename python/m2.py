import cv2


def matching(source_image, suspect_image):
    source_image = cv2.imread(source_image)
    score = 0
    image = None
    kp1, kp2, mp = None, None, None
    scores = []
    target_image = cv2.imread(suspect_image)
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
                break
    if scores == []:
        return "Not match"
    else:
        return "Match"