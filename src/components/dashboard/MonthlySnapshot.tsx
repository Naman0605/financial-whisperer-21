
import { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Label, Tooltip } from "recharts";
import { ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const data = [
  { name: "Income", value: 4500, color: "#4DB6AC" },
  { name: "Expenses", value: 2800, color: "#78909C" },
  { name: "Savings", value: 1700, color: "#FFD54F" },
];

const savingsGoal = 2000;
const savingsProgress = (1700 / savingsGoal) * 100;

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 shadow-lg rounded border border-gray-200 dark:border-gray-700">
        <p className="font-medium">{payload[0].name}</p>
        <p className="text-lg font-semibold">${payload[0].value.toLocaleString()}</p>
      </div>
    );
  }
  return null;
};

export const MonthlySnapshot = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle>Monthly Snapshot</CardTitle>
        <CardDescription>January 2023</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip content={<CustomTooltip />} />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                    stroke={activeIndex === index ? "#fff" : "none"}
                    strokeWidth={activeIndex === index ? 2 : 0}
                  />
                ))}
                <Label
                  value={`$${data[2].value}`}
                  position="center"
                  className="text-xl font-bold"
                  fill="#333"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-2">
          {data.map((item, index) => (
            <div 
              key={index} 
              className="text-center transition-all duration-200 hover:scale-105 p-1 rounded-md cursor-pointer"
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="w-3 h-3 rounded-full mx-auto mb-1" style={{ backgroundColor: item.color }} />
              <p className="text-xs text-muted-foreground">{item.name}</p>
              <p className="font-medium">${item.value}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Progress toward savings goal</span>
              <span className="text-sm font-medium">${data[2].value} of ${savingsGoal}</span>
            </div>
            <Progress value={savingsProgress} className="h-2" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/30">
              <div className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-finance-success" />
                <span className="text-xs text-muted-foreground">Income</span>
              </div>
              <p className="text-lg font-semibold mt-1">${data[0].value}</p>
            </div>
            
            <div className="p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200/50 dark:border-gray-700/30">
              <div className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-finance-danger" />
                <span className="text-xs text-muted-foreground">Expenses</span>
              </div>
              <p className="text-lg font-semibold mt-1">${data[1].value}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlySnapshot;
