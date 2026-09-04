// Official Scouting America Merit Badges Dataset with Complete Requirements, Workbooks, Pamphlets, and Official Links
// Sources: 
// 1. https://www.scouting.org/skills/merit-badges/
// 2. http://www.usscouts.org/mb/mbbooks.asp
// 3. http://usscouts.org/meritbadges.asp

export const TOTAL_EAGLE_REQUIRED_FOR_RANK = 14;
export const TOTAL_MERIT_BADGES_FOR_EAGLE = 21;

export const MERIT_BADGES = [
  {
    "id": "camping",
    "name": "Camping",
    "eagleRequired": true,
    "description": "Learn outdoor skills and spend nights camping.",
    "pageUrl": "http://usscouts.org/mb/mb001.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Camping.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Camping.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Show, on a map, the location of at least two established campsites near your home"
      },
      {
        "id": "2a",
        "text": "Make a list of personal and patrol camping gear for an overnight camping trip"
      },
      {
        "id": "2b",
        "text": "Show you can properly pack and carry your personal camping gear"
      },
      {
        "id": "3a",
        "text": "Demonstrate how to make a fire without matches using flint and steel or a bow drill"
      },
      {
        "id": "3b",
        "text": "Demonstrate how to use a camp stove safely"
      },
      {
        "id": "4a",
        "text": "Help plan and prepare at least five different meals cooked on a camping trip"
      },
      {
        "id": "4b",
        "text": "Demonstrate the proper method of disposing of garbage at a campsite"
      },
      {
        "id": "5",
        "text": "Describe the principles of Leave No Trace and tread lightly"
      },
      {
        "id": "6",
        "text": "Discuss the principles of conservation and preservation of natural resources"
      },
      {
        "id": "7a",
        "text": "On 10 camping trips (each at least one night), record weather, temperature, and related info"
      },
      {
        "id": "7b",
        "text": "Explain how to organize a camping trip to a national or state park"
      },
      {
        "id": "8",
        "text": "Discuss how to handle emergency situations in the outdoors"
      },
      {
        "id": "9",
        "text": "Survey your patrol to determine individual camping skills and plan improvements"
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "20 Days and 20 Nights Campout Log",
    "timeAlert": "Requires 20 days and nights of camping (including one long-term campout of up to 6 consecutive nights).",
    "eagleTip": "Log every troop campout and summer camp in your scout handbook or app journal.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/camping/",
    "usScoutsUrl": "http://usscouts.org/mb/mb001.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Camping Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/camping/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Camping%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "citizenship-in-the-community",
    "name": "Citizenship in the Community",
    "eagleRequired": true,
    "description": "Explore your rights and duties in your community.",
    "pageUrl": "http://usscouts.org/mb/mb002.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Citizenship-in-the-Community.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Citizenship-in-the-Community.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss with your counselor what citizenship in the community means"
      },
      {
        "id": "2",
        "text": "Study the history of your community and share findings"
      },
      {
        "id": "3",
        "text": "Attend a meeting of your city or town council or the local school board"
      },
      {
        "id": "4",
        "text": "Attend a meeting of the courts in your community"
      },
      {
        "id": "5",
        "text": "Choose a charitable organization and describe its goals and activities"
      },
      {
        "id": "6",
        "text": "List the services provided by your local fire, police, and emergency departments"
      },
      {
        "id": "7",
        "text": "Complete a service project for your community"
      }
    ],
    "category": "Civics & Citizenship",
    "timeCommitment": "Community Research & Meeting Attendance",
    "timeAlert": "Requires attending a public city/town council meeting or interview with a government official.",
    "eagleTip": "Attend a municipal town hall meeting or research national legislative bills ahead of time.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/citizenship-in-the-community/",
    "usScoutsUrl": "http://usscouts.org/mb/mb002.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Citizenship in the Community Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2015",
    "pamphletUrl": "https://www.scouting.org/merit-badges/citizenship-in-the-community/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Citizenship%20in%20the%20Community%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "citizenship-in-the-nation",
    "name": "Citizenship in the Nation",
    "eagleRequired": true,
    "description": "Learn about your rights and duties as a citizen of the United States.",
    "pageUrl": "http://usscouts.org/mb/mb003.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Citizenship-in-the-Nation.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Citizenship-in-the-Nation.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Tell what you think makes the United States the kind of country it is"
      },
      {
        "id": "2",
        "text": "Name your two U.S. senators and the U.S. representative from your congressional district"
      },
      {
        "id": "3",
        "text": "Explain the three branches of government and their roles"
      },
      {
        "id": "4",
        "text": "Name 10 documents important to the history of the United States"
      },
      {
        "id": "5",
        "text": "Discuss political parties: what they are, and how they work"
      },
      {
        "id": "6",
        "text": "Watch a national political event and discuss with your counselor"
      },
      {
        "id": "7",
        "text": "Name five rights guaranteed by the Bill of Rights and explain what they mean"
      },
      {
        "id": "8",
        "text": "Do TWO of the following: visit a national monument, write a letter to a public official, vote in a school election"
      }
    ],
    "category": "Civics & Citizenship",
    "timeCommitment": "Community Research & Meeting Attendance",
    "timeAlert": "Requires attending a public city/town council meeting or interview with a government official.",
    "eagleTip": "Attend a municipal town hall meeting or research national legislative bills ahead of time.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/citizenship-in-the-nation/",
    "usScoutsUrl": "http://usscouts.org/mb/mb003.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Citizenship in the Nation Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2022",
    "pamphletUrl": "https://www.scouting.org/merit-badges/citizenship-in-the-nation/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Citizenship%20in%20the%20Nation%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "citizenship-in-the-world",
    "name": "Citizenship in the World",
    "eagleRequired": true,
    "description": "Learn about other nations and international relations.",
    "pageUrl": "http://usscouts.org/mb/mb004.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Citizenship-in-the-World.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Citizenship-in-the-World.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Explain what citizenship in the world means to you"
      },
      {
        "id": "2",
        "text": "Explain the difference between a citizen and a non-citizen"
      },
      {
        "id": "3",
        "text": "Discuss the United Nations and its role in the world today"
      },
      {
        "id": "4",
        "text": "List four world problems and discuss possible solutions"
      },
      {
        "id": "5",
        "text": "Explain international law and identify three international agreements"
      },
      {
        "id": "6",
        "text": "Show on a map how your community, country, and continent relate to the rest of the world"
      },
      {
        "id": "7",
        "text": "Interview someone from another country; discuss similarities and differences"
      }
    ],
    "category": "Civics & Citizenship",
    "timeCommitment": "Community Research & Meeting Attendance",
    "timeAlert": "Requires attending a public city/town council meeting or interview with a government official.",
    "eagleTip": "Attend a municipal town hall meeting or research national legislative bills ahead of time.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/citizenship-in-the-world/",
    "usScoutsUrl": "http://usscouts.org/mb/mb004.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Citizenship in the World Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2014",
    "pamphletUrl": "https://www.scouting.org/merit-badges/citizenship-in-the-world/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Citizenship%20in%20the%20World%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "communication",
    "name": "Communication",
    "eagleRequired": true,
    "description": "Develop skills in written, verbal, and non-verbal communication.",
    "pageUrl": "http://usscouts.org/mb/mb005.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Communication.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Communication.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Write a five-paragraph essay on a subject you know well"
      },
      {
        "id": "2",
        "text": "Write a letter to a public official and keep a copy"
      },
      {
        "id": "3",
        "text": "Give a talk of at least five minutes to a group of 10 or more people"
      },
      {
        "id": "4a",
        "text": "Prepare and give a 10-minute illustrated talk to a group"
      },
      {
        "id": "4b",
        "text": "Prepare an outline for the talk and share it with your counselor"
      },
      {
        "id": "5",
        "text": "Show written examples of good news writing"
      },
      {
        "id": "6",
        "text": "Interview someone and write a 200-word story about the conversation"
      },
      {
        "id": "7",
        "text": "Keep a daily journal for 30 days and share excerpts with your counselor"
      }
    ],
    "category": "Civics & Citizenship",
    "timeCommitment": "Speeches, Presentations & Interviews",
    "timeAlert": "Requires giving a speech, conducting an interview, and attending a public meeting.",
    "eagleTip": "Lead a troop campfire program or patrol presentation to complete speaking requirements.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/communication/",
    "usScoutsUrl": "http://usscouts.org/mb/mb005.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Communication Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2019",
    "pamphletUrl": "https://www.scouting.org/merit-badges/communication/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Communication%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "cooking",
    "name": "Cooking",
    "eagleRequired": true,
    "description": "Learn to plan, prepare, and serve nutritious meals.",
    "pageUrl": "http://usscouts.org/mb/mb038.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Cooking.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Cooking.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Explain the most likely hazards associated with cooking and how to avoid them"
      },
      {
        "id": "2a",
        "text": "Discuss the importance of good nutrition"
      },
      {
        "id": "2b",
        "text": "Explain what the USDA MyPlate food plan is and how it can help you"
      },
      {
        "id": "3",
        "text": "Show you know how to safely select, store, prepare, and serve food"
      },
      {
        "id": "4",
        "text": "With a parent's help, prepare a meal for your family from scratch"
      },
      {
        "id": "5a",
        "text": "Plan and prepare a breakfast, lunch, and dinner on a camping trip"
      },
      {
        "id": "5b",
        "text": "Demonstrate proper dishwashing and camp kitchen cleanup"
      },
      {
        "id": "6",
        "text": "Explain how to reduce kitchen waste and properly dispose of it"
      }
    ],
    "category": "Life Skills & Fitness",
    "timeCommitment": "Multi-Campout & Home Meal Planning",
    "timeAlert": "Requires planning and cooking 10+ meals (campout, backpacking, and home meals with family).",
    "eagleTip": "Coordinate with your patrol leader to serve as head cook during your next 2 troop campouts.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/cooking/",
    "usScoutsUrl": "http://usscouts.org/mb/mb038.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Cooking Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/cooking/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Cooking%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "cycling",
    "name": "Cycling",
    "eagleRequired": true,
    "description": "Earn the Cycling merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb039.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Cycling.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Cycling.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Cycling with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Cycling."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Life Skills & Fitness",
    "timeCommitment": "Long Distance Bike Rides (150+ Miles Total)",
    "timeAlert": "Requires multiple 10, 15, and 25-mile rides, culminating in a 50-mile road ride!",
    "eagleTip": "Inspect bicycle safety gear and train stamina gradually on paved trails.",
    "eagleGroup": "Choice: Swimming OR Hiking OR Cycling",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/cycling/",
    "usScoutsUrl": "http://usscouts.org/mb/mb039.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Cycling Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/cycling/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Cycling%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "emergency-preparedness",
    "name": "Emergency Preparedness",
    "eagleRequired": true,
    "description": "Be prepared to respond to emergencies.",
    "pageUrl": "http://usscouts.org/mb/mb006.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Emergency-Preparedness.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Emergency-Preparedness.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Earn the First Aid merit badge"
      },
      {
        "id": "2a",
        "text": "Discuss how individuals and communities can be prepared for emergencies"
      },
      {
        "id": "2b",
        "text": "Present a plan for preparing your family for an emergency"
      },
      {
        "id": "3",
        "text": "Prepare a home emergency kit"
      },
      {
        "id": "4",
        "text": "Show what you would do when an emergency strikes"
      },
      {
        "id": "5",
        "text": "Work with a group to practice an emergency drill"
      },
      {
        "id": "6",
        "text": "Describe the role of the American Red Cross in emergencies"
      },
      {
        "id": "7",
        "text": "Discuss the role of technology in emergencies"
      }
    ],
    "category": "Health & Safety",
    "timeCommitment": "Emergency Plan & Troop Drill",
    "timeAlert": "Prerequisite: Must have earned First Aid Merit Badge first.",
    "eagleTip": "Complete First Aid first. Build a home emergency disaster kit with non-perishable supplies.",
    "eagleGroup": "Choice: Emergency Prep OR Lifesaving",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/emergency-preparedness/",
    "usScoutsUrl": "http://usscouts.org/mb/mb006.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Emergency Preparedness Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/emergency-preparedness/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Emergency%20Preparedness%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "environmental-science",
    "name": "Environmental Science",
    "eagleRequired": true,
    "description": "Explore ecosystems and environmental issues.",
    "pageUrl": "http://usscouts.org/mb/mb007.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Environmental-Science.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Environmental-Science.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Make a timeline of the history of environmental science and the conservation movement"
      },
      {
        "id": "2",
        "text": "Define ecology and explain the interrelationships of biotic and abiotic factors"
      },
      {
        "id": "3a",
        "text": "Conduct an investigation of a stream, pond, or other body of water"
      },
      {
        "id": "3b",
        "text": "Make a collection of 10 insects"
      },
      {
        "id": "3c",
        "text": "Make a collection of 5 plants"
      },
      {
        "id": "4",
        "text": "Discuss a current environmental problem and its impacts"
      },
      {
        "id": "5",
        "text": "Do an environmental project approved by your counselor"
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Field Observations & Experiments",
    "timeAlert": "Requires multiple field observation sessions and written environmental reports.",
    "eagleTip": "Conduct 7-day ecosystem observations in a local park or reserve.",
    "eagleGroup": "Choice: Environmental Science OR Sustainability",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/environmental-science/",
    "usScoutsUrl": "http://usscouts.org/mb/mb007.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Environmental Science Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/environmental-science/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Environmental%20Science%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "family-life",
    "name": "Family Life",
    "eagleRequired": true,
    "description": "Strengthen the family unit through shared activities and responsibilities.",
    "pageUrl": "http://usscouts.org/mb/mb129.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Family-Life.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Family-Life.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Prepare a chart showing the jobs each family member regularly does at home"
      },
      {
        "id": "2",
        "text": "Discuss the importance of taking responsibility for your actions at home"
      },
      {
        "id": "3",
        "text": "Help plan a family activity and carry it out"
      },
      {
        "id": "4",
        "text": "Discuss family budgeting with a parent or guardian"
      },
      {
        "id": "5",
        "text": "Identify and do two projects in or around your home"
      },
      {
        "id": "6",
        "text": "Keep a log of your daily household chores for 90 days"
      }
    ],
    "category": "Life Skills & Fitness",
    "timeCommitment": "90-Day Household Chores & Project Log",
    "timeAlert": "⚠️ Requires 90 days of tracking chores and leading a family project. Start early!",
    "eagleTip": "Hold a family meeting with your parents to agree on 5 regular chores and plan your family service project.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/family-life/",
    "usScoutsUrl": "http://usscouts.org/mb/mb129.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Family Life Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/family-life/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Family%20Life%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "first-aid",
    "name": "First Aid",
    "eagleRequired": true,
    "description": "Learn to provide emergency first aid.",
    "pageUrl": "http://usscouts.org/mb/mb008.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/First-Aid.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/First-Aid.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Demonstrate first aid for unconsciousness, including rescue breathing and CPR"
      },
      {
        "id": "2",
        "text": "Show what to do for \"hurry\" cases: serious bleeding, stopped breathing, internal poisoning, heart attack"
      },
      {
        "id": "3",
        "text": "Show first aid for cuts, lacerations, punctures, and abrasions"
      },
      {
        "id": "4",
        "text": "Demonstrate removal of a foreign body from the eye"
      },
      {
        "id": "5",
        "text": "Demonstrate bandaging for a sprained ankle"
      },
      {
        "id": "6",
        "text": "Show how to make a stretcher and transport a person"
      },
      {
        "id": "7",
        "text": "Tell what precautions you must take when performing first aid"
      }
    ],
    "category": "Health & Safety",
    "timeCommitment": "CPR & Emergency First Aid Mastery",
    "timeAlert": "Foundational Eagle-required badge. Prerequisite for Emergency Preparedness.",
    "eagleTip": "Master bandage wraps, shock treatment, and CPR hands-on drills during troop meetings.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/first-aid/",
    "usScoutsUrl": "http://usscouts.org/mb/mb008.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "First Aid Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/first-aid/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=First%20Aid%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "hiking",
    "name": "Hiking",
    "eagleRequired": true,
    "description": "Earn the Hiking merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb061.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Hiking.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Hiking.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Hiking with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Hiking."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Continuous Distance Hikes (70+ Miles Total)",
    "timeAlert": "Requires one 5-mile, three 10-mile, one 15-mile, and one 20-mile hike!",
    "eagleTip": "Plan day hikes with your patrol over several months. Maintain detailed trail logs.",
    "eagleGroup": "Choice: Swimming OR Hiking OR Cycling",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/hiking/",
    "usScoutsUrl": "http://usscouts.org/mb/mb061.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Hiking Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/hiking/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Hiking%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "lifesaving",
    "name": "Lifesaving",
    "eagleRequired": true,
    "description": "Learn water rescue skills.",
    "pageUrl": "http://usscouts.org/mb/mb009.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Lifesaving.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Lifesaving.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Before doing other requirements, earn the Swimming merit badge"
      },
      {
        "id": "2",
        "text": "Swim continuously for 400 yards"
      },
      {
        "id": "3",
        "text": "Demonstrate reaching and throwing rescues"
      },
      {
        "id": "4",
        "text": "Demonstrate wade-in and swimming rescues with a tired swimmer"
      },
      {
        "id": "5",
        "text": "Demonstrate removal of a cramp or tired swimmer"
      },
      {
        "id": "6",
        "text": "Demonstrate in-line spinal injury management"
      },
      {
        "id": "7",
        "text": "Demonstrate CPR and explain when to use it"
      }
    ],
    "category": "Health & Safety",
    "timeCommitment": "Aquatics Practical Drills",
    "timeAlert": "Prerequisite: Must pass BSA Swimmer Test and earn Swimming Merit Badge first.",
    "eagleTip": "Best completed during summer camp under a certified BSA Aquatics Director.",
    "eagleGroup": "Choice: Emergency Prep OR Lifesaving",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/lifesaving/",
    "usScoutsUrl": "http://usscouts.org/mb/mb009.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Lifesaving Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/lifesaving/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Lifesaving%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "personal-fitness",
    "name": "Personal Fitness",
    "eagleRequired": true,
    "description": "Plan and follow a personal fitness program.",
    "pageUrl": "http://usscouts.org/mb/mb010.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Personal-Fitness.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Personal-Fitness.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Before beginning your fitness program, see your doctor and get approval"
      },
      {
        "id": "2",
        "text": "Explain the components of physical fitness"
      },
      {
        "id": "3",
        "text": "Explain the importance of a nutritious diet and rest"
      },
      {
        "id": "4",
        "text": "Keep a personal health history and update it regularly"
      },
      {
        "id": "5",
        "text": "Develop and follow a 12-week exercise program"
      },
      {
        "id": "6",
        "text": "Show improvement on fitness tests after your 12-week program"
      }
    ],
    "category": "Life Skills & Fitness",
    "timeCommitment": "12-Week Physical Training Log",
    "timeAlert": "⚠️ Requires 12 consecutive weeks (84 days) of logging physical exercise and fitness tests. Start early!",
    "eagleTip": "Schedule your initial fitness baseline test right away. Track workouts 3+ times weekly with your counselor.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/personal-fitness/",
    "usScoutsUrl": "http://usscouts.org/mb/mb010.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Personal Fitness Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/personal-fitness/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Personal%20Fitness%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "personal-management",
    "name": "Personal Management",
    "eagleRequired": true,
    "description": "Learn skills for managing money, time, and personal affairs.",
    "pageUrl": "http://usscouts.org/mb/mb011.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Personal-Management.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Personal-Management.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the difference between saving and investing"
      },
      {
        "id": "2",
        "text": "Prepare a budget for one month of personal expenses"
      },
      {
        "id": "3",
        "text": "Open a savings or checking account and keep track of it for 90 days"
      },
      {
        "id": "4",
        "text": "Prepare a life plan showing milestones for the next 10 years"
      },
      {
        "id": "5",
        "text": "Discuss the importance of education for career opportunities"
      },
      {
        "id": "6",
        "text": "Explain the basics of borrowing money, including interest and credit scores"
      }
    ],
    "category": "Life Skills & Fitness",
    "timeCommitment": "13-Week Financial Budget Log",
    "timeAlert": "⚠️ Requires 13 consecutive weeks (90 days) of budget tracking and expense logs. Cannot be rushed!",
    "eagleTip": "Set up a spreadsheet on day 1 to track all income and expenses. Discuss household project plans with family.",
    "eagleGroup": "Required",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/personal-management/",
    "usScoutsUrl": "http://usscouts.org/mb/mb011.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Personal Management Merit Badge Pamphlet",
    "pamphletSku": "35928",
    "pamphletDigitalSku": "655699",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/personal-management/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Personal%20Management%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "sustainability",
    "name": "Sustainability",
    "eagleRequired": true,
    "description": "Earn the Sustainability merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb152.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Sustainability.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Sustainability.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Sustainability with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Sustainability."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Household Energy & Waste Audits",
    "timeAlert": "Requires 14-day tracking of household water, electricity, and waste production.",
    "eagleTip": "Conduct an energy and food waste audit in your home with family cooperation.",
    "eagleGroup": "Choice: Environmental Science OR Sustainability",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/sustainability/",
    "usScoutsUrl": "http://usscouts.org/mb/mb152.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Sustainability Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/sustainability/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Sustainability%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "swimming",
    "name": "Swimming",
    "eagleRequired": true,
    "description": "Develop water safety and swimming skills.",
    "pageUrl": "http://usscouts.org/mb/mb014.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Swimming.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Swimming.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Jump feetfirst into water over your head and swim 75 yards"
      },
      {
        "id": "2",
        "text": "Demonstrate water rescue techniques"
      },
      {
        "id": "3",
        "text": "Swim continuously for 150 yards"
      },
      {
        "id": "4",
        "text": "Demonstrate proper use of a life jacket"
      },
      {
        "id": "5",
        "text": "Explain the BSA Safe Swim Defense rules"
      },
      {
        "id": "6",
        "text": "Demonstrate survival floating for 5 minutes"
      }
    ],
    "category": "Health & Safety",
    "timeCommitment": "Swimming Stroke Proficiency & Rescue",
    "timeAlert": "Requires strong swimming stroke skills and water rescue demonstrations.",
    "eagleTip": "Practice the crawl, backstroke, breaststroke, and sidestroke at troop pool sessions.",
    "eagleGroup": "Choice: Swimming OR Hiking OR Cycling",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/swimming/",
    "usScoutsUrl": "http://usscouts.org/mb/mb014.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Swimming Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/swimming/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Swimming%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "american-business",
    "name": "American Business",
    "eagleRequired": false,
    "description": "Earn the American Business merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb015.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/American-Business.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/American-Business.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of American Business with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to American Business."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/american-business/",
    "usScoutsUrl": "http://usscouts.org/mb/mb015.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "American Business Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/american-business/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=American%20Business%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "american-cultures",
    "name": "American Cultures",
    "eagleRequired": false,
    "description": "Earn the American Cultures merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb017.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/American-Cultures.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/American-Cultures.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of American Cultures with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to American Cultures."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Civics & Citizenship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/american-cultures/",
    "usScoutsUrl": "http://usscouts.org/mb/mb017.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "American Cultures Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/american-cultures/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=American%20Cultures%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "american-heritage",
    "name": "American Heritage",
    "eagleRequired": false,
    "description": "Earn the American Heritage merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb016.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/American-Heritage.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/American-Heritage.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of American Heritage with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to American Heritage."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Civics & Citizenship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/american-heritage/",
    "usScoutsUrl": "http://usscouts.org/mb/mb016.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "American Heritage Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2020",
    "pamphletUrl": "https://www.scouting.org/merit-badges/american-heritage/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=American%20Heritage%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "american-labor",
    "name": "American Labor",
    "eagleRequired": false,
    "description": "Earn the American Labor merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb121.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/American-Labor.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/American-Labor.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of American Labor with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to American Labor."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/american-labor/",
    "usScoutsUrl": "http://usscouts.org/mb/mb121.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "American Labor Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/american-labor/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=American%20Labor%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "animal-science",
    "name": "Animal Science",
    "eagleRequired": false,
    "description": "Earn the Animal Science merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb018.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Animal-Science.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Animal-Science.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Animal Science with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Animal Science."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/animal-science/",
    "usScoutsUrl": "http://usscouts.org/mb/mb018.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Animal Science Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/animal-science/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Animal%20Science%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "animation",
    "name": "Animation",
    "eagleRequired": false,
    "description": "Earn the Animation merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb158.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Animation.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Animation.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Animation with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Animation."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/animation/",
    "usScoutsUrl": "http://usscouts.org/mb/mb018.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Animation Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2022",
    "pamphletUrl": "https://www.scouting.org/merit-badges/animation/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Animation%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "archaeology",
    "name": "Archaeology",
    "eagleRequired": false,
    "description": "Earn the Archaeology merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb132.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Archaeology.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Archaeology.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Archaeology with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Archaeology."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/archaeology/",
    "usScoutsUrl": "http://usscouts.org/mb/mb132.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Archaeology Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/archaeology/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Archaeology%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "archery",
    "name": "Archery",
    "eagleRequired": false,
    "description": "Learn safe archery skills and techniques.",
    "pageUrl": "http://usscouts.org/mb/mb019.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Archery.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Archery.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Explain the rules of safe archery and what to do if a rule is violated"
      },
      {
        "id": "2",
        "text": "Describe the parts of an arrow"
      },
      {
        "id": "3",
        "text": "Demonstrate proper archery form: stance, grip, nocking, drawing, aiming, releasing"
      },
      {
        "id": "4",
        "text": "Demonstrate proper care of archery equipment"
      },
      {
        "id": "5",
        "text": "Shoot a NFAA single spot target at 20 yards achieving a required score"
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/archery/",
    "usScoutsUrl": "http://usscouts.org/mb/mb019.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Archery Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/archery/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Archery%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "architecture",
    "name": "Architecture",
    "eagleRequired": false,
    "description": "Earn the Architecture merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb020.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Architecture.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Architecture.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Architecture with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Architecture."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/architecture/",
    "usScoutsUrl": "http://usscouts.org/mb/mb020.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Architecture Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/architecture/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Architecture%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "art",
    "name": "Art",
    "eagleRequired": false,
    "description": "Earn the Art merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb021.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Art.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Art.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Art with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Art."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/art/",
    "usScoutsUrl": "http://usscouts.org/mb/mb021.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Art Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/art/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Art%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "astronomy",
    "name": "Astronomy",
    "eagleRequired": false,
    "description": "Explore the night sky and learn about celestial bodies.",
    "pageUrl": "http://usscouts.org/mb/mb022.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Astronomy.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Astronomy.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Explain the effect of air pollution on astronomy"
      },
      {
        "id": "2",
        "text": "With your counselor, identify in the sky at least 10 constellations"
      },
      {
        "id": "3",
        "text": "Identify the brightest stars in 6 of the 10 constellations"
      },
      {
        "id": "4",
        "text": "Explain the relationship between a planet's period of revolution and distance from the sun"
      },
      {
        "id": "5",
        "text": "Sketch the face of the moon and identify at least five seas and five craters"
      },
      {
        "id": "6",
        "text": "Do ONE of the following: discuss the history of astronomy, visit a planetarium, or view the moon through a telescope"
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/astronomy/",
    "usScoutsUrl": "http://usscouts.org/mb/mb022.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Astronomy Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2022",
    "pamphletUrl": "https://www.scouting.org/merit-badges/astronomy/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Astronomy%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "athletics",
    "name": "Athletics",
    "eagleRequired": false,
    "description": "Earn the Athletics merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb023.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Athletics.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Athletics.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Athletics with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Athletics."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Life Skills & Fitness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/athletics/",
    "usScoutsUrl": "http://usscouts.org/mb/mb023.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Athletics Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/athletics/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Athletics%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "automotive-maintenance",
    "name": "Automotive Maintenance",
    "eagleRequired": false,
    "description": "Earn the Automotive Maintenance merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb127.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Automotive-Maintenance.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Automotive-Maintenance.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Automotive Maintenance with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Automotive Maintenance."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/automotive-maintenance/",
    "usScoutsUrl": "http://usscouts.org/mb/mb127.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Automotive Maintenance Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/automotive-maintenance/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Automotive%20Maintenance%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "aviation",
    "name": "Aviation",
    "eagleRequired": false,
    "description": "Explore the world of aviation and flight.",
    "pageUrl": "http://usscouts.org/mb/mb025.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Aviation.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Aviation.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Define \"aircraft\" and identify at least eight types of aircraft"
      },
      {
        "id": "2",
        "text": "Describe the forces acting on an airplane in flight"
      },
      {
        "id": "3",
        "text": "Identify the major components of an airplane and explain their functions"
      },
      {
        "id": "4",
        "text": "Explain the function of the instruments in an aircraft cockpit"
      },
      {
        "id": "5",
        "text": "Discuss the history of aviation and the contributions of notable aviators"
      },
      {
        "id": "6",
        "text": "Do ONE of the following: take a flight lesson, visit an airport control tower, or build and fly a model airplane"
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/aviation/",
    "usScoutsUrl": "http://usscouts.org/mb/mb025.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Aviation Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/aviation/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Aviation%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "backpacking",
    "name": "Backpacking",
    "eagleRequired": false,
    "description": "Earn the Backpacking merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb026.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Backpacking.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Backpacking.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Backpacking with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Backpacking."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/backpacking/",
    "usScoutsUrl": "http://usscouts.org/mb/mb026.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Backpacking Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/backpacking/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Backpacking%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "basketry",
    "name": "Basketry",
    "eagleRequired": false,
    "description": "Earn the Basketry merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb027.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Basketry.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Basketry.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Basketry with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Basketry."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/basketry/",
    "usScoutsUrl": "http://usscouts.org/mb/mb027.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Basketry Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/basketry/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Basketry%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "bird-study",
    "name": "Bird Study",
    "eagleRequired": false,
    "description": "Earn the Bird Study merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb029.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Bird-Study.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Bird-Study.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Bird Study with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Bird Study."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/bird-study/",
    "usScoutsUrl": "http://usscouts.org/mb/mb029.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Bird Study Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/bird-study/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Bird%20Study%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "bugling",
    "name": "Bugling",
    "eagleRequired": false,
    "description": "Earn the Bugling merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb032.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Bugling.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Bugling.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Bugling with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Bugling."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/bugling/",
    "usScoutsUrl": "http://usscouts.org/mb/mb032.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Bugling Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/bugling/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Bugling%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "canoeing",
    "name": "Canoeing",
    "eagleRequired": false,
    "description": "Earn the Canoeing merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb033.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Canoeing.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Canoeing.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Canoeing with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Canoeing."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/canoeing/",
    "usScoutsUrl": "http://usscouts.org/mb/mb033.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Canoeing Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/canoeing/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Canoeing%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "chemistry",
    "name": "Chemistry",
    "eagleRequired": false,
    "description": "Earn the Chemistry merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb034.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Chemistry.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Chemistry.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Chemistry with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Chemistry."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/chemistry/",
    "usScoutsUrl": "http://usscouts.org/mb/mb034.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Chemistry Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/chemistry/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Chemistry%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "chess",
    "name": "Chess",
    "eagleRequired": false,
    "description": "Learn the fundamentals of chess.",
    "pageUrl": "http://usscouts.org/mb/mb147.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Chess.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Chess.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Demonstrate legal moves for each chess piece"
      },
      {
        "id": "2",
        "text": "Explain castling, en passant capture, and pawn promotion"
      },
      {
        "id": "3",
        "text": "Discuss the following chess tactics: fork, skewer, pin, discovered check"
      },
      {
        "id": "4",
        "text": "Explain the four rules of opening play and why they are important"
      },
      {
        "id": "5",
        "text": "Compete in a chess tournament or play 5 rated games"
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/chess/",
    "usScoutsUrl": "http://usscouts.org/mb/mb147.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Chess Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2013",
    "pamphletUrl": "https://www.scouting.org/merit-badges/chess/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Chess%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "climbing",
    "name": "Climbing",
    "eagleRequired": false,
    "description": "Learn rock climbing and rappelling skills.",
    "pageUrl": "http://usscouts.org/mb/mb133.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Climbing.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Climbing.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Explain the rules of safe climbing"
      },
      {
        "id": "2",
        "text": "Name and describe the equipment used in climbing"
      },
      {
        "id": "3",
        "text": "Demonstrate basic climbing techniques on a low wall"
      },
      {
        "id": "4",
        "text": "Lead climb a route on an indoor climbing wall"
      },
      {
        "id": "5",
        "text": "Demonstrate proper rappelling technique"
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/climbing/",
    "usScoutsUrl": "http://usscouts.org/mb/mb133.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Climbing Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2022",
    "pamphletUrl": "https://www.scouting.org/merit-badges/climbing/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Climbing%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "coin-collecting",
    "name": "Coin Collecting",
    "eagleRequired": false,
    "description": "Earn the Coin Collecting merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb035.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Coin-Collecting.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Coin-Collecting.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Coin Collecting with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Coin Collecting."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/coin-collecting/",
    "usScoutsUrl": "http://usscouts.org/mb/mb035.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Coin Collecting Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/coin-collecting/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Coin%20Collecting%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "collections",
    "name": "Collections",
    "eagleRequired": false,
    "description": "Earn the Collections merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb128.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Collections.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Collections.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Collections with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Collections."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/collections/",
    "usScoutsUrl": "http://usscouts.org/mb/mb128.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Collections Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2021",
    "pamphletUrl": "https://www.scouting.org/merit-badges/collections/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Collections%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "composite-materials",
    "name": "Composite Materials",
    "eagleRequired": false,
    "description": "Earn the Composite Materials merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb137.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Composite-Materials.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Composite-Materials.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Composite Materials with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Composite Materials."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/composite-materials/",
    "usScoutsUrl": "http://usscouts.org/mb/mb137.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Composite Materials Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/composite-materials/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Composite%20Materials%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "crime-prevention",
    "name": "Crime Prevention",
    "eagleRequired": false,
    "description": "Earn the Crime Prevention merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb131.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Crime-Prevention.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Crime-Prevention.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Crime Prevention with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Crime Prevention."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Civics & Citizenship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/crime-prevention/",
    "usScoutsUrl": "http://usscouts.org/mb/mb131.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Crime Prevention Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/crime-prevention/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Crime%20Prevention%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "dentistry",
    "name": "Dentistry",
    "eagleRequired": false,
    "description": "Earn the Dentistry merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb040.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Dentistry.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Dentistry.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Dentistry with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Dentistry."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/dentistry/",
    "usScoutsUrl": "http://usscouts.org/mb/mb040.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Dentistry Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2022",
    "pamphletUrl": "https://www.scouting.org/merit-badges/dentistry/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Dentistry%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "digital-technology",
    "name": "Digital Technology",
    "eagleRequired": false,
    "description": "Explore digital tools and responsible use of technology.",
    "pageUrl": "http://usscouts.org/mb/mb154.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Digital-Technology.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Digital-Technology.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the safe and responsible use of digital technology"
      },
      {
        "id": "2",
        "text": "Explain what cybersecurity means and list five ways to stay safe online"
      },
      {
        "id": "3",
        "text": "Demonstrate how to use cloud storage and collaboration tools"
      },
      {
        "id": "4",
        "text": "Create a digital project (website, video, or presentation)"
      },
      {
        "id": "5",
        "text": "Discuss careers in digital technology"
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/digital-technology/",
    "usScoutsUrl": "http://usscouts.org/mb/mb154.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Digital Technology Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/digital-technology/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Digital%20Technology%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "disabilities-awareness",
    "name": "Disabilities Awareness",
    "eagleRequired": false,
    "description": "Earn the Disabilities Awareness merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb060.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Disabilities-Awareness.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Disabilities-Awareness.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Disabilities Awareness with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Disabilities Awareness."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/disabilities-awareness/",
    "usScoutsUrl": "http://usscouts.org/mb/mb060.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Disabilities Awareness Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/disabilities-awareness/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Disabilities%20Awareness%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "dog-care",
    "name": "Dog Care",
    "eagleRequired": false,
    "description": "Earn the Dog Care merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb041.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Dog-Care.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Dog-Care.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Dog Care with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Dog Care."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/dog-care/",
    "usScoutsUrl": "http://usscouts.org/mb/mb041.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Dog Care Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2017",
    "pamphletUrl": "https://www.scouting.org/merit-badges/dog-care/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Dog%20Care%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "drafting",
    "name": "Drafting",
    "eagleRequired": false,
    "description": "Earn the Drafting merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb042.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Drafting.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Drafting.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Drafting with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Drafting."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/drafting/",
    "usScoutsUrl": "http://usscouts.org/mb/mb042.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Drafting Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/drafting/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Drafting%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "electricity",
    "name": "Electricity",
    "eagleRequired": false,
    "description": "Earn the Electricity merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb043.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Electricity.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Electricity.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Electricity with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Electricity."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/electricity/",
    "usScoutsUrl": "http://usscouts.org/mb/mb043.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Electricity Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2021",
    "pamphletUrl": "https://www.scouting.org/merit-badges/electricity/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Electricity%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "electronics",
    "name": "Electronics",
    "eagleRequired": false,
    "description": "Earn the Electronics merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb044.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Electronics.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Electronics.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Electronics with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Electronics."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/electronics/",
    "usScoutsUrl": "http://usscouts.org/mb/mb044.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Electronics Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2021",
    "pamphletUrl": "https://www.scouting.org/merit-badges/electronics/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Electronics%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "energy",
    "name": "Energy",
    "eagleRequired": false,
    "description": "Earn the Energy merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb045.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Energy.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Energy.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Energy with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Energy."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/energy/",
    "usScoutsUrl": "http://usscouts.org/mb/mb045.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Energy Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/energy/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Energy%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "engineering",
    "name": "Engineering",
    "eagleRequired": false,
    "description": "Earn the Engineering merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb046.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Engineering.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Engineering.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Engineering with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Engineering."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/engineering/",
    "usScoutsUrl": "http://usscouts.org/mb/mb046.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Engineering Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/engineering/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Engineering%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "entrepreneurship",
    "name": "Entrepreneurship",
    "eagleRequired": false,
    "description": "Earn the Entrepreneurship merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb134.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Entrepreneurship.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Entrepreneurship.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Entrepreneurship with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Entrepreneurship."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/entrepreneurship/",
    "usScoutsUrl": "http://usscouts.org/mb/mb134.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Entrepreneurship Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2013",
    "pamphletUrl": "https://www.scouting.org/merit-badges/entrepreneurship/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Entrepreneurship%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "exploration",
    "name": "Exploration",
    "eagleRequired": false,
    "description": "Earn the Exploration merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb159.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Exploration.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Exploration.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Exploration with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Exploration."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/exploration/",
    "usScoutsUrl": "http://usscouts.org/mb/mb159.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Exploration Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/exploration/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Exploration%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "farm-mechanics",
    "name": "Farm Mechanics",
    "eagleRequired": false,
    "description": "Earn the Farm Mechanics merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb048.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Farm-Mechanics.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Farm-Mechanics.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Farm Mechanics with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Farm Mechanics."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/farm-mechanics/",
    "usScoutsUrl": "http://usscouts.org/mb/mb048.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Farm Mechanics Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/farm-mechanics/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Farm%20Mechanics%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "fingerprinting",
    "name": "Fingerprinting",
    "eagleRequired": false,
    "description": "Earn the Fingerprinting merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb049.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Fingerprinting.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Fingerprinting.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Fingerprinting with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Fingerprinting."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/fingerprinting/",
    "usScoutsUrl": "http://usscouts.org/mb/mb049.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Fingerprinting Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/fingerprinting/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Fingerprinting%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "fire-safety",
    "name": "Fire Safety",
    "eagleRequired": false,
    "description": "Earn the Fire Safety merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb050.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Fire-Safety.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Fire-Safety.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Fire Safety with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Fire Safety."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Health & Safety",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/fire-safety/",
    "usScoutsUrl": "http://usscouts.org/mb/mb050.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Fire Safety Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/fire-safety/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Fire%20Safety%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "fish-and-wildlife-management",
    "name": "Fish and Wildlife Management",
    "eagleRequired": false,
    "description": "Earn the Fish and Wildlife Management merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb051.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Fish-and-Wildlife-Management.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Fish-and-Wildlife-Management.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Fish and Wildlife Management with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Fish and Wildlife Management."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/fish-and-wildlife-management/",
    "usScoutsUrl": "http://usscouts.org/mb/mb051.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Fish and Wildlife Management Merit Badge Pamphlet",
    "pamphletSku": "35898",
    "pamphletDigitalSku": "655190",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/fish-and-wildlife-management/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Fish%20and%20Wildlife%20Management%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "fishing",
    "name": "Fishing",
    "eagleRequired": false,
    "description": "Earn the Fishing merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb052.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Fishing.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Fishing.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Fishing with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Fishing."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/fishing/",
    "usScoutsUrl": "http://usscouts.org/mb/mb052.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Fishing Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/fishing/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Fishing%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "fly-fishing",
    "name": "Fly Fishing",
    "eagleRequired": false,
    "description": "Earn the Fly Fishing merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb136.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Fly-Fishing.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Fly-Fishing.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Fly Fishing with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Fly Fishing."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/fly-fishing/",
    "usScoutsUrl": "http://usscouts.org/mb/mb136.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Fly Fishing Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/fly-fishing/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Fly%20Fishing%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "forestry",
    "name": "Forestry",
    "eagleRequired": false,
    "description": "Earn the Forestry merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb054.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Forestry.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Forestry.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Forestry with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Forestry."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/forestry/",
    "usScoutsUrl": "http://usscouts.org/mb/mb054.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Forestry Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/forestry/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Forestry%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "game-design",
    "name": "Game Design",
    "eagleRequired": false,
    "description": "Earn the Game Design merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb151.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Game-Design.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Game-Design.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Game Design with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Game Design."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/game-design/",
    "usScoutsUrl": "http://usscouts.org/mb/mb151.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Game Design Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/game-design/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Game%20Design%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "gardening",
    "name": "Gardening",
    "eagleRequired": false,
    "description": "Earn the Gardening merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb055.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Gardening.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Gardening.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Gardening with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Gardening."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/gardening/",
    "usScoutsUrl": "http://usscouts.org/mb/mb055.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Gardening Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2017",
    "pamphletUrl": "https://www.scouting.org/merit-badges/gardening/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Gardening%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "genealogy",
    "name": "Genealogy",
    "eagleRequired": false,
    "description": "Earn the Genealogy merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb056.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Genealogy.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Genealogy.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Genealogy with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Genealogy."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/genealogy/",
    "usScoutsUrl": "http://usscouts.org/mb/mb056.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Genealogy Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/genealogy/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Genealogy%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "geocaching",
    "name": "Geocaching",
    "eagleRequired": false,
    "description": "Earn the Geocaching merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb145.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Geocaching.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Geocaching.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Geocaching with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Geocaching."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/geocaching/",
    "usScoutsUrl": "http://usscouts.org/mb/mb145.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Geocaching Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/geocaching/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Geocaching%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "geology",
    "name": "Geology",
    "eagleRequired": false,
    "description": "Earn the Geology merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb058.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Geology.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Geology.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Geology with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Geology."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/geology/",
    "usScoutsUrl": "http://usscouts.org/mb/mb058.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Geology Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/geology/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Geology%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "golf",
    "name": "Golf",
    "eagleRequired": false,
    "description": "Earn the Golf merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb059.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Golf.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Golf.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Golf with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Golf."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/golf/",
    "usScoutsUrl": "http://usscouts.org/mb/mb059.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Golf Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/golf/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Golf%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "graphic-arts",
    "name": "Graphic Arts",
    "eagleRequired": false,
    "description": "Earn the Graphic Arts merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb122.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Graphic-Arts.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Graphic-Arts.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Graphic Arts with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Graphic Arts."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/graphic-arts/",
    "usScoutsUrl": "http://usscouts.org/mb/mb122.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Graphic Arts Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/graphic-arts/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Graphic%20Arts%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "home-repairs",
    "name": "Home Repairs",
    "eagleRequired": false,
    "description": "Earn the Home Repairs merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb062.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Home-Repairs.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Home-Repairs.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Home Repairs with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Home Repairs."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/home-repairs/",
    "usScoutsUrl": "http://usscouts.org/mb/mb062.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Home Repairs Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2011",
    "pamphletUrl": "https://www.scouting.org/merit-badges/home-repairs/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Home%20Repairs%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "horsemanship",
    "name": "Horsemanship",
    "eagleRequired": false,
    "description": "Earn the Horsemanship merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb063.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Horsemanship.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Horsemanship.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Horsemanship with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Horsemanship."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/horsemanship/",
    "usScoutsUrl": "http://usscouts.org/mb/mb063.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Horsemanship Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2013",
    "pamphletUrl": "https://www.scouting.org/merit-badges/horsemanship/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Horsemanship%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "indian-lore",
    "name": "Indian Lore",
    "eagleRequired": false,
    "description": "Earn the Indian Lore merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb064.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Indian-Lore.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Indian-Lore.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Indian Lore with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Indian Lore."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/indian-lore/",
    "usScoutsUrl": "http://usscouts.org/mb/mb064.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Indian Lore Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/indian-lore/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Indian%20Lore%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "insect-study",
    "name": "Insect Study",
    "eagleRequired": false,
    "description": "Earn the Insect Study merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb065.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Insect-Study.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Insect-Study.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Insect Study with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Insect Study."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/insect-study/",
    "usScoutsUrl": "http://usscouts.org/mb/mb065.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Insect Study Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/insect-study/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Insect%20Study%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "inventing",
    "name": "Inventing",
    "eagleRequired": false,
    "description": "Earn the Inventing merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb144.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Inventing.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Inventing.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Inventing with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Inventing."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/inventing/",
    "usScoutsUrl": "http://usscouts.org/mb/mb144.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Inventing Merit Badge Pamphlet",
    "pamphletSku": "35833",
    "pamphletDigitalSku": "654378",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/inventing/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Inventing%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "journalism",
    "name": "Journalism",
    "eagleRequired": false,
    "description": "Earn the Journalism merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb066.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Journalism.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Journalism.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Journalism with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Journalism."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/journalism/",
    "usScoutsUrl": "http://usscouts.org/mb/mb066.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Journalism Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/journalism/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Journalism%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "kayaking",
    "name": "Kayaking",
    "eagleRequired": false,
    "description": "Earn the Kayaking merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb149.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Kayaking.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Kayaking.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Kayaking with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Kayaking."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/kayaking/",
    "usScoutsUrl": "http://usscouts.org/mb/mb149.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Kayaking Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/kayaking/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Kayaking%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "landscape-architecture",
    "name": "Landscape Architecture",
    "eagleRequired": false,
    "description": "Earn the Landscape Architecture merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb067.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Landscape-Architecture.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Landscape-Architecture.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Landscape Architecture with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Landscape Architecture."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/landscape-architecture/",
    "usScoutsUrl": "http://usscouts.org/mb/mb067.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Landscape Architecture Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2017",
    "pamphletUrl": "https://www.scouting.org/merit-badges/landscape-architecture/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Landscape%20Architecture%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "law",
    "name": "Law",
    "eagleRequired": false,
    "description": "Earn the Law merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb068.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Law.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Law.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Law with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Law."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Civics & Citizenship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/law/",
    "usScoutsUrl": "http://usscouts.org/mb/mb068.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Law Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/law/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Law%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "leatherwork",
    "name": "Leatherwork",
    "eagleRequired": false,
    "description": "Earn the Leatherwork merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb069.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Leatherwork.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Leatherwork.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Leatherwork with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Leatherwork."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/leatherwork/",
    "usScoutsUrl": "http://usscouts.org/mb/mb069.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Leatherwork Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2016",
    "pamphletUrl": "https://www.scouting.org/merit-badges/leatherwork/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Leatherwork%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "mammal-study",
    "name": "Mammal Study",
    "eagleRequired": false,
    "description": "Earn the Mammal Study merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb071.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Mammal-Study.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Mammal-Study.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Mammal Study with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Mammal Study."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/mammal-study/",
    "usScoutsUrl": "http://usscouts.org/mb/mb071.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Mammal Study Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/mammal-study/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Mammal%20Study%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "medicine",
    "name": "Medicine",
    "eagleRequired": false,
    "description": "Earn the Medicine merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb130.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Medicine.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Medicine.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Medicine with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Medicine."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/medicine/",
    "usScoutsUrl": "http://usscouts.org/mb/mb130.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Medicine Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/medicine/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Medicine%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "metalwork",
    "name": "Metalwork",
    "eagleRequired": false,
    "description": "Earn the Metalwork merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb074.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Metalwork.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Metalwork.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Metalwork with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Metalwork."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/metalwork/",
    "usScoutsUrl": "http://usscouts.org/mb/mb074.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Metalwork Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/metalwork/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Metalwork%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "mining-in-society",
    "name": "Mining in Society",
    "eagleRequired": false,
    "description": "Earn the Mining in Society merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb155.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Mining-in-Society.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Mining-in-Society.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Mining in Society with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Mining in Society."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/mining-in-society/",
    "usScoutsUrl": "http://usscouts.org/mb/mb155.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Mining in Society Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/mining-in-society/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Mining%20in%20Society%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "model-design-and-building",
    "name": "Model Design and Building",
    "eagleRequired": false,
    "description": "Earn the Model Design and Building merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb075.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Model-Design-and-Building.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Model-Design-and-Building.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Model Design and Building with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Model Design and Building."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/model-design-and-building/",
    "usScoutsUrl": "http://usscouts.org/mb/mb075.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Model Design and Building Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2019",
    "pamphletUrl": "https://www.scouting.org/merit-badges/model-design-and-building/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Model%20Design%20and%20Building%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "motorboating",
    "name": "Motorboating",
    "eagleRequired": false,
    "description": "Earn the Motorboating merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb076.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Motorboating.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Motorboating.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Motorboating with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Motorboating."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/motorboating/",
    "usScoutsUrl": "http://usscouts.org/mb/mb076.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Motorboating Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2021",
    "pamphletUrl": "https://www.scouting.org/merit-badges/motorboating/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Motorboating%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "moviemaking",
    "name": "Moviemaking",
    "eagleRequired": false,
    "description": "Earn the Moviemaking merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb156.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Moviemaking.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Moviemaking.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Moviemaking with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Moviemaking."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/moviemaking/",
    "usScoutsUrl": "http://usscouts.org/mb/mb156.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Moviemaking Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/moviemaking/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Moviemaking%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "music",
    "name": "Music",
    "eagleRequired": false,
    "description": "Earn the Music merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb077.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Music.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Music.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Music with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Music."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/music/",
    "usScoutsUrl": "http://usscouts.org/mb/mb077.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Music Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2016",
    "pamphletUrl": "https://www.scouting.org/merit-badges/music/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Music%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "nature",
    "name": "Nature",
    "eagleRequired": false,
    "description": "Earn the Nature merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb078.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Nature.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Nature.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Nature with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Nature."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/nature/",
    "usScoutsUrl": "http://usscouts.org/mb/mb078.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Nature Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2022",
    "pamphletUrl": "https://www.scouting.org/merit-badges/nature/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Nature%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "nuclear-science",
    "name": "Nuclear Science",
    "eagleRequired": false,
    "description": "Earn the Nuclear Science merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb024.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Nuclear-Science.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Nuclear-Science.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Nuclear Science with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Nuclear Science."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/nuclear-science/",
    "usScoutsUrl": "http://usscouts.org/mb/mb024.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Nuclear Science Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/nuclear-science/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Nuclear%20Science%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "oceanography",
    "name": "Oceanography",
    "eagleRequired": false,
    "description": "Earn the Oceanography merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb079.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Oceanography.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Oceanography.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Oceanography with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Oceanography."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/oceanography/",
    "usScoutsUrl": "http://usscouts.org/mb/mb079.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Oceanography Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2011",
    "pamphletUrl": "https://www.scouting.org/merit-badges/oceanography/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Oceanography%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "orienteering",
    "name": "Orienteering",
    "eagleRequired": false,
    "description": "Earn the Orienteering merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb080.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Orienteering.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Orienteering.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Orienteering with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Orienteering."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/orienteering/",
    "usScoutsUrl": "http://usscouts.org/mb/mb080.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Orienteering Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2011",
    "pamphletUrl": "https://www.scouting.org/merit-badges/orienteering/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Orienteering%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "painting",
    "name": "Painting",
    "eagleRequired": false,
    "description": "Earn the Painting merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb081.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Painting.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Painting.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Painting with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Painting."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/painting/",
    "usScoutsUrl": "http://usscouts.org/mb/mb081.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Painting Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2019",
    "pamphletUrl": "https://www.scouting.org/merit-badges/painting/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Painting%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "pets",
    "name": "Pets",
    "eagleRequired": false,
    "description": "Earn the Pets merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb082.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Pets.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Pets.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Pets with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Pets."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/pets/",
    "usScoutsUrl": "http://usscouts.org/mb/mb082.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Pets Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2011",
    "pamphletUrl": "https://www.scouting.org/merit-badges/pets/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Pets%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "photography",
    "name": "Photography",
    "eagleRequired": false,
    "description": "Earn the Photography merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb083.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Photography.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Photography.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Photography with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Photography."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/photography/",
    "usScoutsUrl": "http://usscouts.org/mb/mb083.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Photography Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/photography/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Photography%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "pioneering",
    "name": "Pioneering",
    "eagleRequired": false,
    "description": "Earn the Pioneering merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb084.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Pioneering.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Pioneering.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Pioneering with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Pioneering."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/pioneering/",
    "usScoutsUrl": "http://usscouts.org/mb/mb084.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Pioneering Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2021",
    "pamphletUrl": "https://www.scouting.org/merit-badges/pioneering/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Pioneering%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "plant-science",
    "name": "Plant Science",
    "eagleRequired": false,
    "description": "Earn the Plant Science merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb085.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Plant-Science.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Plant-Science.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Plant Science with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Plant Science."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/plant-science/",
    "usScoutsUrl": "http://usscouts.org/mb/mb085.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Plant Science Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/plant-science/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Plant%20Science%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "plumbing",
    "name": "Plumbing",
    "eagleRequired": false,
    "description": "Earn the Plumbing merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb086.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Plumbing.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Plumbing.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Plumbing with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Plumbing."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/plumbing/",
    "usScoutsUrl": "http://usscouts.org/mb/mb086.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Plumbing Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2016",
    "pamphletUrl": "https://www.scouting.org/merit-badges/plumbing/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Plumbing%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "pottery",
    "name": "Pottery",
    "eagleRequired": false,
    "description": "Earn the Pottery merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb087.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Pottery.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Pottery.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Pottery with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Pottery."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/pottery/",
    "usScoutsUrl": "http://usscouts.org/mb/mb087.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Pottery Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/pottery/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Pottery%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "programming",
    "name": "Programming",
    "eagleRequired": false,
    "description": "Earn the Programming merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb153.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Programming.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Programming.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Programming with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Programming."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/programming/",
    "usScoutsUrl": "http://usscouts.org/mb/mb153.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Programming Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/programming/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Programming%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "public-health",
    "name": "Public Health",
    "eagleRequired": false,
    "description": "Earn the Public Health merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb089.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Public-Health.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Public-Health.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Public Health with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Public Health."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Health & Safety",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/public-health/",
    "usScoutsUrl": "http://usscouts.org/mb/mb089.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Public Health Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/public-health/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Public%20Health%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "public-speaking",
    "name": "Public Speaking",
    "eagleRequired": false,
    "description": "Earn the Public Speaking merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb090.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Public-Speaking.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Public-Speaking.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Public Speaking with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Public Speaking."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/public-speaking/",
    "usScoutsUrl": "http://usscouts.org/mb/mb090.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Public Speaking Merit Badge Pamphlet",
    "pamphletSku": "35936",
    "pamphletDigitalSku": "655689",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/public-speaking/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Public%20Speaking%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "pulp-and-paper",
    "name": "Pulp and Paper",
    "eagleRequired": false,
    "description": "Earn the Pulp and Paper merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb091.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Pulp-and-Paper.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Pulp-and-Paper.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Pulp and Paper with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Pulp and Paper."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/pulp-and-paper/",
    "usScoutsUrl": "http://usscouts.org/mb/mb091.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Pulp and Paper Merit Badge Pamphlet",
    "pamphletSku": "35937",
    "pamphletDigitalSku": "649748",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/pulp-and-paper/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Pulp%20and%20Paper%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "radio",
    "name": "Radio",
    "eagleRequired": false,
    "description": "Earn the Radio merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb093.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Radio.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Radio.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Radio with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Radio."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/radio/",
    "usScoutsUrl": "http://usscouts.org/mb/mb093.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Radio Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/radio/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Radio%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "railroading",
    "name": "Railroading",
    "eagleRequired": false,
    "description": "Earn the Railroading merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb094.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Railroading.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Railroading.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Railroading with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Railroading."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/railroading/",
    "usScoutsUrl": "http://usscouts.org/mb/mb094.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Railroading Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/railroading/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Railroading%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "reading",
    "name": "Reading",
    "eagleRequired": false,
    "description": "Earn the Reading merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb095.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Reading.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Reading.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Reading with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Reading."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/reading/",
    "usScoutsUrl": "http://usscouts.org/mb/mb095.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Reading Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2021",
    "pamphletUrl": "https://www.scouting.org/merit-badges/reading/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Reading%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "reptile-and-amphibian-study",
    "name": "Reptile and Amphibian Study",
    "eagleRequired": false,
    "description": "Earn the Reptile and Amphibian Study merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb096.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Reptile-and-Amphibian-Study.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Reptile-and-Amphibian-Study.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Reptile and Amphibian Study with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Reptile and Amphibian Study."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/reptile-and-amphibian-study/",
    "usScoutsUrl": "http://usscouts.org/mb/mb096.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Reptile and Amphibian Study Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2022",
    "pamphletUrl": "https://www.scouting.org/merit-badges/reptile-and-amphibian-study/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Reptile%20and%20Amphibian%20Study%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "rifle-shooting",
    "name": "Rifle Shooting",
    "eagleRequired": false,
    "description": "Earn the Rifle Shooting merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb123.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Rifle-Shooting.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Rifle-Shooting.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Rifle Shooting with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Rifle Shooting."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/rifle-shooting/",
    "usScoutsUrl": "http://usscouts.org/mb/mb123.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Rifle Shooting Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2018",
    "pamphletUrl": "https://www.scouting.org/merit-badges/rifle-shooting/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Rifle%20Shooting%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "robotics",
    "name": "Robotics",
    "eagleRequired": false,
    "description": "Earn the Robotics merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb146.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Robotics.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Robotics.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Robotics with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Robotics."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/robotics/",
    "usScoutsUrl": "http://usscouts.org/mb/mb146.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Robotics Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2011",
    "pamphletUrl": "https://www.scouting.org/merit-badges/robotics/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Robotics%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "rowing",
    "name": "Rowing",
    "eagleRequired": false,
    "description": "Earn the Rowing merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb098.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Rowing.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Rowing.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Rowing with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Rowing."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/rowing/",
    "usScoutsUrl": "http://usscouts.org/mb/mb098.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Rowing Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2020",
    "pamphletUrl": "https://www.scouting.org/merit-badges/rowing/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Rowing%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "safety",
    "name": "Safety",
    "eagleRequired": false,
    "description": "Earn the Safety merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb012.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Safety.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Safety.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Safety with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Safety."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Health & Safety",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/safety/",
    "usScoutsUrl": "http://usscouts.org/mb/mb012.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Safety Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/safety/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Safety%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "salesmanship",
    "name": "Salesmanship",
    "eagleRequired": false,
    "description": "Earn the Salesmanship merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb099.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Salesmanship.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Salesmanship.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Salesmanship with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Salesmanship."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/salesmanship/",
    "usScoutsUrl": "http://usscouts.org/mb/mb099.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Salesmanship Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2022",
    "pamphletUrl": "https://www.scouting.org/merit-badges/salesmanship/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Salesmanship%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "scholarship",
    "name": "Scholarship",
    "eagleRequired": false,
    "description": "Earn the Scholarship merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb100.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Scholarship.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Scholarship.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Scholarship with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Scholarship."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/scholarship/",
    "usScoutsUrl": "http://usscouts.org/mb/mb100.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Scholarship Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/scholarship/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Scholarship%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "scouting-heritage",
    "name": "Scouting Heritage",
    "eagleRequired": false,
    "description": "Earn the Scouting Heritage merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb143.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Scouting-Heritage.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Scouting-Heritage.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Scouting Heritage with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Scouting Heritage."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Civics & Citizenship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/scouting-heritage/",
    "usScoutsUrl": "http://usscouts.org/mb/mb143.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Scouting Heritage Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/scouting-heritage/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Scouting%20Heritage%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "scuba-diving",
    "name": "Scuba Diving",
    "eagleRequired": false,
    "description": "Earn the Scuba Diving merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb138.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Scuba-Diving.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Scuba-Diving.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Scuba Diving with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Scuba Diving."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/scuba-diving/",
    "usScoutsUrl": "http://usscouts.org/mb/mb138.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Scuba Diving Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/scuba-diving/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Scuba%20Diving%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "sculpture",
    "name": "Sculpture",
    "eagleRequired": false,
    "description": "Earn the Sculpture merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb101.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Sculpture.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Sculpture.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Sculpture with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Sculpture."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/sculpture/",
    "usScoutsUrl": "http://usscouts.org/mb/mb101.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Sculpture Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/sculpture/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Sculpture%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "search-and-rescue",
    "name": "Search and Rescue",
    "eagleRequired": false,
    "description": "Earn the Search and Rescue merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb150.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Search-and-Rescue.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Search-and-Rescue.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Search and Rescue with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Search and Rescue."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Health & Safety",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/search-and-rescue/",
    "usScoutsUrl": "http://usscouts.org/mb/mb150.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Search and Rescue Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2018",
    "pamphletUrl": "https://www.scouting.org/merit-badges/search-and-rescue/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Search%20and%20Rescue%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "shotgun-shooting",
    "name": "Shotgun Shooting",
    "eagleRequired": false,
    "description": "Earn the Shotgun Shooting merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb124.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Shotgun-Shooting.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Shotgun-Shooting.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Shotgun Shooting with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Shotgun Shooting."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/shotgun-shooting/",
    "usScoutsUrl": "http://usscouts.org/mb/mb124.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Shotgun Shooting Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2013",
    "pamphletUrl": "https://www.scouting.org/merit-badges/shotgun-shooting/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Shotgun%20Shooting%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "signs-signals-and-codes",
    "name": "Signs, Signals, and Codes",
    "eagleRequired": false,
    "description": "Earn the Signs, Signals, and Codes merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb157.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Signs,-Signals,-and-Codes.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Signs,-Signals,-and-Codes.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Signs, Signals, and Codes with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Signs, Signals, and Codes."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/signs-signals-and-codes/",
    "usScoutsUrl": "http://usscouts.org/mb/mb132.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Signs, Signals, and Codes Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2017",
    "pamphletUrl": "https://www.scouting.org/merit-badges/signs-signals-and-codes/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Signs%2C%20Signals%2C%20and%20Codes%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "skating",
    "name": "Skating",
    "eagleRequired": false,
    "description": "Earn the Skating merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb103.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Skating.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Skating.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Skating with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Skating."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Life Skills & Fitness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/skating/",
    "usScoutsUrl": "http://usscouts.org/mb/mb103.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Skating Merit Badge Pamphlet",
    "pamphletSku": "35949",
    "pamphletDigitalSku": "650744",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/skating/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Skating%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "small-boat-sailing",
    "name": "Small-boat Sailing",
    "eagleRequired": false,
    "description": "Earn the Small-boat Sailing merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb105.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Small-boat-Sailing.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Small-boat-Sailing.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Small-boat Sailing with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Small-boat Sailing."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/small-boat-sailing/",
    "usScoutsUrl": "http://usscouts.org/mb/mb105.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Small-boat Sailing Merit Badge Pamphlet",
    "pamphletSku": "35950",
    "pamphletDigitalSku": "649749",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/small-boat-sailing/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Small-boat%20Sailing%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "snow-sports",
    "name": "Snow Sports",
    "eagleRequired": false,
    "description": "Earn the Snow Sports merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb135.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Snow-Sports.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Snow-Sports.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Snow Sports with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Snow Sports."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/snow-sports/",
    "usScoutsUrl": "http://usscouts.org/mb/mb135.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Snow Sports Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/snow-sports/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Snow%20Sports%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "soil-and-water-conservation",
    "name": "Soil and Water Conservation",
    "eagleRequired": false,
    "description": "Earn the Soil and Water Conservation merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb106.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Soil-and-Water-Conservation.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Soil-and-Water-Conservation.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Soil and Water Conservation with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Soil and Water Conservation."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/soil-and-water-conservation/",
    "usScoutsUrl": "http://usscouts.org/mb/mb106.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Soil and Water Conservation Merit Badge Pamphlet",
    "pamphletSku": "35952",
    "pamphletDigitalSku": "649768",
    "pamphletRevYear": "2020",
    "pamphletUrl": "https://www.scouting.org/merit-badges/soil-and-water-conservation/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Soil%20and%20Water%20Conservation%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "space-exploration",
    "name": "Space Exploration",
    "eagleRequired": false,
    "description": "Earn the Space Exploration merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb107.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Space-Exploration.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Space-Exploration.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Space Exploration with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Space Exploration."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "STEM & Technology",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/space-exploration/",
    "usScoutsUrl": "http://usscouts.org/mb/mb107.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Space Exploration Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2019",
    "pamphletUrl": "https://www.scouting.org/merit-badges/space-exploration/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Space%20Exploration%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "sports",
    "name": "Sports",
    "eagleRequired": false,
    "description": "Earn the Sports merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb013.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Sports.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Sports.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Sports with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Sports."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Life Skills & Fitness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/sports/",
    "usScoutsUrl": "http://usscouts.org/mb/mb013.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Sports Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/sports/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Sports%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "stamp-collecting",
    "name": "Stamp Collecting",
    "eagleRequired": false,
    "description": "Earn the Stamp Collecting merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb108.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Stamp-Collecting.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Stamp-Collecting.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Stamp Collecting with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Stamp Collecting."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/stamp-collecting/",
    "usScoutsUrl": "http://usscouts.org/mb/mb108.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Stamp Collecting Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/stamp-collecting/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Stamp%20Collecting%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "surveying",
    "name": "Surveying",
    "eagleRequired": false,
    "description": "Earn the Surveying merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb109.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Surveying.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Surveying.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Surveying with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Surveying."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/surveying/",
    "usScoutsUrl": "http://usscouts.org/mb/mb109.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Surveying Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/surveying/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Surveying%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "textile",
    "name": "Textile",
    "eagleRequired": false,
    "description": "Earn the Textile merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb110.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Textile.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Textile.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Textile with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Textile."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/textile/",
    "usScoutsUrl": "http://usscouts.org/mb/mb110.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Textile Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/textile/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Textile%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "theater",
    "name": "Theater",
    "eagleRequired": false,
    "description": "Earn the Theater merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb111.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Theater.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Theater.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Theater with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Theater."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Arts & Hobbies",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/theater/",
    "usScoutsUrl": "http://usscouts.org/mb/mb111.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Theater Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2020",
    "pamphletUrl": "https://www.scouting.org/merit-badges/theater/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Theater%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "traffic-safety",
    "name": "Traffic Safety",
    "eagleRequired": false,
    "description": "Earn the Traffic Safety merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb112.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Traffic-Safety.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Traffic-Safety.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Traffic Safety with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Traffic Safety."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Health & Safety",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/traffic-safety/",
    "usScoutsUrl": "http://usscouts.org/mb/mb112.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Traffic Safety Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2021",
    "pamphletUrl": "https://www.scouting.org/merit-badges/traffic-safety/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Traffic%20Safety%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "truck-transportation",
    "name": "Truck Transportation",
    "eagleRequired": false,
    "description": "Earn the Truck Transportation merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb113.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Truck-Transportation.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Truck-Transportation.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Truck Transportation with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Truck Transportation."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/truck-transportation/",
    "usScoutsUrl": "http://usscouts.org/mb/mb113.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Truck Transportation Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/truck-transportation/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Truck%20Transportation%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "veterinary-medicine",
    "name": "Veterinary Medicine",
    "eagleRequired": false,
    "description": "Earn the Veterinary Medicine merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb114.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Veterinary-Medicine.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Veterinary-Medicine.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Veterinary Medicine with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Veterinary Medicine."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/veterinary-medicine/",
    "usScoutsUrl": "http://usscouts.org/mb/mb114.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Veterinary Medicine Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2024",
    "pamphletUrl": "https://www.scouting.org/merit-badges/veterinary-medicine/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Veterinary%20Medicine%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "water-sports",
    "name": "Water Sports",
    "eagleRequired": false,
    "description": "Earn the Water Sports merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb115.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Water-Sports.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Water-Sports.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Water Sports with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Water Sports."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Life Skills & Fitness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/water-sports/",
    "usScoutsUrl": "http://usscouts.org/mb/mb115.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Water Sports Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2013",
    "pamphletUrl": "https://www.scouting.org/merit-badges/water-sports/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Water%20Sports%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "weather",
    "name": "Weather",
    "eagleRequired": false,
    "description": "Earn the Weather merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb116.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Weather.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Weather.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Weather with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Weather."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Nature & Science (STEM)",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/weather/",
    "usScoutsUrl": "http://usscouts.org/mb/mb116.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Weather Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2023",
    "pamphletUrl": "https://www.scouting.org/merit-badges/weather/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Weather%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "welding",
    "name": "Welding",
    "eagleRequired": false,
    "description": "Earn the Welding merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb148.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Welding.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Welding.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Welding with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Welding."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/welding/",
    "usScoutsUrl": "http://usscouts.org/mb/mb148.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Welding Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2018",
    "pamphletUrl": "https://www.scouting.org/merit-badges/welding/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Welding%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "whitewater",
    "name": "Whitewater",
    "eagleRequired": false,
    "description": "Earn the Whitewater merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb125.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Whitewater.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Whitewater.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Whitewater with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Whitewater."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/whitewater/",
    "usScoutsUrl": "http://usscouts.org/mb/mb125.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Whitewater Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2019",
    "pamphletUrl": "https://www.scouting.org/merit-badges/whitewater/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Whitewater%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "wilderness-survival",
    "name": "Wilderness Survival",
    "eagleRequired": false,
    "description": "Earn the Wilderness Survival merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb117.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Wilderness-Survival.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Wilderness-Survival.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Wilderness Survival with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Wilderness Survival."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Outdoor & Wilderness",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/wilderness-survival/",
    "usScoutsUrl": "http://usscouts.org/mb/mb117.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Wilderness Survival Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2017",
    "pamphletUrl": "https://www.scouting.org/merit-badges/wilderness-survival/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Wilderness%20Survival%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "wood-carving",
    "name": "Wood Carving",
    "eagleRequired": false,
    "description": "Earn the Wood Carving merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb118.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Wood-Carving.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Wood-Carving.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Wood Carving with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Wood Carving."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Careers & Electives",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/wood-carving/",
    "usScoutsUrl": "http://usscouts.org/mb/mb118.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Wood Carving Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2015",
    "pamphletUrl": "https://www.scouting.org/merit-badges/wood-carving/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Wood%20Carving%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  },
  {
    "id": "woodwork",
    "name": "Woodwork",
    "eagleRequired": false,
    "description": "Earn the Woodwork merit badge by completing the official Scouts BSA requirements and workbook packet.",
    "pageUrl": "http://usscouts.org/mb/mb119.asp",
    "packetPdfUrl": "http://usscouts.org/mb/worksheets/Woodwork.pdf",
    "packetDocxUrl": "http://usscouts.org/mb/worksheets/Woodwork.docx",
    "requirements": [
      {
        "id": "1",
        "text": "Discuss the principles and fundamentals of Woodwork with your counselor."
      },
      {
        "id": "2",
        "text": "Review the safety precautions and regulations relevant to Woodwork."
      },
      {
        "id": "3",
        "text": "Complete the practical demonstrations and activities outlined in the official workbook."
      },
      {
        "id": "4",
        "text": "Prepare a report, presentation, or project demonstrating your understanding."
      },
      {
        "id": "5",
        "text": "Participate in a counselor review and summarize what you have learned."
      }
    ],
    "category": "Trades & Craftsmanship",
    "timeCommitment": "Standard (1–3 Sessions / Workshop)",
    "timeAlert": "",
    "eagleTip": "Read the official pamphlet, complete the workbook, and review with your Merit Badge Counselor.",
    "eagleGroup": "Elective",
    "scoutingOrgUrl": "https://www.scouting.org/merit-badges/woodwork/",
    "usScoutsUrl": "http://usscouts.org/mb/mb119.asp",
    "scoutingOrgSkillsUrl": "https://www.scouting.org/skills/merit-badges/",
    "pamphletTitle": "Woodwork Merit Badge Pamphlet",
    "pamphletSku": "35866",
    "pamphletDigitalSku": "655627",
    "pamphletRevYear": "2020",
    "pamphletUrl": "https://www.scouting.org/merit-badges/woodwork/",
    "scoutShopPamphletUrl": "https://www.scoutshop.org/catalogsearch/result/?q=Woodwork%20Merit%20Badge%20Pamphlet",
    "pamphletGuideUrl": "http://www.usscouts.org/mb/mbbooks.asp"
  }
];
