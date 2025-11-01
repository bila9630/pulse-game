import { useState, useEffect } from "react";
import { Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar } from "@/components/ui/avatar";
import { getLevelFromXP, getCurrentLevelXP } from "@/lib/xpSystem";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface LeaderboardUser {
  id: string;
  user_id: string;
  username: string;
  total_xp: number;
  level: number;
  current_xp: number;
}

export function LeaderboardSidebar() {
  const [topUsers, setTopUsers] = useState<LeaderboardUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchLeaderboard, 30000);
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('leaderboard-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_progress'
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();
    
    return () => {
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchLeaderboard = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // Fetch top 10 users (matching Profile page logic)
      const { data, error } = await supabase
        .from('user_progress')
        .select('*')
        .order('total_xp', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      if (data) {
        // Normalize levels based on total XP (matching Profile page)
        const normalized = data.map(user => ({
          ...user,
          level: getLevelFromXP(user.total_xp),
          current_xp: getCurrentLevelXP(user.total_xp),
        }));
        
        // Sort by level first, then by total_xp (matching Profile page)
        const sorted = normalized.sort((a, b) => {
          if (b.level !== a.level) {
            return b.level - a.level;
          }
          return b.total_xp - a.total_xp;
        });
        
        setTopUsers(sorted);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
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

  const getCrownColor = (index: number) => {
    switch (index) {
      case 0:
        return "text-yellow-400";
      case 1:
        return "text-gray-300";
      case 2:
        return "text-amber-600";
      default:
        return "";
    }
  };

  return (
    <TooltipProvider>
      <div className="fixed right-4 top-24 z-30 flex flex-col gap-3">
        {topUsers.map((user, index) => {
          const isCurrentUser = user.user_id === currentUserId;
          const isTopThree = index < 3;
          
          return (
            <Tooltip key={user.user_id}>
              <TooltipTrigger asChild>
                <div className="relative">
                  <Avatar className={`h-12 w-12 cursor-pointer transition-transform hover:scale-110 ${
                    isCurrentUser 
                      ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' 
                      : ''
                  }`}>
                    <div className={`h-full w-full flex items-center justify-center text-sm font-semibold ${
                      isTopThree
                        ? 'bg-gradient-to-br from-primary to-secondary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {getInitials(user.username)}
                    </div>
                  </Avatar>
                  
                  {isTopThree && (
                    <div className="absolute -top-1 -right-1">
                      <Crown className={`h-5 w-5 ${getCrownColor(index)} drop-shadow-lg`} />
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent side="left" className="font-medium">
                <div className="text-sm">
                  <p className="font-semibold">{user.username}</p>
                  <p className="text-xs text-muted-foreground">
                    Level {user.level} • {user.total_xp.toLocaleString()} XP
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Rank #{index + 1}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
