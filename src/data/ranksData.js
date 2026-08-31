export const RANKS_DATA = [
  {
    id: 'arrow_of_light',
    name: 'Arrow of Light',
    order: 1,
    description: 'The highest rank in Cub Scouting, preparing youth for transition to a Scouts BSA Troop.',
    color: 'yellow',
    categories: [
      {
        name: 'AOL Core Requirements',
        requirements: [
          { id: '1', number: '1', text: 'Be active in your Webelos den for at least six months since completing the fourth grade.' },
          { id: '2', number: '2', text: 'Complete the four required adventures: Building a Better World, Duty to God in Action, Outdoor Adventurer, and Personal Fitness.' },
          { id: '3', number: '3', text: 'Complete at least one elective adventure of your choice.' },
          { id: '4', number: '4', text: 'With your parent or guardian, complete the exercises in the pamphlet How to Protect Your Children From Child Abuse: A Parent\'s Guide.' }
        ]
      },
      {
        name: 'Transition & Scouts BSA Preparation',
        requirements: [
          { id: '5a', number: '5a', text: 'Repeat from memory the Scout Oath, Scout Law, Scout motto, and Scout slogan.' },
          { id: '5b', number: '5b', text: 'Demonstrate the Scout sign, salute, and handshake.' },
          { id: '5c', number: '5c', text: 'Describe the First Class Scout badge and tell what each part stands for.' },
          { id: '5d', number: '5d', text: 'Participate in a Webelos den hike, campout, or outdoor activity to prepare for Scouts BSA outings.' }
        ]
      }
    ]
  },
  {
    id: 'scout',
    name: 'Scout',
    order: 2,
    description: 'Basic scouting ideals, nodes, safety, and joining requirement milestones.',
    color: 'emerald',
    categories: [
      {
        name: 'Oath, Law, & Ideals',
        requirements: [
          { id: '1a', number: '1a', text: 'Repeat from memory the Scout Oath, Scout Law, Scout motto, and Scout slogan.' },
          { id: '1b', number: '1b', text: 'Explain what the Scout Oath, Scout Law, Scout motto, and Scout slogan mean to you.' },
          { id: '1c', number: '1c', text: 'Demonstrate the Scout sign, salute, and handshake.' },
          { id: '1d', number: '1d', text: 'Describe the Scout badge and explain its parts.' },
          { id: '1e', number: '1e', text: 'Repeat the Pledge of Allegiance and explain its significance.' },
          { id: '1f', number: '1f', text: 'Recite the Outdoor Code and explain how you will live by it.' }
        ]
      },
      {
        name: 'Patrol & Advancement',
        requirements: [
          { id: '2a', number: '2a', text: 'Explain the patrol method and its importance.' },
          { id: '2b', number: '2b', text: 'Describe how your patrol is organized and explain your patrol name, emblem, flag, and yell.' },
          { id: '2c', number: '2c', text: 'Explain the troop organization and the role of the patrol leader.' },
          { id: '2d', number: '2d', text: 'Explain the scouting advancement system and roles of leaders.' }
        ]
      },
      {
        name: 'Pioneering & Knots',
        requirements: [
          { id: '3a', number: '3a', text: 'Demonstrate tying the square knot, two half-hitches, and a taut-line hitch.' },
          { id: '3b', number: '3b', text: 'Explain how each knot/hitch is used in camping and outdoors.' }
        ]
      },
      {
        name: 'Rope Care',
        requirements: [
          { id: '4a', number: '4a', text: 'Demonstrate how to whip and fuse the ends of a rope.' }
        ]
      },
      {
        name: 'Pocketknife Safety',
        requirements: [
          { id: '5', number: '5', text: 'Demonstrate folding pocketknife safety and explain the rules for using one.' }
        ]
      },
      {
        name: 'Abuse Prevention',
        requirements: [
          { id: '6', number: '6', text: 'Complete the pamphlet exercises on youth abuse prevention with your parent or guardian.' }
        ]
      },
      {
        name: 'Scoutmaster Conference',
        requirements: [
          { id: '7', number: '7', text: 'Participate in a Scoutmaster conference.' }
        ]
      }
    ]
  },
  {
    id: 'tenderfoot',
    name: 'Tenderfoot',
    order: 3,
    description: 'Basic outdoor survival, tool safety, flags, and physical fitness goals.',
    color: 'teal',
    categories: [
      {
        name: 'Camping & Outdoor',
        requirements: [
          { id: '1a', number: '1a', text: 'Present yourself to your leader, prepared for an overnight camping trip. Show personal/camping gear and pack it correctly.' },
          { id: '1b', number: '1b', text: 'Spend at least one night on a patrol/troop campout in a tent you helped pitch.' },
          { id: '1c', number: '1c', text: 'Explain how you practiced the Outdoor Code on your campout.' }
        ]
      },
      {
        name: 'Cooking & Food Safety',
        requirements: [
          { id: '2a', number: '2a', text: 'On the campout, assist in preparing one of the patrol meals.' },
          { id: '2b', number: '2b', text: 'Show you know how to safely store food and wash dishes in camp.' },
          { id: '2c', number: '2c', text: 'Explain what to do if you suspect water is contaminated.' }
        ]
      },
      {
        name: 'Tools & Fire Safety',
        requirements: [
          { id: '3a', number: '3a', text: 'Demonstrate how to safely use and care for a pocketknife, camp shovel, and camp ax.' },
          { id: '3b', number: '3b', text: 'Tell how to safely build a fire and when to use camp stoves.' },
          { id: '3c', number: '3c', text: 'Properly whip and fuse the ends of a rope.' },
          { id: '3d', number: '3d', text: 'Tie the square knot, two half-hitches, and a taut-line hitch and use them on a campout.' }
        ]
      },
      {
        name: 'First Aid',
        requirements: [
          { id: '4a', number: '4a', text: 'Demonstrate first aid for minor cuts, scrapes, burns, insect stings, and minor nosebleeds.' },
          { id: '4b', number: '4b', text: 'Demonstrate first aid for poisonous plants (poison ivy/oak/sumac) and tick bites.' },
          { id: '4c', number: '4c', text: 'Show how to treat hyperthermia, hypothermia, and dehydration.' },
          { id: '4d', number: '4d', text: 'Show how to treat minor blisters and tell how to prevent them.' }
        ]
      },
      {
        name: 'Physical Fitness',
        requirements: [
          { id: '5a', number: '5a', text: 'Record your best performance for: push-ups, pull-ups, sit-ups, and the 1-mile run.' },
          { id: '5b', number: '5b', text: 'Show you are following a physical fitness plan for 30 days.' },
          { id: '5c', number: '5c', text: 'Retest yourself after 30 days and compare results.' }
        ]
      },
      {
        name: 'Citizenship & Flags',
        requirements: [
          { id: '6a', number: '6a', text: 'Demonstrate how to properly fold the American flag.' },
          { id: '6b', number: '6b', text: 'Participate in a flag ceremony or explain the history of the American flag.' }
        ]
      },
      {
        name: 'Advancement Review',
        requirements: [
          { id: '7a', number: '7a', text: 'Participate in a Scoutmaster conference.' },
          { id: '7b', number: '7b', text: 'Successfully complete your Tenderfoot board of review.' }
        ]
      }
    ]
  },
  {
    id: 'second_class',
    name: 'Second Class',
    order: 4,
    description: 'Map navigation, outdoor swimming, wildlife identification, and community service.',
    color: 'cyan',
    categories: [
      {
        name: 'Outdoor & Cooking',
        requirements: [
          { id: '1a', number: '1a', text: 'Participate in 5 troop/patrol activities, at least 3 held outdoors. Spend 3 nights camping.' },
          { id: '1b', number: '1b', text: 'Explain how to prepare a patrol meal and cook it on a campout.' },
          { id: '1c', number: '1c', text: 'Show how to build a fire under damp/wet conditions.' }
        ]
      },
      {
        name: 'Navigation & Mapping',
        requirements: [
          { id: '2a', number: '2a', text: 'Show how to orient a map using a compass and find your current position.' },
          { id: '2b', number: '2b', text: 'Explain the difference between using a compass vs a GPS unit.' },
          { id: '2c', number: '2c', text: 'Complete a 1-mile bearing route using map and compass.' }
        ]
      },
      {
        name: 'Nature & Environment',
        requirements: [
          { id: '3a', number: '3a', text: 'Identify or show evidence of 10 native animal species found in your local area.' },
          { id: '3b', number: '3b', text: 'Discuss Leave No Trace and outdoor ethics.' }
        ]
      },
      {
        name: 'Swimming & Water Rescue',
        requirements: [
          { id: '4a', number: '4a', text: 'Pass the BSA beginner swim test.' },
          { id: '4b', number: '4b', text: 'Demonstrate reach and throw water rescue methods.' }
        ]
      },
      {
        name: 'First Aid',
        requirements: [
          { id: '5a', number: '5a', text: 'Show first aid for head injuries, animal bites, and sprains.' },
          { id: '5b', number: '5b', text: 'Show first aid for fractures, dislocations, and snakebites.' },
          { id: '5c', number: '5c', text: 'Explain how to treat heatstroke, sunstroke, and frostbite.' }
        ]
      },
      {
        name: 'Citizenship & Service',
        requirements: [
          { id: '6a', number: '6a', text: 'Participate in at least 2 hours of community service.' },
          { id: '6b', number: '6b', text: 'Demonstrate Scout spirit by living the Scout Oath and Law in daily life.' }
        ]
      },
      {
        name: 'Advancement Review',
        requirements: [
          { id: '7a', number: '7a', text: 'Participate in a Scoutmaster conference.' },
          { id: '7b', number: '7b', text: 'Successfully complete your Second Class board of review.' }
        ]
      }
    ]
  },
  {
    id: 'first_class',
    name: 'First Class',
    order: 5,
    description: 'Pioneering lashings, plant identification, advanced CPR, and citizenship rights.',
    color: 'yellow',
    categories: [
      {
        name: 'Outdoor & Navigation',
        requirements: [
          { id: '1a', number: '1a', text: 'Participate in 10 troop/patrol activities, at least 6 held outdoors. Spend 6 nights camping.' },
          { id: '1b', number: '1b', text: 'Serve as head cook on a campout, planning and preparing meals.' },
          { id: '1c', number: '1c', text: 'Complete an orienteering course covering at least one mile.' }
        ]
      },
      {
        name: 'Pioneering & Rigging',
        requirements: [
          { id: '2a', number: '2a', text: 'Demonstrate tying the timber hitch, clove hitch, and bowline.' },
          { id: '2b', number: '2b', text: 'Demonstrate square, diagonal, and shear lashings.' },
          { id: '2c', number: '2c', text: 'Use lashings to build a useful camp gadget.' }
        ]
      },
      {
        name: 'Nature & Wildlife',
        requirements: [
          { id: '3a', number: '3a', text: 'Identify 10 native plant species in your local area.' },
          { id: '3b', number: '3b', text: 'Explain how plants are important to the environment.' }
        ]
      },
      {
        name: 'First Aid & CPR',
        requirements: [
          { id: '4a', number: '4a', text: 'Demonstrate first aid for deep wounds, severe bleeding, and shock.' },
          { id: '4b', number: '4b', text: 'Explain the steps in CPR and when to use an AED.' },
          { id: '4c', number: '4c', text: 'Show how to construct a temporary stretcher and transport an injured person.' }
        ]
      },
      {
        name: 'Swimming & Water Safety',
        requirements: [
          { id: '5a', number: '5a', text: 'Pass the BSA swimmer test.' },
          { id: '5b', number: '5b', text: 'Explain water safety and rescue procedures.' }
        ]
      },
      {
        name: 'Citizenship & Service',
        requirements: [
          { id: '6a', number: '6a', text: 'Participate in at least 3 hours of community service.' },
          { id: '6b', number: '6b', text: 'Identify and explain the rights and duties of a citizen.' }
        ]
      },
      {
        name: 'Advancement Review',
        requirements: [
          { id: '7a', number: '7a', text: 'Participate in a Scoutmaster conference.' },
          { id: '7b', number: '7b', text: 'Successfully complete your First Class board of review.' }
        ]
      }
    ]
  },
  {
    id: 'star',
    name: 'Star',
    order: 6,
    description: 'Active leadership role, six merit badges, and service hours.',
    color: 'orange',
    categories: [
      {
        name: 'Active & Spirit',
        requirements: [
          { id: '1', number: '1', text: 'Be active in your troop/patrol for at least 4 months as a First Class Scout.' },
          { id: '2', number: '2', text: 'Demonstrate Scout spirit by living the Scout Oath and Law.' }
        ]
      },
      {
        name: 'Merit Badges',
        requirements: [
          { id: '3a', number: '3a', text: 'Earn at least 6 merit badges.' },
          { id: '3b', number: '3b', text: 'Ensure at least 4 of those 6 badges are from the Eagle-required list.' }
        ]
      },
      {
        name: 'Service & Leadership',
        requirements: [
          { id: '4', number: '4', text: 'Take part in service projects totaling at least 6 hours of work.' },
          { id: '5', number: '5', text: 'Serve actively for 4 months in a leadership position of responsibility.' }
        ]
      },
      {
        name: 'Advancement Review',
        requirements: [
          { id: '6', number: '6', text: 'Participate in a Scoutmaster conference.' },
          { id: '7', number: '7', text: 'Successfully complete your Star board of review.' }
        ]
      }
    ]
  },
  {
    id: 'life',
    name: 'Life',
    order: 7,
    description: 'Mentorship of younger scouts, conservation work, and leadership responsibility.',
    color: 'red',
    categories: [
      {
        name: 'Active & Spirit',
        requirements: [
          { id: '1', number: '1', text: 'Be active in your troop/patrol for at least 6 months as a Star Scout.' },
          { id: '2', number: '2', text: 'Demonstrate Scout spirit by living the Scout Oath and Law.' }
        ]
      },
      {
        name: 'Merit Badges',
        requirements: [
          { id: '3', number: '3', text: 'Earn 5 additional merit badges (total 11), with at least 3 being Eagle-required.' }
        ]
      },
      {
        name: 'Service & Leadership',
        requirements: [
          { id: '4', number: '4', text: 'Take part in service projects totaling at least 6 hours, with at least 3 hours focused on conservation.' },
          { id: '5', number: '5', text: 'Serve actively for 6 months in a leadership position of responsibility.' }
        ]
      },
      {
        name: 'Mentorship',
        requirements: [
          { id: '6', number: '6', text: 'Use the Teaching EDGE method to teach/mentor younger scouts in a scout skill.' }
        ]
      },
      {
        name: 'Advancement Review',
        requirements: [
          { id: '7', number: '7', text: 'Participate in a Scoutmaster conference.' },
          { id: '8', number: '8', text: 'Successfully complete your Life board of review.' }
        ]
      }
    ]
  },
  {
    id: 'eagle',
    name: 'Eagle Scout',
    order: 8,
    description: 'The highest rank in Scouting. Requires 21 merit badges and an Eagle Service Project.',
    color: 'purple',
    categories: [
      {
        name: 'Active & Spirit',
        requirements: [
          { id: '1', number: '1', text: 'Be active in your troop/patrol for at least 6 months as a Life Scout.' },
          { id: '2', number: '2', text: 'Demonstrate Scout spirit by living the Scout Oath and Law.' }
        ]
      },
      {
        name: 'Merit Badges',
        requirements: [
          { id: '3', number: '3', text: 'Earn a total of 21 merit badges, including 14 specific Eagle-required badges.' }
        ]
      },
      {
        name: 'Leadership',
        requirements: [
          { id: '4', number: '4', text: 'Serve actively for 6 months in a leadership position of responsibility.' }
        ]
      },
      {
        name: 'Eagle Service Project',
        requirements: [
          { id: '5a', number: '5a', text: 'Plan a helpful community service project and get it approved.' },
          { id: '5b', number: '5b', text: 'Develop and give leadership to others in executing your Eagle project.' },
          { id: '5c', number: '5c', text: 'Complete the project workbook and document the project results.' }
        ]
      },
      {
        name: 'Advancement Review',
        requirements: [
          { id: '6', number: '6', text: 'Participate in a Scoutmaster conference.' },
          { id: '7', number: '7', text: 'Successfully complete your Eagle Scout board of review.' }
        ]
      }
    ]
  }
];
