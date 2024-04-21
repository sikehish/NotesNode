import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useAuthContext } from '../context/AuthContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash } from 'lucide-react';
import NotificationForm from '@/components/NotificationForm';

interface Props {
  year: number;
}

const Notifications: React.FC<Props> = () => {
  const [branchCode, setBranchCode] = useState("CS");
  const [semester, setSemester] = useState(String(1));
  const [documents, setDocuments] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const { state } = useAuthContext();
  const { user } = state;
  const branchCodes=["CS","IS","ME","CV","CSBS","BT","PST","CTM","ECE","EE","EI"]

  const fetchData = useCallback(async () => {
    if (!semester) return;
    try {
      const response = await fetch(`/api/user/notifications?branch=${branchCode}&semester=${semester}`);
      if (response.ok) {
        const data = await response.json();
        setDocuments(data.data);
      } else {
        const data = await response.json();
        console.log(data)
        throw new Error('Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error("Failed to fetch notifications");
    }
  }, [semester, branchCode]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/delete-notification/${id}`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${user?.token}`,
        },
      });
      if (response.ok) {
        toast.success("Notification deleted!");
        fetchData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error("Delete failed: " + (error as Error).message);
    }
  };

  const handleSaveNotification = async () => {
    
    try {
      console.log(semester, branchCode, message)
      if (!semester || !branchCode || !message.trim()) {
        toast.error('Please select all options and choose a file.');
        return;
      }
      const response = await fetch('/api/admin/create-notification', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${user?.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          semester,
          branch: branchCode,
          message: message.trim(),
        }),
      });
      if (response.ok) {
        toast.success("Notification created!");
        setMessage('');
        fetchData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error("Creation failed: " + (error as Error).message);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 mt-2">Notifications</h1>
      <NotificationForm
      branchCodes={branchCodes}
        semester={semester}
        setSemester={setSemester}
        user={user}
        branchCode={branchCode}
        setBranchCode={setBranchCode}
        message={message}
        setMessage={setMessage}
        handleSave={handleSaveNotification}
      />
      <div className='mt-12'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Heading</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((document) => (
              <TableRow key={document._id}>
                <TableCell>{document.message}</TableCell>
                <TableCell>{new Date(document.updatedAt).toLocaleString().split(",")[0]}</TableCell>
                <TableCell className='flex items-center space-x-3'>
                  <Trash className='cursor-pointer' onClick={() => handleDelete(document._id)} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Notifications;
