import type { Course, PrismaClient } from '@prisma/client';

import { faker } from '@faker-js/faker';
import { Prisma } from '@prisma/client';

import { cuid } from './utils';

interface CourseSeed {
    image: string;
    courses: {
        title: string;
        descriptions: string[];
    }[];
}

const courseSeeds: CourseSeed[] = [
    {
        image: '/images/course-image-1.webp',
        courses: [
            {
                title: 'Introduction to Psychology',
                // Possible descriptions that fit the title
                descriptions: [
                    'Explore the fundamentals of psychology, including key theories and concepts.',
                    'Learn about the human mind and behavior through various psychological lenses.',
                    'Discover the principles of psychology and their applications in everyday life.',
                    'Gain insights into human behavior and mental processes through psychological theories.',
                    'Understand the basics of psychology and its relevance in various fields.',
                    'Dive into the world of psychology and its impact on human behavior.',
                    'Uncover the mysteries of the mind with an introduction to psychology.'
                ]
            },
            {
                title: 'Understnding Human Behavior',
                descriptions: [
                    'Delve into the complexities of human behavior and its underlying motivations.',
                    'Examine the factors that influence human behavior and decision-making.',
                    'Learn about the psychological principles that govern human actions.',
                    'Explore the various aspects of human behavior and their implications.',
                    'Gain a deeper understanding of the psychological factors that shape our actions.',
                    'Discover the intricacies of human behavior and its impact on society.',
                    'Analyze the psychological theories that explain human behavior.'
                ]
            },
            {
                title: 'Psychology of Learning',
                descriptions: [
                    'Explore the psychological principles behind learning and memory.',
                    'Understand the cognitive processes involved in learning and retention.',
                    'Learn about different learning theories and their applications.',
                    'Examine the role of motivation and emotion in the learning process.',
                    'Discover effective strategies for enhancing learning and memory.',
                    'Gain insights into the psychology of learning and its practical implications.',
                    'Analyze the factors that influence learning outcomes.'
                ]
            },
            {
                title: 'Cognitive Psychology',
                descriptions: [
                    'Explore the mental processes involved in perception, memory, and problem-solving.',
                    'Understand the cognitive theories that explain human thought processes.',
                    'Learn about the relationship between cognition and behavior.',
                    'Examine the role of attention and perception in cognitive psychology.',
                    'Discover the impact of cognitive biases on decision-making.',
                    'Gain insights into the cognitive processes that shape our understanding of the world.',
                    'Analyze the psychological principles underlying cognitive functioning.'
                ]
            },
            {
                title: 'Social Psychology',
                descriptions: [
                    'Explore the impact of social interactions on individual behavior and attitudes.',
                    'Understand the principles of group dynamics and social influence.',
                    'Learn about the psychological factors that shape our perceptions of others.',
                    'Examine the role of culture and society in shaping behavior.',
                    'Discover the psychological theories that explain social behavior.',
                    'Gain insights into the complexities of human relationships and social interactions.',
                    'Analyze the psychological principles underlying social behavior.'
                ]
            },
            {
                title: 'Developmental Psychology',
                descriptions: [
                    'Explore the psychological changes that occur throughout the lifespan.',
                    'Understand the factors that influence human development and growth.',
                    'Learn about the stages of cognitive and emotional development.',
                    'Examine the role of genetics and environment in shaping behavior.',
                    'Discover the psychological theories that explain human development.',
                    'Gain insights into the complexities of human growth and change.',
                    'Analyze the psychological principles underlying developmental processes.'
                ]
            },
            {
                title: 'Abnormal Psychology',
                descriptions: [
                    'Explore the psychological disorders and their impact on individuals.',
                    'Understand the diagnostic criteria for various mental health conditions.',
                    'Learn about the treatment approaches for psychological disorders.',
                    'Examine the role of genetics and environment in mental health.',
                    'Discover the psychological theories that explain abnormal behavior.',
                    'Gain insights into the complexities of mental health and illness.',
                    'Analyze the psychological principles underlying abnormal psychology.'
                ]
            },
            {
                title: 'Psychology of Personality',
                descriptions: [
                    'Explore the theories of personality development and assessment.',
                    'Understand the factors that shape individual personality traits.',
                    'Learn about the role of genetics and environment in personality formation.',
                    'Examine the psychological theories that explain personality differences.',
                    'Discover the impact of personality on behavior and relationships.',
                    'Gain insights into the complexities of human personality.',
                    'Analyze the psychological principles underlying personality psychology.'
                ]
            }
        ]
    },
    {
        image: '/images/course-image-2.webp',
        courses: [
            {
                title: 'Surgical Techniques and Procedures',
                descriptions: [
                    'Explore the fundamentals of surgical techniques and procedures.',
                    'Learn about the various surgical instruments and their uses.',
                    'Discover the principles of aseptic technique and infection control.',
                    'Understand the anatomy and physiology relevant to surgical procedures.',
                    'Gain insights into the preoperative and postoperative care of patients.',
                    'Examine the ethical considerations in surgical practice.',
                    'Analyze the role of technology in modern surgical techniques.'
                ]
            },
            {
                title: 'Anesthesia and Pain Management',
                descriptions: [
                    'Explore the principles of anesthesia and pain management.',
                    'Learn about the different types of anesthesia and their applications.',
                    'Discover the pharmacology of anesthetic agents.',
                    'Understand the monitoring and assessment of patients under anesthesia.',
                    'Gain insights into the management of postoperative pain.',
                    'Examine the ethical considerations in anesthesia practice.',
                    'Analyze the role of technology in modern anesthesia techniques.'
                ]
            },
            {
                title: 'Surgical Anatomy and Physiology',
                descriptions: [
                    'Explore the anatomy and physiology relevant to surgical practice.',
                    'Learn about the surgical approaches to various anatomical structures.',
                    'Discover the principles of surgical dissection and tissue handling.',
                    'Understand the implications of anatomical variations in surgery.',
                    'Gain insights into the role of imaging in surgical anatomy.',
                    'Examine the ethical considerations in surgical anatomy education.',
                    'Analyze the impact of anatomical knowledge on surgical outcomes.'
                ]
            },
            {
                title: 'Minimally Invasive Surgery',
                descriptions: [
                    'Explore the principles of minimally invasive surgical techniques.',
                    'Learn about the advantages and disadvantages of minimally invasive surgery.',
                    'Discover the various instruments and technologies used in minimally invasive procedures.',
                    'Understand the indications and contraindications for minimally invasive surgery.',
                    'Gain insights into the postoperative care of patients undergoing minimally invasive procedures.',
                    'Examine the ethical considerations in minimally invasive surgical practice.',
                    'Analyze the role of technology in advancing minimally invasive surgery.'
                ]
            },
            {
                title: 'Surgical Oncology',
                descriptions: [
                    'Explore the principles of surgical oncology and cancer treatment.',
                    'Learn about the different types of cancer and their surgical management.',
                    'Discover the role of surgery in cancer staging and treatment planning.',
                    'Understand the principles of tumor resection and reconstruction.',
                    'Gain insights into the postoperative care of cancer patients.',
                    'Examine the ethical considerations in surgical oncology practice.',
                    'Analyze the impact of surgical interventions on cancer outcomes.'
                ]
            },
            {
                title: 'Trauma Surgery',
                descriptions: [
                    'Explore the principles of trauma surgery and emergency care.',
                    'Learn about the assessment and management of traumatic injuries.',
                    'Discover the role of surgery in trauma resuscitation and stabilization.',
                    'Understand the principles of damage control surgery.',
                    'Gain insights into the postoperative care of trauma patients.',
                    'Examine the ethical considerations in trauma surgical practice.',
                    'Analyze the impact of surgical interventions on trauma outcomes.'
                ]
            },
            {
                title: 'Pediatric Surgery',
                descriptions: [
                    'Explore the principles of pediatric surgery and child health care.',
                    'Learn about the unique anatomical and physiological considerations in pediatric patients.',
                    'Discover the role of surgery in congenital anomalies and childhood diseases.',
                    'Understand the principles of pediatric anesthesia and pain management.',
                    'Gain insights into the postoperative care of pediatric patients.',
                    'Examine the ethical considerations in pediatric surgical practice.',
                    'Analyze the impact of surgical interventions on pediatric outcomes.'
                ]
            }
        ]
    },
    {
        image: '/images/course-image-3.webp',
        courses: [
            {
                title: 'Anatomy and Physiology',
                descriptions: [
                    'Explore the structure and function of the human body.',
                    'Learn about the major organ systems and their interrelationships.',
                    'Discover the principles of homeostasis and physiological regulation.',
                    'Understand the anatomical terminology and body planes.',
                    'Gain insights into the role of anatomy and physiology in health and disease.',
                    'Examine the impact of lifestyle choices on anatomical and physiological health.',
                    'Analyze the relationship between structure and function in the human body.'
                ]
            },
            {
                title: 'Nutrition and Metabolism',
                descriptions: [
                    'Explore the principles of nutrition and its impact on health.',
                    'Learn about the macronutrients and micronutrients essential for life.',
                    'Discover the role of metabolism in energy production and utilization.',
                    'Understand the dietary guidelines and recommendations for healthy eating.',
                    'Gain insights into the relationship between nutrition and chronic diseases.',
                    'Examine the impact of cultural and social factors on dietary choices.',
                    'Analyze the role of nutrition in disease prevention and management.'
                ]
            },
            {
                title: 'Pharmacology',
                descriptions: [
                    'Explore the principles of pharmacology and drug therapy.',
                    'Learn about the mechanisms of drug action and their effects on the body.',
                    'Discover the pharmacokinetics and pharmacodynamics of medications.',
                    'Understand the principles of drug interactions and adverse effects.',
                    'Gain insights into the role of pharmacology in disease management.',
                    'Examine the ethical considerations in pharmacological practice.',
                    'Analyze the impact of pharmacological interventions on health outcomes.'
                ]
            },
            {
                title: 'Microbiology and Immunology',
                descriptions: [
                    'Explore the principles of microbiology and the immune system.',
                    'Learn about the different types of microorganisms and their roles in health and disease.',
                    'Discover the mechanisms of immune response and disease prevention.',
                    'Understand the principles of infection control and prevention.',
                    'Gain insights into the role of microbiology in public health.',
                    'Examine the impact of antibiotics and antimicrobial resistance on health.',
                    'Analyze the relationship between microbiology and immunology.'
                ]
            },
            {
                title: 'Pathophysiology',
                descriptions: [
                    'Explore the principles of pathophysiology and disease processes.',
                    'Learn about the mechanisms of disease development and progression.',
                    'Discover the role of genetics and environment in disease etiology.',
                    'Understand the principles of disease classification and diagnosis.',
                    'Gain insights into the impact of pathophysiology on health outcomes.',
                    'Examine the relationship between pathophysiology and clinical practice.',
                    'Analyze the role of pathophysiology in disease management.'
                ]
            },
            {
                title: 'Clinical Skills',
                descriptions: [
                    'Explore the essential clinical skills for healthcare professionals.',
                    'Learn about patient assessment and physical examination techniques.',
                    'Discover the principles of communication and patient interaction.',
                    'Understand the role of clinical skills in patient care and safety.',
                    'Gain insights into the ethical considerations in clinical practice.',
                    'Examine the impact of technology on clinical skills training.',
                    'Analyze the relationship between clinical skills and patient outcomes.'
                ]
            },
            {
                title: 'Health Promotion and Disease Prevention',
                descriptions: [
                    'Explore the principles of health promotion and disease prevention.',
                    'Learn about the role of lifestyle factors in health and wellness.',
                    'Discover the impact of social determinants on health outcomes.',
                    'Understand the principles of public health and community health.',
                    'Gain insights into the role of healthcare professionals in health promotion.',
                    'Examine the ethical considerations in health promotion practice.',
                    'Analyze the relationship between health promotion and disease prevention.'
                ]
            },
            {
                title: 'Medical Ethics and Law',
                descriptions: [
                    'Explore the principles of medical ethics and legal considerations in healthcare.',
                    'Learn about the ethical dilemmas faced by healthcare professionals.',
                    'Discover the role of informed consent and patient autonomy.',
                    'Understand the principles of confidentiality and privacy in healthcare.',
                    'Gain insights into the legal responsibilities of healthcare providers.',
                    'Examine the impact of ethical and legal issues on patient care.',
                    'Analyze the relationship between medical ethics and law.'
                ]
            }
        ]
    },
    {
        image: '/images/course-image-4.webp',
        courses: [
            {
                title: 'Introduction to Computer Science',
                descriptions: [
                    'Explore the fundamentals of computer science and programming.',
                    'Learn about algorithms, data structures, and software development.',
                    'Discover the principles of computer architecture and operating systems.',
                    'Understand the basics of web development and database management.',
                    'Gain insights into the role of computer science in various fields.',
                    'Examine the impact of technology on society and culture.',
                    'Analyze the ethical considerations in computer science and technology.'
                ]
            },
            {
                title: 'Web Development',
                descriptions: [
                    'Explore the principles of web development and design.',
                    'Learn about HTML, CSS, and JavaScript for building websites.',
                    'Discover the role of front-end and back-end development.',
                    'Understand the basics of responsive design and user experience.',
                    'Gain insights into the tools and technologies used in web development.',
                    'Examine the impact of web development on business and society.',
                    'Analyze the ethical considerations in web development.'
                ]
            },
            {
                title: 'Data Science and Analytics',
                descriptions: [
                    'Explore the principles of data science and analytics.',
                    'Learn about data collection, cleaning, and visualization techniques.',
                    'Discover the role of statistical analysis and machine learning.',
                    'Understand the basics of big data and cloud computing.',
                    'Gain insights into the applications of data science in various fields.',
                    'Examine the impact of data science on decision-making and strategy.',
                    'Analyze the ethical considerations in data science and analytics.'
                ]
            },
            {
                title: 'Artificial Intelligence and Machine Learning',
                descriptions: [
                    'Explore the principles of artificial intelligence and machine learning.',
                    'Learn about supervised and unsupervised learning algorithms.',
                    'Discover the role of neural networks and deep learning.',
                    'Understand the basics of natural language processing and computer vision.',
                    'Gain insights into the applications of AI in various industries.',
                    'Examine the impact of AI on society and the economy.',
                    'Analyze the ethical considerations in AI and machine learning.'
                ]
            },
            {
                title: 'Cybersecurity',
                descriptions: [
                    'Explore the principles of cybersecurity and information security.',
                    'Learn about network security, encryption, and threat detection.',
                    'Discover the role of risk management and incident response.',
                    'Understand the basics of ethical hacking and penetration testing.',
                    'Gain insights into the legal and regulatory aspects of cybersecurity.',
                    'Examine the impact of cybersecurity on business and society.',
                    'Analyze the ethical considerations in cybersecurity.'
                ]
            },
            {
                title: 'Mobile App Development',
                descriptions: [
                    'Explore the principles of mobile app development for iOS and Android.',
                    'Learn about mobile programming languages and frameworks.',
                    'Discover the role of user interface design and user experience.',
                    'Understand the basics of mobile app testing and deployment.',
                    'Gain insights into the tools and technologies used in mobile app development.',
                    'Examine the impact of mobile apps on business and society.',
                    'Analyze the ethical considerations in mobile app development.'
                ]
            },
            {
                title: 'Game Development',
                descriptions: [
                    'Explore the principles of game development and design.',
                    'Learn about game engines, programming languages, and graphics.',
                    'Discover the role of storytelling and user experience in games.',
                    'Understand the basics of game testing and quality assurance.',
                    'Gain insights into the tools and technologies used in game development.',
                    'Examine the impact of games on culture and society.',
                    'Analyze the ethical considerations in game development.'
                ]
            },
            {
                title: 'Cloud Computing',
                descriptions: [
                    'Explore the principles of cloud computing and its applications.',
                    'Learn about cloud service models: IaaS, PaaS, and SaaS.',
                    'Discover the role of virtualization and containerization.',
                    'Understand the basics of cloud security and compliance.',
                    'Gain insights into the tools and technologies used in cloud computing.',
                    'Examine the impact of cloud computing on business and society.',
                    'Analyze the ethical considerations in cloud computing.'
                ]
            }
        ]
    },
    {
        image: '/images/course-image-5.webp',
        courses: [
            {
                title: 'Trigonometry and Geometry',
                descriptions: [
                    'Explore the principles of trigonometry and geometry.',
                    'Learn about angles, triangles, and geometric shapes.',
                    'Discover the applications of trigonometry in real-world problems.',
                    'Understand the relationship between trigonometric functions and geometry.',
                    'Gain insights into the role of geometry in various fields.',
                    'Examine the impact of trigonometry on science and engineering.',
                    'Analyze the ethical considerations in mathematical applications.'
                ]
            },
            {
                title: 'Calculus and Analysis',
                descriptions: [
                    'Explore the principles of calculus and mathematical analysis.',
                    'Learn about limits, derivatives, and integrals.',
                    'Discover the applications of calculus in physics and engineering.',
                    'Understand the relationship between calculus and real-world problems.',
                    'Gain insights into the role of analysis in advanced mathematics.',
                    'Examine the impact of calculus on scientific research.',
                    'Analyze the ethical considerations in mathematical modeling.'
                ]
            },
            {
                title: 'Statistics and Probability',
                descriptions: [
                    'Explore the principles of statistics and probability theory.',
                    'Learn about data collection, analysis, and interpretation.',
                    'Discover the applications of statistics in various fields.',
                    'Understand the role of probability in decision-making.',
                    'Gain insights into the relationship between statistics and data science.',
                    'Examine the impact of statistical methods on research outcomes.',
                    'Analyze the ethical considerations in statistical analysis.'
                ]
            },
            {
                title: 'Linear Algebra',
                descriptions: [
                    'Explore the principles of linear algebra and vector spaces.',
                    'Learn about matrices, determinants, and eigenvalues.',
                    'Discover the applications of linear algebra in computer science and engineering.',
                    'Understand the relationship between linear algebra and geometry.',
                    'Gain insights into the role of linear algebra in data analysis.',
                    'Examine the impact of linear algebra on machine learning algorithms.',
                    'Analyze the ethical considerations in mathematical applications.'
                ]
            },
            {
                title: 'Discrete Mathematics',
                descriptions: [
                    'Explore the principles of discrete mathematics and combinatorics.',
                    'Learn about logic, set theory, and graph theory.',
                    'Discover the applications of discrete mathematics in computer science.',
                    'Understand the relationship between discrete mathematics and algorithms.',
                    'Gain insights into the role of discrete mathematics in cryptography.',
                    'Examine the impact of discrete mathematics on data structures.',
                    'Analyze the ethical considerations in mathematical modeling.'
                ]
            },
            {
                title: 'Mathematical Logic',
                descriptions: [
                    'Explore the principles of mathematical logic and proof techniques.',
                    'Learn about propositional and predicate logic.',
                    'Discover the applications of logic in computer science and philosophy.',
                    'Understand the relationship between logic and set theory.',
                    'Gain insights into the role of logic in formal verification.',
                    'Examine the impact of mathematical logic on theoretical computer science.',
                    'Analyze the ethical considerations in logical reasoning.'
                ]
            },
            {
                title: 'Number Theory',
                descriptions: [
                    'Explore the principles of number theory and its applications.',
                    'Learn about prime numbers, divisibility, and congruences.',
                    'Discover the role of number theory in cryptography and security.',
                    'Understand the relationship between number theory and algebra.',
                    'Gain insights into the applications of number theory in computer science.',
                    'Examine the impact of number theory on mathematical research.',
                    'Analyze the ethical considerations in mathematical applications.'
                ]
            },
            {
                title: 'Mathematical Modeling',
                descriptions: [
                    'Explore the principles of mathematical modeling and simulation.',
                    'Learn about differential equations and their applications.',
                    'Discover the role of modeling in science and engineering.',
                    'Understand the relationship between modeling and real-world problems.',
                    'Gain insights into the tools and techniques used in mathematical modeling.',
                    'Examine the impact of modeling on decision-making and strategy.',
                    'Analyze the ethical considerations in mathematical modeling.'
                ]
            }
        ]
    },
    {
        image: '/images/course-image-6.webp',
        courses: [
            {
                title: 'Organic Chemistry',
                descriptions: [
                    'Explore the principles of organic chemistry and molecular structure.',
                    'Learn about functional groups, reactions, and mechanisms.',
                    'Discover the applications of organic chemistry in pharmaceuticals and materials.',
                    'Understand the relationship between organic chemistry and biochemistry.',
                    'Gain insights into the role of organic chemistry in environmental science.',
                    'Examine the impact of organic chemistry on industrial processes.',
                    'Analyze the ethical considerations in organic chemistry research.'
                ]
            },
            {
                title: 'Inorganic Chemistry',
                descriptions: [
                    'Explore the principles of inorganic chemistry and coordination compounds.',
                    'Learn about periodic trends, bonding, and reactivity.',
                    'Discover the applications of inorganic chemistry in catalysis and materials science.',
                    'Understand the relationship between inorganic chemistry and solid-state chemistry.',
                    'Gain insights into the role of inorganic chemistry in environmental science.',
                    'Examine the impact of inorganic chemistry on industrial processes.',
                    'Analyze the ethical considerations in inorganic chemistry research.'
                ]
            },
            {
                title: 'Physical Chemistry',
                descriptions: [
                    'Explore the principles of physical chemistry and thermodynamics.',
                    'Learn about kinetics, equilibrium, and quantum mechanics.',
                    'Discover the applications of physical chemistry in materials science and nanotechnology.',
                    'Understand the relationship between physical chemistry and chemical engineering.',
                    'Gain insights into the role of physical chemistry in environmental science.',
                    'Examine the impact of physical chemistry on industrial processes.',
                    'Analyze the ethical considerations in physical chemistry research.'
                ]
            },
            {
                title: 'Analytical Chemistry',
                descriptions: [
                    'Explore the principles of analytical chemistry and instrumentation.',
                    'Learn about qualitative and quantitative analysis techniques.',
                    'Discover the applications of analytical chemistry in pharmaceuticals and forensics.',
                    'Understand the relationship between analytical chemistry and quality control.',
                    'Gain insights into the role of analytical chemistry in environmental monitoring.',
                    'Examine the impact of analytical chemistry on industrial processes.',
                    'Analyze the ethical considerations in analytical chemistry research.'
                ]
            },
            {
                title: 'Biochemistry',
                descriptions: [
                    'Explore the principles of biochemistry and molecular biology.',
                    'Learn about enzymes, metabolism, and genetic information.',
                    'Discover the applications of biochemistry in medicine and biotechnology.',
                    'Understand the relationship between biochemistry and cellular biology.',
                    'Gain insights into the role of biochemistry in drug development.',
                    'Examine the impact of biochemistry on health and disease.',
                    'Analyze the ethical considerations in biochemistry research.'
                ]
            },
            {
                title: 'Environmental Chemistry',
                descriptions: [
                    'Explore the principles of environmental chemistry and pollution.',
                    'Learn about chemical processes in the atmosphere, hydrosphere, and lithosphere.',
                    'Discover the applications of environmental chemistry in sustainability.',
                    'Understand the relationship between environmental chemistry and climate change.',
                    'Gain insights into the role of environmental chemistry in public health.',
                    'Examine the impact of environmental chemistry on ecosystems.',
                    'Analyze the ethical considerations in environmental chemistry research.'
                ]
            },
            {
                title: 'Materials Chemistry',
                descriptions: [
                    'Explore the principles of materials chemistry and solid-state chemistry.',
                    'Learn about polymers, ceramics, and nanomaterials.',
                    'Discover the applications of materials chemistry in electronics and energy storage.',
                    'Understand the relationship between materials chemistry and engineering.',
                    'Gain insights into the role of materials chemistry in nanotechnology.',
                    'Examine the impact of materials chemistry on industrial processes.',
                    'Analyze the ethical considerations in materials chemistry research.'
                ]
            },
            {
                title: 'Medicinal Chemistry',
                descriptions: [
                    'Explore the principles of medicinal chemistry and drug design.',
                    'Learn about structure-activity relationships and pharmacology.',
                    'Discover the applications of medicinal chemistry in pharmaceuticals.',
                    'Understand the relationship between medicinal chemistry and biochemistry.',
                    'Gain insights into the role of medicinal chemistry in drug discovery.',
                    'Examine the impact of medicinal chemistry on health and disease.',
                    'Analyze the ethical considerations in medicinal chemistry research.'
                ]
            }
        ]
    }
];

