import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { IdeationQuestion } from "@/components/IdeationQuestion";
import { LevelUpModal } from "@/components/LevelUpModal";
import { 
  UserProgress, 
  LevelReward, 
  loadProgress, 
  saveProgress 
} from "@/lib/xpSystem";

const Ideation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as {
    questionId: string;
    questionText: string;
    xpReward: number;
  } | null;

  const [userProgress, setUserProgress] = useState<UserProgress>(loadProgress());
  const [answeredQuestions, setAnsweredQuestions] = useState<string[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newRewards, setNewRewards] = useState<LevelReward[]>([]);

  // Reload progress when component mounts or becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setUserProgress(loadProgress());
      }
    };
    
    setUserProgress(loadProgress());
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  // If no state is provided, redirect to homepage
  useEffect(() => {
    if (!state?.questionId) {
      navigate('/');
    }
  }, [state, navigate]);

  const handleClose = () => {
    navigate('/');
  };

  const handleLevelUp = (rewards: LevelReward[]) => {
    setNewRewards(rewards);
    setShowLevelUp(true);
  };

  if (!state) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Header with Close Button */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
              <span className="text-xl">💡</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Ideation Challenge</h1>
              <p className="text-sm text-muted-foreground">Generate as many ideas as you can!</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Ideation Question Component */}
        <div className="space-y-6">
          <IdeationQuestion
            questionId={state.questionId}
            questionText={state.questionText}
            xpReward={state.xpReward}
            userProgress={userProgress}
            setUserProgress={setUserProgress}
            answeredQuestions={answeredQuestions}
            setAnsweredQuestions={setAnsweredQuestions}
            onClose={handleClose}
            onLevelUp={handleLevelUp}
          />
        </div>
      </div>

      {/* Level Up Modal */}
      <LevelUpModal
        show={showLevelUp}
        userProgress={userProgress}
        newRewards={newRewards}
        onClose={() => setShowLevelUp(false)}
      />
    </div>
  );
};

export default Ideation;
