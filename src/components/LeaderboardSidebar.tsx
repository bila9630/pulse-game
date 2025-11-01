import { useState, useEffect } from "react";
import { Trophy, Medal, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";

interface LeaderboardUser {
  user_id: string;
  username: string;
  total_xp: number;
  level: number;
}

export function LeaderboardSidebar() {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // Fetch top 10 users
      const { data, error } = await supabase
        .from('user_progress')
        .select('user_id, username, total_xp, level')
        .order('total_xp', { ascending: false })
        .limit(10);

      if (error) throw error;
      if (data) setTopUsers(data);
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
    }
  };

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="h-4 w-4 text-yellow-400" />;
      case 1:
        return <Medal className="h-4 w-4 text-gray-300" />;
      case 2:
        return <Medal className="h-4 w-4 text-amber-600" />;
      default:
        return <Trophy className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const getInitials = (username: string) => {
    return username
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className="fixed left-0 top-20 z-30 transition-all duration-300 ease-in-out"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: isHovered ? '240px' : '48px',
      }}
    >
      <div className="bg-card/80 backdrop-blur-sm border-r border-border h-[calc(100vh-5rem)] shadow-lg overflow-hidden">
        <div className="p-2 space-y-1">
          {topUsers.map((user, index) => {
            const isCurrentUser = user.user_id === currentUserId;
            
            return (
              <div
                key={user.user_id}
                className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                  isCurrentUser 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted/50'
                }`}
              >
                {/* Rank indicator - always visible */}
                <div className="flex items-center justify-center w-6 shrink-0">
                  {getRankIcon(index)}
                </div>

                {/* Expandable content */}
                <div
                  className="flex items-center gap-2 transition-opacity duration-300 whitespace-nowrap overflow-hidden"
                  style={{
                    opacity: isHovered ? 1 : 0,
                    width: isHovered ? 'auto' : 0,
                  }}
                >
                  <Avatar className="h-6 w-6 shrink-0">
                    <div className="h-full w-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-[10px] font-semibold text-primary-foreground">
                      {getInitials(user.username)}
                    </div>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <p className={`text-xs font-medium truncate ${
                      isCurrentUser ? 'text-primary' : 'text-foreground'
                    }`}>
                      {user.username}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Lv.{user.level} • {user.total_xp.toLocaleString()} XP
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hint text at bottom */}
        <div
          className="absolute bottom-4 left-0 right-0 text-center transition-opacity duration-300"
          style={{
            opacity: isHovered ? 0 : 1,
          }}
        >
          <p className="text-[10px] text-muted-foreground px-2">
            Hover to expand
          </p>
        </div>
      </div>
    </div>
  );
}
