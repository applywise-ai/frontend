'use client';

interface JobResponsibilitiesQualificationsProps {
  shortResponsibilities?: string;
  shortQualifications?: string;
}

export default function JobResponsibilitiesQualifications({
  shortResponsibilities,
  shortQualifications
}: JobResponsibilitiesQualificationsProps) {
  if (!shortResponsibilities && !shortQualifications) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:items-stretch">
      {/* Responsibilities */}
      {shortResponsibilities && (
        <div className="flex flex-col">
          <h4 className="text-base font-bold text-gray-900 mb-2">Key Responsibilities</h4>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex-1">
            <p className="text-gray-700 leading-relaxed text-sm">{shortResponsibilities}</p>
          </div>
        </div>
      )}
      
      {/* Qualifications */}
      {shortQualifications && (
        <div className="flex flex-col">
          <h4 className="text-base font-bold text-gray-900 mb-2">Key Qualifications</h4>
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 flex-1">
            <p className="text-gray-700 leading-relaxed text-sm">{shortQualifications}</p>
          </div>
        </div>
      )}
    </div>
  );
} 