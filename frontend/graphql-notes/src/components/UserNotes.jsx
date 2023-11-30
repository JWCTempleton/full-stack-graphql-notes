import { useMutation, useQuery } from "@apollo/client";
import { EDIT_NOTE, USER_NOTES } from "../queries";
import moment from "moment";
import Toggleable from "./Toggleable";
import NoteForm from "./NoteForm";

const UserNotes = ({ user, visible, setVisible }) => {
  const results = useQuery(USER_NOTES);
  const [editNote] = useMutation(EDIT_NOTE, {
    refetchQueries: [{ query: USER_NOTES }],
  });
  console.log("TEST", results.data);

  if (results.loading) {
    return <div>loading...</div>;
  }

  const styles = {
    border: "1px solid white",
    borderRadius: "8px",
    marginTop: "22px",
    width: "600px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    padding: "10px",
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2>User Notes</h2>
      <Toggleable
        buttonLabel="New Note"
        visible={visible}
        setVisible={setVisible}
      >
        <NoteForm setVisible={setVisible} />
      </Toggleable>
      {results.data.userNotes.map((n) => {
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
                  <button>Delete</button>
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

export default UserNotes;
