import moment from "moment";
import { ALL_NOTES, DELETE_NOTE, EDIT_NOTE } from "../queries";
import { useMutation } from "@apollo/client";
import Toggleable from "./Toggleable";
import NoteForm from "./NoteForm";

const styles = {
  border: "1px solid white",
  borderRadius: "8px",
  marginTop: "18px",
  width: "600px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "16px",
};

const Notes = ({ notes, user, visible, setVisible }) => {
  const [editNote] = useMutation(EDIT_NOTE, {
    refetchQueries: [{ query: ALL_NOTES }],
  });

  const [deleteNote] = useMutation(DELETE_NOTE, {
    refetchQueries: [{ query: ALL_NOTES }],
  });

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Toggleable
        buttonLabel="New Note"
        visible={visible}
        setVisible={setVisible}
      >
        <NoteForm setVisible={setVisible} />
      </Toggleable>
      <h1>Notes</h1>
      {notes.map((n) => {
        let noteId = n.note_id;
        let isImportant = n.is_important;
        return (
          <div style={styles} key={n.note_id}>
            <p style={{ fontWeight: "bold" }}>{n.content}</p>
            <div
              style={{
                display: "flex",
                width: "100%",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div>
                Created by: {n.username} on{" "}
                {moment(n.created_at).format(`MMMM Do, YYYY`)}.
              </div>
              {user && user === n.username ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-around",
                    width: "100%",
                    paddingTop: "12px",
                  }}
                >
                  <button
                    onClick={() =>
                      editNote({ variables: { noteId, isImportant } })
                    }
                  >
                    {n.is_important ? "Important" : "Unimportant"}
                  </button>
                  <button onClick={() => deleteNote({ variables: { noteId } })}>
                    Delete
                  </button>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Notes;
