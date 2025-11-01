import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Trophy, BarChart3, MessageSquare, Zap } from "lucide-react";
import heroImage from "@/assets/hero-feedback.jpg";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 animate-gradient" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-in">
              <div className="inline-block">
                <span className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold">
                  🎮 Make Feedback Fun
                </span>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                Transform Feedback into a
                <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"> Game</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Engage your team with interactive questions, earn XP, unlock rewards, and gather valuable insights—all in one playful platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/play">
                  <Button variant="hero" size="lg" className="w-full sm:w-auto">
                    <Zap className="mr-2 h-5 w-5" />
                    Start Playing
                  </Button>
                </Link>
                <Link to="/analytics">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    <BarChart3 className="mr-2 h-5 w-5" />
                    View Analytics
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl" />
              <img
                src={heroImage}
                alt="Team engaging with feedback platform"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-slide-up">
          <h2 className="text-4xl font-bold mb-4">Why Teams Love It</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Combining gamification with meaningful feedback collection
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-fade-in border border-border">
            <div className="w-14 h-14 bg-gradient-to-br from-primary to-primary-glow rounded-xl flex items-center justify-center mb-6">
              <MessageSquare className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Interactive Questions</h3>
            <p className="text-muted-foreground leading-relaxed">
              Multiple choice, open-ended, and swipe-to-vote questions keep employees engaged and excited to share their thoughts.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-fade-in border border-border" style={{ animationDelay: "0.1s" }}>
            <div className="w-14 h-14 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center mb-6">
              <Trophy className="h-7 w-7 text-secondary-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">XP & Rewards</h3>
            <p className="text-muted-foreground leading-relaxed">
              Earn experience points, level up, and redeem rewards. Gamification makes participation fun and motivating.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow animate-fade-in border border-border" style={{ animationDelay: "0.2s" }}>
            <div className="w-14 h-14 bg-gradient-to-br from-accent to-success rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="h-7 w-7 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-bold mb-3">Smart Analytics</h3>
            <p className="text-muted-foreground leading-relaxed">
              Visual dashboards with charts, filters, and insights help you understand team sentiment and trends at a glance.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-primary via-secondary to-accent rounded-3xl p-12 text-center shadow-2xl animate-fade-in">
          <h2 className="text-4xl font-bold text-primary-foreground mb-4">
            Ready to Transform Your Feedback?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join teams who've made giving feedback as fun as playing a game.
          </p>
          <Link to="/play">
            <Button size="lg" className="bg-card text-primary hover:bg-card/90 shadow-lg hover:shadow-xl">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Index;
