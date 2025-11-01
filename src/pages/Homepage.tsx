import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Star, TrendingUp, Clock, ThumbsUp, ThumbsDown, ChevronRight, Flame, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useIsMobile } from "@/hooks/use-mobile";

type QuestionType = "multiple-choice" | "open-ended" | "yes-no" | "ranking";

interface Question {
  id: number;
  type: QuestionType;
  question: string;
  options?: string[];
  rankingOptions?: Array<{ name: string; emoji: string; wins: number }>;
  category: string;
  xpReward: number;
  timeAgo: string;
}

const availableQuestions: Question[] = [
  {
    id: 1,
    type: "multiple-choice",
    question: "How would you rate your work-life balance this week?",
    options: ["Excellent", "Good", "Fair", "Needs Improvement"],
    category: "Wellness",
    xpReward: 50,
    timeAgo: "2h ago",
  },
  {
    id: 2,
    type: "yes-no",
    question: "Do you feel your contributions are valued by the team?",
    category: "Team Culture",
    xpReward: 50,
    timeAgo: "5h ago",
  },
  {
    id: 3,
    type: "open-ended",
    question: "What's one thing we could improve to make your work experience better?",
    category: "Feedback",
    xpReward: 75,
    timeAgo: "1d ago",
  },
  {
    id: 4,
    type: "multiple-choice",
    question: "How clear are your current project goals?",
    options: ["Very Clear", "Mostly Clear", "Somewhat Clear", "Not Clear"],
    category: "Projects",
    xpReward: 50,
    timeAgo: "1d ago",
  },
  {
    id: 5,
    type: "yes-no",
    question: "Would you recommend our company as a great place to work?",
    category: "Culture",
    xpReward: 50,
    timeAgo: "2d ago",
  },
  {
    id: 6,
    type: "ranking",
    question: "What's your favorite food in the canteen?",
    rankingOptions: [
      { name: "Croissants", emoji: "🥐", wins: 0 },
      { name: "Muffins", emoji: "🧁", wins: 0 },
      { name: "Cookies", emoji: "🍪", wins: 0 },
      { name: "Macarons", emoji: "🍬", wins: 0 },
      { name: "Donuts", emoji: "🍩", wins: 0 },
    ],
    category: "Canteen",
    xpReward: 100,
    timeAgo: "3h ago",
  },
];

