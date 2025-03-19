
import { PieChart, Pie, Cell, ResponsiveContainer, Label } from "recharts";
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

export const MonthlySnapshot = () => {
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
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
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
            <div key={index} className="text-center">
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
