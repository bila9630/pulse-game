import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Crown, Coffee, Shirt, Headphones, Ticket, Lock } from "lucide-react";
import { toast } from "sonner";

interface Reward {
  id: number;
  name: string;
  cost: number;
  icon: any;
  available: boolean;
  description: string;
  category: string;
}

const rewards: Reward[] = [
  {
    id: 1,
    name: "Coffee Voucher",
    cost: 100,
    icon: Coffee,
    available: true,
    description: "Enjoy a premium coffee on us",
    category: "Food & Drink",
  },
  {
    id: 2,
    name: "Extra Day Off",
    cost: 500,
    icon: Ticket,
    available: true,
    description: "One additional vacation day",
    category: "Time Off",
  },
  {
    id: 3,
    name: "Company Swag",
    cost: 200,
    icon: Shirt,
    available: true,
    description: "Premium branded merchandise",
    category: "Merchandise",
  },
  {
    id: 4,
    name: "Wireless Headphones",
    cost: 800,
    icon: Headphones,
    available: true,
    description: "High-quality noise-canceling headphones",
    category: "Tech",
  },
  {
    id: 5,
    name: "VIP Parking Spot",
    cost: 300,
    icon: Crown,
    available: true,
    description: "Reserved parking for one month",
    category: "Perks",
  },
  {
    id: 6,
    name: "Premium Gift Box",
    cost: 1000,
    icon: Gift,
    available: false,
    description: "Exclusive curated gift collection",
    category: "Special",
  },
];

const Rewards = () => {
  const userXP = 850;

  const handleRedeem = (reward: Reward) => {
    if (!reward.available) {
      toast.error("This reward is not available yet");
      return;
    }
    
    if (userXP < reward.cost) {
      toast.error("Not enough XP!", {
        description: `You need ${reward.cost - userXP} more XP`,
      });
      return;
    }

    toast.success("Reward redeemed!", {
      description: `${reward.name} has been added to your account`,
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Rewards Shop</h1>
        <p className="text-muted-foreground">Redeem your XP for awesome rewards</p>
      </div>

      {/* XP Balance Card */}
      <Card className="p-6 mb-8 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border-2 border-primary/20 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {userXP} XP
            </p>
          </div>
          <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg animate-glow">
            <Gift className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
      </Card>

      {/* Rewards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map((reward, index) => {
          const canAfford = userXP >= reward.cost;
          const Icon = reward.icon;
          
          return (
            <Card
              key={reward.id}
              className={`p-6 shadow-lg hover:shadow-xl transition-all animate-fade-in ${
                !reward.available ? "opacity-60" : "hover:scale-105"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="space-y-4">
                {/* Icon and Badge */}
                <div className="flex items-start justify-between">
                  <div className={`h-14 w-14 rounded-xl flex items-center justify-center ${
                    reward.available
                      ? "bg-gradient-to-br from-primary to-secondary"
                      : "bg-muted"
                  }`}>
                    <Icon className={`h-7 w-7 ${
                      reward.available ? "text-primary-foreground" : "text-muted-foreground"
                    }`} />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {reward.category}
                  </Badge>
                </div>

                {/* Content */}
                <div>
                  <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    {reward.name}
                    {!reward.available && <Lock className="h-4 w-4 text-muted-foreground" />}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {reward.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div>
                    <p className="text-2xl font-bold text-primary">{reward.cost} XP</p>
                  </div>
                  <Button
                    onClick={() => handleRedeem(reward)}
                    disabled={!canAfford || !reward.available}
                    variant={canAfford && reward.available ? "default" : "outline"}
                    size="sm"
                  >
                    {!reward.available ? "Locked" : canAfford ? "Redeem" : "Need More XP"}
                  </Button>
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
