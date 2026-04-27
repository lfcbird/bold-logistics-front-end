export type ID = string;

export interface Customer {
  id: ID;
  name: string;
  contact: string;
  email: string;
  phone: string;
  address: string;
  createdAt: string;
}

export type OrderStatus = "PENDING" | "ASSIGNED" | "IN_TRANSIT" | "DELIVERED" | "CANCELLED";

export interface Order {
  id: ID;
  customerId: ID;
  customerName: string;
  origin: string;
  destination: string;
  pickupDate: string;
  weightLbs: number;
  rate: number;
  status: OrderStatus;
  createdAt: string;
}

export type DispatchStatus = "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface Dispatch {
  id: ID;
  orderId: ID;
  driverId: ID;
  driverName: string;
  vehicleId: ID;
  vehiclePlate: string;
  scheduledAt: string;
  status: DispatchStatus;
  notes?: string;
}

export type DriverStatus = "AVAILABLE" | "ON_TRIP" | "OFF_DUTY";

export interface Driver {
  id: ID;
  name: string;
  licenseNumber: string;
  phone: string;
  email: string;
  status: DriverStatus;
  hireDate: string;
}

export type VehicleStatus = "ACTIVE" | "MAINTENANCE" | "INACTIVE";

export interface Vehicle {
  id: ID;
  plate: string;
  make: string;
  model: string;
  year: number;
  capacityLbs: number;
  status: VehicleStatus;
}

export interface Doc {
  id: ID;
  name: string;
  type: "BOL" | "POD" | "INVOICE" | "INSURANCE" | "OTHER";
  relatedTo?: string;
  uploadedAt: string;
  size: string;
}

export interface Notification {
  id: ID;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

export interface DashboardSummary {
  totalCustomers: number;
  activeOrders: number;
  inTransit: number;
  deliveredThisMonth: number;
  revenueThisMonth: number;
  availableDrivers: number;
  activeVehicles: number;
  pendingDocuments: number;
  revenueTrend: { month: string; revenue: number }[];
  ordersByStatus: { status: string; count: number }[];
}
