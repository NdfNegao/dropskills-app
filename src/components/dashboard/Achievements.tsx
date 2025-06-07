"use client";
import { CheckCircle, Trophy } from 'lucide-react';
import { Bot, Crown, Zap } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  unlocked: boolean;
  progress?: number;
}

interface AchievementsProps {
  achievements: Achievement[];
}

export default function Achievements({ achievements }: AchievementsProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
          <Trophy className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-foreground">🏆 Vos Succès</h2>
          <p className="text-sm text-muted-foreground">Débloquez des achievements en utilisant DropSkills</p>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`bg-gradient-to-br from-[#111111] to-[#1a1a1a] border rounded-xl p-4 ${
              achievement.unlocked ? 'border-yellow-500/30' : 'border-[#232323]'
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  achievement.unlocked ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-500/20 text-gray-500'
                }`}
              >
                <achievement.icon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h3
                  className={`font-medium text-sm ${
                    achievement.unlocked ? 'text-white' : 'text-gray-500'
                  }`}
                >
                  {achievement.title}
                </h3>
              </div>
              {achievement.unlocked && <CheckCircle className="w-4 h-4 text-green-400" />}
            </div>
            <p className={`text-xs ${achievement.unlocked ? 'text-gray-300' : 'text-gray-500'}`}>{achievement.description}</p>
            {achievement.progress !== undefined && (
              <div className="mt-3">
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ width: `${achievement.progress}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-400 mt-1">{achievement.progress}%</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
