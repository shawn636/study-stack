import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

import {
    faChessRook,
    faChurch,
    faCross,
    faGavel,
    faHiking,
    faPeopleArrows,
    faSun,
    faTint
} from '@fortawesome/free-solid-svg-icons';

interface Belief {
    content: string;
    icon: IconDefinition;
    title: string;
}

export const beliefs: Belief[] = [
    {
        content:
            'We believe in one God eternally existing as one essence and three distinct persons: God the Father, God the Son, and God the Holy Spirit, each of whom is fully God, yet there is one God.',
        icon: faCross,
        title: 'Doctrine of God'
    },
    {
        content:
            'God has made Himself known to the world in Jesus Christ, the Scriptures, and creation.',
        icon: faSun,
        title: 'Doctrine of Revelation'
    },
    {
        content:
            'We believe that God created the world from nothing and governs all things at all times in all places.',
        icon: faChessRook,
        title: 'Doctrine of Creation and Providence'
    },
    {
        content:
            'We believe that all humanity is created in the image of God and possesses intrinsic dignity and worth.',
        icon: faPeopleArrows,
        title: 'Doctrine of Humanity'
    },
    {
        content:
            'We believe that sin has fractured all things, leaving the world in desperate need of salvation.',
        icon: faGavel,
        title: 'Doctrine of Sin'
    },
    {
        content: 'We believe that salvation is by grace alone through faith alone in Christ alone.',
        icon: faHiking,
        title: 'Doctrine of Salvation'
    },
    {
        content:
            'We believe that the Church is the body of Christ sent into the world to shine forth the glory of God.',
        icon: faChurch,
        title: 'Doctrine of the Church'
    },
    {
        content:
            'We believe that Jesus Christ is returning to the world in the future to judge the living and the dead.',
        icon: faTint,
        title: 'Doctrine of New Creation'
    }
];
