import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';
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
import { ExternalLink, Pencil, Save, Trash } from 'lucide-react';
import InputForm from './InputForm';

interface Props{
    year: number
}

const NotesAndAssignment: React.FC<Props> = ({ year }) => {
  const [branchCode, setBranchCode] = useState("CS");
  const [semester, setSemester] = useState(String(2 * year - 1));
  const [documentType, setDocumentType] = useState("notes");
  const [file, setFile] = useState<File | null>(null);
  const [heading, setHeading] = useState("");
  const [documents, setDocuments] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { state } = useAuthContext();
  const { user } = state;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [deadline, setDeadline] = useState<Date>(tomorrow);
  const [editedCourseCode, setEditedCourseCode] = useState("");
  const [editedHeading, setEditedHeading] = useState("");
  const [editedDeadline, setEditedDeadline] = useState<Date | null>(null);

  const handleDeadlineChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedDate = new Date(e.target.value);
    console.log(e.target.value)
    setEditedDeadline(selectedDate);
  };

  
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
  const [courseCode, setCourseCode] = useState(courseCodes1[0]);
  

  const formatUpdatedAt = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const fetchData=useCallback(async () => {
    if (!semester) return;
    try {
      const response = await fetch(`/api/user/${documentType}?branch=${branchCode}&year=${year}&semester=${semester}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data);
      } else {
        const data = await response.json();
        console.log(data)
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

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>, deadline?: Date) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please log in to upload documents.');
      return;
    }
    console.log(courseCode)
    if (!semester || !documentType || !file || !courseCode || !heading.trim() || (documentType=="assignments" && !deadline)) {
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
    if(documentType=="assignments" && deadline) formData.append('deadline', deadline.toISOString().split('T')[0]);

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
        if(documentType=="assignments") setDeadline(new Date())
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

  const handleEdit = (
    id: string,
    currentHeading: string,
    currentCourseCode: string,
    currentDeadline: Date
  ) => {
    setEditingId(id);
    setEditedHeading(currentHeading);
    setEditedCourseCode(currentCourseCode);
    setEditedDeadline(currentDeadline); // Set editedDeadline when editing begins
  };

  const handleSaveEdit = async () => {
    const endpoint = documentType === 'notes' ? `/api/admin/edit-notes/${editingId}` : `/api/admin/edit-assignments/${editingId}`;

    try {
      if(!editedHeading.trim() || !editedCourseCode || (documentType=="assignments" && !editedDeadline) ){
        console.log("IN ",editedDeadline)
        throw new Error("No field can be left empty!") 
      }
      // console.log("OUT ",editedDeadline, documentType, editedDeadline.toISOString().split('T')[0])
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          heading: editedHeading,
          courseCode: editedCourseCode,
          deadline: editedDeadline && documentType=="assignments" ? editedDeadline.toISOString().split('T')[0] : undefined
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


  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 mt-2">Second Year Documents</h1>
      <InputForm
  semester={semester}
  setSemester={setSemester}
  documentType={documentType}
  setDocumentType={setDocumentType}
  user={user}
  handleFileChange={handleFileChange}
  branchCode={branchCode}
  branchCodes={branchCodes}
  setBranchCode={setBranchCode}
  courseCode={courseCode}
  setCourseCode={setCourseCode}
  year={year}
  courseCodes1={courseCodes1}
  courseCodes2={courseCodes2}
  heading={heading}
  setHeading={setHeading}
  handleUpload={handleUpload}
  deadline={deadline}
  handleDeadlineChange={handleDeadlineChange}
/>
      <div className='mt-12'>
        <h2 className="text-xl font-bold mb-2">{documentType[0].toUpperCase() + documentType.slice(1)}</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Heading</TableHead>
              <TableHead>Course Code</TableHead>
              <TableHead>Updated At</TableHead>
              {documentType === 'assignments' && <TableHead>Deadline</TableHead>}
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
                      {+semester===2*(year)-1 ? courseCodes1.map((code) => (
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
                {documentType === 'assignments' && (
                 <TableCell>
                 {editingId === document._id ? (
                   <input
                     type="date"
                     value={editedDeadline? (new Date(editedDeadline)).toISOString().split('T')[0] : tomorrow.toISOString().split('T')[0]}
                     min={tomorrow.toISOString().split('T')[0]}
                     onChange={(e) => handleDeadlineChange(e)}
                     className="border p-2 w-full"
                   />
                 ) : (
                   document.deadline && new Date(document.deadline).toLocaleDateString()
                 )}
               </TableCell>
               
                )}
                <TableCell className='flex items-center space-x-3'>
                  <ExternalLink className='cursor-pointer'  onClick={() => handleDownload(document.documentUrl)} />
                  {editingId === document._id ? (
                      <Save  onClick={handleSaveEdit} className='cursor-pointer text-blue-600'/>
                  ) : (
                    <>
                      <Trash className='cursor-pointer' onClick={() => handleDelete(document._id)} />
                      <Pencil className='cursor-pointer' onClick={() => handleEdit(document._id, document.heading, document.courseCode, document.deadline)} />
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
