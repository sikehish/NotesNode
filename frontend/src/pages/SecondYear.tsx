import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContext';

const SecondYear: React.FC = () => {
  const [semester, setSemester] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [courseCode, setCourseCode] = useState('');
  const [heading, setHeading] = useState('');
  const { state } = useAuthContext();
  const { user } = state;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!semester || !documentType || !file || !courseCode || !heading) {
      toast.error('Please select all options and choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('year', "2");
    formData.append('semester', semester);
    formData.append('documentType', documentType);
    formData.append('courseCode', courseCode);
    formData.append('heading', heading);
    formData.append('document', file);

    try {
      const response = await fetch('/api/admin/upload-' + documentType, {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
        body: formData,
      });
      if (response.ok) {
        toast.success("File uploaded!")
        setSemester('');
        setDocumentType('');
        setFile(null);
        setCourseCode('');
        setHeading('');
      } else {
        const data = await response.json();
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error("Upload failed: " + (error as Error).message)
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Second Year Documents</h1>
      <div className="flex items-center mb-4">
        <label htmlFor="semester" className="mr-2">
          Select Semester:
        </label>
        <select
          id="semester"
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="border p-1 mr-2"
        >
          <option value={3}>Semester 3</option>
          <option value={4}>Semester 4</option>
        </select>
        <label htmlFor="documentType" className="mr-2">
          Document Type:
        </label>
        <select
          id="documentType"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="border p-1 mr-2"
        >
          <option value="notes">Notes</option>
          <option value="assignment">Assignment</option>
        </select>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mr-2"
        />
        <input
          type="text"
          placeholder="Course Code"
          value={courseCode}
          onChange={(e) => setCourseCode(e.target.value)}
          className="border p-1 mr-2"
        />
        <input
          type="text"
          placeholder="Heading"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className="border p-1 mr-2"
        />
        <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
          Upload
        </button>
      </div>
    </div>
  );
};

export default SecondYear;
