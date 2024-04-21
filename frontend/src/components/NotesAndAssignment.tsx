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
} from "./ui/table"
import { ExternalLink, Pencil, Trash } from 'lucide-react';

interface Props{
    year: number
}

const NotesAndAssignment: React.FC<Props> = ({year}) => {
  const [branchCode, setBranchCode]=useState("CS")
  const [semester, setSemester] = useState(String(2*year-1));
  const [documentType, setDocumentType] = useState('notes');
  const [file, setFile] = useState<File | null>(null);
  const [courseCode, setCourseCode] = useState('');
  const [heading, setHeading] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedHeading, setEditedHeading] = useState('');
  const [editedCourseCode, setEditedCourseCode] = useState('');
  const { state } = useAuthContext();
  const { user } = state;

  const courseCodes1=["20CS320","20CS330","20CS340","20CS350","20HU311","20CS36L","20CS37L","20CS320P"].map(code => {
    const prefix = code.substring(0, 4);
    const suffix = code.substring(5); 
    const newCode = prefix + (2 * year - 1) + suffix; 
    return newCode;
  }).map(code=> code.replace("CS",branchCode))

  const courseCodes2=["20CS420","20CS430","20CS440","20CS450","20HU411","20CS46L","20CS47L","20CS420P"].map(code => {
    const prefix = code.substring(0, 4);
    const suffix = code.substring(5); 
    const newCode = prefix + (2 * year) + suffix; 
    return newCode;
  }).map(code=> code.replace("CS",branchCode))

  const branchCodes=["CS","IS","ME","CV","CSBS","BT","PST","CTM","ECE","EE","EI"]
  

  const formatUpdatedAt = (dateString: string) => {
    console.log("DATE: ", dateString)
    console.log(new Date(dateString).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'}))
    return new Date(dateString).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const fetchData=useCallback(async () => {
    if (!semester) return;
    try {
      const response = await fetch(`/api/user/${documentType}?branch=${branchCode}&year=${year}&semester=${semester}`);
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
  }, [semester, documentType, year, branchCode])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please log in to upload documents.');
      return;
    }
    if (!semester || !documentType || !file || !courseCode || !heading) {
      toast.error('Please select all options and choose a file.');
      return;
    }

    const formData = new FormData();
    formData.append('year', String(year));
    formData.append('semester', semester);
    formData.append('documentType', documentType);
    formData.append('courseCode', courseCode);
    formData.append('branch', branchCode);
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

  const handleDelete = async (id: string) => {
    const endpoint = documentType === 'notes' ? `/api/admin/delete-notes/${id}` : `/api/admin/delete-assignments/${id}`;
    try {
      const response = await fetch(endpoint, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        toast.success("Document deleted!");
        fetchData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting document:', error);
      toast.error("Delete failed: " + (error as Error).message);
    }
  };

  const handleEdit = (id: string, currentHeading: string, currentCourseCode: string) => {
    setEditingId(id);
    setEditedHeading(currentHeading);
    setEditedCourseCode(currentCourseCode);
  };

  const handleSaveEdit = async () => {
    const endpoint = documentType === 'notes' ? `/api/admin/edit-notes/${editingId}` : `/api/admin/edit-assignments/${editingId}`;
    try {
      if(!editedHeading.trim() || !editedCourseCode){
        throw new Error("No field can be left empty!") 
      }
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heading: editedHeading,
          courseCode: editedCourseCode,
        }),
      });
      if (response.ok) {
        toast.success("Document updated!");
        fetchData();
        setEditingId(null);
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating document:', error);
      toast.error("Update failed: " + (error as Error).message);
    }
  };

  console.log(editedCourseCode)

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
          <option value={year*2-1}>Semester {year*2-1}</option>
          <option value={year*2}>Semester {year*2}</option>
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
              value={branchCode}
              onChange={(e) => setBranchCode(e.target.value)}
              className="border p-1 mr-2"
            >
              <option value="">Select Branch</option>
              {branchCodes.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
            </select>
            <select
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="border p-1 mr-2"
            >
              <option value="">Select Course Code</option>
              {+semester==2*(year)-1 ? courseCodes1.map((code) => (
                <option key={code} value={code}>{code}</option>
              )) : courseCodes2.map((code) => (
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
                <TableCell>
                  {editingId === document._id ? (
                    <input
                      type="text"
                      value={editedHeading}
                      className='px-2 py-1 bg-gray-200'
                      onChange={(e) => setEditedHeading(e.target.value)}
                    />
                  ) : (
                    document.heading
                  )}
                </TableCell>
                <TableCell>
                  {editingId === document._id ? (
                    <select
                      value={editedCourseCode}
                      onChange={(e) => setEditedCourseCode(e.target.value)}
                      className="px-2 py-1 bg-gray-200"
                    >
                      <option value="" >Select Course Code</option>
                      {+semester==2*(year)-1 ? courseCodes1.map((code) => (
                <option key={code} value={code}>{code}</option>
              )) : courseCodes2.map((code) => (
                <option key={code} value={code}>{code}</option>
              ))}
                    </select>
                  ) : (
                    document.courseCode
                  )}
                </TableCell>
                <TableCell>{formatUpdatedAt(document.updatedAt)}</TableCell>
                <TableCell className='flex items-center space-x-3'>
                  <ExternalLink className='cursor-pointer'  onClick={() => handleDownload(document.documentUrl)} />
                  {editingId === document._id ? (
                    <button onClick={handleSaveEdit} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                      Save
                    </button>
                  ) : (
                    <>
                      <Trash className='cursor-pointer' onClick={() => handleDelete(document._id)} />
                      <Pencil className='cursor-pointer' onClick={() => handleEdit(document._id, document.heading, document.courseCode)} />
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default NotesAndAssignment;
