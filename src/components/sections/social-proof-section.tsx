import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const testimonials = [
  {
    quote: "Coming soon from our beta partners",
    author: "Beta Tester",
    role: "Early Adopter",
    company: "Private Beta",
  },
  {
    quote: "Coming soon from our beta partners",
    author: "Beta Tester",
    role: "Early Adopter",
    company: "Private Beta",
  },
  {
    quote: "Coming soon from our beta partners",
    author: "Beta Tester",
    role: "Early Adopter",
    company: "Private Beta",
  },
];

export function SocialProofSection() {
  return (
    <section className="py-20 md:py-24 bg-navy-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-center mb-8">
          <Badge
            variant="secondary"
            className="bg-accent-100 text-accent-700 px-4 py-2 text-sm"
          >
            Currently in Private Beta
          </Badge>
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-center text-navy-900 mb-12">
          What Early Adopters Are Saying
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 bg-white">
              <CardContent className="p-0">
                <p className="text-navy-600 italic mb-4">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-navy-200 rounded-full" />
                  <div>
                    <p className="font-semibold text-navy-900">
                      {testimonial.author}
                    </p>
                    <p className="text-sm text-navy-500">
                      {testimonial.role}, {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
