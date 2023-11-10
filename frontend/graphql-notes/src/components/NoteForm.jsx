import { useMutation } from "@apollo/client";
import { useState } from "react";
import { ALL_NOTES, ADD_NOTE } from "../queries";

const NoteForm = () => {
  const [content, setContent] = useState("");
  const [is_public, setIsPublic] = useState(false);
  const [is_important, setImportant] = useState(false);
  const [addNote] = useMutation(ADD_NOTE, {
    refetchQueries: [{ query: ALL_NOTES }],
  });

  const submit = (event) => {
    event.preventDefault();

    addNote({ variables: { content, is_important, is_public } });

    setContent("");
    setIsPublic(false);
    setImportant(false);
  };

  return (
    <div>
      <h2>Create new Note</h2>
      <form onSubmit={submit}>
        <div>
          <textarea
            placeholder="Enter note"
            rows={8}
            cols={40}
            value={content}
            onChange={({ target }) => setContent(target.value)}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "center",
            marginTop: "8px",
          }}
        >
          <div style={{ marginBottom: "10px" }}>
            <label>
              <input
                type="checkbox"
                checked={is_important}
                onChange={() => setImportant(!is_important)}
              />
              Set Important?
            </label>
          </div>
          <div>
            <label>
              <input
                type="checkbox"
                checked={is_public}
                onChange={() => setIsPublic(!is_public)}
              />
              Set Public?
            </label>
          </div>
        </div>
        <button type="submit">Add Note</button>
      </form>
    </div>
  );
};

export default NoteForm;
