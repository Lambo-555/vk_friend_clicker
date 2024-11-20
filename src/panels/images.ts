import photo_1_1 from '../assets/1/1.png';
import photo_1_2 from '../assets/1/2.png';
import photo_1_3 from '../assets/1/3.png';
import photo_1_4 from '../assets/1/4.png';
import photo_1_5 from '../assets/1/5.png';
import photo_1_6 from '../assets/1/6.png';
import photo_1_7 from '../assets/1/7.png';
import photo_1_8 from '../assets/1/8.png';
import photo_1_9 from '../assets/1/9.png';
import photo_1_10 from '../assets/1/10.png';

import photo_2_1 from '../assets/2/1.png';
import photo_2_2 from '../assets/2/2.png';
import photo_2_3 from '../assets/2/3.png';
import photo_2_4 from '../assets/2/4.png';
import photo_2_5 from '../assets/2/5.png';
import photo_2_6 from '../assets/2/6.png';
import photo_2_7 from '../assets/2/7.png';
import photo_2_8 from '../assets/2/8.png';
import photo_2_9 from '../assets/2/9.png';
import photo_2_10 from '../assets/2/10.png';

import photo_3_1 from '../assets/3/1.png';
import photo_3_2 from '../assets/3/2.png';
import photo_3_3 from '../assets/3/3.png';
import photo_3_4 from '../assets/3/4.png';
import photo_3_5 from '../assets/3/5.png';
import photo_3_6 from '../assets/3/6.png';
import photo_3_7 from '../assets/3/7.png';
import photo_3_8 from '../assets/3/8.png';
import photo_3_9 from '../assets/3/9.png';
import photo_3_10 from '../assets/3/10.png';

import photo_4_1 from '../assets/4/1.png';
import photo_4_2 from '../assets/4/2.png';
import photo_4_3 from '../assets/4/3.png';
import photo_4_4 from '../assets/4/4.png';
import photo_4_5 from '../assets/4/5.png';
import photo_4_6 from '../assets/4/6.png';
import photo_4_7 from '../assets/4/7.png';
import photo_4_8 from '../assets/4/8.png';
import photo_4_9 from '../assets/4/9.png';
import photo_4_10 from '../assets/4/10.png';

import hummer_1_1 from '../assets/hummers/1/1.png';
import hummer_1_2 from '../assets/hummers/1/2.png';
import hummer_2_1 from '../assets/hummers/2/1.png';
import hummer_2_2 from '../assets/hummers/2/2.png';

export const getCarImageById = (carId: number, imgId: number): string => {
    const images: { [key: string]: { [key: string]: any } } = {
        1: {
            1: photo_1_1,
            2: photo_1_2,
            3: photo_1_3,
            4: photo_1_4,
            5: photo_1_5,
            6: photo_1_6,
            7: photo_1_7,
            8: photo_1_8,
            9: photo_1_9,
            10: photo_1_10,
        },
        2: {
            1: photo_2_1,
            2: photo_2_2,
            3: photo_2_3,
            4: photo_2_4,
            5: photo_2_5,
            6: photo_2_6,
            7: photo_2_7,
            8: photo_2_8,
            9: photo_2_9,
            10: photo_2_10,
        },
        3: {
            1: photo_3_1,
            2: photo_3_2,
            3: photo_3_3,
            4: photo_3_4,
            5: photo_3_5,
            6: photo_3_6,
            7: photo_3_7,
            8: photo_3_8,
            9: photo_3_9,
            10: photo_3_10,
        },
        4: {
            1: photo_4_1,
            2: photo_4_2,
            3: photo_4_3,
            4: photo_4_4,
            5: photo_4_5,
            6: photo_4_6,
            7: photo_4_7,
            8: photo_4_8,
            9: photo_4_9,
            10: photo_4_10,
        }
    }
    return images?.[carId]?.[imgId];
};

export const getToolImageById = (toolId: number, imgId: number): string => {
    const images: { [key: string]: { [key: string]: any } } = {
        1: {
            1: hummer_1_1,
            2: hummer_1_2,
        },
        2: {
            1: hummer_2_1,
            2: hummer_2_2,
        },
    }
    return images[toolId][imgId];
};