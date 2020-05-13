import React, { useState, useCallback } from 'react'
import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

export const query = gql`
 query Users($description: String) {
   users {
    items {
      id
      name
    }
   }
 }
`

function Users() {
  const [description, setDescription] = useState('');
  const { data, loading } = useQuery(query, {
    variables: { description }
  })
  const users = useCallback(data?.users?.items || [], [data]);

  return (
    <>
      <input
        type="text"
        data-testid="input-filter-id"
        value={description}
        onChange={e => setDescription(e.target.value)}
      />
      {loading && (
        <h3>is loading...</h3>
      )}

      {users.length > 0 && (
        <table border="1" data-testid="table-user">
          <thead>
            <tr>
              <td>Id</td>
              <td>Name</td>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} data-testid={`table-user-tr-${user.id}`}>
                <td>{user.id}</td>
                <td>{user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}

export default Users