const Homepage = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("new");
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [openAnswer, setOpenAnswer] = useState("");
  
  // Ranking game state
  const [gameStarted, setGameStarted] = useState(false);
  const [currentRound, setCurrentRound] = useState(0);
  const [remainingOptions, setRemainingOptions] = useState<any[]>([]);
  const [currentPair, setCurrentPair] = useState<any[]>([]);
  const [winner, setWinner] = useState<any>(null);
  const [gameComplete, setGameComplete] = useState(false);
  const [userRanking, setUserRanking] = useState<any[]>([]);

  const handleStartQuestion = (question: Question) => {
    setCurrentQuestion(question);
  };

  const handleAnswer = (answer: string) => {
    if (currentQuestion) {
      toast.success(`+${currentQuestion.xpReward} XP!`, {
        description: "Answer submitted successfully!",
        icon: <Star className="h-4 w-4 text-accent" />,
      });
      
      const newAnsweredQuestions = [...answeredQuestions, currentQuestion.id];
      setAnsweredQuestions(newAnsweredQuestions);
      setOpenAnswer("");
      
      // Find the next unanswered question
      const nextQuestion = availableQuestions.find(
        (q) => !newAnsweredQuestions.includes(q.id)
      );
      
      // Automatically open the next question or close the modal
      setCurrentQuestion(nextQuestion || null);
    }
  };

  const handleSwipe = (direction: "left" | "right") => {
    const answer = direction === "right" ? "Yes" : "No";
    handleAnswer(answer);
  };
  
  const startRankingGame = () => {
    if (currentQuestion?.rankingOptions) {
      const shuffled = [...currentQuestion.rankingOptions].sort(() => Math.random() - 0.5);
      setRemainingOptions(shuffled);
      setCurrentPair([shuffled[0], shuffled[1]]);
      setGameStarted(true);
      setCurrentRound(1);
      setGameComplete(false);
      setUserRanking([]);
    }
  };
  
  const handleRankingChoice = (chosen: any, notChosen: any) => {
    const updatedRanking = [...userRanking];
    const chosenIndex = updatedRanking.findIndex(item => item.name === chosen.name);
    
    if (chosenIndex === -1) {
      updatedRanking.push({ ...chosen, wins: 1 });
    } else {
      updatedRanking[chosenIndex].wins += 1;
    }
    
    setUserRanking(updatedRanking);
    
    if (currentRound >= 10) {
      // Game complete after 10 rounds
      setWinner(chosen);
      setGameComplete(true);
    } else {
      // Create a pool of options excluding the current winner
      const availableOpponents = remainingOptions.filter(opt => opt.name !== chosen.name);
      
      // Find the next opponent that's not the one just defeated
      let nextOpponent;
      const notChosenIndex = availableOpponents.findIndex(opt => opt.name === notChosen.name);
      
      if (notChosenIndex !== -1 && availableOpponents.length > 1) {
        // Get the next option after the defeated one (wrap around if needed)
        const nextIndex = (notChosenIndex + 1) % availableOpponents.length;
        nextOpponent = availableOpponents[nextIndex];
      } else {
        // Fallback: just pick the first available opponent
        nextOpponent = availableOpponents[0];
      }
      
      setCurrentPair([chosen, nextOpponent]);
      setCurrentRound(currentRound + 1);
    }
  };
  
  const completeRankingGame = () => {
    if (currentQuestion) {
      toast.success(`+${currentQuestion.xpReward} XP!`, {
        description: "Ranking complete!",
        icon: <Trophy className="h-4 w-4 text-accent" />,
      });
      
      setAnsweredQuestions([...answeredQuestions, currentQuestion.id]);
      setCurrentQuestion(null);
      setGameStarted(false);
      setGameComplete(false);
      setUserRanking([]);
    }
  };

  const renderQuestionModal = () => {
    if (!currentQuestion) return null;

    return (
      <div 
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
        onClick={() => setCurrentQuestion(null)}
      >
        <Card 
          className="max-w-2xl w-full p-8 shadow-2xl animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-6">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                <Star className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <Badge className="mb-2">{currentQuestion.category}</Badge>
                <h2 className="text-2xl font-bold leading-tight">{currentQuestion.question}</h2>
              </div>
            </div>

            {/* Render based on type */}
            {currentQuestion.type === "multiple-choice" && (
              <div className="space-y-3">
                {currentQuestion.options?.map((option, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full h-auto py-4 text-left justify-start hover:bg-primary hover:text-primary-foreground transition-all"
                    onClick={() => handleAnswer(option)}
                  >
                    <span className="text-lg">{option}</span>
                  </Button>
                ))}
              </div>
            )}

            {currentQuestion.type === "open-ended" && (
              <div className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={openAnswer}
                  onChange={(e) => setOpenAnswer(e.target.value)}
                  className="min-h-[150px] text-base resize-none"
                />
                <div className="flex gap-2">
                  <Button
                    className="flex-1"
                    onClick={() => handleAnswer(openAnswer)}
                    disabled={!openAnswer.trim()}
                  >
                    Submit Answer
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentQuestion(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {currentQuestion.type === "yes-no" && (
              <div className="space-y-6">
                <p className="text-center text-muted-foreground">Choose your answer</p>
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
                <Button variant="outline" className="w-full" onClick={() => setCurrentQuestion(null)}>
                  Cancel
                </Button>
              </div>
            )}
            
            {/* Ranking Game */}
            {currentQuestion.type === "ranking" && !gameStarted && (
              <div className="text-center space-y-4">
                <Trophy className="h-16 w-16 text-primary mx-auto" />
                <div>
                  <h3 className="text-2xl font-semibold mb-2">Pairwise Ranking Game</h3>
                  <p className="text-muted-foreground">
                    Compare your preferences two at a time. Choose your favorite in each round!
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="lg" className="flex-1" onClick={startRankingGame}>
                    Start Ranking Game
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentQuestion(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
            
            {currentQuestion.type === "ranking" && gameStarted && !gameComplete && (
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant="outline" className="mb-4">Round {currentRound} of 10</Badge>
                  <h3 className="text-2xl font-semibold mb-2">Which do you prefer?</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {currentPair.map((option, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      className="h-32 text-4xl hover:bg-primary hover:text-primary-foreground transition-all hover:scale-105"
                      onClick={() => handleRankingChoice(option, currentPair[1 - idx])}
                    >
                      {option.emoji}
                      <span className="ml-3 text-lg">{option.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {currentQuestion.type === "ranking" && gameComplete && (
              <div className="space-y-6 max-h-[70vh] overflow-y-auto">
                <div className="text-center">
                  <Trophy className="h-16 w-16 text-success mx-auto mb-4" />
                  <h3 className="text-3xl font-semibold mb-2">Your Ultimate Pick: {winner?.emoji} {winner?.name}</h3>
                  <p className="text-muted-foreground">
                    Your taste profile: Sweet over flaky, comfort over elegance
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xl font-semibold">Your Personal Ranking:</h4>
                  {userRanking
                    .sort((a, b) => b.wins - a.wins)
                    .map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                            {idx + 1}
                          </div>
                          <span className="text-2xl">{item.emoji}</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-muted-foreground">{item.wins} wins</span>
                      </div>
                    ))}
                </div>
                
                {/* Colleagues' Results Section */}
                <div className="border-t pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xl font-semibold">Colleagues' Rankings</h4>
                    <Badge variant="secondary">8 responses</Badge>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Colleague 1 */}
                    <Card className="p-4 bg-muted/30">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
                          JD
                        </div>
                        <div>
                          <p className="font-semibold">John Doe</p>
                          <p className="text-sm text-muted-foreground">Marketing Team • 2h ago</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { emoji: "🍩", name: "Donuts", position: 1 },
                          { emoji: "🍬", name: "Macarons", position: 2 },
                          { emoji: "🥐", name: "Croissants", position: 3 },
                        ].map((item) => (
                          <div key={item.position} className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground w-4">#{item.position}</span>
                            <span className="text-lg">{item.emoji}</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                    
                    {/* Colleague 2 */}
                    <Card className="p-4 bg-muted/30">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-semibold">
                          AS
                        </div>
                        <div>
                          <p className="font-semibold">Alice Smith</p>
                          <p className="text-sm text-muted-foreground">Engineering Team • 4h ago</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { emoji: "🥐", name: "Croissants", position: 1 },
                          { emoji: "🍪", name: "Cookies", position: 2 },
                          { emoji: "🧁", name: "Muffins", position: 3 },
                        ].map((item) => (
                          <div key={item.position} className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground w-4">#{item.position}</span>
                            <span className="text-lg">{item.emoji}</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                    
                    {/* Colleague 3 */}
                    <Card className="p-4 bg-muted/30">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-semibold">
                          MJ
                        </div>
                        <div>
                          <p className="font-semibold">Michael Johnson</p>
                          <p className="text-sm text-muted-foreground">Design Team • 5h ago</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {[
                          { emoji: "🍬", name: "Macarons", position: 1 },
                          { emoji: "🍩", name: "Donuts", position: 2 },
                          { emoji: "🍪", name: "Cookies", position: 3 },
                        ].map((item) => (
                          <div key={item.position} className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground w-4">#{item.position}</span>
                            <span className="text-lg">{item.emoji}</span>
                            <span>{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                    
                    <Button variant="outline" className="w-full">
                      View All 8 Responses
                    </Button>
                  </div>
                </div>
                <div className="sticky bottom-0 bg-card pt-4">
                  <Button className="w-full" onClick={completeRankingGame}>
                    Complete & Earn {currentQuestion.xpReward} XP
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    );
  };

  const filteredQuestions = availableQuestions.filter((q) => {
    if (activeTab === "new") return !answeredQuestions.includes(q.id);
    if (activeTab === "completed") return answeredQuestions.includes(q.id);
    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Welcome back, Jane! 👋</h1>
        <p className="text-muted-foreground text-lg">
          You have {availableQuestions.length - answeredQuestions.length} new questions waiting
        </p>
      </div>

      {/* Daily Streak Card */}
      <Card className="p-6 mb-8 bg-gradient-to-br from-[#F59E0B] to-[#F97316] border-0 shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{isMobile ? '5' : '7'}-day streak</h2>
              <p className="text-white/90 font-medium">Keep it going!</p>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Flame className="h-7 w-7 text-white" />
            </div>
          </div>

          {/* Streak Progress */}
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute top-[calc(50%+12px)] left-0 right-0 h-1 bg-white/30" 
                 style={{ left: '5%', right: '5%', width: '90%' }} />
            
            {/* Progress Line */}
            <div className="absolute top-[calc(50%+12px)] left-0 h-1 bg-white" 
                 style={{ left: '5%', width: isMobile ? '72%' : '77%' }} />

            {/* Days with Circles */}
            <div className="flex items-center justify-between relative">
              {(isMobile 
                ? [{ day: 'W', completed: true }, { day: 'T', completed: true }, { day: 'F', completed: true }, { day: 'S', completed: true }, { day: 'S', completed: false }]
                : [{ day: 'S', completed: true }, { day: 'M', completed: true }, { day: 'T', completed: true }, { day: 'W', completed: true }, { day: 'T', completed: true }, { day: 'F', completed: true }, { day: 'S', completed: false }]
              ).map((item, index) => (
                <div key={index} className="flex flex-col items-center gap-3">
                  <p className="text-white/70 text-sm font-medium">{item.day}</p>
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-all ${
                      item.completed
                        ? 'bg-white shadow-lg'
                        : 'bg-white/30 backdrop-blur-sm border-2 border-white'
                    }`}
                  >
                    {item.completed && (
                      <svg
                        className="h-5 w-5 text-[#F59E0B]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="new">
            New ({availableQuestions.length - answeredQuestions.length})
          </TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="completed">Completed ({answeredQuestions.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="new" className="space-y-4">
          {filteredQuestions.length === 0 ? (
            <Card className="p-12 text-center">
              <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">All caught up! 🎉</h3>
              <p className="text-muted-foreground">Check back later for new questions</p>
            </Card>
          ) : (
            filteredQuestions.map((question, index) => (
              <Card
                key={question.id}
                className="p-6 shadow-md hover:shadow-xl transition-all cursor-pointer animate-fade-in hover:scale-[1.02] border-2 border-transparent hover:border-primary/20"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handleStartQuestion(question)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="secondary">{question.category}</Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {question.timeAgo}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{question.question}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">+{question.xpReward}</p>
                      <p className="text-xs text-muted-foreground">XP</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground capitalize">
                      {question.type.replace("-", " ")} question
                    </span>
                    <Button size="sm" variant="ghost" className="group">
                      Answer now
                      <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="text-center py-12">
            <TrendingUp className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-bold mb-2">Trending Questions</h3>
            <p className="text-muted-foreground">Most answered by your team this week</p>
          </div>
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {answeredQuestions.length === 0 ? (
            <Card className="p-12 text-center">
              <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No completed questions yet</h3>
              <p className="text-muted-foreground">Start answering to see your progress here</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {availableQuestions
                .filter((q) => answeredQuestions.includes(q.id))
                .map((question) => (
                  <Card key={question.id} className="p-6 bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-success flex items-center justify-center">
                        <ThumbsUp className="h-5 w-5 text-success-foreground" />
                      </div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-2">
                          {question.category}
                        </Badge>
                        <h3 className="font-semibold">{question.question}</h3>
                      </div>
                      <Badge className="bg-success/10 text-success border-0">+{question.xpReward} XP</Badge>
                    </div>
                  </Card>
                ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {renderQuestionModal()}
    </div>
  );
};

export default Homepage;
