import { FormEvent, useState } from "react";


interface AddUserFormProps {
  onSubmit: (userData: UserData) => void; 
  onClose: () => void;
}

function AddUserForm({ onSubmit, onClose }: AddUserFormProps) {
  const [formData, setFormData] = useState<UserData>(
     { id: 0, name: '', email: '' }
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit(formData); 
    onClose();
  }
  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>
        <button type="button" onClick={onClose}>Cancel</button>
      <button type="submit">{'Create User'}</button>
    </form>
    </div>
  );

}

export default AddUserForm;