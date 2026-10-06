export const serviceDetails: Record<string, { includes: string[]; preparation: string }> = {
  grooming: {
    includes: ["Discuss your pet’s coat and grooming preferences", "Ask about bathing, trimming, and nail care", "Tell the team about sensitivities before the visit"],
    preparation: "Share your pet’s breed, coat condition, and preferred grooming style.",
  },
  checkup: {
    includes: ["Discuss your pet’s health and daily routine", "Ask about wellness exams and vaccinations", "Bring any previous care records you have"],
    preparation: "Tell the team about recent changes and the questions you want to discuss.",
  },
  emergency: {
    includes: ["Call the clinic to discuss urgent concerns", "Confirm whether the team can receive your pet", "Ask where to go if the clinic cannot help immediately"],
    preparation: "For urgent concerns, call the team directly rather than waiting for an appointment request.",
  },
  boarding: {
    includes: ["Discuss the dates and length of your pet’s stay", "Share feeding routines and care instructions", "Confirm boarding requirements with the team"],
    preparation: "Have your preferred stay dates and any special care instructions ready.",
  },
  homeVisit: {
    includes: ["Ask whether your address is in the service area", "Discuss which services are suitable for a home visit", "Agree on a time and preparations with the team"],
    preparation: "Share your area and the care you would like arranged at home.",
  },
  preventive: {
    includes: ["Compare the care plan benefits", "Discuss your pet’s routine and care needs", "Confirm current prices and plan terms before joining"],
    preparation: "Use the plan finder below to explore the options before contacting the team.",
  },
};
