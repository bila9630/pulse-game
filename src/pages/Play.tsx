import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Trophy, Star, Zap, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

type QuestionType = "multiple-choice" | "open-ended" | "yes-no";

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
}

const sampleQuestions: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "How would you rate your work-life balance?",
    options: ["Excellent", "Good", "Fair", "Needs Improvement"],
  },
  {
    id: 2,
    type: "yes-no",
    question: "Do you feel your contributions are valued by the team?",
  },
  {
    id: 3,
    type: "open-ended",
    question: "What's one thing we could improve to make your work experience better?",
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "How clear are your current project goals?",
    options: ["Very Clear", "Mostly Clear", "Somewhat Clear", "Not Clear"],
  },
];

const Play = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userXP, setUserXP] = useState(850);
  const [userLevel, setUserLevel] = useState(5);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [openAnswer, setOpenAnswer] = useState("");
  const [swipeAnimation, setSwipeAnimation] = useState<"left" | "right" | null>(null);

  const question = sampleQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / sampleQuestions.length) * 100;
  const xpToNextLevel = 1000;
  const xpProgress = (userXP / xpToNextLevel) * 100;

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [question.id]: answer });
    
    // Add XP
    const xpGain = 50;
    setUserXP(userXP + xpGain);
    
    toast.success(`+${xpGain} XP!`, {
      description: "Great job! Keep going!",
      icon: <Star className="h-4 w-4 text-accent" />,
    });

    // Move to next question
    setTimeout(() => {
      if (currentQuestion < sampleQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setOpenAnswer("");
      } else {
        toast.success("🎉 Survey Complete!", {
          description: "You earned 200 XP total!",
        });
      }
    }, 500);
  };

  const handleSwipe = (direction: "left" | "right") => {
    setSwipeAnimation(direction);
    const answer = direction === "right" ? "Yes" : "No";
    
    setTimeout(() => {
      handleAnswer(answer);
      setSwipeAnimation(null);
    }, 400);
  };

  const renderQuestion = () => {
    switch (question.type) {
      case "multiple-choice":
        return (
          <div className="space-y-3 animate-fade-in">
            {question.options?.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto py-4 text-left justify-start hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                onClick={() => handleAnswer(option)}
              >
                <span className="text-lg">{option}</span>
              </Button>
            ))}
          </div>
        );

      case "open-ended":
        return (
          <div className="space-y-4 animate-fade-in">
            <Textarea
              placeholder="Share your thoughts..."
              value={openAnswer}
              onChange={(e) => setOpenAnswer(e.target.value)}
              className="min-h-[150px] text-base resize-none"
            />
            <Button
              className="w-full"
              onClick={() => handleAnswer(openAnswer)}
              disabled={!openAnswer.trim()}
            >
              Submit Answer
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );

      case "yes-no":
        return (
          <div className="space-y-6 animate-fade-in">
            <p className="text-center text-muted-foreground">Swipe or tap to answer</p>
            <div
              className={`relative ${
                swipeAnimation === "left"
                  ? "animate-swipe-left"
                  : swipeAnimation === "right"
                  ? "animate-swipe-right"
                  : ""
              }`}
            >
              <Card className="p-8 text-center border-2 border-primary/20 bg-gradient-to-br from-card to-muted/30 shadow-lg">
                <div className="flex justify-center gap-8">
                  <Button
                    size="lg"
                    variant="destructive"
                    className="rounded-full h-20 w-20 shadow-xl hover:scale-110 transition-transform"
                    onClick={() => handleSwipe("left")}
                  >
                    <ThumbsDown className="h-8 w-8" />
                  </Button>
                  <Button
                    size="lg"
                    variant="success"
                    className="rounded-full h-20 w-20 shadow-xl hover:scale-110 transition-transform"
                    onClick={() => handleSwipe("right")}
                  >
                    <ThumbsUp className="h-8 w-8" />
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        );
    }
  };

  if (currentQuestion >= sampleQuestions.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center space-y-6 animate-bounce-in border-2 border-primary/20 shadow-2xl">
          <div className="animate-celebrate">
            <Trophy className="h-20 w-20 mx-auto text-accent" />
          </div>
          <h2 className="text-3xl font-bold">Amazing Work!</h2>
          <p className="text-xl text-muted-foreground">
            You've completed all questions and earned <span className="text-primary font-bold">200 XP</span>
          </p>
          <div className="bg-muted rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-2">Your Stats</p>
            <div className="flex justify-around">
              <div>
                <p className="text-2xl font-bold text-primary">{userXP}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary">Level {userLevel}</p>
                <p className="text-xs text-muted-foreground">Current Level</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Button onClick={() => setCurrentQuestion(0)} variant="hero" className="w-full">
              Play Again
            </Button>
            <Link to="/" className="w-full">
              <Button variant="outline" className="w-full">
                Back to Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Header with XP and Level */}
      <div className="bg-card border-b border-border shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <Link to="/">
              <Button variant="ghost" size="sm">
                ← Back
              </Button>
            </Link>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Level {userLevel}</p>
                <p className="text-xs text-muted-foreground">{userXP} / {xpToNextLevel} XP</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-glow">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
            </div>
          </div>
          <Progress value={xpProgress} className="h-2" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress */}
        <div className="mb-8 animate-fade-in">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestion + 1} of {sampleQuestions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-3" />
        </div>

        {/* Question Card */}
        <Card className="p-8 shadow-xl border-2 border-primary/10 animate-scale-in bg-gradient-to-br from-card to-muted/30">
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Star className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold leading-tight">{question.question}</h2>
              </div>
            </div>

            {renderQuestion()}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Play;
