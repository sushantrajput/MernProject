
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Customer {
  id: string;
  name: string;
  email: string;
  totalSpent: number;
  orders: number;
  status: "active" | "inactive";
  lastActive: string;
  image: string;
}

const mockCustomers: Customer[] = [
  {
    id: "c001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    totalSpent: 12500,
    orders: 5,
    status: "active",
    lastActive: "2 hours ago",
    image: "https://i.pravatar.cc/150?img=1"
  },
  {
    id: "c002",
    name: "Priya Patel",
    email: "priya.patel@example.com",
    totalSpent: 28000,
    orders: 9,
    status: "active",
    lastActive: "5 minutes ago",
    image: "https://i.pravatar.cc/150?img=2"
  },
  {
    id: "c003",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    totalSpent: 5000,
    orders: 2,
    status: "inactive",
    lastActive: "3 days ago",
    image: "https://i.pravatar.cc/150?img=3"
  },
  {
    id: "c004",
    name: "Deepika Singh",
    email: "deepika.singh@example.com",
    totalSpent: 35000,
    orders: 12,
    status: "active",
    lastActive: "1 hour ago",
    image: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: "c005",
    name: "Vikram Mehta",
    email: "vikram.mehta@example.com",
    totalSpent: 9000,
    orders: 4,
    status: "active",
    lastActive: "Just now",
    image: "https://i.pravatar.cc/150?img=5"
  }
];

const CustomerActivity: React.FC = () => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Customer Activity</h2>
        <p className="text-muted-foreground">
          Monitor your customers' activities and purchasing behavior.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Customers</h3>
          <p className="text-3xl font-bold">{mockCustomers.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Customers</h3>
          <p className="text-3xl font-bold">{mockCustomers.filter(c => c.status === "active").length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border shadow-sm">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">Average Spend</h3>
          <p className="text-3xl font-bold">
            {formatPrice(mockCustomers.reduce((acc, c) => acc + c.totalSpent, 0) / mockCustomers.length)}
          </p>
        </div>
      </div>
      
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead>Total Spent</TableHead>
              <TableHead>Last Active</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={customer.image} alt={customer.name} />
                      <AvatarFallback>{customer.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={customer.status === 'active' ? 'default' : 'secondary'}
                    className={customer.status === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                  >
                    {customer.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </TableCell>
                <TableCell>{customer.orders}</TableCell>
                <TableCell>{formatPrice(customer.totalSpent)}</TableCell>
                <TableCell>{customer.lastActive}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CustomerActivity;
