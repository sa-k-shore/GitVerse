import { useState, FormEvent, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import "../App.css";
import { invoke } from "@tauri-apps/api/core";
import AddUserForm from "./AddForms";
import GitActions from "./GitActions";

function UserAndProject() {

  const [user, setUser] = useState<UserData>();
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [isInGitActions, SetGitActions] = useState(false);
  const [isUserPopupOpen, setIsUserPopupOpen] = useState(false);
  const [isFileSystemPopupOpen, setIsFileSystemPopupOpen] = useState(false);



interface FormData {
  firstSelect?: UserData;
  secondSelect?: string;
}

  const [formData, setFormData] = useState<FormData>();
  const [submissionStatus, setSubmissionStatus] = useState('');

  const secondOptions: ProjectData[] = [
    {  name: 'Option 1-A', id : 1 },
    {  name: 'Option 1-B',  id : 2 },
    {  name: 'Option 1-C',  id : 3 },
  ];

  const handleUserSelectChange = (
    select: UserData[],
    value : string,
  ) => {
     const selected = select.find((opt) => opt.email === value) || undefined;
    setFormData((prevData) => ({
      ...prevData,
      firstSelect: selected,
    }));
  };
  
  //   const handleProjectSelectChange = (
  //   select: ProjectData[],
  //   value : string,
  // ) => {
  //   const selected = select.find((opt) => opt.name === value) || undefined;
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     secondSelect: selected,
  //   }));
  // };


    const handleFilePathChange = (
    value : string,
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      secondSelect: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmissionStatus('Submitting...');
    try {
      console.log('Form Data to Submit:', formData);
      if (!(formData?.firstSelect && formData?.secondSelect)) {
        setSubmissionStatus('Select All Field Values!');
        return;
      }
      let tn1: UserData  = formData.firstSelect;
      let tn2: string  = formData.secondSelect;
      await invoke('set_for_git', { userData : tn1 , filePath: tn2 });
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      setSubmissionStatus('Form submitted successfully!');
      SetGitActions(true);
    } catch (error) {
      setSubmissionStatus('Form submission failed.' + error);
    }
  };


  const openUserPopup = () => {
    setIsUserPopupOpen(true);
  };

   const closeUserPopup = () => {
    setIsUserPopupOpen(false);
  };

  const openProjectPopup = () => {
    setIsFileSystemPopupOpen(true);
  };

  const closeProjectPopup = () => {
    setIsFileSystemPopupOpen(false);
  };

  useEffect(() => {
    async function getUsers() {
      try {
        console.log("user", allUsers);
        const users = await invoke<UserData[]>("get_users_data");
        setAllUsers(users);
        console.log("user", allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
        // Handle the error in your UI, e.g., display an error message
      }
      await invoke("test_perm");
    }
    getUsers(); // Call the async function here
  }, []);

   const handleCreateUser = async (newUserData: UserData) => {
    console.log('Creating user in parent:', newUserData);
    // Call your Tauri invoke function to save the user data
    // await invoke('save_user_data', { user: newUserData });
    setAllUsers([...allUsers, newUserData]);
    closeUserPopup(); // Close the popup after handling data
  };

  const [selectedFilePath, setSelectedFilePath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  const handleOpenFileDialog = async () => {
    try {
      const result = await invoke<{ path: string | null }>('select_file');
      if (result.path) {
        setSelectedFilePath(result.path);
        setFileContent(null); // Clear previous content
        console.log('Selected file path:', result.path);
        // Optionally, you can now invoke the Rust backend to read the file content
        // if you need it directly in the frontend (for small files)
        // await handleReadFileContent(result.path);
      } else {
        console.log('File selection cancelled.');
      }
    } catch (error) {
      console.error('Error opening file dialog:', error);
    }
  };

  const handleReadFileContent = async (filePath: string) => {
    try {
      const content = await invoke<string>('read_file_content', { filePath });
      setFileContent(content);
      console.log('File content:', content);
      // Now you can use the fileContent in your React app
    } catch (error) {
      console.error('Error reading file content:', error);
    }
  };

  const handleProjectNameSubmit = async () => {
    if (selectedFilePath) {
      console.log('File path to send to backend for processing:', selectedFilePath);
      // Here you would typically invoke another Tauri command to process the file
      // on the backend, using the selectedFilePath.
    } else {
      console.warn('No file selected.');
    }
  };

   const closeGitActions = () => {
    SetGitActions(false);
  };

  return (
    <main className="container">
        <a target="_blank">
          <img src="/gitverse.png" className="logo vite" alt="GitVerse logo" />
        </a>
       {!isUserPopupOpen && !isInGitActions && !isFileSystemPopupOpen && (
        <div>
    <h1>Welcome to GitVerse</h1>
   <form onSubmit={handleSubmit}>
      <div className="row" >
        <div> 
        <label htmlFor="firstSelect">First Select:</label>
        <select
          id="firstSelect"
          value={formData && formData.firstSelect ? formData.firstSelect.email : '' }
          onChange={(e) => handleUserSelectChange(allUsers, e.target.value)}
        >
          <option value="">-- Select First Option --</option>
          {allUsers.map((option) => (
            <option key={option.email} value={option.email}>
              {option.name}
            </option>
          ))}
        </select>
        <button type="button" onClick={openUserPopup}>+</button>
      </div>


      <div>
         <label htmlFor="greet-input">Select a File</label>
        <input
          id="greet-input"
          onChange={(e) => handleFilePathChange(e.currentTarget.value)}
          placeholder="Enter a file Path..."
        />      </div>
      </div>

      <button type="submit">Submit</button>
      {submissionStatus && <p>{submissionStatus}</p>}
    </form>
    </div>)
    }
    {isUserPopupOpen && (<div className="modal-overlay">
          <div className="modal">
            <h1>Add User</h1>
            <AddUserForm onSubmit={handleCreateUser} onClose={closeUserPopup} />
          </div>
        </div>) }

    {isFileSystemPopupOpen &&  (
      <div>
      <h1>Select a File</h1>
      <button onClick={handleOpenFileDialog}>Open File Dialog</button>
      {selectedFilePath && <p>Selected File: {selectedFilePath}</p>}
      {fileContent && (
        <div>
          <h2>File Content:</h2>
          <pre>{fileContent}</pre>
        </div>
      )}
      <button onClick={handleProjectNameSubmit} disabled={!selectedFilePath}>
        Submit File Path for Processing
      </button>
    </div>
    )}

    {isInGitActions && <div>
      <button type = "button" onClick={closeGitActions}>Back</button>
      <GitActions filePath={formData?.secondSelect || "."}></GitActions>
       </div>
      }
    </main>
  );


// function PageOne() {

//     return (
//       <div>
//         <h1>Page One</h1>
//         <Link to={{ pathname: '/gitActions', state: {user} }}>
//           Go to Page Two with Data
//         </Link>
//       </div>
//     );
//   }
}

export default UserAndProject