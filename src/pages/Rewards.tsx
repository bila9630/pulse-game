import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Lock, TreePine, ArrowRight, Trophy, ShoppingBag, Check, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { loadProgress } from "@/lib/xpSystem";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface ShopItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  cost: number;
  levelRequired: number;
  cooldownHours: number;
}

interface RedeemedItem {
  id: string;
  redeemedAt: number;
}

const shopItems: ShopItem[] = [
  { id: "coffee", name: "☕ Coffee Voucher", description: "Redeem for a free coffee at the office", icon: "☕", cost: 500, levelRequired: 2, cooldownHours: 24 },
  { id: "lunch", name: "🍕 Team Lunch", description: "Join us for a team lunch", icon: "🍕", cost: 1000, levelRequired: 5, cooldownHours: 168 },
  { id: "tshirt", name: "👕 Company T-Shirt", description: "Exclusive company merchandise", icon: "👕", cost: 1500, levelRequired: 7, cooldownHours: 720 },
  { id: "book", name: "📚 Book of Choice", description: "Pick any professional development book", icon: "📚", cost: 2000, levelRequired: 10, cooldownHours: 336 },
  { id: "charity", name: "❤️ Charity Donation", description: "Donate to Doctors Without Borders", icon: "❤️", cost: 1200, levelRequired: 6, cooldownHours: 168 },
  { id: "wellness", name: "🧘 Wellness Session", description: "Book a massage or yoga session", icon: "🧘", cost: 800, levelRequired: 4, cooldownHours: 72 },
  { id: "parking", name: "🅿️ Premium Parking", description: "Reserved parking spot for a week", icon: "🅿️", cost: 600, levelRequired: 3, cooldownHours: 168 },
  { id: "day-off", name: "🏖️ Extra Day Off", description: "Enjoy an additional day of paid leave", icon: "🏖️", cost: 5000, levelRequired: 15, cooldownHours: 2160 },
  { id: "conference", name: "🎯 Conference Pass", description: "Attend a professional conference", icon: "🎯", cost: 10000, levelRequired: 20, cooldownHours: 4320 },
];

