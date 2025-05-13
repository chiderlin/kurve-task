import { useState } from 'react';

export default function CustomerList({
  id,
  name,
  email,
  age,
  onDelete,
  onUpdate,
}: {
  id: number;
  name: string;
  email: string;
  age: number;
  onDelete: (id: number) => void;
  onUpdate: (
    id: number,
    data: { name: string; email: string; age: number }
  ) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedEmail, setEditedEmail] = useState(email);
  const [editedAge, setEditedAge] = useState(age);

  const handleSave = () => {
    onUpdate(id, { name: editedName, email: editedEmail, age: editedAge });
    setIsEditing(false);
  };

  return (
    <div className="customer">
      <div className="customer-top-bar">
        {isEditing ? (
          <button type="button" onClick={handleSave}>
            Save
          </button>
        ) : (
          <button type="button" onClick={() => setIsEditing(true)}>
            Edit
          </button>
        )}
        <button type="button" onClick={() => onDelete(id)}>
          Delete
        </button>
      </div>
      <div>
        {isEditing ? (
          <>
            <input
              className="customer-edit-name"
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <input
              className="customer-edit-name"
              type="email"
              value={editedEmail}
              onChange={(e) => setEditedEmail(e.target.value)}
            />
            <input
              className="customer-edit-name"
              type="number"
              value={editedAge}
              onChange={(e) => setEditedAge(parseInt(e.target.value))}
            />
          </>
        ) : (
          <>
            <h3>{editedName}</h3>
            <p>{editedEmail}</p>
            <p>{editedAge}</p>
          </>
        )}
      </div>
    </div>
  );
}
