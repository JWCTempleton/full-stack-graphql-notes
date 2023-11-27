import { useQuery } from "@apollo/client";
import { USER_NOTES } from "../queries";

const UserNotes = () => {
  const results = useQuery(USER_NOTES);
  console.log("TEST", results.data);
  return (
    <div>
      <h2>User Notes</h2>
    </div>
  );
};

export default UserNotes;
