import { useState, FormEvent, useEffect } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import "../App.css";
import { invoke } from "@tauri-apps/api/core";

function StartPage() {

  const [user, setUser] = useState<UserData>();
  const [allUsers, setAllUsers] = useState<UserData[]>([]);
  const [project, setProject] = useState<ProjectData>();
  const [allProject, setAllProject] =  useState<ProjectData[]>([]);

interface FormData {
  firstSelect?: UserData;
  secondSelect?: ProjectData;
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
  
    const handleProjectSelectChange = (
    select: ProjectData[],
    value : string,
  ) => {
    const selected = select.find((opt) => opt.name === value) || undefined;
    setFormData((prevData) => ({
      ...prevData,
      secondSelect: selected,
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
      // Simulate a successful submission (e.g., an API call)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate delay
      setSubmissionStatus('Form submitted successfully!');
    } catch (error) {
      setSubmissionStatus('Form submission failed.');
    }
  };

  function buttonclick (createUserUrl : string) {
    window.open(createUserUrl, '_blank', 'width=600,height=400,noopener,noreferrer');
    console.log("user", allUsers);
  }
  const openUserPopup = () => {
    const settingsUrl = '/userPopup';
    buttonclick(settingsUrl);
  };

  const openProjectPopup = () => {
    const helpUrl = '/projectPopup';
    buttonclick(helpUrl);
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

   (
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
      <button onClick={handleSubmit} disabled={!selectedFilePath}>
        Submit File Path for Processing
      </button>
    </div>
  );

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
    }
    getUsers(); // Call the async function here
  }, []);

  

  return (
    <main className="container">
         <a target="_blank">
          <img src="/gitverse.png" className="logo vite" alt="GitVerse logo" />
        </a>
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
                 <button type = "button" onClick={openUserPopup}>+</button>

      </div>


      <div>
        <label htmlFor="secondSelect">Second Select:</label>
        <select
          id="secondSelect"
          value={formData && formData.secondSelect ? formData.secondSelect.name : ''}
          onChange={(e) => handleProjectSelectChange(secondOptions, e.target.value)}
        >
          <option value="">-- Select Second Option --</option>
          {secondOptions.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
        </select>
                 <button type = "button" onClick={openProjectPopup}>+</button>

      </div>
      </div>

      <button type="submit">Submit</button>
      {submissionStatus && <p>{submissionStatus}</p>}
    </form>
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

export default StartPage