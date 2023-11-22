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

const ME = gql`
  query {
    me {
      user_id
      username
      email
      created_at
      is_admin
      suspended
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

const EDIT_NOTE = gql`
  mutation editNote($noteId: ID!, $isImportant: Boolean!) {
    editNote(note_id: $noteId, is_important: $isImportant) {
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

const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`;

export { ALL_NOTES, ADD_NOTE, LOGIN, ME, EDIT_NOTE };
