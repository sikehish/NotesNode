import React, { ChangeEvent, useState } from 'react';

interface InputFormProps {
  semester: string;
  setSemester: React.Dispatch<React.SetStateAction<string>>;
  documentType: string;
  setDocumentType: React.Dispatch<React.SetStateAction<string>>;
  user: any;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  branchCode: string;
  setBranchCode: React.Dispatch<React.SetStateAction<string>>;
  courseCode: string;
  setCourseCode: React.Dispatch<React.SetStateAction<string>>;
  year: number;
  courseCodes1: string[];
  courseCodes2: string[];
  heading: string;
  branchCodes: string[];
  setHeading: React.Dispatch<React.SetStateAction<string>>;
  deadline?: Date; 
  handleDeadlineChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUpload: (e: React.MouseEvent<HTMLButtonElement>, deadline?: Date) => void;
}

const InputForm: React.FC<InputFormProps> = ({
  semester,
  setSemester,
  documentType,
  setDocumentType,
  user,
  handleFileChange,
  branchCode,
  branchCodes,
  setBranchCode,
  courseCode,
  setCourseCode,
  year,
  courseCodes1,
  courseCodes2,
  heading,
  setHeading,
  deadline, // Add deadline to props destructuring
  handleDeadlineChange, // Specify handleDeadlineChange prop
  handleUpload,
}) => {
  const [showFields, setShowFields] = useState(false);
  const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
const nextDayString = tomorrow.toISOString().split('T')[0];


  return (
    <div className="bg-gray-100 rounded-lg shadow-md p-6 mb-4 md:w-3/4 lg:w-1/2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          id="semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border p-2 bg-white"
        >
          <optgroup label="Select Semester">
            <option value={String(year * 2 - 1)}>Semester {year * 2 - 1}</option>
            <option value={String(year * 2)}>Semester {year * 2}</option>
          </optgroup>
        </select>
        <select
          id="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="border p-2 bg-white"
        >
          <optgroup label="Select Document Types">
            <option value="notes">Notes</option>
            <option value="assignments">Assignments</option>
          </optgroup>
        </select>
        <select
          value={branchCode}
          onChange={(e) => setBranchCode(e.target.value)}
          className="border p-2 bg-white"
        >
          <optgroup label="Select Branch">
            {branchCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </optgroup>
        </select>
      </div>
      {!showFields && user && (
        <button
          onClick={() => setShowFields(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
        >
          Add New Document
        </button>
      )}
      {showFields && user && (
        <>
          <div className="flex flex-wrap items-center justify-between">
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="border p-2 w-full mt-4 mb-2"
            />
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="border p-2 bg-white mt-4 md:mt-0 md:w-auto flex-grow"
            >
              <optgroup label="Select Course Code">
                {+semester === 2 * year - 1
                  ? courseCodes1.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))
                  : courseCodes2.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
              </optgroup>
            </select>
          </div>
          <input
            type="text"
            placeholder="Heading"
            value={heading}
            onChange={(e) => setHeading(e.target.value)}
            className="border p-2 w-full mt-4"
          />
          {documentType === 'assignments' && deadline && (
            <input
              type="date"
              onChange={handleDeadlineChange}
              min={nextDayString} 
              value={nextDayString}
              className="border p-2 w-full mt-4"
            />
          )}
          <button
            onClick={(e) => handleUpload(e, deadline)}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
          >
            Upload
          </button>
        </>
      )}
    </div>
  );
};

export default InputForm;
