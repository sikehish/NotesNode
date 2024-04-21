
interface NotificationFormProps {
  semester: string;
  setSemester: React.Dispatch<React.SetStateAction<string>>;
  user: any;
  branchCode: string;
  setBranchCode: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  branchCodes: string[];
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  handleSave: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({
  semester,
  setSemester,
  user,
  branchCode,
  branchCodes,
  setBranchCode,
  message,
  setMessage,
  handleSave,
}) => {

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
    {(new Array(8)).fill(0).map((_, i) => (
      <option key={i + 1} value={i + 1}>
        Semester {i + 1}
      </option>
    ))}
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
     
      {user && (
        <>
          <textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="border p-2 w-full mt-4"
          />
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 w-full"
          >
            Save
          </button>
        </>
      )}
    </div>
  );
};

export default NotificationForm;
