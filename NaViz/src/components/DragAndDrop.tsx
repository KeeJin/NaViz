// src/components/DragAndDrop.tsx

import React, { useCallback, useState } from "react";

interface DragAndDropProps {
  onFileUpload: (data: string) => void; // Callback to handle uploaded data
}

const DragAndDrop: React.FC<DragAndDropProps> = ({ onFileUpload }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      console.log("drop detected: ", event);
      event.preventDefault();
      setIsDragging(false);
      const file = event.dataTransfer.files[0];

      if (file && file.type === "application/octet-stream") {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result as string;
          onFileUpload(fileContent);
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid PCD file");
      }
    },
    [onFileUpload]
  );

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault(); // Prevent default behavior to allow drop
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`border-dashed border-2 border-gray-400 p-4 flex justify-center items-center ${isDragging ? "bg-gray-500" : ""}`}
      style={{ height: "200px" }}
    >
      <p>Drag and drop your PCD file here</p>
    </div>
  );
};

export default DragAndDrop;
