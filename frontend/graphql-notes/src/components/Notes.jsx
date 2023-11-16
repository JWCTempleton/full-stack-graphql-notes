import moment from "moment";

const styles = {
  border: "1px solid white",
  borderRadius: "8px",
  marginTop: "12px",
  width: "600px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  padding: "10px",
};
const Notes = ({ notes, user }) => {
  return (
    <div>
      {notes.map((n) => (
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
                <button>Edit</button>
                <button>Delete</button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Notes;
