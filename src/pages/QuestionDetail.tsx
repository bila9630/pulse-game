import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, AlertTriangle, Sparkles, Wrench, Target, TrendingDown, TrendingUp } from "lucide-react";

// This would typically come from a shared data file or API
const questionsData = [
  {
    id: 1,
    question: "How satisfied are you with your current work-life balance?",
    type: "Multiple Choice",
    totalResponses: 324,
    responseRate: 89,
    keyObservations: [
      { icon: Heart, text: "74% of employees report positive work-life balance satisfaction" },
      { icon: AlertTriangle, text: "8.6% are dissatisfied, indicating potential burnout risk" },
    ],
    actionableInsights: [
      { icon: Sparkles, text: "Implement flexible working hours for better balance" },
      { icon: Target, text: "Focus on supporting the dissatisfied group with wellness programs" },
    ],
  },
  {
    id: 2,
    question: "Do you feel supported by your team lead?",
    type: "Yes/No",
    totalResponses: 356,
    responseRate: 98,
    keyObservations: [
      { icon: Heart, text: "87.6% feel supported by their team lead" },
      { icon: TrendingDown, text: "12.4% lack adequate leadership support" },
    ],
    actionableInsights: [
      { icon: Wrench, text: "Provide leadership training for team leads" },
      { icon: Target, text: "Conduct one-on-one sessions with unsupported employees" },
    ],
  },
  {
    id: 3,
    question: "What improvements would you suggest for our remote work policy?",
    type: "Open-ended",
    totalResponses: 287,
    responseRate: 79,
    keyObservations: [
      { icon: Heart, text: "69% positive sentiment shows overall satisfaction with policy" },
      { icon: AlertTriangle, text: "Common requests include more flexibility and better collaboration tools" },
    ],
    actionableInsights: [
      { icon: Sparkles, text: "Introduce flexible working hours across all teams" },
      { icon: Wrench, text: "Invest in improved communication and collaboration platforms" },
    ],
  },
  {
    id: 4,
    question: "Rate your satisfaction with career development opportunities",
    type: "Multiple Choice",
    totalResponses: 298,
    responseRate: 82,
    keyObservations: [
      { icon: Heart, text: "71.8% rate career development opportunities positively" },
      { icon: AlertTriangle, text: "28.2% rate as average or poor, signaling need for improvement" },
    ],
    actionableInsights: [
      { icon: Target, text: "Expand mentorship and training programs" },
      { icon: Sparkles, text: "Create clear career progression pathways" },
    ],
  },
  {
    id: 5,
    question: "Are you satisfied with the company's communication channels?",
    type: "Yes/No",
    totalResponses: 341,
    responseRate: 94,
    keyObservations: [
      { icon: Heart, text: "84.8% are satisfied with current communication channels" },
      { icon: AlertTriangle, text: "15.2% indicate communication gaps need addressing" },
    ],
    actionableInsights: [
      { icon: Wrench, text: "Survey dissatisfied users for specific channel improvements" },
      { icon: Target, text: "Implement additional communication tools for better reach" },
    ],
  },
];

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const question = questionsData.find((q) => q.id === Number(id));

  if (!question) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Button variant="ghost" onClick={() => navigate("/analytics")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Button>
        <p className="text-muted-foreground">Question not found</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate("/analytics")} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Analytics
      </Button>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3">{question.question}</h1>
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant="outline">{question.type}</Badge>
          <span className="text-sm text-muted-foreground">
            {question.totalResponses} responses
          </span>
          <span className="text-sm text-success flex items-center">
            <TrendingUp className="h-4 w-4 mr-1" />
            {question.responseRate}% response rate
          </span>
        </div>
      </div>

      {/* Key Observations and Actionable Insights */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Key Observations */}
        <Card className="bg-primary/5 border-primary/20">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Target className="mr-3 h-6 w-6 text-primary" />
              Key Observations
            </h2>
            <div className="space-y-4">
              {question.keyObservations?.map((observation, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-background/50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex items-start gap-3 flex-1">
                    <observation.icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-primary" />
                    <p className="text-base leading-relaxed">{observation.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Actionable Insights */}
        <Card className="bg-success/5 border-success/20">
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <Sparkles className="mr-3 h-6 w-6 text-success" />
              Actionable Insights
            </h2>
            <div className="space-y-4">
              {question.actionableInsights?.map((insight, idx) => (
                <div key={idx} className="flex items-start gap-4 p-4 bg-background/50 rounded-lg">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success font-semibold text-lg">
                    {idx + 1}
                  </div>
                  <div className="flex items-start gap-3 flex-1">
                    <insight.icon className="h-5 w-5 mt-0.5 flex-shrink-0 text-success" />
                    <p className="text-base leading-relaxed">{insight.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default QuestionDetail;
