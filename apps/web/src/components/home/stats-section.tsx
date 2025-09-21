'use client';

import { useEffect, useState } from 'react';
import { FileText, Scale, Newspaper, Users } from 'lucide-react';

export function StatsSection() {
  const [stats, setStats] = useState([
    { label: 'Documents BOPA', value: 0, target: 1250, icon: FileText },
    { label: 'Lleis i Reglaments', value: 0, target: 850, icon: Scale },
    { label: 'Notícies agregades', value: 0, target: 2400, icon: Newspaper },
    { label: 'Usuaris actius', value: 0, target: 320, icon: Users },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prevStats =>
        prevStats.map(stat => ({
          ...stat,
          value: Math.min(stat.value + Math.ceil(stat.target / 100), stat.target),
        }))
      );
    }, 50);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold mb-4">
            Portal en números
          </h2>
          <p className="text-muted-foreground">
            Dades actualitzades en temps real
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="text-center p-6 bg-background rounded-lg border"
              >
                <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}