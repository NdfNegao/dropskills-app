import React from 'react';
import { Star, Quote } from 'lucide-react';

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Entrepreneur",
      content: "L'interface est magnifique ! Les animations sont fluides et l'expérience utilisateur est exceptionnelle.",
      rating: 5
    },
    {
      name: "Thomas Martin",
      role: "Designer UX",
      content: "Enfin une plateforme qui allie fonctionnalité et esthétique. Les micro-interactions sont parfaites.",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Développeuse",
      content: "Navigation intuitive, design moderne, performances excellentes. Bravo pour cette refonte !",
      rating: 5
    }
  ];

  return (
    <section className="py-20 px-4 bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Retours Utilisateurs
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Ce que pensent nos utilisateurs de la nouvelle expérience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-[#111111] border border-[#232323] rounded-xl p-6 hover:border-[#333] transition-all duration-300 hover:scale-105 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              
              <Quote className="w-6 h-6 text-[#ff0033] mb-4" />
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#ff0033] to-red-600 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-sm text-gray-400">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 