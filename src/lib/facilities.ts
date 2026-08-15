export type FacilityType = "Hospital" | "Relief Center" | "Shelter";

export interface ReliefFacility {
  id: string;
  name: string;
  type: FacilityType;
  bedsAvailable: number;
  lat: number;
  lng: number;
}

export const facilities: ReliefFacility[] = [
  {
    id: "FAC-CIV-01",
    name: "Civil Hospital",
    type: "Hospital",
    bedsAvailable: 312,
    lat: 23.029,
    lng: 72.599,
  },
  {
    id: "FAC-SVP-02",
    name: "SVP Hospital",
    type: "Hospital",
    bedsAvailable: 148,
    lat: 23.0289,
    lng: 72.5743,
  },
  {
    id: "FAC-LGH-03",
    name: "LG Hospital",
    type: "Hospital",
    bedsAvailable: 96,
    lat: 22.998,
    lng: 72.608,
  },
  {
    id: "FAC-AMC-04",
    name: "AMC Relief Center",
    type: "Relief Center",
    bedsAvailable: 220,
    lat: 23.022,
    lng: 72.545,
  },
  {
    id: "FAC-SHE-05",
    name: "Sabarmati Riverfront Shelter",
    type: "Shelter",
    bedsAvailable: 175,
    lat: 23.041,
    lng: 72.578,
  },
];
