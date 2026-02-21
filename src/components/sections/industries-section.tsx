import { Stethoscope, Wind, Bug, Scale, Home, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const industries = [
  {
    icon: Stethoscope,
    name: "Dental",
    valueProp: "Never miss a $5K implant patient calling after hours",
  },
  {
    icon: Wind,
    name: "HVAC",
    valueProp: "Catch emergency AC calls at 10 PM in July",
  },
  {
    icon: Bug,
    name: "Pest Control",
    valueProp: "Convert price-shoppers into recurring plans",
  },
  {
    icon: Scale,
    name: "Legal",
    valueProp: "Capture $50K accident cases at 2 AM",
  },
  {
    icon: Home,
    name: "Roofing",
    valueProp: "Handle storm-season call surges without extra staff",
  },
  {
    icon: Wrench,
    name: "Plumbing",
    valueProp: "Triage emergency vs. routine before you roll a truck",
  },
];

export function IndustriesSection() {
  return (
    <section className="py-20 md:py-24 bg-navy-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-navy-900 mb-4">
          Built for service businesses that close deals over the phone
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto mt-12">
          {industries.map((industry, index) => (
            <Card
              key={index}
              className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-navy-200"
            >
              <CardContent className="p-0">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <industry.icon className="w-6 h-6 text-accent-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-navy-900 mb-2">
                      {industry.name}
                    </h3>
                    <p className="text-sm text-navy-600">{industry.valueProp}</p>
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
