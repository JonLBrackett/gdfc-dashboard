// BuildToCountsDashboard.jsx — with auto-sync from Google Sheets + improved field labels
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

const initialData = [];

export default function BuildToCountsDashboard() {
  const [data, setData] = useState(initialData);
  const [form, setForm] = useState({});
  const [inventoryUpdate, setInventoryUpdate] = useState({});

  useEffect(() => {
    handlePull();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleInventoryChange = (e) => {
    const { name, value } = e.target;
    setInventoryUpdate({ ...inventoryUpdate, [name]: value });
  };

  const handleSubmit = () => {
    const frequencyMultiplier = form.frequency === "weekly" ? 1 : form.frequency === "bi-weekly" ? 0.5 : 0.25;
    const updatedData = [...data];

    updatedData.forEach((item, index) => {
      const key = item.name;
      const inputVal = parseInt(form[key] || 0, 10);
      updatedData[index].expected += inputVal * frequencyMultiplier;
    });

    setData(updatedData);
    setForm({});
  };

  const handleInventorySubmit = () => {
    const now = new Date().toLocaleString();
    const updatedData = data.map((item) => {
      const inv = parseInt(inventoryUpdate[item.name + "-inventory"] || item.inventory, 10);
      const sold = parseInt(inventoryUpdate[item.name + "-sold"] || item.sold, 10);
      return {
        ...item,
        inventory: inv,
        sold: sold,
        lastUpdated: now,
      };
    });
    setData(updatedData);
    setInventoryUpdate({});
  };

  const handlePull = async () => {
    const res = await fetch("/api/pull");
    const sheetData = await res.json();
    setData(sheetData);
  };

  const handlePush = async () => {
    await fetch("/api/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="p-4 grid gap-4">
      <h1 className="text-2xl font-bold">Build to Counts Dashboard</h1>
      <div className="flex gap-2">
        <Button onClick={handlePull}>🔄 Sync Now</Button>
        <Button onClick={handlePush}>💾 Save to Sheets</Button>
      </div>
      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="recurring">Recurring Orders</TabsTrigger>
          <TabsTrigger value="manage">Manage Subscriptions</TabsTrigger>
          <TabsTrigger value="inventory">Inventory & Sales</TabsTrigger>
        </TabsList>

        <TabsContent value="manage">
          <Card>
            <CardContent className="p-4 grid gap-4">
              <h2 className="text-xl">Add Subscription</h2>
              <Input
                name="customer"
                placeholder="Customer Name"
                value={form.customer || ""}
                onChange={(e) => setForm({ ...form, customer: e.target.value })}
              />
              <div className="flex items-center gap-2">
                <label className="text-sm">Active:</label>
                <input
                  type="checkbox"
                  checked={form.active || false}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                />
              </div>
              <Select value={form.frequency} onValueChange={(val) => setForm({ ...form, frequency: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <h3 className="text-md mt-4">Select Products</h3>
              {data.map((item) => (
                <div key={item.name} className="flex flex-col">
                  <label className="text-sm font-medium">{item.name}</label>
                  <Input
                    type="number"
                    value={form[item.name] || ""}
                    onChange={(e) => setForm({ ...form, [item.name]: e.target.value })}
                  />
                </div>
              ))}
              <Button onClick={handleSubmit}>Add to Weekly Demand</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardContent className="p-4 grid gap-4">
              <h2 className="text-xl mb-2">Update Inventory & Sales</h2>
              {data.map((item) => (
                <div key={item.name} className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Inventory – {item.name}</label>
                    <Input
                      name={`${item.name}-inventory`}
                      value={inventoryUpdate[`${item.name}-inventory`] || ""}
                      onChange={handleInventoryChange}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Sold – {item.name}</label>
                    <Input
                      name={`${item.name}-sold`}
                      value={inventoryUpdate[`${item.name}-sold`] || ""}
                      onChange={handleInventoryChange}
                    />
                  </div>
                </div>
              ))}
              <Button onClick={handleInventorySubmit}>Update All</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
