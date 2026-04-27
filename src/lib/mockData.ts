import type { Customer, Dispatch, Doc, Driver, Notification, Order, Vehicle, DashboardSummary } from "./types";

export const mockCustomers: Customer[] = [
  { id: "C-1001", name: "Walmart Distribution", contact: "Sarah Johnson", email: "sarah@walmart-dc.com", phone: "+1 (555) 201-3344", address: "702 SW 8th St, Bentonville, AR", createdAt: "2025-01-12" },
  { id: "C-1002", name: "Home Depot Logistics", contact: "Mike Chen", email: "mchen@homedepot.com", phone: "+1 (555) 442-7788", address: "2455 Paces Ferry Rd, Atlanta, GA", createdAt: "2025-02-04" },
  { id: "C-1003", name: "Amazon Freight", contact: "Priya Patel", email: "priya@amazonfreight.com", phone: "+1 (555) 991-2231", address: "410 Terry Ave N, Seattle, WA", createdAt: "2025-02-19" },
  { id: "C-1004", name: "Costco Wholesale", contact: "Daniel Reed", email: "dreed@costco.com", phone: "+1 (555) 661-9020", address: "999 Lake Dr, Issaquah, WA", createdAt: "2025-03-02" },
  { id: "C-1005", name: "Target Supply Co.", contact: "Lauren Brooks", email: "lbrooks@target.com", phone: "+1 (555) 110-4422", address: "1000 Nicollet Mall, Minneapolis, MN", createdAt: "2025-03-22" },
  { id: "C-1006", name: "FedEx Ground Partner", contact: "Omar Hassan", email: "ohassan@fedex.com", phone: "+1 (555) 818-5566", address: "942 S Shady Grove Rd, Memphis, TN", createdAt: "2025-04-01" },
];

export const mockDrivers: Driver[] = [
  { id: "D-501", name: "James Carter", licenseNumber: "TX-DL-887421", phone: "+1 (555) 233-1190", email: "jcarter@bold.com", status: "ON_TRIP", hireDate: "2023-06-14" },
  { id: "D-502", name: "Maria Gonzalez", licenseNumber: "CA-DL-553201", phone: "+1 (555) 778-2244", email: "mgonzalez@bold.com", status: "AVAILABLE", hireDate: "2022-11-03" },
  { id: "D-503", name: "Robert Kim", licenseNumber: "WA-DL-441098", phone: "+1 (555) 119-3380", email: "rkim@bold.com", status: "AVAILABLE", hireDate: "2024-02-20" },
  { id: "D-504", name: "Anthony Davis", licenseNumber: "GA-DL-220117", phone: "+1 (555) 660-7711", email: "adavis@bold.com", status: "OFF_DUTY", hireDate: "2021-08-09" },
  { id: "D-505", name: "Linda Park", licenseNumber: "IL-DL-998012", phone: "+1 (555) 442-1009", email: "lpark@bold.com", status: "ON_TRIP", hireDate: "2023-01-30" },
];

export const mockVehicles: Vehicle[] = [
  { id: "V-301", plate: "TX-7842-BL", make: "Freightliner", model: "Cascadia", year: 2022, capacityLbs: 80000, status: "ACTIVE" },
  { id: "V-302", plate: "CA-3320-RT", make: "Volvo", model: "VNL 860", year: 2023, capacityLbs: 80000, status: "ACTIVE" },
  { id: "V-303", plate: "WA-1109-MS", make: "Kenworth", model: "T680", year: 2021, capacityLbs: 78000, status: "MAINTENANCE" },
  { id: "V-304", plate: "GA-5567-PR", make: "Peterbilt", model: "579", year: 2024, capacityLbs: 80000, status: "ACTIVE" },
  { id: "V-305", plate: "IL-9921-FL", make: "Mack", model: "Anthem", year: 2020, capacityLbs: 76000, status: "INACTIVE" },
];

export const mockOrders: Order[] = [
  { id: "ORD-20451", customerId: "C-1001", customerName: "Walmart Distribution", origin: "Bentonville, AR", destination: "Dallas, TX", pickupDate: "2025-04-22", weightLbs: 42000, rate: 3850, status: "IN_TRANSIT", createdAt: "2025-04-20" },
  { id: "ORD-20452", customerId: "C-1003", customerName: "Amazon Freight", origin: "Seattle, WA", destination: "Portland, OR", pickupDate: "2025-04-23", weightLbs: 28500, rate: 1620, status: "ASSIGNED", createdAt: "2025-04-21" },
  { id: "ORD-20453", customerId: "C-1002", customerName: "Home Depot Logistics", origin: "Atlanta, GA", destination: "Charlotte, NC", pickupDate: "2025-04-24", weightLbs: 35200, rate: 2180, status: "PENDING", createdAt: "2025-04-22" },
  { id: "ORD-20454", customerId: "C-1004", customerName: "Costco Wholesale", origin: "Issaquah, WA", destination: "Boise, ID", pickupDate: "2025-04-21", weightLbs: 41000, rate: 2960, status: "DELIVERED", createdAt: "2025-04-19" },
  { id: "ORD-20455", customerId: "C-1005", customerName: "Target Supply Co.", origin: "Minneapolis, MN", destination: "Chicago, IL", pickupDate: "2025-04-25", weightLbs: 30800, rate: 1980, status: "PENDING", createdAt: "2025-04-23" },
  { id: "ORD-20456", customerId: "C-1006", customerName: "FedEx Ground Partner", origin: "Memphis, TN", destination: "Nashville, TN", pickupDate: "2025-04-22", weightLbs: 18200, rate: 1250, status: "DELIVERED", createdAt: "2025-04-20" },
  { id: "ORD-20457", customerId: "C-1001", customerName: "Walmart Distribution", origin: "Bentonville, AR", destination: "Oklahoma City, OK", pickupDate: "2025-04-26", weightLbs: 39500, rate: 2740, status: "IN_TRANSIT", createdAt: "2025-04-22" },
];