export async function seedCourse(client: PrismaClient) {
    const [categories, users, organizations] = await Promise.all([
        client.category.findMany(),
        client.user.findMany(),
        client.organization.findMany()
    ]);

    const difficulties = ['Beginner', 'Intermediate', 'Advanced'];

    const numCourses = 30;
    const courses: Course[] = [];

    for (let i = 0; i < numCourses; i++) {
        const isDiscounted = faker.datatype.boolean();
        const price = parseFloat(faker.finance.amount({ dec: 2, max: 1000.0, min: 0.01 }));
        const discountedPrice = price * faker.number.float({ max: 0.99, min: 0.01 });

        const category = faker.helpers.arrayElement(categories);
        const instructor = faker.helpers.arrayElement(users);
        const hasOrg = instructor.organizationId !== null;
        const organization = hasOrg
            ? organizations.find((org) => org.id === instructor.organizationId)
            : null;

        const courseItem = faker.helpers.arrayElement(courseSeeds);
        const courseSubItem = faker.helpers.arrayElement(courseItem.courses);
        const image = courseItem.image;
        const title = courseSubItem.title;
        const description = faker.helpers.arrayElement(courseSubItem.descriptions);

        const course: Course = {
            categoryId: category.id,
            currentPrice: new Prisma.Decimal(discountedPrice),
            description: description,
            difficulty: faker.helpers.arrayElement(difficulties),
            estimatedTimeHours: faker.number.int({ max: 100, min: 0 }),
            estimatedTimeMinutes: faker.number.int({ max: 59, min: 0 }),
            id: cuid(),
            imgHref: image,
            instructorId: instructor.id,
            lessonCount: 0,
            organizationId: organization?.id ?? null,
            originalPrice: isDiscounted
                ? new Prisma.Decimal(price)
                : new Prisma.Decimal(discountedPrice),
            ratingAverage: faker.number.float({ max: 5, min: 0 }),
            ratingCount: faker.number.int({ max: 1000, min: 0 }),
            recordType: 'SEED_RECORD',
            title: title
        };

        courses.push(course);
    }

    await client.course.createMany({ data: courses });
}
