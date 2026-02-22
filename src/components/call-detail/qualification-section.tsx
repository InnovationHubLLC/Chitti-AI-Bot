"use client";

interface QualificationDetail {
  label: string;
  value: string;
}

interface QualificationSectionProps {
  details: QualificationDetail[];
}

export function QualificationSection({ details }: QualificationSectionProps) {
  return (
    <div className="bg-white border rounded-xl divide-y">
      {details.map((detail, index) => (
        <div
          key={index}
          className="flex justify-between items-start py-3 px-4"
        >
          <span className="text-sm text-navy-400">{detail.label}</span>
          <span className="text-sm font-medium text-navy-800">
            {detail.value}
          </span>
        </div>
      ))}
    </div>
  );
}