const Rewards = () => {
  const navigate = useNavigate();
  const [userProgress, setUserProgress] = useState(loadProgress());
  const [redeemedItems, setRedeemedItems] = useState<RedeemedItem[]>([]);
  const totalTreesPlanted = 127;
  
  useEffect(() => {
    // Reload progress when component mounts
    setUserProgress(loadProgress());
    
    // Load redeemed items from localStorage
    const saved = localStorage.getItem('redeemedItems');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Handle legacy format (array of strings)
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
          const converted = parsed.map(id => ({ id, redeemedAt: Date.now() }));
          setRedeemedItems(converted);
          localStorage.setItem('redeemedItems', JSON.stringify(converted));
        } else {
          setRedeemedItems(parsed);
        }
      } catch (e) {
        setRedeemedItems([]);
      }
    }
  }, []);

  const getCooldownStatus = (item: ShopItem) => {
    const redeemed = redeemedItems.find(r => r.id === item.id);
    if (!redeemed) return { isOnCooldown: false, remainingHours: 0 };
    
    const cooldownMs = item.cooldownHours * 60 * 60 * 1000;
    const elapsedMs = Date.now() - redeemed.redeemedAt;
    const remainingMs = cooldownMs - elapsedMs;
    
    if (remainingMs <= 0) return { isOnCooldown: false, remainingHours: 0 };
    
    return {
      isOnCooldown: true,
      remainingHours: Math.ceil(remainingMs / (60 * 60 * 1000)),
    };
  };

  const formatCooldown = (hours: number) => {
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  
  const handleRedeem = (item: ShopItem) => {
    const { isOnCooldown } = getCooldownStatus(item);
    
    if (isOnCooldown) {
      toast.error("Item on cooldown!", {
        description: "This item is not available yet. Please wait for the cooldown to expire.",
      });
      return;
    }
    
    if (userProgress.totalXP < item.cost) {
      toast.error("Not enough XP!", {
        description: `You need ${item.cost - userProgress.totalXP} more XP to redeem this item.`,
      });
      return;
    }
    
    if (userProgress.level < item.levelRequired) {
      toast.error("Level too low!", {
        description: `You need to reach Level ${item.levelRequired} to redeem this item.`,
      });
      return;
    }
    
    // Deduct XP and mark as redeemed
    const newProgress = {
      ...userProgress,
      totalXP: userProgress.totalXP - item.cost,
    };
    setUserProgress(newProgress);
    
    const newRedeemedItems = [...redeemedItems.filter(r => r.id !== item.id), { id: item.id, redeemedAt: Date.now() }];
    setRedeemedItems(newRedeemedItems);
    
    // Save to localStorage
    localStorage.setItem('userProgress', JSON.stringify(newProgress));
    localStorage.setItem('redeemedItems', JSON.stringify(newRedeemedItems));
    
    // Dispatch custom event for sidebar to update
    window.dispatchEvent(new Event('xpUpdated'));
    
    toast.success(`${item.icon} Redeemed!`, {
      description: `${item.name} has been added to your rewards. Check with HR to claim it!`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Rewards Shop</h1>
        <p className="text-muted-foreground">Redeem your XP for exciting rewards</p>
      </div>

      {/* Level and XP Card */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Your Balance</p>
            <p className="text-4xl font-bold mb-2 flex items-center gap-3">
              <Trophy className="h-10 w-10 text-primary" />
              {userProgress.totalXP} XP
            </p>
            <p className="text-lg text-muted-foreground">
              Available to spend
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground mb-1">Current Level</p>
            <p className="text-3xl font-bold text-primary">
              {userProgress.level}
            </p>
            <p className="text-sm text-muted-foreground">Keep leveling up!</p>
          </div>
        </div>
      </Card>

      {/* Tree Impact Card */}
      <Card 
        className="p-6 mb-8 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 border-2 border-green-500/20 shadow-lg cursor-pointer hover:shadow-xl hover:scale-[1.02] transition-all"
        onClick={() => navigate('/trees')}
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TreePine className="h-5 w-5 text-green-600 dark:text-green-400" />
              <p className="text-sm font-semibold text-green-600 dark:text-green-400">Environmental Impact</p>
            </div>
            <p className="text-3xl font-bold mb-1">{totalTreesPlanted} Trees Planted</p>
            <p className="text-sm text-muted-foreground">By our community members</p>
          </div>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </Card>

      {/* Shop Items */}
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <ShoppingBag className="h-7 w-7 text-primary" />
        Available Items
      </h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {shopItems.map((item, index) => {
          const canAfford = userProgress.totalXP >= item.cost;
          const canUnlock = userProgress.level >= item.levelRequired;
          const { isOnCooldown, remainingHours } = getCooldownStatus(item);
          const canRedeem = canAfford && canUnlock && !isOnCooldown;
          
          return (
            <Card
              key={item.id}
              className={`p-6 shadow-lg transition-all animate-fade-in relative ${
                !canUnlock ? "opacity-60" : canRedeem ? "hover:scale-105 hover:shadow-xl" : ""
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Cooldown Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatCooldown(item.cooldownHours)}</span>
              </div>

              <div className="space-y-4">
                {/* Icon and Cost */}
                <div className="flex items-start justify-between">
                  <div className={`text-5xl ${
                    !canUnlock || isOnCooldown ? "grayscale opacity-50" : ""
                  }`}>
                    {item.icon}
                  </div>
                  <Badge variant={canAfford ? "default" : "secondary"} className="text-xs">
                    {item.cost} XP
                  </Badge>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    {item.name}
                    {!canUnlock && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="pt-3 border-t border-border">
                  {isOnCooldown ? (
                    <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
                      <Clock className="h-5 w-5" />
                      <span className="font-semibold">Available in {formatCooldown(remainingHours)}</span>
                    </div>
                  ) : !canUnlock ? (
                    <div className="text-sm text-muted-foreground">
                      Unlock at Level {item.levelRequired}
                    </div>
                  ) : (
                    <Button 
                      className="w-full" 
                      onClick={() => handleRedeem(item)}
                      disabled={!canRedeem}
                      variant={canAfford ? "default" : "outline"}
                    >
                      {canAfford ? "Redeem" : `Need ${item.cost - userProgress.totalXP} more XP`}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>


      {/* Info Card */}
      <Card className="p-6 mt-8 bg-muted/50">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          How to earn more XP?
        </h3>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>• Answer questions: <span className="font-semibold text-foreground">50 XP</span> per question</li>
          <li>• Complete daily surveys: <span className="font-semibold text-foreground">100 XP</span> bonus</li>
          <li>• Provide detailed feedback: <span className="font-semibold text-foreground">Extra 25 XP</span></li>
          <li>• Weekly participation streak: <span className="font-semibold text-foreground">200 XP</span> bonus</li>
        </ul>
      </Card>
    </div>
  );
};

export default Rewards;
