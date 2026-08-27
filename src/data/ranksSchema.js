// Static reference dataset: all 7 BSA Scouting ranks with hierarchical requirements.
// Each rank has categories, each category has numbered/lettered requirements.

export const RANKS = [
  'Scout',
  'Tenderfoot',
  'Second Class',
  'First Class',
  'Star',
  'Life',
  'Eagle',
];

export const RANKS_SCHEMA = {
  Scout: {
    label: 'Scout',
    color: 'emerald',
    categories: [
      {
        name: 'Joining Requirements',
        requirements: [
          { id: '1', number: '1', description: 'Meet the age requirements: be a boy who is 11 years old, or one who has completed the fifth grade or earned the Arrow of Light Award.' },
          { id: '2', number: '2', description: 'Find a Scout troop near your home.' },
          { id: '3', number: '3', description: 'Complete a Boy Scout application and health history signed by your parent or guardian.' },
          { id: '4', number: '4', description: 'Repeat the Pledge of Allegiance.' },
          { id: '5', number: '5', description: 'Demonstrate the Scout sign, salute, and handshake.' },
          { id: '6', number: '6', description: 'Demonstrate tying the square knot (a joining knot).' },
          { id: '7', number: '7', description: 'Understand and agree to live by the Scout Oath, Scout Law, Scout motto, and Scout slogan and the Outdoor Code.' },
          { id: '8', number: '8', description: 'Describe the Scout badge.' },
          { id: '9', number: '9', description: 'Complete the pamphlet exercises with your parent or guardian and Scoutmaster.' },
          { id: '10', number: '10', description: 'Participate in a Scoutmaster conference.' },
        ],
      },
    ],
  },

  Tenderfoot: {
    label: 'Tenderfoot',
    color: 'teal',
    categories: [
      {
        name: 'Camping & Outdoor',
        requirements: [
          { id: '1a', number: '1a', description: 'Present yourself to your leader, prepared for an overnight camping trip. Show the personal and camping gear you will use. Show the right way to pack and carry it.' },
          { id: '1b', number: '1b', description: 'Spend at least one night on a patrol or troop campout. Sleep in a tent you have helped pitch.' },
          { id: '1c', number: '1c', description: 'Tell how you practiced the Outdoor Code on a campout or outing.' },
        ],
      },
      {
        name: 'Cooking & Nutrition',
        requirements: [
          { id: '2a', number: '2a', description: 'On the campout, assist in preparing one of the meals. Tell why it is important for each patrol member to share in meal preparation and cleanup.' },
          { id: '2b', number: '2b', description: 'While on a campout, demonstrate the principles of Leave No Trace.' },
          { id: '2c', number: '2c', description: 'Explain the importance of eating together as a patrol.' },
        ],
      },
      {
        name: 'First Aid & Safety',
        requirements: [
          { id: '3a', number: '3a', description: 'Demonstrate how to find directions during the day and at night without using a compass.' },
          { id: '3b', number: '3b', description: 'Demonstrate how to use a map and compass.' },
          { id: '4a', number: '4a', description: 'Demonstrate how to properly care for and sharpen a pocketknife.' },
          { id: '4b', number: '4b', description: 'With the guidance of an adult, demonstrate how to safely use a pocketknife.' },
          { id: '5', number: '5', description: 'Demonstrate the Heimlich maneuver and tell when it is used.' },
          { id: '6a', number: '6a', description: 'Demonstrate first aid for the following: object in the eye, bite of a warm-blooded animal, puncture wounds from a splinter or nail, serious cuts and lacerations, blisters, and minor burns or scalds.' },
          { id: '6b', number: '6b', description: 'Show what to do for "hurry cases" of stopped breathing, stroke, severe bleeding, and ingested poisoning.' },
          { id: '6c', number: '6c', description: 'Tell the five most common signs of a heart attack. Explain the steps (CALL-PUSH-VENTILATE) in cardiopulmonary resuscitation (CPR).' },
        ],
      },
      {
        name: 'Citizenship & Values',
        requirements: [
          { id: '7a', number: '7a', description: "Tell someone who is eligible to join Boy Scouts, or an inactive Boy Scout, about your troop's activities. Invite him to an outing, activity, service project, or meeting." },
          { id: '7b', number: '7b', description: "Share a meal with your family, and explain to them what the Scout Oath and Law mean to you." },
          { id: '7c', number: '7c', description: 'Demonstrate the Scout sign, salute, and handshake. Recite from memory the Scout Oath, Scout Law, Scout motto, and Scout slogan.' },
          { id: '8', number: '8', description: "Describe the steps in Scouting's Teaching EDGE method. Use the Teaching EDGE method to teach another person how to tie the square knot." },
          { id: '9', number: '9', description: 'Demonstrate your knowledge of the requirements to earn the Cyber Chip award for your age.' },
          { id: '10', number: '10', description: 'Participate in a Scoutmaster conference.' },
          { id: '11', number: '11', description: 'Successfully complete your board of review.' },
        ],
      },
    ],
  },

  'Second Class': {
    label: 'Second Class',
    color: 'cyan',
    categories: [
      {
        name: 'Camping & Outdoor',
        requirements: [
          { id: '1a', number: '1a', description: 'Since joining, participate in five separate troop/patrol activities, at least three of which must be held outdoors.' },
          { id: '1b', number: '1b', description: 'Camp a total of at least 10 nights since joining. Sleep each night under the sky or in a tent you have pitched.' },
        ],
      },
      {
        name: 'Cooking & Nutrition',
        requirements: [
          { id: '2a', number: '2a', description: 'Explain when it is appropriate to substitute cooking methods.' },
          { id: '2b', number: '2b', description: 'On one campout, plan and cook one hot breakfast or lunch, selecting foods from MyPlate or the current USDA nutritional model.' },
          { id: '2c', number: '2c', description: 'Demonstrate how to transport and store food to prevent it from spoiling.' },
          { id: '2d', number: '2d', description: "On one campout, serve as your patrol's cook, demonstrating proper meal cleanup." },
        ],
      },
      {
        name: 'Navigation',
        requirements: [
          { id: '3a', number: '3a', description: 'Since joining, demonstrate on three separate occasions that you can identify locations on a map.' },
          { id: '3b', number: '3b', description: 'Demonstrate how to use a compass, map, and online mapping tools to plot a course.' },
          { id: '3c', number: '3c', description: 'Use a map to determine UTM/MGRS coordinates for two points in your local area.' },
        ],
      },
      {
        name: 'Nature & Environment',
        requirements: [
          { id: '4', number: '4', description: 'Identify or show evidence of at least 10 kinds of wild animals (birds, mammals, reptiles, fish, or insects) found in your local area or camping location.' },
          { id: '5a', number: '5a', description: 'Tell what precautions must be taken for a safe swim.' },
          { id: '5b', number: '5b', description: 'Demonstrate that you are able to jump feetfirst into water over your head in depth, level off, and swim 25 feet on the surface, stop, turn sharply, resume swimming, then return to your starting place.' },
          { id: '5c', number: '5c', description: 'Demonstrate water rescue methods by reaching with your arm or leg, by reaching with a suitable object, and by throwing lines and objects.' },
        ],
      },
      {
        name: 'First Aid & Safety',
        requirements: [
          { id: '6a', number: '6a', description: 'Demonstrate first aid for the following: second- and third-degree burns; bloody nose; frostbite and sunstroke; muscle cramps; obstructed airway.' },
          { id: '6b', number: '6b', description: 'Show what to do for "hurry cases" of stopped breathing, stroke, severe bleeding, and ingested poisoning.' },
          { id: '6c', number: '6c', description: 'Tell the five most common signs of a heart attack. Explain the steps in CPR.' },
          { id: '6d', number: '6d', description: 'Demonstrate how to handle a poisoning emergency.' },
          { id: '6e', number: '6e', description: 'Show first aid for two or three victims in a simulated emergency.' },
          { id: '6f', number: '6f', description: 'Tell the first steps you should take to help in a vehicle accident.' },
          { id: '6g', number: '6g', description: 'Explain what a bee sting kit is and how you would use it.' },
        ],
      },
      {
        name: 'Citizenship & Values',
        requirements: [
          { id: '7a', number: '7a', description: 'After attending three troop meetings, explain what the patrol method is and how it works in your troop.' },
          { id: '7b', number: '7b', description: 'Explain the patrol method and why it is an important part of Boy Scouts.' },
          { id: '8a', number: '8a', description: 'Tell your patrol leader or Scoutmaster how you have lived the Scout Oath and Scout Law in your daily life.' },
          { id: '8b', number: '8b', description: 'Explain what good citizenship means to you and what it means to be a good citizen in your community.' },
          { id: '9', number: '9', description: 'Participate in a Scoutmaster conference.' },
          { id: '10', number: '10', description: 'Successfully complete your board of review.' },
        ],
      },
    ],
  },

  'First Class': {
    label: 'First Class',
    color: 'yellow',
    categories: [
      {
        name: 'Camping & Outdoor',
        requirements: [
          { id: '1', number: '1', description: 'Since joining, participate in 10 separate troop/patrol activities, at least six of which must be held outdoors. Of the outdoor activities, at least three must include overnight camping.' },
        ],
      },
      {
        name: 'Cooking & Nutrition',
        requirements: [
          { id: '2a', number: '2a', description: "Help plan a menu for one of your patrol's campouts that includes at least one breakfast, one lunch, and one dinner." },
          { id: '2b', number: '2b', description: "On a campout, serve as your patrol's cook for one breakfast, one lunch, and one dinner. Explain the importance of good nutrition." },
          { id: '2c', number: '2c', description: 'Demonstrate how to transport, store, and prepare foods to prevent foodborne illness. Tell what common pests and bacteria cause foodborne illness.' },
          { id: '2d', number: '2d', description: 'Discuss nutritional requirements for a Scout on a campout.' },
          { id: '2e', number: '2e', description: 'Tell how to select and care for a patrol cooking kit.' },
          { id: '2f', number: '2f', description: 'Discuss how to plan for eating during emergency situations.' },
        ],
      },
      {
        name: 'Navigation',
        requirements: [
          { id: '3a', number: '3a', description: 'Using a map and compass, complete an orienteering course that covers at least one mile and requires measuring the height and/or width of designated items.' },
          { id: '3b', number: '3b', description: 'Demonstrate how to use a handheld GPS unit. Download and use a topographic map from the internet.' },
        ],
      },
      {
        name: 'Nature & Environment',
        requirements: [
          { id: '4', number: '4', description: 'Identify or show evidence of at least 10 kinds of native plants found in your local area or campsite location.' },
          { id: '5a', number: '5a', description: 'Tell what precautions must be taken for a safe trip afloat.' },
          { id: '5b', number: '5b', description: 'Demonstrate your ability to pass the BSA swimmer test.' },
          { id: '5c', number: '5c', description: 'With a helper and a practice victim, show a line rescue both as tender and as rescuer.' },
        ],
      },
      {
        name: 'First Aid & Safety',
        requirements: [
          { id: '7a', number: '7a', description: 'Demonstrate bandaging for a sprained ankle and for injuries on the head, the upper arm, and the collarbone.' },
          { id: '7b', number: '7b', description: 'By yourself and with a partner, show that you can transport a person from a smoke-filled room.' },
          { id: '7c', number: '7c', description: 'Tell the five most common signs of a heart attack. Explain the steps in CPR.' },
          { id: '7d', number: '7d', description: 'Tell what steps to take in the proper handling of a spinal injury.' },
          { id: '7e', number: '7e', description: 'By yourself, demonstrate the correct way to treat heat exhaustion.' },
          { id: '7f', number: '7f', description: 'Demonstrate dressing and care for a wound.' },
          { id: '7g', number: '7g', description: "Demonstrate the proper way to move an injured person, including the fireman's carry." },
        ],
      },
      {
        name: 'Leadership & Citizenship',
        requirements: [
          { id: '9a', number: '9a', description: 'Visit and discuss the historical significance of a national monument or landmark.' },
          { id: '9b', number: '9b', description: 'Tour a facility where your local government operates or provides a service.' },
          { id: '9c', number: '9c', description: 'Explain what citizenship in the nation means and what it means to you to be a good citizen in your community.' },
          { id: '10', number: '10', description: "Tell someone who is eligible to join Boy Scouts about your troop's activities." },
          { id: '11', number: '11', description: 'Participate in a Scoutmaster conference.' },
          { id: '12', number: '12', description: 'Successfully complete your board of review.' },
        ],
      },
    ],
  },

  Star: {
    label: 'Star',
    color: 'orange',
    categories: [
      {
        name: 'Merit Badges & Advancement',
        requirements: [
          { id: '1', number: '1', description: 'Be active in your troop and patrol for at least four months as a First Class Scout.' },
          { id: '2', number: '2', description: 'Demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God, how you have lived four points of the Scout Law in your everyday life.' },
          { id: '3', number: '3', description: 'Earn six merit badges, including any four from the required list for Eagle Scout.' },
          { id: '4', number: '4', description: 'While a First Class Scout, take part in service projects totaling at least six hours of work. These projects must be approved by your Scoutmaster.' },
        ],
      },
      {
        name: 'Leadership',
        requirements: [
          { id: '5', number: '5', description: 'While a First Class Scout, serve actively for four months in one or more positions of responsibility (patrol leader, assistant senior patrol leader, senior patrol leader, etc.).' },
        ],
      },
      {
        name: 'Citizenship & Values',
        requirements: [
          { id: '6', number: '6', description: 'While a First Class Scout, use the Teaching EDGE method to teach a younger Scout a Scout skill.' },
          { id: '7', number: '7', description: 'Participate in a Scoutmaster conference.' },
          { id: '8', number: '8', description: 'Successfully complete your board of review.' },
        ],
      },
    ],
  },

  Life: {
    label: 'Life',
    color: 'red',
    categories: [
      {
        name: 'Merit Badges & Advancement',
        requirements: [
          { id: '1', number: '1', description: 'Be active in your troop and patrol for at least six months as a Star Scout.' },
          { id: '2', number: '2', description: 'Demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God, how you have lived four points of the Scout Law in your everyday life.' },
          { id: '3', number: '3', description: 'Earn five more merit badges (so that you have 11 in all), including any three more from the required list for Eagle Scout.' },
          { id: '4', number: '4', description: 'While a Star Scout, take part in service projects totaling at least six hours of work. These projects must be approved by your Scoutmaster.' },
        ],
      },
      {
        name: 'Leadership',
        requirements: [
          { id: '5', number: '5', description: 'While a Star Scout, serve actively for six months in one or more positions of responsibility (patrol leader, assistant senior patrol leader, senior patrol leader, etc.).' },
        ],
      },
      {
        name: 'Citizenship & Values',
        requirements: [
          { id: '6', number: '6', description: 'While a Star Scout, use the Teaching EDGE method to teach a younger Scout a Scout skill.' },
          { id: '7', number: '7', description: 'Participate in a Scoutmaster conference.' },
          { id: '8', number: '8', description: 'Successfully complete your board of review.' },
        ],
      },
    ],
  },

  Eagle: {
    label: 'Eagle Scout',
    color: 'purple',
    categories: [
      {
        name: 'Merit Badges & Service',
        requirements: [
          { id: '1', number: '1', description: 'Be active in your troop and patrol for at least six months as a Life Scout.' },
          { id: '2', number: '2', description: 'Demonstrate Scout spirit by living the Scout Oath and Scout Law. Tell how you have done your duty to God, how you have lived four points of the Scout Law in your everyday life.' },
          { id: '3', number: '3', description: 'Earn a total of 21 merit badges (10 more than required for Life), including these 13 required badges: First Aid, Citizenship in the Community, Citizenship in the Nation, Citizenship in the World, Communication, Cooking, Personal Fitness, Emergency Preparedness or Lifesaving, Environmental Science or Sustainability, Personal Management, Swimming or Hiking or Cycling, Camping, and Family Life.' },
        ],
      },
      {
        name: 'Eagle Project',
        requirements: [
          { id: '4', number: '4', description: 'While a Life Scout, plan, develop, and give leadership to others in a service project helpful to any religious institution, any school, or your community. The project must benefit an organization other than the Boy Scouts of America. A project proposal must be approved by the organization benefiting from the effort, your unit leader, unit committee, and the council or district before you start.' },
        ],
      },
      {
        name: 'Leadership',
        requirements: [
          { id: '5', number: '5', description: 'While a Life Scout, serve actively for six months in one or more positions of responsibility.' },
          { id: '6', number: '6', description: 'While a Life Scout, use the Teaching EDGE method to teach a younger Scout a Scout skill.' },
        ],
      },
      {
        name: 'Board of Review',
        requirements: [
          { id: '7', number: '7', description: 'Participate in a Scoutmaster conference.' },
          { id: '8', number: '8', description: 'Successfully complete your Eagle Scout board of review.' },
        ],
      },
    ],
  },
};