export const mockDispatches: Dispatch[] = [
  { id: "DSP-9001", orderId: "ORD-20451", driverId: "D-501", driverName: "James Carter", vehicleId: "V-301", vehiclePlate: "TX-7842-BL", scheduledAt: "2025-04-22 06:30", status: "IN_PROGRESS", notes: "Refrigerated load, deliver before 8 PM CT." },
  { id: "DSP-9002", orderId: "ORD-20452", driverId: "D-505", driverName: "Linda Park", vehicleId: "V-302", vehiclePlate: "CA-3320-RT", scheduledAt: "2025-04-23 05:00", status: "SCHEDULED" },
  { id: "DSP-9003", orderId: "ORD-20454", driverId: "D-502", driverName: "Maria Gonzalez", vehicleId: "V-304", vehiclePlate: "GA-5567-PR", scheduledAt: "2025-04-21 04:15", status: "COMPLETED" },
  { id: "DSP-9004", orderId: "ORD-20457", driverId: "D-501", driverName: "James Carter", vehicleId: "V-301", vehiclePlate: "TX-7842-BL", scheduledAt: "2025-04-26 07:00", status: "SCHEDULED" },
  { id: "DSP-9005", orderId: "ORD-20456", driverId: "D-503", driverName: "Robert Kim", vehicleId: "V-302", vehiclePlate: "CA-3320-RT", scheduledAt: "2025-04-22 05:45", status: "COMPLETED" },
];

export const mockDocs: Doc[] = [
  { id: "DOC-1", name: "BOL_ORD-20451.pdf", type: "BOL", relatedTo: "ORD-20451", uploadedAt: "2025-04-22", size: "248 KB" },
  { id: "DOC-2", name: "POD_ORD-20454.pdf", type: "POD", relatedTo: "ORD-20454", uploadedAt: "2025-04-21", size: "312 KB" },
  { id: "DOC-3", name: "Invoice_C-1001_April.pdf", type: "INVOICE", relatedTo: "C-1001", uploadedAt: "2025-04-23", size: "184 KB" },
  { id: "DOC-4", name: "Insurance_V-301_2025.pdf", type: "INSURANCE", relatedTo: "V-301", uploadedAt: "2025-01-10", size: "1.1 MB" },
  { id: "DOC-5", name: "POD_ORD-20456.pdf", type: "POD", relatedTo: "ORD-20456", uploadedAt: "2025-04-22", size: "276 KB" },
];

export const mockNotifications: Notification[] = [
  { id: "N-1", title: "Order delivered", message: "ORD-20454 delivered to Costco — Boise, ID.", type: "success", read: false, createdAt: "2025-04-21 18:42" },
  { id: "N-2", title: "Vehicle maintenance due", message: "Kenworth T680 (WA-1109-MS) is due for service.", type: "warning", read: false, createdAt: "2025-04-22 09:10" },
  { id: "N-3", title: "New order received", message: "Target Supply Co. created order ORD-20455.", type: "info", read: true, createdAt: "2025-04-23 11:25" },
  { id: "N-4", title: "Driver off duty", message: "Anthony Davis is now off duty.", type: "info", read: true, createdAt: "2025-04-22 17:00" },
];

export const mockSummary: DashboardSummary = {
  totalCustomers: mockCustomers.length,
  activeOrders: mockOrders.filter(o => o.status === "PENDING" || o.status === "ASSIGNED" || o.status === "IN_TRANSIT").length,
  inTransit: mockOrders.filter(o => o.status === "IN_TRANSIT").length,
  deliveredThisMonth: mockOrders.filter(o => o.status === "DELIVERED").length,
  revenueThisMonth: mockOrders.reduce((s, o) => s + o.rate, 0),
  availableDrivers: mockDrivers.filter(d => d.status === "AVAILABLE").length,
  activeVehicles: mockVehicles.filter(v => v.status === "ACTIVE").length,
  pendingDocuments: 3,
  revenueTrend: [
    { month: "Nov", revenue: 142000 },
    { month: "Dec", revenue: 168000 },
    { month: "Jan", revenue: 154000 },
    { month: "Feb", revenue: 189000 },
    { month: "Mar", revenue: 211000 },
    { month: "Apr", revenue: 246000 },
  ],
  ordersByStatus: [
    { status: "Pending", count: 2 },
    { status: "Assigned", count: 1 },
    { status: "In Transit", count: 2 },
    { status: "Delivered", count: 2 },
  ],
};
