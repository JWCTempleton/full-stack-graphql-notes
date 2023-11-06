import "./App.css";
import { useQuery } from "@apollo/client";
import Notes from "./components/Notes";
import NoteForm from "./components/NoteForm";
import { ALL_NOTES } from "./queries";

function App() {
  const result = useQuery(ALL_NOTES);

  console.log("DATA", result.data);

  if (result.loading) {
    return <div>loading...</div>;
  }
  return (
    <>
      <NoteForm />
      <h1>Notes</h1>
      <Notes notes={result.data.allNotes} />
    </>
  );
}

export default App;
