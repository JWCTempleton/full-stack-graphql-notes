import "./App.css";
import { gql, useQuery } from "@apollo/client";

const ALL_NOTES = gql`
  query {
    allNotes {
      note_id
      user_id
      username
      content
      is_important
      is_public
      created_at
    }
  }
`;

function App() {
  const result = useQuery(ALL_NOTES);

  console.log("DATA", result.data);

  if (result.loading) {
    return <div>loading...</div>;
  }
  return (
    <>
      <div>{result.data.allNotes.map((p) => p.content).join(", ")}</div>
    </>
  );
}

export default App;
