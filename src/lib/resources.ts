export type ResourceType = "Ambulance" | "Boat" | "Helicopter" | "Supply Truck";
export type ResourceStatus = "Available" | "Dispatched" | "Standby";

export interface Resource {
  id: string;
  name: string;
  type: ResourceType;
  status: ResourceStatus;
  lat: number;
  lng: number;
}

export const resourceStatusColor: Record<ResourceStatus, string> = {
  Available: "#16a34a",
  Dispatched: "#2563eb",
  Standby: "#6b7280",
};

export const resources: Resource[] = [
  {
    id: "RES-01",
    name: "ALS Ambulance 12",
    type: "Ambulance",
    status: "Dispatched",
    lat: 23.035,
    lng: 72.565,
  },
  {
    id: "RES-02",
    name: "NDRF Boat 3",
    type: "Boat",
    status: "Dispatched",
    lat: 23.044,
    lng: 72.572,
  },
  {
    id: "RES-03",
    name: "ALS Ambulance 07",
    type: "Ambulance",
    status: "Available",
    lat: 23.022,
    lng: 72.532,
  },
  {
    id: "RES-04",
    name: "Chetak Helicopter 1",
    type: "Helicopter",
    status: "Standby",
    lat: 23.078,
    lng: 72.636,
  },
  {
    id: "RES-05",
    name: "Supply Truck Delta",
    type: "Supply Truck",
    status: "Available",
    lat: 23.013,
    lng: 72.51,
  },
  {
    id: "RES-06",
    name: "NDRF Boat 5",
    type: "Boat",
    status: "Available",
    lat: 23.005,
    lng: 72.582,
  },
  {
    id: "RES-07",
    name: "Supply Truck Echo",
    type: "Supply Truck",
    status: "Dispatched",
    lat: 23.028,
    lng: 72.602,
  },
  {
    id: "RES-08",
    name: "ALS Ambulance 21",
    type: "Ambulance",
    status: "Standby",
    lat: 23.009,
    lng: 72.548,
  },
];
