import unittest
from pseudo_bike import weighted_miles_bike
from pseudo_walk import weighted_miles_pedestrian

from pseudo import weight_bike, weight_ped, calc_proj_length, segments, intersections

class TestPseudo(unittest.TestCase):

    def test_bike(self):
        self.assertEqual(weighted_miles_bike('test'), 170.0569558270192)

    def test_walk(self):
        self.assertEqual(weighted_miles_pedestrian('test'), 216.78688524590174)

    def test_bike2(self):
        result = weight_bike(calc_proj_length(segments), segments)
        self.assertEqual(result, 170.0569558270192)

    def test_walk2(self):
        result = weight_ped(calc_proj_length(segments), intersections)
        self.assertEqual(result, 216.78688524590171)


if __name__ == '__main__':
    unittest.main()
