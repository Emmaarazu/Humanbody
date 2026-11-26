export const SYSTEM_COLORS = {
  skeletal: '#e2d9ba',
  muscular: '#a85b50',
  cardiac: '#b96760',
  sensory: '#b0c8ce',
  arterial: '#c05245',
  venous: '#527c9f',
  nervous: '#d8b565',
  respiratory: '#b98991',
  digestive: '#b8916b',
  urinary: '#b47961',
  lymphatic: '#879f7c',
  endocrine: '#c5a09a',
  reproductive: '#bda098',
  integumentary: '#ba9b7d',
  connective: '#b0a89a',
};

export const SYSTEM_LABELS = {
  skeletal: 'Skeleton',
  muscular: 'Muscles',
  cardiac: 'Heart',
  sensory: 'Sensory',
  arterial: 'Arteries',
  venous: 'Veins',
  nervous: 'Nervous',
  respiratory: 'Respiratory',
  digestive: 'Digestive',
  urinary: 'Urinary',
  lymphatic: 'Lymphatic',
  endocrine: 'Endocrine',
  reproductive: 'Reproductive',
  integumentary: 'Skin / Surface',
  connective: 'Connective',
};

export const SYSTEM_DESCRIPTIONS = {
  skeletal:
    'Bones form the supporting framework of the body, protect internal organs, and provide attachment points for muscles.',
  muscular:
    'Skeletal muscles generate movement by pulling on their attachments. Together with tendons they move joints and stabilise posture.',
  cardiac:
    'The heart is a four-chambered muscular pump. Its valves direct blood through the pulmonary and systemic circuits.',
  sensory:
    'Specialised tissues detect stimuli and work with the nervous system to convey information about the environment and the body.',
  arterial:
    'Arteries carry blood away from the heart to supply tissues or, in the pulmonary circuit, to the lungs.',
  venous:
    'Veins return blood toward the heart. Superficial and deep networks collect blood from the tissues.',
  nervous:
    'The brain, spinal cord, and peripheral nerves carry and process signals that support sensation, movement, and coordination.',
  respiratory:
    'The airways conduct air to the lungs, where oxygen and carbon dioxide are exchanged between air and blood.',
  digestive:
    'The digestive tract breaks down food, absorbs nutrients, and moves waste onward.',
  urinary:
    'The kidneys filter blood and regulate fluid, electrolyte, and acid–base balance.',
  lymphatic:
    'Lymphatic vessels return excess tissue fluid to the circulation. Lymph nodes support immune surveillance.',
  endocrine:
    'Endocrine organs release hormones into the blood to coordinate metabolism, growth, and reproduction.',
  reproductive:
    'The reproductive structures contribute to gamete production, maturation, and sex hormone production.',
  integumentary:
    'The body surface provides an outer anatomical reference and contributes to sensation and temperature regulation.',
  connective:
    'Connective tissues support, bind, and protect other tissues and organs.',
};

export const ALL_SYSTEMS = Object.keys(SYSTEM_COLORS);

export const NAV_SECTIONS = [
  { id: 'overview', label: 'Overview', available: true },
  { id: 'skeletal', label: 'Skeleton', available: true },
  { id: 'muscular', label: 'Muscles', available: true },
  { id: 'organs', label: 'Organs', available: true },
  { id: 'arterial', label: 'Circulatory', available: true },
  { id: 'nervous', label: 'Nervous', available: true },
  { id: 'microscopic', label: 'Microscopic', available: false, comingSoon: true },
];

export const NAV_PRESETS = {
  overview: () => ALL_SYSTEMS,
  skeletal: () => ['skeletal'],
  muscular: () => ['muscular', 'skeletal'],
  organs: () => [
    'cardiac',
    'sensory',
    'respiratory',
    'digestive',
    'urinary',
    'lymphatic',
    'endocrine',
    'reproductive',
  ],
  arterial: () => ['arterial', 'venous', 'cardiac'],
  nervous: () => ['nervous'],
};