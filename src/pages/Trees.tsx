import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TreePine, MapPin, Calendar, Users, Leaf, ArrowLeft, Droplets, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface TreePlanting {
  id: number;
  location: string;
  date: string;
  treeCount: number;
  species: string;
  contributor: string;
}

const treePlantings: TreePlanting[] = [
  {
    id: 1,
    location: "Amazon Rainforest, Brazil",
    date: "2024-10-15",
    treeCount: 25,
    species: "Brazil Nut Trees",
    contributor: "Sarah M.",
  },
  {
    id: 2,
    location: "Pacific Northwest, USA",
    date: "2024-10-10",
    treeCount: 18,
    species: "Douglas Fir",
    contributor: "John D.",
  },
  {
    id: 3,
    location: "Madagascar Forest",
    date: "2024-10-05",
    treeCount: 32,
    species: "Baobab Trees",
    contributor: "Maria L.",
  },
  {
    id: 4,
    location: "Scottish Highlands, UK",
    date: "2024-09-28",
    treeCount: 22,
    species: "Scots Pine",
    contributor: "David R.",
  },
  {
    id: 5,
    location: "Sahel Region, Africa",
    date: "2024-09-20",
    treeCount: 30,
    species: "Acacia Trees",
    contributor: "Team Effort",
  },
];

const Trees = () => {
  const navigate = useNavigate();
  const totalTreesPlanted = 127;
  const co2Offset = (totalTreesPlanted * 22).toFixed(0);
  const [visibleTrees, setVisibleTrees] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisibleTrees((prev) => {
        if (prev >= totalTreesPlanted) {
          clearInterval(timer);
          return prev;
        }
        return prev + 1;
      });
    }, 20);
    return () => clearInterval(timer);
  }, [totalTreesPlanted]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl relative">
      {/* Decorative background elements */}
      <div className="fixed inset-0 pointer-events-none opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 text-green-500">
          <TreePine className="h-32 w-32 animate-pulse" style={{ animationDuration: "3s" }} />
        </div>
        <div className="absolute top-40 right-20 text-emerald-500">
          <TreePine className="h-24 w-24 animate-pulse" style={{ animationDuration: "4s" }} />
        </div>
        <div className="absolute bottom-40 left-1/4 text-green-600">
          <TreePine className="h-28 w-28 animate-pulse" style={{ animationDuration: "3.5s" }} />
        </div>
        <div className="absolute top-1/3 right-1/4 text-teal-500">
          <Leaf className="h-20 w-20 animate-pulse" style={{ animationDuration: "2.5s" }} />
        </div>
      </div>
      {/* Header */}
      <div className="relative z-10 mb-8">
        <Button 
          variant="ghost" 
          className="mb-4"
          onClick={() => navigate('/rewards')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Rewards
        </Button>
      </div>

      {/* Hero Forest Section */}
      <Card className="relative mb-8 p-8 md:p-12 bg-gradient-to-br from-green-500/20 via-emerald-500/20 to-teal-500/20 border-2 border-green-500/30 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 opacity-10">
          <Sun className="absolute top-4 right-4 h-16 w-16 text-yellow-500 animate-pulse" style={{ animationDuration: "4s" }} />
          <Droplets className="absolute bottom-4 left-4 h-12 w-12 text-blue-500 animate-pulse" style={{ animationDuration: "3s" }} />
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 flex flex-wrap items-center gap-3">
            <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Our Growing Forest
            </span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8">Every XP you earn helps us grow a greener planet 🌍</p>
          
          {/* Visual Forest Display */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-1 max-h-48 overflow-hidden">
              {Array.from({ length: totalTreesPlanted }).map((_, i) => (
                <TreePine
                  key={i}
                  className={`h-6 w-6 transition-all duration-300 ${
                    i < visibleTrees
                      ? "text-green-600 dark:text-green-400 opacity-100 scale-100"
                      : "text-gray-300 opacity-0 scale-0"
                  }`}
                  style={{
                    transitionDelay: `${i * 20}ms`,
                  }}
                />
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-lg">
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2">
              <TreePine className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="font-bold text-2xl text-green-600 dark:text-green-400">{totalTreesPlanted}</span>
              <span className="text-muted-foreground">Trees Planted</span>
            </div>
            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm rounded-lg px-4 py-2">
              <Leaf className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">{co2Offset}</span>
              <span className="text-muted-foreground">kg CO₂/year</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8 relative z-10">
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20 hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-start justify-between mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
              <TreePine className="h-6 w-6 text-white" />
            </div>
            <Badge variant="secondary" className="bg-green-500/20 text-green-700 dark:text-green-300">
              Total
            </Badge>
          </div>
          <p className="text-3xl font-bold mb-1">{totalTreesPlanted}</p>
          <p className="text-sm text-muted-foreground">Trees Planted</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20 hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-start justify-between mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-700 dark:text-blue-300">
              Impact
            </Badge>
          </div>
          <p className="text-3xl font-bold mb-1">{co2Offset} kg</p>
          <p className="text-sm text-muted-foreground">CO₂ Offset per Year</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20 hover:shadow-xl transition-all hover:scale-105">
          <div className="flex items-start justify-between mb-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Users className="h-6 w-6 text-white" />
            </div>
            <Badge variant="secondary" className="bg-purple-500/20 text-purple-700 dark:text-purple-300">
              Community
            </Badge>
          </div>
          <p className="text-3xl font-bold mb-1">43</p>
          <p className="text-sm text-muted-foreground">Contributors</p>
        </Card>
      </div>

      {/* Recent Plantings */}
      <div className="mb-8 relative z-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <TreePine className="h-6 w-6 text-green-600 dark:text-green-400" />
          Recent Tree Plantings
        </h2>
        <div className="space-y-4">
          {treePlantings.map((planting, index) => (
            <Card 
              key={planting.id}
              className="p-6 hover:shadow-lg transition-all animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <TreePine className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-1">{planting.treeCount} Trees</h3>
                      <p className="text-sm text-muted-foreground">{planting.species}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{planting.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(planting.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>Contributed by {planting.contributor}</span>
                    </div>
                  </div>
                </div>
                
                <Badge variant="secondary" className="self-start md:self-center bg-green-500/20 text-green-700 dark:text-green-300">
                  {(planting.treeCount * 22).toFixed(0)} kg CO₂/year
                </Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <Card className="p-6 bg-muted/50 relative z-10">
        <h3 className="font-bold mb-2 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600 dark:text-green-400" />
          About Our Tree Planting Program
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          For every 150 XP redeemed, we partner with verified environmental organizations to plant a tree in areas affected by deforestation. Each tree helps combat climate change, restore habitats, and support local communities.
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-semibold mb-1">Our Impact:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Verified planting partners worldwide</li>
              <li>• Native species for each region</li>
              <li>• Long-term monitoring and care</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold mb-1">Environmental Benefits:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Average 22 kg CO₂ absorbed per tree/year</li>
              <li>• Wildlife habitat restoration</li>
              <li>• Soil erosion prevention</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Trees;
