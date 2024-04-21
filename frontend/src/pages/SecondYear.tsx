import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContext';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table"

const SecondYear: React.FC = () => {
  const [semester, setSemester] = useState("3");
  const [documentType, setDocumentType] = useState('notes');
  const [file, setFile] = useState<File | null>(null);
  const [courseCode, setCourseCode] = useState('');
  const [heading, setHeading] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const { state } = useAuthContext();
  const { user } = state;

  const courseCodes=["20CS320","20CS330","20CS340","20CS350","20HU311","20CS36L","20CS37L","20CS320P"]

  const formatUpdatedAt = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const fetchData=useCallback(async () => {
    if (!semester) return;
    try {
      const response = await fetch(`/api/user/${documentType}?year=2&semester=${semester}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data);
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error("Failed to fetch documents");
    }
  }, [semester, documentType])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!user) {
      toast.error('Please log in to upload documents.');
      return;
    }
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
        toast.success("File uploaded!");
        setFile(null);
        setCourseCode('');
        setHeading('');
        fetchData(); // Refresh documents after upload
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error("Upload failed: " + (error as Error).message);
    }
  };

  const handleDownload = async (documentUrl: string) => {
    let file=null
    const rawResponse = await fetch(`/api/user/download/${documentUrl}`);
    file = await rawResponse.blob();
    const pdfWindow = window.open();
    if(pdfWindow) pdfWindow.location.href = window.URL.createObjectURL(file);
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
          <option value="assignments">Assignments</option>
        </select>
        {user && (
          <>
            <input
              id="fileInput"
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="mr-2"
            />
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="border p-1 mr-2"
            >
              <option value="">Select Course Code</option>
              {courseCodes.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
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
          </>
        )}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Documents</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Heading</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document._id}>
                <TableCell>{document.heading}</TableCell>
                <TableCell>{document.courseCode}</TableCell>
                <TableCell>{formatUpdatedAt(document.updatedAt)}</TableCell>
                <TableCell>
                  <button onClick={() => handleDownload(document.documentUrl)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                    Download
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SecondYear;
