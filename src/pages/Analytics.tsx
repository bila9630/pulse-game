import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Users, MessageSquare, Calendar } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

const workLifeBalanceData = [
  { name: "Excellent", value: 45, fill: "hsl(var(--success))" },
  { name: "Good", value: 30, fill: "hsl(var(--primary))" },
  { name: "Fair", value: 18, fill: "hsl(var(--accent))" },
  { name: "Needs Improvement", value: 7, fill: "hsl(var(--destructive))" },
];

const participationData = [
  { month: "Jan", responses: 120 },
  { month: "Feb", responses: 145 },
  { month: "Mar", responses: 180 },
  { month: "Apr", responses: 210 },
  { month: "May", responses: 250 },
  { month: "Jun", responses: 290 },
];

const sentimentData = [
  { category: "Team Support", positive: 85, negative: 15 },
  { category: "Work Environment", positive: 78, negative: 22 },
  { category: "Career Growth", positive: 72, negative: 28 },
  { category: "Communication", positive: 88, negative: 12 },
];

const Analytics = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground text-lg">Insights from your team's feedback</p>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 shadow-lg border-l-4 border-l-primary animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Participants</span>
          </div>
          <p className="text-3xl font-bold mb-1">1,284</p>
          <p className="text-sm text-success flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +12% from last month
          </p>
        </Card>

        <Card className="p-6 shadow-lg border-l-4 border-l-secondary animate-fade-in" style={{ animationDelay: "0.1s" }}>
          <div className="flex items-center justify-between mb-4">
            <MessageSquare className="h-8 w-8 text-secondary" />
            <span className="text-sm font-medium text-muted-foreground">Responses</span>
          </div>
          <p className="text-3xl font-bold mb-1">5,147</p>
          <p className="text-sm text-success flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +18% from last month
          </p>
        </Card>

        <Card className="p-6 shadow-lg border-l-4 border-l-accent animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center justify-between mb-4">
            <BarChart3 className="h-8 w-8 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">Avg Rating</span>
          </div>
          <p className="text-3xl font-bold mb-1">4.2/5</p>
          <p className="text-sm text-success flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            +0.3 from last month
          </p>
        </Card>

        <Card className="p-6 shadow-lg border-l-4 border-l-success animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <div className="flex items-center justify-between mb-4">
            <Calendar className="h-8 w-8 text-success" />
            <span className="text-sm font-medium text-muted-foreground">Active Days</span>
          </div>
          <p className="text-3xl font-bold mb-1">28/30</p>
          <p className="text-sm text-success flex items-center">
            93% engagement
          </p>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Participation Trend */}
        <Card className="p-6 shadow-lg animate-scale-in">
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-primary" />
              Participation Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={participationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="responses" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
        </Card>

        {/* Work-Life Balance Distribution */}
        <Card className="p-6 shadow-lg animate-scale-in" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <BarChart3 className="mr-2 h-5 w-5 text-secondary" />
              Work-Life Balance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={workLifeBalanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {workLifeBalanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="p-6 shadow-lg lg:col-span-2 animate-scale-in" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-xl font-bold mb-6 flex items-center">
              <MessageSquare className="mr-2 h-5 w-5 text-accent" />
              Sentiment by Category
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--card))", 
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px"
                  }} 
                />
                <Legend />
                <Bar dataKey="positive" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="negative" fill="hsl(var(--destructive))" radius={[8, 8, 0, 0]} />
              </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card className="p-6 shadow-lg mt-8 animate-fade-in">
        <h3 className="text-xl font-bold mb-6">Recent Open Feedback</h3>
        <div className="space-y-4">
          {[
            { text: "Love the new team collaboration tools!", sentiment: "positive", time: "2 hours ago" },
            { text: "Would appreciate more flexible working hours.", sentiment: "neutral", time: "5 hours ago" },
            { text: "The onboarding process was excellent!", sentiment: "positive", time: "1 day ago" },
            { text: "Communication between departments could be improved.", sentiment: "neutral", time: "2 days ago" },
          ].map((feedback, index) => (
            <div
              key={index}
              className="p-4 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
            >
              <p className="mb-2">{feedback.text}</p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  feedback.sentiment === "positive" 
                    ? "bg-success/10 text-success" 
                    : "bg-accent/10 text-accent"
                }`}>
                  {feedback.sentiment}
                </span>
                <span>{feedback.time}</span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
