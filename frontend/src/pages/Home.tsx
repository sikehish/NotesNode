import React from 'react';

function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="max-w-4xl px-6 py-12">
        <h1 className="text-4xl font-bold text-center mb-6">Welcome to NotesNode 📚</h1>
        <p className="text-lg text-gray-700 mb-8">
          NotesNode is a platform where students can access notes and assignments for their courses. 
          It provides a convenient way for students to stay updated with their course materials and deadlines.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden flex-shrink-0 flex justify-center items-center flex-col text-center">
            <span className="text-4xl text-blue-500 text-center mt-3 mb-2">📝</span>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-center">Notes</h2>
              <p className="text-gray-700 text-center">Access course notes for various subjects and semesters.</p>
            </div>
          </div>
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden flex-shrink-0 flex justify-center items-center flex-col text-center">
            <span className="text-4xl text-green-500 text-center mt-3 mb-2">📌</span>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-center">Assignments</h2>
              <p className="text-gray-700 text-center">View and submit assignments with deadlines.</p>
            </div>
          </div>
          <div className="max-w-xs bg-white shadow-md rounded-lg overflow-hidden flex-shrink-0 flex justify-center items-center flex-col text-center">
            <span className="text-4xl text-purple-500 text-center mt-3 mb-2">🔔</span>
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2 text-center">Notifications</h2>
              <p className="text-gray-700 text-center">Receive notifications from various departments.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
