import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Award, TrendingUp, Crown, Star } from "lucide-react";

const LeaderboardSection = () => {
  const topPerformers = [
    {
      rank: 1,
      name: "Alex Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      score: 2847,
      assessments: 156,
      accuracy: 98,
      badge: "Champion"
    },
    {
      rank: 2,
      name: "Sarah Johnson", 
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      score: 2653,
      assessments: 142,
      accuracy: 96,
      badge: "Expert"
    },
    {
      rank: 3,
      name: "Marcus Williams",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face", 
      score: 2541,
      assessments: 138,
      accuracy: 94,
      badge: "Scholar"
    }
  ];

  const stats = [
    { label: "Total Participants", value: "12,847", icon: TrendingUp },
    { label: "Assessments Completed", value: "89,432", icon: Award },
    { label: "Average Score", value: "87.3%", icon: Star },
    { label: "Active This Month", value: "8,234", icon: Trophy },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Award className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  return (
    <section id="leaderboard" className="py-20 bg-gradient-secondary">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-slide-up">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Global Leaderboard
          </h2>
          <p className="text-lg text-muted-foreground">
            See how top performers are excelling with Assess AI Wizard. Join the competition and 
            track your progress against learners worldwide.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Leaderboard Card */}
          <div className="lg:col-span-2">
            <Card className="border-0 shadow-card bg-card/80 backdrop-blur-sm animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <span>Top Performers This Month</span>
                </CardTitle>
                <CardDescription>
                  Leading learners based on assessment scores, accuracy, and completion rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((performer, index) => (
                    <div 
                      key={index}
                      className={`flex items-center space-x-4 p-4 rounded-lg transition-all hover:shadow-lg ${
                        performer.rank === 1 
                          ? 'bg-gradient-primary/10 border-2 border-primary/20' 
                          : 'bg-muted/50 hover:bg-muted'
                      } animate-slide-up`}
                      style={{animationDelay: `${index * 0.1}s`}}
                    >
                      {/* Rank */}
                      <div className="flex items-center justify-center w-8 h-8">
                        {getRankIcon(performer.rank)}
                      </div>

                      {/* Avatar */}
                      <img 
                        src={performer.avatar}
                        alt={performer.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-border"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <p className="font-semibold text-foreground">{performer.name}</p>
                          <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full font-medium">
                            {performer.badge}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {performer.assessments} assessments • {performer.accuracy}% accuracy
                        </p>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">{performer.score}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                  <Button variant="outline" className="w-full">
                    View Full Leaderboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            <Card className="border-0 shadow-card bg-card/80 backdrop-blur-sm animate-fade-in" style={{animationDelay: '0.2s'}}>
              <CardHeader>
                <CardTitle className="text-lg">Platform Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.map((stat, index) => {
                    const IconComponent = stat.icon;
                    return (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <IconComponent className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{stat.value}</div>
                          <div className="text-xs text-muted-foreground">{stat.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-card bg-gradient-primary text-white overflow-hidden animate-float">
              <CardContent className="p-6 relative">
                <div className="absolute top-0 right-0 opacity-10">
                  <Trophy className="w-20 h-20" />
                </div>
                <div className="relative">
                  <h3 className="font-bold text-lg mb-2">Join the Competition!</h3>
                  <p className="text-white/90 text-sm mb-4">
                    Start taking assessments and climb up the global leaderboard to earn badges and recognition.
                  </p>
                  <Button variant="glass" size="sm" className="w-full">
                    Start Competing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeaderboardSection;