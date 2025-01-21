import React from "react";

const RideProgressBar = ({ status }) => {
  // Define stages and their order
  const stages = [
    { label: "Accepted" },
    { label: "En-route" },
    { label: "Goods Collected" },
    { label: "Goods Delivered" },
  ];

  // Map stage labels to their order dynamically
  const statuses = stages.reduce((acc, stage, index) => {
    acc[stage.label] = index + 1;
    return acc;
  }, {});

  // Determine the current stage based on the passed status
  const currentStage = statuses[status] || 0;

  // Helper function to get the stage style
  const getStageStatus = (stageLabel) => {
    const stageIndex = statuses[stageLabel] || 0;
    if (stageIndex < currentStage) return "completed"; // Stage is completed
    if (stageIndex === currentStage) return "current"; // Current stage
    return "upcoming"; // Future stage
  };

  return (
    <div className="flex items-center justify-between w-full bg-gray-100 rounded-lg py-4 px-6 shadow-md">
      {stages.map((stage, index) => {
        const stageStatus = getStageStatus(stage.label);

        return (
          <div
            key={stage.label}
            className="flex flex-col items-center w-full"
          >
            {/* Stage Circle */}
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-white ${stageStatus === "completed"
                  ? "bg-green-500"
                  : stageStatus === "current"
                    ? "bg-blue-500"
                    : "bg-gray-300"
                }`}
            >
              {index + 1}
            </div>

            {/* Label */}
            <p
              className={`mt-2 text-sm font-medium ${stageStatus === "completed"
                  ? "text-green-600"
                  : stageStatus === "current"
                    ? "text-blue-600"
                    : "text-gray-500"
                }`}
            >
              {stage.label}
            </p>

            {/* Line */}
            <div
              className={`h-1 w-full mt-2 border-b border-gray-300 ${ // Consistent underline color
                stageStatus === "completed"
                  ? "border-green-500" // Match completed stage color
                  : stageStatus === "current"
                    ? "border-blue-500" // Match current stage color
                    : ""
              }`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default RideProgressBar;