export const RANK_COLORS = {
  emerald: {
    badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    active: 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40',
    ring: 'ring-emerald-500',
    bar: 'bg-emerald-500',
    text: 'text-emerald-400',
    checkDone: 'text-emerald-400',
    border: 'border-emerald-800/50',
    bg: 'bg-emerald-950/20',
  },
  teal: {
    badge: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
    active: 'bg-teal-600 text-white shadow-lg shadow-teal-900/40',
    ring: 'ring-teal-500',
    bar: 'bg-teal-500',
    text: 'text-teal-400',
    checkDone: 'text-teal-400',
    border: 'border-teal-800/50',
    bg: 'bg-teal-950/20',
  },
  cyan: {
    badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
    active: 'bg-cyan-600 text-white shadow-lg shadow-cyan-900/40',
    ring: 'ring-cyan-500',
    bar: 'bg-cyan-500',
    text: 'text-cyan-400',
    checkDone: 'text-cyan-400',
    border: 'border-cyan-800/50',
    bg: 'bg-cyan-950/20',
  },
  yellow: {
    badge: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    active: 'bg-yellow-600 text-white shadow-lg shadow-yellow-900/40',
    ring: 'ring-yellow-500',
    bar: 'bg-yellow-500',
    text: 'text-yellow-400',
    checkDone: 'text-yellow-400',
    border: 'border-yellow-800/50',
    bg: 'bg-yellow-950/20',
  },
  orange: {
    badge: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    active: 'bg-orange-600 text-white shadow-lg shadow-orange-900/40',
    ring: 'ring-orange-500',
    bar: 'bg-orange-500',
    text: 'text-orange-400',
    checkDone: 'text-orange-400',
    border: 'border-orange-800/50',
    bg: 'bg-orange-950/20',
  },
  red: {
    badge: 'bg-red-500/20 text-red-300 border-red-500/30',
    active: 'bg-red-600 text-white shadow-lg shadow-red-900/40',
    ring: 'ring-red-500',
    bar: 'bg-red-500',
    text: 'text-red-400',
    checkDone: 'text-red-400',
    border: 'border-red-800/50',
    bg: 'bg-red-950/20',
  },
  purple: {
    badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    active: 'bg-purple-600 text-white shadow-lg shadow-purple-900/40',
    ring: 'ring-purple-500',
    bar: 'bg-purple-500',
    text: 'text-purple-400',
    checkDone: 'text-purple-400',
    border: 'border-purple-800/50',
    bg: 'bg-purple-950/20',
  },
};
