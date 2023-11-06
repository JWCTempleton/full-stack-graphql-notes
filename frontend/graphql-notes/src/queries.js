import { gql } from "@apollo/client";

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

const ADD_NOTE = gql`
  mutation addNote(
    $content: String!
    $is_important: Boolean!
    $is_public: Boolean!
  ) {
    addNote(
      content: $content
      is_important: $is_important
      is_public: $is_public
    ) {
      content
      is_important
      is_public
      note_id
      user_id
      created_at
      username
    }
  }
`;

export { ALL_NOTES, ADD_NOTE };
